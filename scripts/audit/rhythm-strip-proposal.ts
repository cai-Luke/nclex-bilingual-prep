import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { Question, RhythmStripVisual } from "../../src/types";
import {
  buildRhythmLayerA,
  DEFAULT_BANK,
  type RhythmLayerARow,
} from "./rhythm-strip-layer-a";

const DEFAULT_OUTPUT = "audit/rhythm-strip-audit-proposal.jsonl";
const DEFAULT_REPORT = "audit/rhythm-strip-audit-proposal.md";

type Verdict = "CUT" | "CURE" | "KEEP" | "REVIEW";
type Confidence = "HIGH" | "MEDIUM" | "LOW";
type CategoryCode = "NEC" | "RED" | "OG";

type Cure = {
  field: string;
  before: string;
  after: string;
};

type Decision = {
  verdict: Verdict;
  category_code: CategoryCode;
  confidence: Confidence;
  reason: string;
  alternative_interpretation: string;
  confidence_justification: string;
  duplicate_of?: string;
  cure?: Cure;
};

type RhythmQuestion = Question & { visual: RhythmStripVisual };

const RETAINED_FLAGGED: Record<string, Decision> = {
  rhy_sinus_brady_001: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Strong source-reviewed recognition item; the strip's rate and sinus morphology are the tested data.",
    alternative_interpretation: "The stem repeats measured features, but the learner still has to integrate the displayed rhythm with those measurements.",
    confidence_justification: "It is the strongest reviewed sinus-brady recognition item and tests a distinct concept.",
  },
  ekg_b1_mc_02: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Distinct athlete-bradycardia management concept; the unnamed strip establishes the rhythm requiring clinical interpretation.",
    alternative_interpretation: "The athlete context suggests benign bradycardia, but the rhythm must still be identified before choosing observation.",
    confidence_justification: "The visual and stability data jointly determine the safe action.",
  },
  ekg_b1_mc_05: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Distinct beta-blocker overdose concept; the unnamed bradycardic strip contributes to recognizing toxic chronotropy.",
    alternative_interpretation: "The overdose history points toward glucagon, but the strip supplies the clinically relevant bradyarrhythmia.",
    confidence_justification: "It is not a duplicate of rhythm recognition or routine symptomatic-bradycardia treatment.",
  },
  ekg_b1_mc_08: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Distinct compensatory sinus-tachycardia item linking the strip to hypovolemia and fluid resuscitation.",
    alternative_interpretation: "The dehydration findings strongly suggest fluids even without the strip, but the rhythm confirms the compensatory response the item tests.",
    confidence_justification: "The item integrates rhythm interpretation with cause-directed treatment rather than recalling a named rhythm.",
  },
  ekg_b2_mc_01: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Best atrial-fibrillation recognition item in the MC group; the rhythm is not named in the stem.",
    alternative_interpretation: "The stem describes the morphology in text, but the displayed strip remains the central classification stimulus.",
    confidence_justification: "It is necessity-clean under the calibrated name-leak rule and conceptually distinct from AF management.",
  },
  ekg_b2_mc_03: {
    verdict: "CURE",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Retain the only focused SVT recognition item; remove one Chinese spatial-language hazard.",
    alternative_interpretation: "The phrase describes an anatomic origin rather than an option position, but equivalent non-spatial wording is clearer and mechanically safe.",
    confidence_justification: "The item protects the SVT subtype and needs exactly one wording cure.",
    cure: {
      field: "rationale.correct.zh",
      before: "表明冲动起源在心室以上",
      after: "表明冲动起源于心室上方的组织",
    },
  },
  ekg_b3_mc_03: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Focused Mobitz I recognition item; the subtype is not named and the progressive PR pattern is load-bearing.",
    alternative_interpretation: "The stem verbalizes the strip pattern, but the visual remains the rhythm-classification stimulus.",
    confidence_justification: "It tests a distinct conduction pattern and is stronger than the stable-management recall item.",
  },
  ekg_b3_mc_05: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Focused Mobitz II recognition item retained for can't-miss subtype coverage.",
    alternative_interpretation: "The stem describes constant conducted PR intervals and dropped beats, but the strip remains the classification stimulus.",
    confidence_justification: "It is the strongest necessity-clean item for a protected high-risk subtype.",
  },
  ekg_b3_mc_07: {
    verdict: "CURE",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Retain complete-heart-block recognition and replace a stale option-letter instruction with answer-content wording.",
    alternative_interpretation: "The option letter may have matched a pre-shuffle layout, but it is unsafe in the normalized bank.",
    confidence_justification: "The protected subtype is strongly tested and only one Chinese strategy field needs repair.",
    cure: {
      field: "testTakingStrategy.zh",
      before: "选择选项B。",
      after: "选择三度（完全性）房室传导阻滞。",
    },
  },
  ekg_b4_mc_01: {
    verdict: "KEEP",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Focused PVC recognition item; no stronger retained item tests the same ectopic-beat morphology.",
    alternative_interpretation: "The stem describes the morphology fully, but the strip is still the classification stimulus.",
    confidence_justification: "It preserves a distinct rhythm concept without a name leak.",
  },
  ekg_b4_mc_03: {
    verdict: "CURE",
    category_code: "RED",
    confidence: "HIGH",
    reason: "Retain monomorphic-VT recognition and replace one Chinese spatial phrase.",
    alternative_interpretation: "The phrase is anatomically meaningful rather than option-position language, but the cure preserves meaning without the flagged token.",
    confidence_justification: "The item protects VT recognition and needs exactly one mechanical wording change.",
    cure: {
      field: "rationale.byChoice[0].zh",
      before: "因为传导通路在心室以上",
      after: "因为冲动经正常传导系统从心室上方传入",
    },
  },
  ekg_b4_mc_08: {
    verdict: "CURE",
    category_code: "NEC",
    confidence: "HIGH",
    reason: "Retain the only focused asystole recognition item and replace one relative-position pronoun.",
    alternative_interpretation: "“后者” is grammatically understandable, but explicit PEA wording is robust after presentation changes.",
    confidence_justification: "The protected subtype remains load-bearing and the sole defect is one Chinese strategy phrase.",
    cure: {
      field: "testTakingStrategy.zh",
      before: "将其与PEA区分开来，后者在监护仪上表现为有组织的心律",
      after: "将其与PEA区分开来；PEA在监护仪上表现为有组织的心律",
    },
  },
};

const CUT_OVERRIDES: Record<string, Partial<Decision>> = {
  ekg_b1_mc_01: { reason: "The stem asks for a general normal-sinus criterion and names the target classification; the displayed strip is not needed.", category_code: "NEC" },
  ekg_b1_sata_03: { reason: "The stem names sinus bradycardia and asks for generic poor-perfusion findings; the strip is decorative.", category_code: "NEC" },
  ekg_b1_mc_04: { reason: "The stem names symptomatic sinus bradycardia and supplies rate, symptoms, and blood pressure; the strip adds nothing to atropine-dose recall.", category_code: "NEC" },
  ekg_b1_mc_06: { reason: "The stem names sinus tachycardia and asks for a common cause; the strip is decorative.", category_code: "NEC" },
  ekg_b1_sata_07: { reason: "The stem names sustained sinus tachycardia and asks for generic instability findings; the strip is decorative.", category_code: "NEC" },
  ekg_b1_matrix_09: { reason: "The matrix rows contain all rhythm parameters and classifications; the single displayed strip is unrelated to resolving the three rows.", category_code: "NEC" },
  ekg_b1_mc_10: { reason: "The rate and albuterol context resolve an expected adverse effect without reading the strip; weaker visual necessity than the retained hypovolemia item.", category_code: "RED", duplicate_of: "ekg_b1_mc_08" },
  ekg_b2_mc_02: { reason: "Chronic atrial fibrillation is named and the question is anticoagulation recall; the strip is decorative.", category_code: "NEC" },
  ekg_b2_mc_04: { reason: "SVT is named with stability and rate supplied; the answer is vagal-maneuver recall without strip interpretation.", category_code: "NEC" },
  ekg_b2_mc_05: { reason: "SVT and failed vagal maneuvers are named; the answer is adenosine-administration recall and the strip is decorative.", category_code: "NEC" },
  ekg_b2_sata_06: { reason: "SVT and adenosine administration are named; expected adverse effects do not require the strip.", category_code: "NEC" },
  ekg_b2_mc_08: { reason: "Atrial fibrillation and ventricular rate are supplied in the stem; rate-control therapy is resolvable without the strip.", category_code: "NEC" },
  ekg_b2_sata_09: { reason: "Atrial fibrillation and rate are supplied; the task is generic unstable-tachycardia sign recognition.", category_code: "NEC" },
  ekg_b3_mc_01: { reason: "The retained heart-block matrix already tests the same prolonged, constant PR with 1:1 conduction classification.", category_code: "RED", duplicate_of: "ekg_b3_matrix_10" },
  ekg_b3_mc_02: { reason: "The PR interval and facility hold parameter are stated explicitly; the strip is unnecessary to apply the medication protocol.", category_code: "NEC" },
  ekg_b3_mc_04: { reason: "Mobitz I is named and stability findings are complete; observation is generic management recall and the item also carries positional wording.", category_code: "NEC" },
  ekg_b3_mc_06: { reason: "Mobitz II, ventricular rate, symptoms, and hypotension are stated; pacing priority does not require reading the strip.", category_code: "NEC" },
  ekg_b3_sata_08: { reason: "Complete AV block and ventricular rate are stated; the item asks for generic severe-hypoperfusion manifestations.", category_code: "NEC" },
  ekg_b3_mc_09: { reason: "Third-degree AV block and rate are stated; permanent-pacemaker recall does not require the strip.", category_code: "NEC" },
  ekg_b4_mc_02: { reason: "PVCs and their frequency are named; potassium review is a reversible-cause recall item with a decorative strip.", category_code: "NEC" },
  ekg_b4_mc_04: { reason: "Pulseless ventricular tachycardia is explicitly supplied; the retained source-reviewed pulseless-VT item is stronger and broader.", category_code: "RED", duplicate_of: "rhy_vtach_001" },
  ekg_b4_mc_05: { reason: "Monomorphic ventricular tachycardia, stability, pulse status, and rate are supplied; the strip is decorative medication recall.", category_code: "NEC" },
  ekg_b4_sata_07: { reason: "Ventricular fibrillation and pulseless arrest are named; the retained source-reviewed shockable-arrest item covers the same immediate actions more strongly.", category_code: "RED", duplicate_of: "rhy_vtach_001" },
  ekg_b4_sata_09: { reason: "Asystole is named; the intervention set is non-shockable-arrest recall and the strip is decorative.", category_code: "NEC" },
  ekg_b5_mc_02: { reason: "Sinus bradycardia and classic digoxin-toxicity symptoms are supplied; holding digoxin does not require the strip.", category_code: "NEC" },
};

const isRhythmQuestion = (question: Question): question is RhythmQuestion =>
  question.visual?.kind === "rhythm_strip";

const correctAnswerText = (question: Question): string => {
  if (question.itemType === "multiple_choice" || question.itemType === "select_all") {
    return question.options
      .filter((option) => question.correct.includes(option.id))
      .map((option) => option.en)
      .join(" | ");
  }
  if (question.itemType === "matrix") {
    return question.correct
      .map((answer) => {
        const row = question.matrix.rows.find((candidate) => candidate.id === answer.rowId);
        const columns = answer.columnIds.map(
          (id) => question.matrix.columns.find((candidate) => candidate.id === id)?.en ?? id,
        );
        return `${row?.en ?? answer.rowId} => ${columns.join(" + ")}`;
      })
      .join(" | ");
  }
  throw new Error(`Unsupported rhythm-strip item type ${question.itemType} for ${question.id}`);
};

const evidenceFor = (question: Question) => ({
  full_stem: question.stem.en,
  correct_answer: correctAnswerText(question),
  rationale: question.rationale.correct.en,
});

const defaultCut = (row: RhythmLayerARow): Decision => {
  const override = CUT_OVERRIDES[row.id];
  const category = override?.category_code ??
    (row.flags.includes("necessity_leak") ? "NEC" : "RED");
  return {
    verdict: "CUT",
    category_code: category,
    confidence: override?.confidence ?? (category === "NEC" ? "HIGH" : "MEDIUM"),
    reason: override?.reason ?? "Flagged item does not earn retention under the cut-over-cure rule.",
    alternative_interpretation:
      override?.alternative_interpretation ??
      "The item may test a clinically distinct fact, but that distinction does not make the displayed strip necessary.",
    confidence_justification:
      override?.confidence_justification ??
      (category === "NEC"
        ? "The keyed response remains resolvable from the stem and choices after removing the visual."
        : "The concept adds less value than the retained comparator within the capped rhythm set."),
    duplicate_of: override?.duplicate_of,
  };
};

const confidenceOrder: Record<Confidence, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export const buildProposal = (questions: Question[]) => {
  const rhythmQuestions = questions.filter(isRhythmQuestion);
  const byId = new Map(rhythmQuestions.map((question) => [question.id, question]));
  const layerA = buildRhythmLayerA(questions);

  const manifest = layerA.rows.map((row) => {
    const question = byId.get(row.id);
    if (!question) throw new Error(`Missing rhythm question ${row.id}`);

    const decision =
      row.flags.length === 0
        ? {
            verdict: "KEEP" as const,
            category_code: "RED" as const,
            confidence: "HIGH" as const,
            reason: "Layer A clean; excluded from the capped semantic queue and retained unchanged.",
            alternative_interpretation: "No flagged necessity, redundancy, or positional concern requires adjudication.",
            confidence_justification: "The deterministic gate supplied no reason to alter this item.",
          }
        : RETAINED_FLAGGED[row.id] ?? defaultCut(row);

    const duplicate = decision.duplicate_of ? byId.get(decision.duplicate_of) : undefined;
    if (decision.duplicate_of && !duplicate) {
      throw new Error(`${row.id} references missing duplicate ${decision.duplicate_of}`);
    }

    return {
      id: row.id,
      subtype: row.subtype,
      verdict: decision.verdict,
      category_code: decision.category_code,
      confidence: decision.confidence,
      flags: row.flags,
      reason: decision.reason,
      evidence: evidenceFor(question),
      ...(duplicate
        ? { comparison: { id: duplicate.id, evidence: evidenceFor(duplicate) } }
        : {}),
      alternative_interpretation: decision.alternative_interpretation,
      confidence_justification: decision.confidence_justification,
      ...(decision.cure ? { cure: decision.cure } : {}),
    };
  });

  const retained = manifest.filter((row) => row.verdict !== "CUT").length;
  if (retained < 18 || retained > 20) {
    throw new Error(`Retained set must be 18-20 items; got ${retained}`);
  }
  for (const row of manifest) {
    if (row.verdict === "CURE" && !("cure" in row)) {
      throw new Error(`${row.id} is CURE without a cure payload`);
    }
  }
  const protectedSubtypes = ["vfib", "vtach", "asystole", "avb_3", "avb_2_mobitz2", "svt", "afib"];
  for (const subtype of protectedSubtypes) {
    if (!manifest.some((row) => row.subtype === subtype && row.verdict !== "CUT")) {
      throw new Error(`Protected subtype ${subtype} has no retained item`);
    }
  }

  return manifest.sort(
    (left, right) =>
      confidenceOrder[left.confidence] - confidenceOrder[right.confidence] ||
      left.id.localeCompare(right.id),
  );
};

const toJsonl = (rows: unknown[]) =>
  `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;

const reportFor = (manifest: ReturnType<typeof buildProposal>) => {
  const counts = (value: Verdict) => manifest.filter((row) => row.verdict === value).length;
  const confidenceCounts = (value: Confidence) =>
    manifest.filter(
      (row) => row.verdict !== "KEEP" && row.confidence === value,
    ).length;
  const auditedIds = manifest.map((row) => row.id).sort();
  const unflagged = manifest.filter((row) => row.flags.length === 0).map((row) => row.id);
  return `# Rhythm-Strip Audit Proposal

AUDIT SESSION HEADER
====================
Session ID         : 2026-06-13-Rhythm-1
Questions Audited  : ${auditedIds.join(", ")}
Total in Scope     : ${manifest.length}
Audit Categories   : NEC, RED, OG
Total Findings     : ${counts("CUT") + counts("CURE") + counts("REVIEW")}
  HIGH confidence  : ${confidenceCounts("HIGH")}
  MEDIUM confidence: ${confidenceCounts("MEDIUM")}
  LOW confidence   : ${confidenceCounts("LOW")}
Null Ranges        : Layer-A-clean retained items: ${unflagged.join(", ")}

Verdicts: ${counts("CUT")} CUT, ${counts("CURE")} CURE, ${counts("KEEP")} KEEP, ${counts("REVIEW")} REVIEW.
Retained set: ${manifest.length - counts("CUT")} items.

The JSONL manifest is the action proposal. Canonical bank content was not edited.

## Current-Guidance Check

No OG verdict was required. The 2025 American Heart Association adult algorithms retain:

- atropine 1 mg IV, repeated every 3-5 minutes to 3 mg total;
- shock-first VF/pulseless-VT sequencing with epinephrine every 3-5 minutes after the second shock loop;
- amiodarone 150 mg over 10 minutes as an antiarrhythmic infusion option for stable wide-QRS tachycardia.

Sources:

- https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf
- https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf
- https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Tachycardia-250514.pdf
`;
};

const loadQuestions = async (bankPath: string): Promise<Question[]> => {
  const raw = parseBankText(await readFile(bankPath, "utf8"));
  const result = validateBankObject(raw);
  if (!result.ok) throw new Error(result.reasons.join("\n"));
  return result.value.questions;
};

export const writeProposal = async (
  bankPath = DEFAULT_BANK,
  outputPath = DEFAULT_OUTPUT,
  reportPath = DEFAULT_REPORT,
) => {
  const manifest = buildProposal(await loadQuestions(bankPath));
  await Promise.all([
    mkdir(dirname(outputPath), { recursive: true }),
    mkdir(dirname(reportPath), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(outputPath, toJsonl(manifest), "utf8"),
    writeFile(reportPath, reportFor(manifest), "utf8"),
  ]);
  return manifest;
};

const runCli = async () => {
  const [bankPath = DEFAULT_BANK, outputPath = DEFAULT_OUTPUT, reportPath = DEFAULT_REPORT] =
    process.argv.slice(2);
  const manifest = await writeProposal(bankPath, outputPath, reportPath);
  const retained = manifest.filter((row) => row.verdict !== "CUT").length;
  console.log(`Wrote ${manifest.length} verdicts to ${outputPath}; retained set ${retained}.`);
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runCli();
}
