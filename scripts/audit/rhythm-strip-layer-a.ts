import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { Question, RhythmStripVisual } from "../../src/types";

export const DEFAULT_BANK = "banks/visual-canonical.json";
export const DEFAULT_MANIFEST = "audit/rhythm-strip-layer-a-manifest.jsonl";
export const DEFAULT_CURE_LIST = "audit/rhythm-strip-positional-language-cures.jsonl";

type RhythmQuestion = Question & { visual: RhythmStripVisual };

export type RhythmAuditFlag =
  | "necessity_leak"
  | "redundancy_group"
  | "positional_language";

export type RhythmLayerARow = {
  id: string;
  subtype: RhythmStripVisual["rhythm"];
  itemType: Question["itemType"];
  category: Question["category"];
  flags: RhythmAuditFlag[];
};

export type PositionalCureRow = {
  id: string;
  subtype: RhythmStripVisual["rhythm"];
  field: string;
  match: string;
};

const NECESSITY_TERMS: Record<RhythmStripVisual["rhythm"], RegExp> = {
  sinus: /\b(?:normal\s+)?sinus rhythm\b/i,
  sinus_brady: /\bsinus bradycardia\b/i,
  sinus_tach: /\bsinus tachycardia\b/i,
  afib: /\b(?:atrial fibrillation|a-?fib)\b/i,
  aflutter: /\batrial flutter\b/i,
  svt: /\b(?:supraventricular tachycardia|SVT)\b/i,
  avb_1: /\b(?:first-degree|1st-degree) (?:atrioventricular|AV) block\b/i,
  avb_2_mobitz1: /\b(?:second-degree (?:atrioventricular|AV) block )?Mobitz I\b/i,
  avb_2_mobitz2: /\b(?:second-degree (?:atrioventricular|AV) block )?Mobitz II\b/i,
  avb_3: /\b(?:third-degree(?: \(complete\))?|complete) (?:atrioventricular|AV) block\b/i,
  pvc: /\b(?:premature ventricular contractions?|PVCs?)\b/i,
  vtach: /\b(?:monomorphic )?ventricular tachycardia\b/i,
  vfib: /\b(?:ventricular fibrillation|VFib)\b/i,
  asystole: /\basystole\b/i,
};

const POSITIONAL_PATTERNS = [
  /选项\s*[BDbd]/g,
  /以上/g,
  /后者/g,
];

const isRhythmQuestion = (question: Question): question is RhythmQuestion =>
  question.visual?.kind === "rhythm_strip";

const positionalTexts = (
  question: Question,
): Array<{ field: string; text: string }> => {
  const texts = [
    { field: "rationale.correct.en", text: question.rationale.correct.en },
    { field: "rationale.correct.zh", text: question.rationale.correct.zh },
    { field: "testTakingStrategy.en", text: question.testTakingStrategy.en },
    { field: "testTakingStrategy.zh", text: question.testTakingStrategy.zh },
  ];
  question.rationale.byChoice?.forEach((choice, index) => {
    texts.push(
      { field: `rationale.byChoice[${index}].en`, text: choice.en },
      { field: `rationale.byChoice[${index}].zh`, text: choice.zh },
    );
  });
  return texts;
};

export const findPositionalCures = (
  question: RhythmQuestion,
): PositionalCureRow[] => {
  const cures: PositionalCureRow[] = [];
  for (const { field, text } of positionalTexts(question)) {
    for (const pattern of POSITIONAL_PATTERNS) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        cures.push({
          id: question.id,
          subtype: question.visual.rhythm,
          field,
          match: match[0],
        });
      }
    }
  }
  return cures;
};

export const buildRhythmLayerA = (
  questions: Question[],
): { rows: RhythmLayerARow[]; cures: PositionalCureRow[] } => {
  const rhythmQuestions = questions.filter(isRhythmQuestion);
  const groupSizes = new Map<string, number>();

  rhythmQuestions.forEach((question) => {
    const key = `${question.visual.rhythm}\0${question.itemType}`;
    groupSizes.set(key, (groupSizes.get(key) ?? 0) + 1);
  });

  const cures = rhythmQuestions.flatMap(findPositionalCures);
  const positionalIds = new Set(cures.map((cure) => cure.id));

  const rows = rhythmQuestions.map((question): RhythmLayerARow => {
    const flags: RhythmAuditFlag[] = [];
    const groupKey = `${question.visual.rhythm}\0${question.itemType}`;
    if (NECESSITY_TERMS[question.visual.rhythm].test(question.stem.en)) {
      flags.push("necessity_leak");
    }
    if ((groupSizes.get(groupKey) ?? 0) >= 2) {
      flags.push("redundancy_group");
    }
    if (positionalIds.has(question.id)) {
      flags.push("positional_language");
    }
    return {
      id: question.id,
      subtype: question.visual.rhythm,
      itemType: question.itemType,
      category: question.category,
      flags,
    };
  });

  return { rows, cures };
};

const toJsonl = (rows: unknown[]) =>
  `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;

const loadQuestions = async (bankPath: string): Promise<Question[]> => {
  const text = await readFile(bankPath, "utf8");
  const raw = parseBankText(text);
  const result = validateBankObject(raw);
  if (!result.ok) {
    throw new Error(
      `${bankPath} failed validation:\n${result.reasons.map((reason) => `- ${reason}`).join("\n")}`,
    );
  }
  return result.value.questions;
};

export const writeRhythmLayerA = async (
  bankPath = DEFAULT_BANK,
  manifestPath = DEFAULT_MANIFEST,
  cureListPath = DEFAULT_CURE_LIST,
) => {
  const output = buildRhythmLayerA(await loadQuestions(bankPath));
  await Promise.all([
    mkdir(dirname(manifestPath), { recursive: true }),
    mkdir(dirname(cureListPath), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(manifestPath, toJsonl(output.rows), "utf8"),
    writeFile(cureListPath, toJsonl(output.cures), "utf8"),
  ]);
  return output;
};

const runCli = async () => {
  const [bankPath = DEFAULT_BANK, manifestPath = DEFAULT_MANIFEST, cureListPath = DEFAULT_CURE_LIST] =
    process.argv.slice(2);
  const { rows, cures } = await writeRhythmLayerA(bankPath, manifestPath, cureListPath);
  const flagged = rows.filter((row) => row.flags.length > 0).length;
  console.log(
    `Wrote ${rows.length} rhythm rows (${flagged} flagged) to ${manifestPath}; ` +
      `${cures.length} positional cure candidates to ${cureListPath}.`,
  );
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runCli();
}
