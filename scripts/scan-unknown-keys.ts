import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { allowedKeySets, type AllowedObjectType } from "../src/allowedKeys";
import { parseBankText } from "../src/bankImport";
import type { ItemType } from "../src/types";

type UnknownKeyFinding = {
  bank: string;
  line: number | null;
  objectId: string;
  path: string;
  objectType: string;
  key: string;
  count: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const keySetCache = new Map<string, ReadonlySet<string>>();

const keySet = (keys: readonly string[], cacheKey: string) => {
  const cached = keySetCache.get(cacheKey);
  if (cached) return cached;
  const next = new Set(keys);
  keySetCache.set(cacheKey, next);
  return next;
};

const standardKeySet = (objectType: AllowedObjectType) =>
  keySet(allowedKeySets[objectType], objectType);

const sourceLineMaps = new Map<string, Map<string, number>>();

const buildJsonKeyLineMap = (text: string) => {
  const keyLines = new Map<string, number>();
  let index = 0;
  let line = 1;

  const advance = () => {
    const char = text[index++];
    if (char === "\n") line += 1;
    return char;
  };

  const skipWhitespace = () => {
    while (index < text.length && /\s/.test(text[index])) advance();
  };

  const parseString = () => {
    if (text[index] !== "\"") throw new Error("Expected JSON string");
    const startLine = line;
    advance();
    let result = "";
    while (index < text.length) {
      const char = advance();
      if (char === "\\") {
        result += advance();
      } else if (char === "\"") {
        return { value: result, line: startLine };
      } else {
        result += char;
      }
    }
    throw new Error("Unterminated JSON string");
  };

  const parseLiteral = () => {
    while (index < text.length && !/[\s,\]}]/.test(text[index])) advance();
  };

  const parseValue = (path: string): void => {
    skipWhitespace();
    if (text[index] === "{") {
      parseObject(path);
    } else if (text[index] === "[") {
      parseArray(path);
    } else if (text[index] === "\"") {
      parseString();
    } else {
      parseLiteral();
    }
  };

  const parseArray = (path: string) => {
    advance();
    skipWhitespace();
    let itemIndex = 0;
    while (index < text.length && text[index] !== "]") {
      parseValue(`${path}[${itemIndex}]`);
      itemIndex += 1;
      skipWhitespace();
      if (text[index] === ",") {
        advance();
        skipWhitespace();
      }
    }
    if (text[index] === "]") advance();
  };

  const parseObject = (path: string) => {
    advance();
    skipWhitespace();
    while (index < text.length && text[index] !== "}") {
      const key = parseString();
      skipWhitespace();
      if (text[index] === ":") advance();
      keyLines.set(`${path}\t${key.value}`, key.line);
      skipWhitespace();
      parseValue(`${path}.${key.value}`);
      skipWhitespace();
      if (text[index] === ",") {
        advance();
        skipWhitespace();
      }
    }
    if (text[index] === "}") advance();
  };

  parseValue("$");
  return keyLines;
};

const recordUnknowns = (
  findings: Map<string, UnknownKeyFinding>,
  bank: string,
  objectId: string,
  path: string,
  objectType: string,
  value: unknown,
  allowed: ReadonlySet<string>,
) => {
  if (!isRecord(value)) return;
  for (const key of Object.keys(value)) {
    if (allowed.has(key)) continue;
    const id = `${bank}\t${objectId}\t${path}\t${objectType}\t${key}`;
    const existing = findings.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      findings.set(id, {
        bank,
        line: sourceLineMaps.get(bank)?.get(`${path}\t${key}`) ?? null,
        objectId,
        path,
        objectType,
        key,
        count: 1,
      });
    }
  }
};

const scanTextPair = (ctx: ScanContext, value: unknown, path: string, objectId: string) => {
  recordUnknowns(ctx.findings, ctx.bank, objectId, path, "textPair", value, standardKeySet("textPair"));
};

type ScanContext = {
  bank: string;
  findings: Map<string, UnknownKeyFinding>;
};

const scanVisual = (ctx: ScanContext, value: unknown, path: string, objectId: string) => {
  if (!isRecord(value)) return;
  const kind = typeof value.kind === "string" ? value.kind : "unknown";
  const kindKeys = kind in allowedKeySets.visualByKind
    ? allowedKeySets.visualByKind[kind as keyof typeof allowedKeySets.visualByKind]
    : [];
  const allowed = keySet([...allowedKeySets.visualCommon, ...kindKeys], `visual:${kind}`);
  recordUnknowns(ctx.findings, ctx.bank, objectId, path, `visual:${kind}`, value, allowed);

  if (value.caption !== undefined) scanTextPair(ctx, value.caption, `${path}.caption`, objectId);
  if (value.rosc !== undefined) {
    recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.rosc`, "rosc", value.rosc, standardKeySet("rosc"));
  }
  if (value.time !== undefined) {
    recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.time`, "visualTime", value.time, standardKeySet("visualTime"));
  }
  if (Array.isArray(value.series)) {
    const seriesType = kind === "lab_trend" ? "labSeries" : "vitalsSeries";
    value.series.forEach((entry, index) => {
      recordUnknowns(
        ctx.findings,
        ctx.bank,
        objectId,
        `${path}.series[${index}]`,
        seriesType,
        entry,
        standardKeySet(seriesType),
      );
    });
  }
  if (Array.isArray(value.medications)) {
    value.medications.forEach((medication, index) => {
      const medicationPath = `${path}.medications[${index}]`;
      recordUnknowns(
        ctx.findings,
        ctx.bank,
        objectId,
        medicationPath,
        "marMedication",
        medication,
        standardKeySet("marMedication"),
      );
      if (isRecord(medication) && Array.isArray(medication.administrations)) {
        medication.administrations.forEach((administration, adminIndex) => {
          recordUnknowns(
            ctx.findings,
            ctx.bank,
            objectId,
            `${medicationPath}.administrations[${adminIndex}]`,
            "marAdministration",
            administration,
            standardKeySet("marAdministration"),
          );
        });
      }
    });
  }
  for (const entryKey of ["intake", "output"] as const) {
    if (Array.isArray(value[entryKey])) {
      value[entryKey].forEach((entry, index) => {
        recordUnknowns(
          ctx.findings,
          ctx.bank,
          objectId,
          `${path}.${entryKey}[${index}]`,
          "ioEntry",
          entry,
          standardKeySet("ioEntry"),
        );
      });
    }
  }
  if (value.periodLabel !== undefined) scanTextPair(ctx, value.periodLabel, `${path}.periodLabel`, objectId);
  if (value.title !== undefined) scanTextPair(ctx, value.title, `${path}.title`, objectId);
  if (Array.isArray(value.fields)) {
    value.fields.forEach((field, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.fields[${index}]`, "medLabelField", field, standardKeySet("medLabelField"));
    });
  }
  if (Array.isArray(value.settings)) {
    value.settings.forEach((setting, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.settings[${index}]`, "deviceSetting", setting, standardKeySet("deviceSetting"));
    });
  }
  if (Array.isArray(value.contractions)) {
    value.contractions.forEach((contraction, index) => {
      recordUnknowns(
        ctx.findings,
        ctx.bank,
        objectId,
        `${path}.contractions[${index}]`,
        "fetalContraction",
        contraction,
        standardKeySet("fetalContraction"),
      );
    });
  }
  if (Array.isArray(value.accelerations)) {
    value.accelerations.forEach((acceleration, index) => {
      recordUnknowns(
        ctx.findings,
        ctx.bank,
        objectId,
        `${path}.accelerations[${index}]`,
        "fetalAcceleration",
        acceleration,
        standardKeySet("fetalAcceleration"),
      );
    });
  }
  if (Array.isArray(value.decelerations)) {
    value.decelerations.forEach((deceleration, index) => {
      recordUnknowns(
        ctx.findings,
        ctx.bank,
        objectId,
        `${path}.decelerations[${index}]`,
        "fetalDeceleration",
        deceleration,
        standardKeySet("fetalDeceleration"),
      );
    });
  }
};

const scanQuestionMeta = (ctx: ScanContext, value: unknown, path: string, objectId: string) => {
  recordUnknowns(ctx.findings, ctx.bank, objectId, path, "questionMeta", value, standardKeySet("questionMeta"));
  if (!isRecord(value)) return;
  if (Array.isArray(value.expected_trend)) {
    value.expected_trend.forEach((entry, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.expected_trend[${index}]`, "expectedTrend", entry, standardKeySet("expectedTrend"));
    });
  }
  if (Array.isArray(value.expected_flags)) {
    value.expected_flags.forEach((entry, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.expected_flags[${index}]`, "expectedFlag", entry, standardKeySet("expectedFlag"));
    });
  }
  if (Array.isArray(value.reference_bands)) {
    value.reference_bands.forEach((entry, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.reference_bands[${index}]`, "referenceBand", entry, standardKeySet("referenceBand"));
    });
  }
};

const scanRationale = (ctx: ScanContext, value: unknown, path: string, objectId: string) => {
  recordUnknowns(ctx.findings, ctx.bank, objectId, path, "rationale", value, standardKeySet("rationale"));
  if (!isRecord(value)) return;
  if (value.correct !== undefined) scanTextPair(ctx, value.correct, `${path}.correct`, objectId);
  if (Array.isArray(value.byChoice)) {
    value.byChoice.forEach((choice, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.byChoice[${index}]`, "rationaleChoice", choice, standardKeySet("rationaleChoice"));
    });
  }
  if (Array.isArray(value.visuals)) {
    value.visuals.forEach((visual, index) => scanVisual(ctx, visual, `${path}.visuals[${index}]`, objectId));
  }
};

const scanOptions = (ctx: ScanContext, value: unknown, path: string, objectId: string) => {
  if (!Array.isArray(value)) return;
  value.forEach((option, index) => {
    recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}[${index}]`, "option", option, standardKeySet("option"));
  });
};

const scanQuestion = (ctx: ScanContext, value: unknown, path: string, fallbackId: string, options: { caseSubQuestion?: boolean } = {}) => {
  if (!isRecord(value)) return;
  const objectId = typeof value.id === "string" ? value.id : fallbackId;
  const itemType = typeof value.itemType === "string" ? value.itemType : "unknown";
  const itemTypeKeys = itemType in allowedKeySets.questionByItemType
    ? allowedKeySets.questionByItemType[itemType as ItemType]
    : [];
  const caseSubQuestionKeys = options.caseSubQuestion ? allowedKeySets.caseSubQuestion : [];
  const allowed = keySet([...allowedKeySets.questionCommon, ...itemTypeKeys, ...caseSubQuestionKeys], `question:${itemType}:${options.caseSubQuestion ? "case" : "standalone"}`);
  recordUnknowns(ctx.findings, ctx.bank, objectId, path, `question:${itemType}`, value, allowed);

  scanTextPair(ctx, value.stem, `${path}.stem`, objectId);
  scanTextPair(ctx, value.testTakingStrategy, `${path}.testTakingStrategy`, objectId);
  if (value.rationale !== undefined) scanRationale(ctx, value.rationale, `${path}.rationale`, objectId);
  if (value.visual !== undefined) scanVisual(ctx, value.visual, `${path}.visual`, objectId);
  if (value.meta !== undefined) scanQuestionMeta(ctx, value.meta, `${path}.meta`, objectId);

  if (Array.isArray(value.glossary)) {
    value.glossary.forEach((term, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.glossary[${index}]`, "glossaryTerm", term, standardKeySet("glossaryTerm"));
    });
  }
  if (Array.isArray(value.options)) scanOptions(ctx, value.options, `${path}.options`, objectId);
  if (Array.isArray(value.blanks)) {
    value.blanks.forEach((blank, index) => {
      const blankPath = `${path}.blanks[${index}]`;
      recordUnknowns(ctx.findings, ctx.bank, objectId, blankPath, "blank", blank, standardKeySet("blank"));
      if (isRecord(blank)) {
        scanTextPair(ctx, blank.prompt, `${blankPath}.prompt`, objectId);
        recordUnknowns(ctx.findings, ctx.bank, objectId, `${blankPath}.numeric`, "blankNumeric", blank.numeric, standardKeySet("blankNumeric"));
      }
    });
  }
  if (isRecord(value.matrix)) {
    recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.matrix`, "matrix", value.matrix, standardKeySet("matrix"));
    scanOptions(ctx, value.matrix.rows, `${path}.matrix.rows`, objectId);
    scanOptions(ctx, value.matrix.columns, `${path}.matrix.columns`, objectId);
  }
  if (Array.isArray(value.correct) && itemType === "matrix") {
    value.correct.forEach((entry, index) => {
      recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.correct[${index}]`, "matrixCorrect", entry, standardKeySet("matrixCorrect"));
    });
  }
  if (value.clozeStem !== undefined) scanTextPair(ctx, value.clozeStem, `${path}.clozeStem`, objectId);
  if (Array.isArray(value.dropdowns)) {
    value.dropdowns.forEach((dropdown, index) => {
      const dropdownPath = `${path}.dropdowns[${index}]`;
      recordUnknowns(ctx.findings, ctx.bank, objectId, dropdownPath, "dropdown", dropdown, standardKeySet("dropdown"));
      if (isRecord(dropdown)) scanOptions(ctx, dropdown.options, `${dropdownPath}.options`, objectId);
    });
  }
  if (isRecord(value.highlight)) {
    recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.highlight`, "highlight", value.highlight, standardKeySet("highlight"));
    if (Array.isArray(value.highlight.segments)) {
      value.highlight.segments.forEach((segment, index) => {
        recordUnknowns(
          ctx.findings,
          ctx.bank,
          objectId,
          `${path}.highlight.segments[${index}]`,
          "highlightSegment",
          segment,
          standardKeySet("highlightSegment"),
        );
      });
    }
  }
  if (isRecord(value.bowtie)) {
    recordUnknowns(ctx.findings, ctx.bank, objectId, `${path}.bowtie`, "bowtie", value.bowtie, standardKeySet("bowtie"));
    for (const zoneName of ["condition", "actions", "parameters"] as const) {
      const zone = value.bowtie[zoneName];
      const zonePath = `${path}.bowtie.${zoneName}`;
      recordUnknowns(ctx.findings, ctx.bank, objectId, zonePath, "bowtieZone", zone, standardKeySet("bowtieZone"));
      if (isRecord(zone)) {
        if (zone.prompt !== undefined) scanTextPair(ctx, zone.prompt, `${zonePath}.prompt`, objectId);
        if (Array.isArray(zone.tokens)) {
          zone.tokens.forEach((token, index) => {
            recordUnknowns(ctx.findings, ctx.bank, objectId, `${zonePath}.tokens[${index}]`, "bowtieToken", token, standardKeySet("bowtieToken"));
          });
        }
      }
    }
  }
  if (isRecord(value.caseStudy)) {
    const casePath = `${path}.caseStudy`;
    recordUnknowns(ctx.findings, ctx.bank, objectId, casePath, "caseStudy", value.caseStudy, standardKeySet("caseStudy"));
    scanTextPair(ctx, value.caseStudy.title, `${casePath}.title`, objectId);
    if (value.caseStudy.summary !== undefined) scanTextPair(ctx, value.caseStudy.summary, `${casePath}.summary`, objectId);
    if (Array.isArray(value.caseStudy.exhibits)) {
      value.caseStudy.exhibits.forEach((exhibit, index) => scanCaseStudyExhibit(ctx, exhibit, `${casePath}.exhibits[${index}]`, objectId));
    }
    if (Array.isArray(value.caseStudy.stages)) {
      value.caseStudy.stages.forEach((stage, index) => {
        const stagePath = `${casePath}.stages[${index}]`;
        recordUnknowns(ctx.findings, ctx.bank, objectId, stagePath, "caseStudyStage", stage, standardKeySet("caseStudyStage"));
        if (isRecord(stage)) {
          scanTextPair(ctx, stage.title, `${stagePath}.title`, objectId);
          if (stage.trigger !== undefined) scanTextPair(ctx, stage.trigger, `${stagePath}.trigger`, objectId);
          if (stage.narrative !== undefined) scanTextPair(ctx, stage.narrative, `${stagePath}.narrative`, objectId);
          if (Array.isArray(stage.exhibits)) {
            stage.exhibits.forEach((exhibit, exhibitIndex) =>
              scanCaseStudyExhibit(ctx, exhibit, `${stagePath}.exhibits[${exhibitIndex}]`, objectId),
            );
          }
        }
      });
    }
    if (Array.isArray(value.caseStudy.questions)) {
      value.caseStudy.questions.forEach((caseQuestion, index) => {
        scanQuestion(ctx, caseQuestion, `${casePath}.questions[${index}]`, `${objectId}/embedded[${index}]`, { caseSubQuestion: true });
      });
    }
  }
};

const scanCaseStudyExhibit = (ctx: ScanContext, value: unknown, path: string, objectId: string) => {
  recordUnknowns(ctx.findings, ctx.bank, objectId, path, "caseStudyExhibit", value, standardKeySet("caseStudyExhibit"));
  if (!isRecord(value)) return;
  scanTextPair(ctx, value.title, `${path}.title`, objectId);
  scanTextPair(ctx, value.content, `${path}.content`, objectId);
  if (value.visual !== undefined) scanVisual(ctx, value.visual, `${path}.visual`, objectId);
};

const scanBank = (bank: string, text: string, raw: unknown) => {
  sourceLineMaps.set(bank, buildJsonKeyLineMap(text));
  const findings = new Map<string, UnknownKeyFinding>();
  const ctx: ScanContext = { bank, findings };
  recordUnknowns(findings, bank, "(bank)", "$", "bank", raw, standardKeySet("bank"));
  if (!isRecord(raw)) return [];
  recordUnknowns(findings, bank, "(bank)", "$.meta", "bankMeta", raw.meta, standardKeySet("bankMeta"));
  if (Array.isArray(raw.questions)) {
    raw.questions.forEach((question, index) => scanQuestion(ctx, question, `$.questions[${index}]`, `questions[${index}]`));
  }
  return [...findings.values()].sort((left, right) =>
    left.bank.localeCompare(right.bank) ||
    left.objectId.localeCompare(right.objectId) ||
    left.path.localeCompare(right.path) ||
    left.objectType.localeCompare(right.objectType) ||
    left.key.localeCompare(right.key),
  );
};

const formatMarkdown = (findings: UnknownKeyFinding[], scannedBanks: string[]) => {
  const total = findings.reduce((sum, finding) => sum + finding.count, 0);
  const distinctKeys = [...new Set(findings.map((finding) => finding.key))].sort();
  const affectedBanks = [...new Set(findings.map((finding) => finding.bank))].sort();
  const perBank = new Map<string, number>();
  for (const finding of findings) perBank.set(finding.bank, (perBank.get(finding.bank) ?? 0) + finding.count);

  const lines = [
    "# Unknown Key Gate Report",
    "",
    "## Phase 1 Manifest Summary",
    "",
    "Source anchors: the allowed-key manifest is defined at `src/allowedKeys.ts:3`; direct object key sets include common question keys at `src/allowedKeys.ts:6`, case subquestion keys at `src/allowedKeys.ts:31`, case-study object keys at `src/allowedKeys.ts:47`, and visual kind keys at `src/allowedKeys.ts:75`. The scanner records JSON source lines at `scripts/scan-unknown-keys.ts:35`, records unknown keys at `scripts/scan-unknown-keys.ts:124`, scans only `*-canonical.json` files at `scripts/scan-unknown-keys.ts:551`, and writes this report at `scripts/scan-unknown-keys.ts:567`. Existing promote ordering already strips compile manifests before validation at `scripts/promote.ts:53`.",
    "",
    `Scanned ${scannedBanks.length} canonical bank files: ${scannedBanks.map((bank) => `\`${bank}\``).join(", ")}.`,
    "",
    `Total off-schema key occurrences: ${total}.`,
    `Distinct off-schema keys: ${distinctKeys.length === 0 ? "none" : distinctKeys.map((key) => `\`${key}\``).join(", ")}.`,
    `Affected banks: ${affectedBanks.length === 0 ? "none" : affectedBanks.map((bank) => `\`${bank}\``).join(", ")}.`,
    "",
    "**Interpretation (amended 2026-06-21 after Schema 1.6).** The scanner is functioning correctly. The former dominant Bucket 1 case-study metadata findings have cleared after Schema 1.6 typed them. Remaining findings are the small cleanup/provenance tail: misnested caseStudy fields, duplicate rationale-choice ids, one matrix-level duplicate `correct`, one glossary stray `en`, one legacy `overview`, and three bank-meta provenance keys.",
    "",
    total === 0
      ? "Canonical is currently clean under the Phase 1 scanner's allowed-key manifest."
      : "Canonical is not currently clean under the Phase 1 scanner's allowed-key manifest.",
    "",
    "## Per-Bank Counts",
    "",
    "| Bank | Off-schema key occurrences |",
    "|---|---:|",
    ...scannedBanks.map((bank) => `| \`${bank}\` | ${perBank.get(bank) ?? 0} |`),
    "",
    "## Full Manifest",
    "",
  ];

  if (findings.length === 0) {
    lines.push("No unknown keys found.", "");
  } else {
    lines.push("| Location | Object id | JSON path | Object type | Unknown key | Count |");
    lines.push("|---|---|---|---|---|---:|");
    for (const finding of findings) {
      const location = finding.line === null ? finding.bank : `${finding.bank}:${finding.line}`;
      lines.push(
        `| \`${location}\` | \`${finding.objectId}\` | \`${finding.path}\` | \`${finding.objectType}\` | \`${finding.key}\` | ${finding.count} |`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Phase 2 Patch Summary",
    "",
    "Not implemented in this pass. The only code added here is the reusable allowed-key manifest and the non-mutating Phase 1 scan script.",
    "",
    "When Phase 2 is approved, the A1 reject gate should import the same allowed-key manifest in `src/schema.ts` and run after `stripCompileManifests` in the promote path. That ordering is already present because `scripts/promote.ts` calls `validateBankObject(stripCompileManifests(raw))`.",
    "",
    "## Classification",
    "",
    "**Bucket 1 — unfolding-case structure (cleared by Schema 1.6).**",
    "`stageId`, `answerableAfterStageId`, `trigger`, `narrative`, `timeOffset`, and exhibit `type` are now typed and whitelisted as additive Schema 1.6 metadata.",
    "",
    "**Bucket 2 — whitelist omission (cleared 2026-06-21).**",
    "`pattern_keyed` on capnography `meta` was added to `allowedKeySets.questionMeta`; the scan dropped from 134 to 127 findings and `capnography-canonical.json` now reports 0.",
    "",
    "**Bucket 3 — genuine strays, low-risk strip candidates.**",
    "Six `cs_copd_01_q1` rationale entries carry duplicate `id` beside `refId`; one `gpt_pph_2026_06_16_case_01_q5` matrix object carries a duplicate nested `correct`; one glossary term on `opus_tpn_case_mucositis_01_q3` carries stray `en`; `gpt_case_unsafe_assignment_01` has misnested `rationale`, `glossary`, and `testTakingStrategy` inside `caseStudy`; `opus12_case_inpatient_suicide_risk_01` carries one legacy `overview` TextPair inside `caseStudy`.",
    "",
    "**Bucket 4 — bank-meta provenance decision.**",
    "`generatedAt`, `bankIdPrefix`, and `lane` exist on `io-canonical.json` bank `meta`; decide whether to type a provenance block or strip them like compile-only metadata.",
    "",
    "## Residual Decision",
    "",
    "Schema 1.6 has cleared the A1 structural blocker. A1 is still not ready until the remaining 15 findings are resolved or explicitly typed: decide keep-vs-strip for Bucket 4 provenance and clean or ratify each Bucket 3 tail item.",
    "",
  );

  return lines.join("\n");
};

const bankDir = "banks";
const files = (await readdir(bankDir))
  .filter((file) => file.endsWith("-canonical.json"))
  .sort();

const allFindings: UnknownKeyFinding[] = [];
for (const file of files) {
  const text = await readFile(join(bankDir, file), "utf8");
  const raw = parseBankText(text);
  allFindings.push(...scanBank(file, text, raw));
}

const total = allFindings.reduce((sum, finding) => sum + finding.count, 0);
const distinctKeys = [...new Set(allFindings.map((finding) => finding.key))].sort();
const affectedBanks = [...new Set(allFindings.map((finding) => finding.bank))].sort();

await writeFile("unknown-key-gate-report.md", formatMarkdown(allFindings, files), "utf8");

console.log("Unknown-key scan summary");
console.log(`- scanned banks: ${files.length}`);
console.log(`- off-schema key occurrences: ${total}`);
console.log(`- distinct keys: ${distinctKeys.length === 0 ? "none" : distinctKeys.join(", ")}`);
console.log(`- affected banks: ${affectedBanks.length === 0 ? "none" : affectedBanks.join(", ")}`);
console.log("- wrote unknown-key-gate-report.md");

if (total > 0) process.exit(1);
