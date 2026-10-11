import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  classifyKey,
  escapeNonAscii,
  findTextHygieneFindings,
  foldFullWidth,
  referencesShadowDelta,
  runAuditTextHygiene,
  type TextHygieneFinding,
} from "../audit/audit-text-hygiene";
import { gateVerdict } from "../audit/audit-verdict";
import {
  createAuditScopeFixtures,
  makeBank,
  makeQuestion,
  withUnreadableFile,
} from "../test-utils/audit-scope-fixtures";

// Synthetic fixtures only — never bank content.

const FILE = "fixture.json";
const scan = (question: unknown): TextHygieneFinding[] =>
  findTextHygieneFindings({ questions: [question] }, FILE);
const rulesAt = (findings: TextHygieneFinding[], path: string): string[] =>
  findings.filter((finding) => finding.jsonPath === path).map((finding) => finding.rule);
const stemEn = (en: string) => rulesAt(scan({ id: "q", stem: { en, zh: "测试。" } }), "$.questions[0].stem.en");
const stemZh = (zh: string) => rulesAt(scan({ id: "q", stem: { en: "Test.", zh } }), "$.questions[0].stem.zh");
const idRules = (id: string) => rulesAt(scan({ id }), "$.questions[0].id");

// --- location classes -------------------------------------------------------
for (const key of ["en", "termEn"]) assert.equal(classifyKey(key), "L-EN");
for (const key of ["zh", "termZh", "defZh"]) assert.equal(classifyKey(key), "L-ZH");
for (const key of ["id", "refId", "correct", "rowId", "columnIds", "stageId", "answerableAfterStageId"]) {
  assert.equal(classifyKey(key), "L-ID", key);
}
for (const key of ["topic", "unit", "acceptable", "key", "valid", null]) assert.equal(classifyKey(key), "L-OTHER");

// --- clean baseline ---------------------------------------------------------
assert.deepEqual(scan(makeQuestion("clean_fixture")), []);

// --- TH1 invisible-char (all classes) ---------------------------------------
assert.deepEqual(stemEn("Zero​width."), ["TH1"]);
assert.deepEqual(stemZh("测﻿试。"), ["TH1"]);
assert.deepEqual(stemEn("Carriage\rreturn."), ["TH1"]);
assert.deepEqual(stemEn("Tab\tand\nnewline are allowed."), []);
assert.deepEqual(rulesAt(scan({ id: "q", topic: "Soft­hyphen" }), "$.questions[0].topic"), ["TH1"]);

// U+200B inside an id fires TH1 and TH3.
assert.deepEqual(idRules("fixture​id"), ["TH1", "TH3"]);

// --- TH2 nonstandard-space (all classes) ------------------------------------
assert.deepEqual(stemEn("Give 5 mg."), ["TH2"]);
assert.deepEqual(stemZh("测试　测试。"), ["TH2"]);
assert.deepEqual(stemEn("Give 5 mg."), []);

// --- TH3 id-non-ascii (L-ID only) -------------------------------------------
assert.deepEqual(idRules("fixture id"), ["TH3"]);
assert.deepEqual(idRules("fixture_测"), ["TH3"]);
assert.deepEqual(idRules("fixture_id-01.a"), []);
assert.deepEqual(
  scan({ id: "q", correct: ["a", "ｂ"] }).map((finding) => `${finding.jsonPath} ${finding.rule}`),
  ["$.questions[0].correct[1] TH3", "$.questions[0].correct[1] TH4"],
);
assert.deepEqual(stemEn("café"), [], "TH3 does not apply outside L-ID");

// --- TH4 fullwidth-alnum (all classes) --------------------------------------
assert.deepEqual(stemZh("选项Ａ正确。"), ["TH4"]);
assert.deepEqual(stemEn("Dose １ mg."), ["TH4"]);
assert.deepEqual(stemZh("伤员A："), [], "ASCII letter plus correct full-width colon is clean");

// --- TH5 en-cjk-punct (L-EN only) -------------------------------------------
assert.deepEqual(stemEn("First，second。"), ["TH5", "TH5"]);
assert.deepEqual(stemEn("First, second."), []);
assert.deepEqual(stemZh("第一，第二。"), [], "CJK punctuation is correct in zh");

// --- TH6 en-han (L-EN only) -------------------------------------------------
assert.deepEqual(stemEn("The nurse 护士 responds."), ["TH6", "TH6"]);
assert.deepEqual(stemEn("The nurse responds."), []);

// --- TH7 en-curly-double-quote (L-EN only) ----------------------------------
assert.deepEqual(stemEn("The client says “I feel dizzy.”"), ["TH7", "TH7"]);
assert.deepEqual(stemEn("The client says \"I feel dizzy.\""), []);
assert.deepEqual(stemZh("患者说“我头晕”。"), [], "Chinese quotation marks are valid in zh");

// --- TH8 zh-ascii-punct (L-ZH only) -----------------------------------------
assert.deepEqual(stemZh("首先,评估。"), ["TH8"]);
assert.deepEqual(stemZh("注意: 评估"), ["TH8"]);
assert.deepEqual(stemZh("ABC, 评估"), ["TH8"], "Han after the mark across one space");
assert.deepEqual(stemZh("评估完成."), ["TH8"]);
assert.deepEqual(stemZh("评估. 然后"), ["TH8"]);
assert.deepEqual(stemZh("评估.然后"), ["TH8"]);
assert.deepEqual(stemZh("剂量为3.5 mg。"), [], "decimal");
assert.deepEqual(stemZh("升至0 mmHg以上。"), [], "measurement with trailing Han");
assert.deepEqual(stemZh("比例为 1:2，时间 12:30，范围 3-5。"), [], "ratio, time, range");
assert.deepEqual(stemZh("例如 e.g. 和 i.e. 等"), [], "Latin abbreviation with no adjacent Han");
assert.deepEqual(stemZh("ABC,  评估"), [], "two spaces is not adjacency");
assert.deepEqual(stemEn("First, second: third; fourth? fifth!"), [], "TH8 does not apply to en");

// --- TH9 zh-ascii-quote (L-ZH only) -----------------------------------------
assert.deepEqual(stemZh("患者说\"头晕\"。"), ["TH9", "TH9"]);
assert.deepEqual(stemZh("称为'休克'。"), ["TH9", "TH9"]);
assert.deepEqual(stemZh("评估 Kussmaul's 呼吸。"), [], "apostrophe with no adjacent Han");

// --- TH10 zh-ascii-paren (L-ZH only) ----------------------------------------
const paren = scan({ id: "q", stem: { en: "Test.", zh: "血压(收缩压)升高。" } });
assert.deepEqual(paren.map((finding) => [finding.rule, finding.offset, finding.codepoints]), [
  ["TH10", 2, ["U+0028", "U+0029"]],
]);
assert.deepEqual(stemZh("血压（收缩压）升高。"), []);
assert.deepEqual(stemZh("血钾 (K+) 升高。"), [], "ASCII parens around non-Han");
assert.deepEqual(stemZh("血压(收缩压）升高。"), [], "mixed pair is not an ASCII pair");

// --- TH11 zh-untranslated (L-ZH only) ---------------------------------------
const untranslated = scan({ id: "q", stem: { en: "Test.", zh: "Use the clinical facts." } });
assert.deepEqual(untranslated.map((finding) => [finding.rule, finding.offset, finding.codepoints]), [["TH11", 0, []]]);
assert.deepEqual(stemZh("使用 clinical facts 判断。"), [], "contains Han");
assert.deepEqual(stemZh("0800"), [], "no word pair");
assert.deepEqual(stemZh("PCA"), []);

// --- owner IDs: missing id does not crash and yields null -------------------
const noId = scan({ stem: { en: "Zero​width.", zh: "测试。" } });
assert.equal(noId.length, 1);
assert.equal(noId[0].topLevelId, null);
assert.equal(noId[0].leafId, null);
assert.equal(scan({ id: 7, stem: { en: "Zero​width.", zh: "测试。" } })[0].topLevelId, null);
assert.deepEqual(findTextHygieneFindings(null, FILE), []);
assert.deepEqual(findTextHygieneFindings("bare​string", FILE).map((finding) => finding.jsonPath), ["$"]);
assert.deepEqual(
  findTextHygieneFindings([{ id: "bare", stem: { en: "A b", zh: "测试。" } }], FILE)
    .map((finding) => [finding.jsonPath, finding.topLevelId, finding.leafId]),
  [["$[0].stem.en", "bare", "bare"]],
);

const caseFindings = scan({
  id: "case_parent",
  stem: { en: "Case stem.", zh: "测试。" },
  caseStudy: {
    title: { en: "Case title", zh: "测试" },
    questions: [
      { id: "case_parent_part_1", stem: { en: "Part one.", zh: "测试。" } },
      { stem: { en: "Part two.", zh: "测试。" } },
    ],
  },
});
assert.deepEqual(caseFindings.map((finding) => [finding.jsonPath, finding.topLevelId, finding.leafId]), [
  ["$.questions[0].caseStudy.questions[0].stem.en", "case_parent", "case_parent_part_1"],
  ["$.questions[0].caseStudy.questions[1].stem.en", "case_parent", null],
  ["$.questions[0].caseStudy.title.en", "case_parent", null],
  ["$.questions[0].stem.en", "case_parent", null],
]);

// Strings outside questions[] are scanned with null owner IDs; keys are never scanned.
assert.deepEqual(
  findTextHygieneFindings({ meta: { topic: "a b", "odd key": "clean" }, questions: [] }, FILE)
    .map((finding) => [finding.jsonPath, finding.locationClass, finding.topLevelId]),
  [["$.meta.topic", "L-OTHER", null]],
);

// --- code-point offsets and excerpts ----------------------------------------
// U+20000 is an astral-plane Han character: one code point, two UTF-16 units.
const astral = scan({ id: "q", stem: { en: "Test.", zh: "\u{20000}\u{20000}测,试" } });
assert.deepEqual(astral.map((finding) => [finding.rule, finding.offset, finding.codepoints]), [["TH8", 3, ["U+002C"]]]);
assert.equal(astral[0].excerpt, "\u{20000}\u{20000}测,试");
const longValue = `${"甲".repeat(40)},${"乙".repeat(40)}`;
const windowed = scan({ id: "q", stem: { en: "Test.", zh: longValue } });
assert.equal(windowed[0].offset, 40);
assert.equal(Array.from(windowed[0].excerpt).length, 33);
assert.equal(windowed[0].excerpt, `${"甲".repeat(16)},${"乙".repeat(16)}`);

// --- deterministic ordering -------------------------------------------------
const ordered = findTextHygieneFindings({
  questions: [
    { id: "b", stem: { en: "x y​z", zh: "测,试" } },
    { id: "a", stem: { en: "x​y", zh: "测试。" } },
  ],
}, FILE);
assert.deepEqual(ordered.map((finding) => `${finding.jsonPath}@${finding.offset}:${finding.rule}`), [
  "$.questions[0].stem.en@1:TH2",
  "$.questions[0].stem.en@3:TH1",
  "$.questions[0].stem.zh@1:TH8",
  "$.questions[1].stem.en@1:TH1",
]);

// --- ASCII escaping ---------------------------------------------------------
assert.equal(escapeNonAscii("plain ~ text"), "plain ~ text");
assert.equal(escapeNonAscii("fixture_测​_id"), "fixture_\\u{6D4B}\\u{200B}_id");
assert.equal(escapeNonAscii("a\tb\nc\u007F"), "a\\u{0009}b\\u{000A}c\\u{007F}");
assert.equal(escapeNonAscii("\u{20000}"), "\\u{20000}");
assert.equal(escapeNonAscii("back\\slash"), "back\\u{005C}slash", "backslash is escaped so the mapping is injective");
assert.match(escapeNonAscii("（Ａ）“x” ﻿"), /^[\x20-\x7E]*$/);

// --- S1 references shadow ---------------------------------------------------
assert.equal(foldFullWidth("（Ａ）　！～"), "(A) !~");
assert.equal(foldFullWidth("测试，“x”。"), "测试,“x”。", "only U+FF01–U+FF5E and U+3000 fold");

const shadowed = makeQuestion("shadow_fixture");
shadowed.rationale.correct.zh = "临床理由（A）。";
const before = JSON.stringify(shadowed);
assert.deepEqual(referencesShadowDelta(shadowed), {
  topLevelId: "shadow_fixture",
  addedStaleKeys: [],
  addedHazards: ["rationale.correct.zh"],
  removedStaleKeys: [],
  removedHazards: [],
});
assert.equal(JSON.stringify(shadowed), before, "S1 does not mutate its input");
assert.equal(referencesShadowDelta(makeQuestion("shadow_clean")), null);

const staleShadow = makeQuestion("shadow_stale");
staleShadow.rationale.byChoice![1].zh = "选项Ｂ是正确的。";
assert.deepEqual(referencesShadowDelta(staleShadow), {
  topLevelId: "shadow_stale",
  addedStaleKeys: ['rationale.byChoice[1].zh: asserted="B" live=[A]'],
  addedHazards: ["rationale.byChoice[1].zh"],
  removedStaleKeys: [],
  removedHazards: [],
});

// --- runner -----------------------------------------------------------------
const fixture = await createAuditScopeFixtures();
try {
  let result = await runAuditTextHygiene({ files: [fixture.validA] });
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.failures, []);

  result = await runAuditTextHygiene({ files: [fixture.validA, fixture.aliasForValidA, fixture.validB] });
  assert.equal(result.status, "PASS");
  assert.match(result.detail, /in 2 file\(s\)/);

  // Missing and malformed selections fail loud; a rule finding never does.
  for (const path of [fixture.missing, fixture.malformed]) {
    result = await runAuditTextHygiene({ files: [fixture.validA, path] });
    assert.equal(result.status, "FAIL");
    assert.match(result.detail, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.deepEqual(result.failures, [fixture.validA, path]);
  }
  assert.equal((await runAuditTextHygiene({ files: [] })).status, "FAIL");

  // Pre-schema operation: a schema-invalid but parseable file is scanned, not failed.
  result = await runAuditTextHygiene({ files: [fixture.schemaInvalid] });
  assert.equal(result.status, "PASS");

  const findingPath = join(fixture.directory, "hygiene-finding.json");
  const dirty = makeQuestion("hygiene_finding");
  dirty.stem.zh = "首先,评估(血压)。";
  await writeFile(findingPath, JSON.stringify({
    ...makeBank(dirty, makeQuestion("hygiene_clean")),
    questions: [dirty, makeQuestion("hygiene_clean"), { stem: { en: "No id.", zh: "测试。" } }],
  }));
  result = await runAuditTextHygiene({ files: [findingPath, fixture.validA] });
  assert.equal(result.status, "WARN");
  assert.deepEqual(result.failures, ["(no id)", "hygiene_finding"]);
  assert.match(result.detail, /3 advisory text-hygiene finding\(s\) in 2 top-level item\(s\) across 1 of 2 file\(s\)/);
  assert.match(result.detail, /TH2 nonstandard-space L-EN: 1 finding\(s\) in 1 item\(s\)/);
  assert.match(result.detail, /TH8 zh-ascii-punct L-ZH: 1 finding\(s\) in 1 item\(s\)/);
  assert.match(result.detail, /TH10 zh-ascii-paren L-ZH: 1 finding\(s\) in 1 item\(s\)/);
  assert.match(result.detail, /hygiene-finding\.json \(2 item\(s\)\): \(no id\), hygiene_finding/);
  assert.doesNotMatch(result.detail, /评估/, "detail carries counts and IDs, never text");
  const repeated = await runAuditTextHygiene({ files: [findingPath, fixture.validA] });
  assert.deepEqual(repeated, result);

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runAuditTextHygiene({ files: [fixture.unreadable] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

// --- fatality split against gateVerdict --------------------------------------
// The wiring keeps a hygiene WARN out of blockingResults and puts a hygiene FAIL in.
const warn = { name: "audit:text-hygiene", status: "WARN" as const, failures: ["hygiene_only"], detail: "" };
const fail = { name: "audit:text-hygiene", status: "FAIL" as const, failures: ["missing.json"], detail: "" };
const blocker = { name: "audit:references", status: "FAIL" as const, failures: ["stale_item"], detail: "" };
assert.deepEqual(gateVerdict([warn], []), { exitCode: 0, failedIds: [], message: "GATE PASSED (warnings present)." });
assert.deepEqual(gateVerdict([blocker, warn], [blocker]).failedIds, ["stale_item"]);
assert.equal(gateVerdict([fail], []).exitCode, 0, "an unlisted FAIL would pass, so the wiring must list it");
assert.equal(gateVerdict([fail], [fail]).exitCode, 1);

console.log("audit-text-hygiene tests passed");
