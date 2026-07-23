import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { checkCaseCompileManifests, stripCompileManifests } from "./case-completeness";
import { normalizeBankPresentations, serializeBank } from "./presentation-normalization";
import { normalizeRawBankStructure, type RawNormalizationChange } from "./raw-bank-normalization";
import { routeCanonical } from "./canonical-routing";
import { shuffle } from "./shuffle";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import type { BankEnvelope } from "../src/types";

export type PreparedPromotionPreview = {
  displayPath: string;
  resolvedPath: string;
  sourceFilename: string;
  canonicalFilename: string;
  bank: BankEnvelope;
  serialized: string;
};

export type PromotionPreviewFailure = {
  displayPath: string;
  reasons: string[];
  normalizationChanges?: RawNormalizationChange[];
};

export type PreparePromotionPreviewResult =
  | { ok: true; prepared: PreparedPromotionPreview }
  | { ok: false; failure: PromotionPreviewFailure };

const strictValidation = (value: unknown) =>
  validateBankObject(value, { rejectUnknownKeys: true, requireMeta: true });

const describeNormalizationChange = (change: RawNormalizationChange): string => {
  const owner = change.questionId ? `${change.questionId} ` : "";
  const transition = change.from !== undefined || change.to !== undefined
    ? ` (${JSON.stringify(change.from)} → ${JSON.stringify(change.to)})`
    : "";
  return `${owner}${change.path}: ${change.note}${transition}`;
};

export async function prepareRawPromotionPreview(input: {
  displayPath: string;
  resolvedPath: string;
}): Promise<PreparePromotionPreviewResult> {
  const { displayPath, resolvedPath } = input;
  try {
    const parsed = parseBankText(await readFile(resolvedPath, "utf8"));
    const normalized = normalizeRawBankStructure(parsed);
    if (normalized.changes.length > 0) {
      return {
        ok: false,
        failure: {
          displayPath,
          normalizationChanges: normalized.changes,
          reasons: [
            "Source requires deliberate raw-bank normalization before gating.",
            ...normalized.changes.map(describeNormalizationChange),
            `Review and run: npm run normalize-raw-bank -- --write ${displayPath}`,
          ],
        },
      };
    }

    const manifestFailures = checkCaseCompileManifests(parsed);
    if (manifestFailures.length > 0) {
      return {
        ok: false,
        failure: {
          displayPath,
          reasons: manifestFailures.flatMap((failure) =>
            failure.reasons.map((reason) => `${failure.caseId}: ${reason}`)),
        },
      };
    }

    const validated = strictValidation(stripCompileManifests(parsed));
    if (!validated.ok) {
      return { ok: false, failure: { displayPath, reasons: validated.reasons } };
    }

    const shuffled: BankEnvelope = {
      ...validated.value,
      questions: validated.value.questions.map(shuffle),
    };
    const prepared = normalizeBankPresentations(shuffled).bank;
    const revalidated = strictValidation(prepared);
    if (!revalidated.ok) {
      return {
        ok: false,
        failure: {
          displayPath,
          reasons: revalidated.reasons.map((reason) => `prepared preview: ${reason}`),
        },
      };
    }

    const sourceFilename = basename(resolvedPath);
    const canonicalFilename = routeCanonical(sourceFilename);
    if (!canonicalFilename) {
      return {
        ok: false,
        failure: {
          displayPath,
          reasons: [`No canonical route is registered for candidate filename ${sourceFilename}.`],
        },
      };
    }

    return {
      ok: true,
      prepared: {
        displayPath,
        resolvedPath,
        sourceFilename,
        canonicalFilename,
        bank: revalidated.value,
        serialized: serializeBank(revalidated.value),
      },
    };
  } catch (error) {
    return {
      ok: false,
      failure: {
        displayPath,
        reasons: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}
