import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { BankEnvelope, MultipleChoiceQuestion } from "../../src/types";

const text = (en: string) => ({ en, zh: "测试。" });

export const makeQuestion = (
  id: string,
  options: {
    correctIndex?: number;
    stem?: string;
    rationale?: string;
    topic?: string;
  } = {},
): MultipleChoiceQuestion => {
  const optionIds = ["A", "B", "C"];
  return {
    id,
    itemType: "multiple_choice",
    category: "Pharmacological and Parenteral Therapies",
    topic: options.topic ?? "IV Fluid Calculations",
    difficulty: "medium",
    stem: text(options.stem ?? "Which action should the nurse take?"),
    options: optionIds.map((optionId) => ({
      id: optionId,
      en: `Choice ${optionId}`,
      zh: `选项 ${optionId}`,
    })),
    correct: [optionIds[options.correctIndex ?? 0]],
    rationale: {
      correct: text(options.rationale ?? "Use the clinical facts."),
      byChoice: optionIds.map((optionId) => ({
        refId: optionId,
        en: `Reason for choice ${optionId}.`,
        zh: "临床理由。",
      })),
    },
    testTakingStrategy: text("Use the clinical facts in the stem."),
    glossary: [],
  };
};

export const makeBank = (...questions: BankEnvelope["questions"]): BankEnvelope => ({
  meta: {
    schemaVersion: "2.0",
    exam: "NCLEX-RN",
    topic: "audit scope fixture",
    category: "mixed",
    difficulty: "mixed",
    count: questions.length,
  },
  questions,
});

export type AuditScopeFixtures = {
  directory: string;
  validA: string;
  validB: string;
  malformed: string;
  schemaInvalid: string;
  missing: string;
  unreadable: string;
  aliasForValidA: string;
  cleanup: () => Promise<void>;
};

export async function createAuditScopeFixtures(): Promise<AuditScopeFixtures> {
  const directory = await mkdtemp(join(tmpdir(), "project-shrimp-audit-scope-"));
  const validA = join(directory, "a.json");
  const validB = join(directory, "b.json");
  const malformed = join(directory, "malformed.json");
  const schemaInvalid = join(directory, "schema-invalid.json");
  const unreadable = join(directory, "unreadable.json");
  await Promise.all([
    writeFile(validA, JSON.stringify(makeBank(makeQuestion("fixture_a")))),
    writeFile(validB, JSON.stringify(makeBank(makeQuestion("fixture_b", { correctIndex: 1 })))),
    writeFile(malformed, "{ malformed"),
    writeFile(schemaInvalid, JSON.stringify({ meta: { schemaVersion: "2.0" }, questions: [{ id: "invalid" }] })),
    writeFile(unreadable, JSON.stringify(makeBank(makeQuestion("fixture_unreadable")))),
  ]);
  return {
    directory,
    validA,
    validB,
    malformed,
    schemaInvalid,
    missing: join(directory, "missing.json"),
    unreadable,
    aliasForValidA: `${directory}/./a.json`,
    cleanup: () => rm(directory, { recursive: true, force: true }),
  };
}

export async function withUnreadableFile<T>(
  file: string,
  run: () => Promise<T>,
): Promise<{ unreadableWasEnforced: boolean; value: T }> {
  await chmod(file, 0);
  try {
    let unreadableWasEnforced = false;
    try {
      await import("node:fs/promises").then(({ readFile }) => readFile(file));
    } catch {
      unreadableWasEnforced = true;
    }
    return { unreadableWasEnforced, value: await run() };
  } finally {
    await chmod(file, 0o600);
  }
}
