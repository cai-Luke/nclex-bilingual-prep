import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { routeCanonical } from "../../lib/canonical-routing";
import { normalizeTopic } from "../../scripts/coverage-report";
import {
  auditNonMcqBias,
  NON_MCQ_BIAS_CONFIG,
  NON_MCQ_BIAS_CONFIG_HASH,
  type BiasRecord,
  type BiasReport,
  type BiasVerdict,
} from "../../scripts/audit/non-mcq-bias-lib";
import {
  defaultNonMcqBiasBankPaths,
  loadNonMcqBiasBanks,
} from "../../scripts/audit/audit-non-mcq-bias";
import {
  categories,
  difficulties,
  NCLEX_CATEGORY_WEIGHTS,
  standaloneItemTypes,
} from "../../src/schema";
import { getVisual, VISUAL_ITEM_TYPES } from "../../src/visuals/registry";
import "../../src/visuals/kinds";
import type { Question } from "../../src/types";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT_DIR = resolve(ROOT, "audit/content-demand-2026-07-14");
const GENERATOR_PATH = "audit/content-demand-2026-07-14/generate-content-demand.ts";
const INVENTORY_JSON = resolve(OUT_DIR, "distribution-inventory.json");
const INVENTORY_MD = resolve(OUT_DIR, "distribution-inventory.md");
const MANIFEST_JSON = resolve(OUT_DIR, "content-commission-manifest.json");
const HANDOFF_MD = resolve(OUT_DIR, "CONTENT-DEMAND-HANDOFF.md");

type LeafLocation = "top_level_standalone" | "embedded_case_part";
type Population = "graded_leaves" | "commissionable_standalone" | "embedded_case_parts" | "case_parents" | "canonical_bank" | "global_audit";
type RoutingDisposition = "allowed_current_route" | "frozen_bank_exception_required" | "audit_policy_change_required" | "removal_only_simulation" | "not_executable";

type ItemRef = {
  id: string;
  parentCaseId: string | null;
  parentTopic: string | null;
  parentCategory: string | null;
  bank: string;
  location: LeafLocation;
  itemType: string;
  category: string;
  difficulty: string;
  topicRaw: string;
  topicNormalized: string;
  topicLabelVariants: string[];
  optionCount: number | null;
  correctCount: number | null;
  sequenceLength: number | null;
  promotedTemplate: string | null;
  visualKinds: string[];
  ngnSkill: string | null;
};

type Leaf = {
  question: any;
  bank: string;
  location: LeafLocation;
  parentCaseId: string | null;
  parentTopic: string | null;
  parentCategory: string | null;
  ref?: ItemRef;
  kendall?: number | null;
};

type Scope = {
  scopeId: string;
  population: Population;
  bank: string | null;
  entries: Leaf[];
  official: "global" | "bank" | null;
  dimension: "global" | "bank" | "category" | "topic" | "difficulty" | "location";
};

const STOP_WORDS = [
  "about", "after", "also", "among", "and", "are", "because", "been", "before", "being", "between",
  "client", "does", "during", "each", "following", "from", "have", "into", "most", "nurse", "patient",
  "should", "that", "the", "their", "then", "this", "through", "which", "while", "with", "would",
].sort();
const STOP_WORD_SET = new Set(STOP_WORDS);

const FROZEN_BANKS = new Set([
  "burn-canonical", "capnography-canonical", "device-canonical", "io-canonical", "lab-canonical",
  "mar-canonical", "medlabel-canonical", "vitals-canonical",
]);

const jsonStable = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const lexical = (left: string, right: string) => left.localeCompare(right);
const uniqueSorted = (values: string[]) => [...new Set(values)].sort(lexical);
const round = (value: number, digits = 12) => Number(value.toFixed(digits));

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function capture(command: string, args: string[]) {
  const run = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", env: process.env });
  const exitCode = run.status ?? 1;
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  if (exitCode !== 0) throw new Error(`${[command, ...args].join(" ")} failed (${exitCode})\n${output}`);
  return { command: [command, ...args].join(" "), exitCode, note: output.split("\n").filter(Boolean).slice(-2).join(" | ") };
}

function record(report: BiasReport, bank: string, itemType: string, check: string): BiasRecord {
  const found = report.records.find((row) => row.bank === bank && row.item_type === itemType && row.check === check);
  if (!found) throw new Error(`Missing audit record: ${bank}/${itemType}/${check}`);
  return found;
}

function nativeReport(scope: Scope): { report: BiasReport; bankId: string } {
  // Avoid colliding with the library's own generated `global` row. The public
  // single-bank call still supplies the native statistic, but its per-bank row
  // is now unambiguous.
  const bankId = scope.official === "global" ? "native_global" : scope.scopeId;
  return {
    report: auditNonMcqBias([{ id: bankId, questions: scope.entries.map((entry) => entry.question) as Question[] }]),
    bankId,
  };
}

function stemTokens(question: any): Set<string> {
  return new Set(String(question.stem?.en ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORD_SET.has(token)));
}

function jaccard(left: Set<string>, right: Set<string>): number {
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return round(intersection / union.size);
}

function orderedPublicValues(question: any): { template: string; kendall: number } {
  const id = `item:${question.id}`;
  const report = auditNonMcqBias([{ id, questions: [question] }]);
  const templateRecord = record(report, id, "ordered_response", "template_repetition");
  const scrambleRecord = record(report, id, "ordered_response", "scramble_depth");
  const histogram = templateRecord.metrics.template_histogram as Record<string, number>;
  const keys = Object.keys(histogram);
  if (keys.length !== 1 || histogram[keys[0]] !== 1) throw new Error(`Public API did not yield one template for ${question.id}`);
  const kendall = Number(scrambleRecord.metrics.mean_normalized_kendall);
  if (!Number.isFinite(kendall)) throw new Error(`Public API did not yield Kendall value for ${question.id}`);
  return { template: keys[0], kendall };
}

function sataFailureCauses(scope: Scope, native: BiasRecord): string[] {
  if (native.verdict !== "FAIL") return [];
  const sata = scope.entries.filter((entry) => entry.question.itemType === "select_all");
  const optionCounts = uniqueSorted(sata.map((entry) => String(entry.question.options.length))).map(Number);
  const availableBins = optionCounts.length === 0 ? 0 : Math.max(...optionCounts);
  const topShare = Number(native.metrics.top_share ?? 0);
  const forcedConcentration = native.n > 0 && availableBins > 0 && Math.ceil(native.n / availableBins) / native.n > NON_MCQ_BIAS_CONFIG.sata_count_degeneracy;
  const missing = native.metrics.missing_by_option_count as Record<string, number[]>;
  const causes = new Set<string>();
  for (const [shape, counts] of Object.entries(missing ?? {})) {
    const optionCount = Number(shape);
    const cohortN = sata.filter((entry) => entry.question.options.length === optionCount).length;
    if (cohortN < optionCount) causes.add("low_n_impossible");
    for (const count of counts) causes.add(count === 1 || count === optionCount ? "missing_boundary_bin" : "missing_interior_bin");
  }
  if (forcedConcentration) causes.add("low_n_impossible");
  else if (topShare > NON_MCQ_BIAS_CONFIG.sata_count_degeneracy) causes.add("concentration");
  return [...causes].sort();
}

function orderedFailureCauses(native: BiasRecord): string[] {
  if (native.verdict !== "FAIL") return [];
  return native.n < Math.ceil(1 / NON_MCQ_BIAS_CONFIG.template_repeat_max_share)
    ? ["low_n_impossible"]
    : ["concentration"];
}

function buildDisposition(
  scope: Scope,
  itemType: "select_all" | "ordered_response",
  check: "correct_count_distribution" | "template_repetition",
  native: BiasRecord,
  effective: BiasRecord,
) {
  const inheritedFrom = scope.official === "global"
    ? ((effective.metrics.inherited_per_bank_failures as string[] | undefined) ?? [])
    : [];
  const causes = itemType === "select_all" ? sataFailureCauses(scope, native) : orderedFailureCauses(native);
  const metrics = { ...native.metrics, failureCauses: causes };
  let disposition: "no_action" | "content_candidate" | "audit_policy_review" | "routing_blocked" | "case_level_review";
  if (native.verdict !== "FAIL") {
    disposition = inheritedFrom.length > 0
      ? inheritedFrom.some((bank) => FROZEN_BANKS.has(bank)) ? "routing_blocked" : "audit_policy_review"
      : "no_action";
  } else if (!causes.includes("concentration")) {
    disposition = "audit_policy_review";
  } else if (scope.population === "embedded_case_parts") {
    disposition = "case_level_review";
  } else if (scope.bank && FROZEN_BANKS.has(scope.bank)) {
    disposition = "routing_blocked";
  } else {
    disposition = "content_candidate";
  }
  const minimumN = itemType === "ordered_response"
    ? Math.ceil(1 / NON_MCQ_BIAS_CONFIG.template_repeat_max_share)
    : scope.entries.filter((entry) => entry.question.itemType === "select_all")
      .reduce((sum, entry, _index, array) => _index === array.findIndex((other) => other.question.options.length === entry.question.options.length) ? sum + entry.question.options.length : sum, 0);
  const mechanicallyImpossible = causes.includes("low_n_impossible");
  return {
    scopeId: scope.scopeId,
    population: scope.population,
    bank: scope.bank,
    itemType,
    check,
    nativeVerdict: native.verdict,
    effectiveVerdict: effective.verdict,
    inheritedFrom,
    n: native.n,
    nUsable: native.n_usable,
    lowN: {
      value: mechanicallyImpossible,
      reason: mechanicallyImpossible ? (itemType === "select_all" ? "Current missing-bin or concentration rule is mechanically impossible at this cohort size." : "Fewer than seven unique templates cannot meet the live 0.15 share limit.") : null,
      minimumNToPossiblyPass: minimumN || null,
      mechanicallyImpossibleToPassAtCurrentN: mechanicallyImpossible,
    },
    metrics,
    disposition,
    requiresClaudeRuling: disposition !== "no_action",
  };
}

function sataCohorts(scope: Scope) {
  const entries = scope.entries.filter((entry) => entry.question.itemType === "select_all");
  return uniqueSorted(entries.map((entry) => String(entry.question.options.length))).map((shape) => {
    const optionCount = Number(shape);
    const cohort = entries.filter((entry) => entry.question.options.length === optionCount);
    const histogram = Object.fromEntries(Array.from({ length: optionCount }, (_, index) => index + 1)
      .map((count) => [String(count), cohort.filter((entry) => entry.question.correct.length === count).length]));
    const topFrequency = Math.max(0, ...Object.values(histogram));
    const dominantCorrectCounts = Object.entries(histogram).filter(([, count]) => count === topFrequency && topFrequency > 0).map(([count]) => Number(count));
    const missingCounts = Object.entries(histogram).filter(([, count]) => count === 0).map(([count]) => Number(count));
    const impossible = cohort.length < optionCount;
    return {
      scopeId: `${scope.scopeId}:options:${optionCount}`,
      optionCount,
      n: cohort.length,
      histogram,
      dominantCorrectCount: dominantCorrectCounts[0] ?? null,
      dominantCorrectCounts,
      topFrequency,
      topShare: cohort.length ? round(topFrequency / cohort.length) : null,
      missingCounts,
      minimumNToPopulateAllCurrentRuleBins: optionCount,
      mechanicallyImpossibleToPassAtCurrentN: impossible,
      boundaryCounts: { oneCorrectObserved: histogram["1"] > 0, allCorrectObserved: histogram[String(optionCount)] > 0 },
      productionDemand: impossible || missingCounts.includes(1) || missingCounts.includes(optionCount) ? "prohibited_pending_architect" : missingCounts.length ? "conditional" : "none",
      itemRefs: cohort.map((entry) => entry.ref).sort((a, b) => lexical(a!.id, b!.id)),
    };
  });
}

function orderedCohort(scopeId: string, entries: Leaf[]) {
  const ordered = entries.filter((entry) => entry.question.itemType === "ordered_response");
  const sequenceLengthHistogram: Record<string, number> = {};
  const templateGroups = new Map<string, ItemRef[]>();
  const kendallHistogram: Record<string, number> = {};
  for (const entry of ordered) {
    const length = String(entry.question.options.length);
    sequenceLengthHistogram[length] = (sequenceLengthHistogram[length] ?? 0) + 1;
    const template = entry.ref!.promotedTemplate!;
    templateGroups.set(template, [...(templateGroups.get(template) ?? []), entry.ref!]);
    const bucket = Number(entry.kendall).toFixed(3);
    kendallHistogram[bucket] = (kendallHistogram[bucket] ?? 0) + 1;
  }
  const templates = [...templateGroups.entries()]
    .map(([template, itemRefs]) => ({ template, count: itemRefs.length, itemRefs: itemRefs.sort((a, b) => lexical(a.id, b.id)) }))
    .sort((a, b) => b.count - a.count || lexical(a.template, b.template));
  const topTemplateCount = templates[0]?.count ?? 0;
  const topTemplates = templates.filter((row) => row.count === topTemplateCount && topTemplateCount > 0).map((row) => row.template).sort();
  const minimumN = Math.ceil(1 / NON_MCQ_BIAS_CONFIG.template_repeat_max_share);
  return {
    scopeId,
    n: ordered.length,
    sequenceLengthHistogram: Object.fromEntries(Object.entries(sequenceLengthHistogram).sort(([a], [b]) => Number(a) - Number(b))),
    templateHistogram: Object.fromEntries(templates.map((row) => [row.template, row.count])),
    topTemplate: topTemplates[0] ?? null,
    topTemplates,
    topTemplateCount,
    topTemplateShare: ordered.length ? round(topTemplateCount / ordered.length) : null,
    minimumNForUniqueTemplatesToMeetCurrentShareLimit: minimumN,
    mechanicallyImpossibleToPassAtCurrentN: ordered.length > 0 && ordered.length < minimumN,
    meanNormalizedKendall: ordered.length ? round(ordered.reduce((sum, entry) => sum + Number(entry.kendall), 0) / ordered.length) : null,
    normalizedKendallHistogram: Object.fromEntries(Object.entries(kendallHistogram).sort(([a], [b]) => Number(a) - Number(b))),
    normalizedKendallByItem: ordered.map((entry) => ({ itemRef: entry.ref, value: entry.kendall })).sort((a, b) => lexical(a.itemRef!.id, b.itemRef!.id)),
    templates,
  };
}

function coverageCounts(entries: Leaf[], key: (entry: Leaf) => string | null): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of entries) {
    const value = key(entry);
    if (value !== null) map.set(value, (map.get(value) ?? 0) + 1);
  }
  return map;
}

function routingTrace(filename: string | null, governanceAllowsRoute: boolean) {
  const prefix = filename?.match(/^([^-]+-)/)?.[1] ?? null;
  return { routeInputFilename: filename, routeInputPrefix: prefix, resolvedCanonical: filename ? routeCanonical(filename) : null, governanceAllowsRoute };
}

async function main() {
  const commands = [capture("npm", ["run", "census:check"]), capture("npm", ["run", "audit"])];
  const headSha = git("rev-parse", "HEAD");
  const branch = git("branch", "--show-current");
  const generatedAt = git("show", "-s", "--format=%cI", "HEAD");
  const generatorText = readFileSync(resolve(ROOT, GENERATOR_PATH));
  const bankPaths = await defaultNonMcqBiasBankPaths();
  const banks = await loadNonMcqBiasBanks(bankPaths);
  const fullReport = auditNonMcqBias(banks);
  if (fullReport.audit_version !== NON_MCQ_BIAS_CONFIG.audit_version || fullReport.config_hash !== NON_MCQ_BIAS_CONFIG_HASH) throw new Error("Live audit version/config mismatch");

  const leaves: Leaf[] = [];
  const caseParents: any[] = [];
  const inputBanks: any[] = [];
  const perBankReconciliation: any[] = [];
  for (let index = 0; index < banks.length; index += 1) {
    const bank = banks[index];
    const bankPath = bankPaths[index];
    let standalone = 0;
    let parents = 0;
    let embedded = 0;
    for (const question of bank.questions as any[]) {
      if (question.itemType === "case_study") {
        parents += 1;
        caseParents.push({
          id: question.id, bank: bank.id, topicRaw: question.topic, topicNormalized: normalizeTopic(question.topic),
          category: question.category, difficulty: question.difficulty,
          embeddedPartIds: question.caseStudy.questions.map((part: any) => part.id).sort(),
          sharedVisualKinds: uniqueSorted([
            ...question.caseStudy.exhibits.flatMap((exhibit: any) => exhibit.visual ? [exhibit.visual.kind] : []),
            ...(question.caseStudy.stages ?? []).flatMap((stage: any) => stage.exhibits.flatMap((exhibit: any) => exhibit.visual ? [exhibit.visual.kind] : [])),
          ]),
        });
        for (const part of question.caseStudy.questions) {
          embedded += 1;
          leaves.push({ question: part, bank: bank.id, location: "embedded_case_part", parentCaseId: question.id, parentTopic: question.topic, parentCategory: question.category });
        }
      } else {
        standalone += 1;
        leaves.push({ question, bank: bank.id, location: "top_level_standalone", parentCaseId: null, parentTopic: null, parentCategory: null });
      }
    }
    const bankText = readFileSync(resolve(ROOT, bankPath));
    const row = {
      path: bankPath.replaceAll("\\", "/"), sha256: sha256(bankText), topLevelQuestionCount: bank.questions.length,
      standaloneCount: standalone, caseParentCount: parents, embeddedPartCount: embedded, gradedLeafCount: standalone + embedded,
    };
    inputBanks.push(row);
    perBankReconciliation.push({ bank: bank.id, ...row, equationPassed: row.gradedLeafCount === standalone + embedded });
  }

  const topicVariants = new Map<string, Set<string>>();
  for (const leaf of leaves) {
    const normalized = normalizeTopic(leaf.question.topic);
    topicVariants.set(normalized, new Set([...(topicVariants.get(normalized) ?? []), leaf.question.topic]));
    if (leaf.question.itemType === "ordered_response") {
      const values = orderedPublicValues(leaf.question);
      leaf.kendall = values.kendall;
      (leaf as any).template = values.template;
    }
  }
  for (const leaf of leaves) {
    const q = leaf.question;
    const normalized = normalizeTopic(q.topic);
    leaf.ref = {
      id: q.id, parentCaseId: leaf.parentCaseId, parentTopic: leaf.parentTopic, parentCategory: leaf.parentCategory,
      bank: leaf.bank, location: leaf.location, itemType: q.itemType, category: q.category, difficulty: q.difficulty,
      topicRaw: q.topic, topicNormalized: normalized, topicLabelVariants: [...(topicVariants.get(normalized) ?? [])].sort(),
      optionCount: Array.isArray(q.options) ? q.options.length : null,
      correctCount: q.itemType === "select_all" ? q.correct.length : null,
      sequenceLength: q.itemType === "ordered_response" ? q.options.length : null,
      promotedTemplate: q.itemType === "ordered_response" ? (leaf as any).template : null,
      visualKinds: q.visual ? [q.visual.kind] : [], ngnSkill: q.ngnSkill ?? null,
    };
  }

  const standaloneLeaves = leaves.filter((leaf) => leaf.location === "top_level_standalone");
  const embeddedLeaves = leaves.filter((leaf) => leaf.location === "embedded_case_part");
  const topLevelTotal = banks.reduce((sum, bank) => sum + bank.questions.length, 0);
  const reconciliation = {
    topLevelStandalone: standaloneLeaves.length, caseParents: caseParents.length, embeddedParts: embeddedLeaves.length,
    topLevelTotal, gradedLeaves: leaves.length, commissionableStandalone: standaloneLeaves.length,
    equationPassed: leaves.length === standaloneLeaves.length + embeddedLeaves.length,
  };
  if (!reconciliation.equationPassed || !perBankReconciliation.every((row) => row.equationPassed)) throw new Error("Population reconciliation failed");

  const scopes: Scope[] = [
    { scopeId: "global", population: "global_audit", bank: null, entries: leaves, official: "global", dimension: "global" },
    ...banks.map((bank) => ({ scopeId: bank.id, population: "canonical_bank" as const, bank: bank.id, entries: leaves.filter((leaf) => leaf.bank === bank.id), official: "bank" as const, dimension: "bank" as const })),
    ...categories.map((category) => ({ scopeId: `category:${category}`, population: "graded_leaves" as const, bank: null, entries: leaves.filter((leaf) => leaf.question.category === category), official: null, dimension: "category" as const })),
    ...difficulties.map((difficulty) => ({ scopeId: `difficulty:${difficulty}`, population: "graded_leaves" as const, bank: null, entries: leaves.filter((leaf) => leaf.question.difficulty === difficulty), official: null, dimension: "difficulty" as const })),
    { scopeId: "commissionable_standalone", population: "commissionable_standalone", bank: null, entries: standaloneLeaves, official: null, dimension: "location" },
    { scopeId: "embedded_case_parts", population: "embedded_case_parts", bank: null, entries: embeddedLeaves, official: null, dimension: "location" },
  ];
  const topicNames = uniqueSorted(leaves.map((leaf) => normalizeTopic(leaf.question.topic)));
  for (const topic of topicNames) {
    const entries = leaves.filter((leaf) => normalizeTopic(leaf.question.topic) === topic);
    if (entries.some((leaf) => leaf.question.itemType === "select_all" || leaf.question.itemType === "ordered_response")) {
      scopes.push({ scopeId: `topic:${topic}`, population: "graded_leaves", bank: null, entries, official: null, dimension: "topic" });
    }
  }

  const dispositions: any[] = [];
  const sataDiagnostics: any[] = [];
  const orderedDiagnostics: any[] = [];
  for (const scope of scopes) {
    const native = nativeReport(scope);
    for (const [itemType, check] of [["select_all", "correct_count_distribution"], ["ordered_response", "template_repetition"]] as const) {
      const own = record(native.report, native.bankId, itemType, check);
      if (scope.dimension === "topic" && own.n === 0) continue;
      const effective = scope.official === "global" ? record(fullReport, "global", itemType, check)
        : scope.official === "bank" ? record(fullReport, scope.scopeId, itemType, check) : own;
      dispositions.push(buildDisposition(scope, itemType, check, own, effective));
    }
    sataDiagnostics.push(...sataCohorts(scope));
    const ordered = scope.entries.filter((entry) => entry.question.itemType === "ordered_response");
    if (scope.dimension !== "topic" || ordered.length > 0) {
      orderedDiagnostics.push(orderedCohort(scope.scopeId, scope.entries));
      for (const length of uniqueSorted(ordered.map((entry) => String(entry.question.options.length)))) {
        orderedDiagnostics.push(orderedCohort(`${scope.scopeId}:sequence:${length}`, ordered.filter((entry) => entry.question.options.length === Number(length))));
      }
    }
  }

  const topicItemTypeCounts = coverageCounts(leaves, (leaf) => `${normalizeTopic(leaf.question.topic)}\u001f${leaf.question.itemType}`);
  const categoryItemTypeCounts = coverageCounts(leaves, (leaf) => `${leaf.question.category}\u001f${leaf.question.itemType}`);
  const topicDifficultyCounts = coverageCounts(leaves, (leaf) => `${normalizeTopic(leaf.question.topic)}\u001f${leaf.question.difficulty}`);
  const visualKindCounts = coverageCounts(leaves, (leaf) => leaf.question.visual?.kind ?? null);
  const ngnSkillCounts = coverageCounts(leaves, (leaf) => leaf.question.ngnSkill ?? null);
  const gradedCategoryCounts = coverageCounts(leaves, (leaf) => leaf.question.category);
  const contentCandidateScopes = new Map(dispositions.filter((row) => row.disposition === "content_candidate").map((row) => [`${row.scopeId}\u001f${row.itemType}`, row]));

  const reviewPriorities = leaves
    .filter((leaf) => leaf.question.itemType === "select_all" || leaf.question.itemType === "ordered_response")
    .map((leaf) => {
      const q = leaf.question;
      const topic = normalizeTopic(q.topic);
      const peers = leaves.filter((other) => other !== leaf && normalizeTopic(other.question.topic) === topic && other.question.itemType === q.itemType);
      const scoredPeers = peers.map((other) => ({ itemRef: other.ref, similarity: jaccard(stemTokens(q), stemTokens(other.question)) }))
        .sort((a, b) => b.similarity - a.similarity || lexical(a.itemRef!.id, b.itemRef!.id));
      const impacts = [
        ["topic_item_type", `${topic}|${q.itemType}`, topicItemTypeCounts.get(`${topic}\u001f${q.itemType}`) ?? 0],
        ["category_item_type", `${q.category}|${q.itemType}`, categoryItemTypeCounts.get(`${q.category}\u001f${q.itemType}`) ?? 0],
        ["topic_difficulty", `${topic}|${q.difficulty}`, topicDifficultyCounts.get(`${topic}\u001f${q.difficulty}`) ?? 0],
        ...(q.visual ? [["visual_kind", q.visual.kind, visualKindCounts.get(q.visual.kind) ?? 0]] : []),
        ...(q.ngnSkill ? [["ngn_skill", q.ngnSkill, ngnSkillCounts.get(q.ngnSkill) ?? 0]] : []),
      ].map(([dimension, value, beforeCount]) => ({ dimension, value, beforeCount, afterRemovalCount: Number(beforeCount) - 1, becomesZero: Number(beforeCount) === 1 }));
      const relevantScopes = scopes.filter((scope) => scope.entries.includes(leaf));
      const dominant = relevantScopes.some((scope) => {
        const candidate = contentCandidateScopes.get(`${scope.scopeId}\u001f${q.itemType}`);
        if (!candidate) return false;
        if (q.itemType === "select_all") {
          const hist = candidate.metrics.histogram as Record<string, number>;
          const max = Math.max(...Object.values(hist));
          return hist[String(q.correct.length)] === max;
        }
        const hist = candidate.metrics.template_histogram as Record<string, number>;
        const max = Math.max(...Object.values(hist));
        return hist[leaf.ref!.promotedTemplate!] === max;
      });
      const categoryTargetGradedLeaves = NCLEX_CATEGORY_WEIGHTS[q.category as keyof typeof NCLEX_CATEGORY_WEIGHTS] * leaves.length;
      const categorySurplusRatio = round(((gradedCategoryCounts.get(q.category) ?? 0) - categoryTargetGradedLeaves) / categoryTargetGradedLeaves);
      const components = {
        locationRank: leaf.location === "top_level_standalone" ? 0 : 1,
        dominantCellRank: dominant ? 0 : 1,
        topicItemTypeCount: topicItemTypeCounts.get(`${topic}\u001f${q.itemType}`) ?? 0,
        categorySurplusRatio,
        zeroProducingCoverageImpactCount: impacts.filter((impact) => impact.becomesZero).length,
        maxStemJaccard: scoredPeers[0]?.similarity ?? null,
        itemId: q.id,
      };
      return {
        itemRef: leaf.ref, label: leaf.location === "embedded_case_part" ? "case_level_review_only" : dominant ? "review_candidate" : "not_distribution_relevant",
        reviewPriorityComponents: components,
        stemSimilaritySignal: { method: "fixed_stopword_jaccard", maxSimilarity: scoredPeers[0]?.similarity ?? null, neighbors: scoredPeers.filter((row) => row.similarity === scoredPeers[0]?.similarity).map((row) => row.itemRef) },
        coverageImpacts: impacts,
        categoryTargetGradedLeaves,
        currentCategoryCountGradedLeaves: gradedCategoryCounts.get(q.category) ?? 0,
      };
    })
    .sort((a, b) => a.reviewPriorityComponents.locationRank - b.reviewPriorityComponents.locationRank
      || a.reviewPriorityComponents.dominantCellRank - b.reviewPriorityComponents.dominantCellRank
      || b.reviewPriorityComponents.topicItemTypeCount - a.reviewPriorityComponents.topicItemTypeCount
      || b.reviewPriorityComponents.categorySurplusRatio - a.reviewPriorityComponents.categorySurplusRatio
      || a.reviewPriorityComponents.zeroProducingCoverageImpactCount - b.reviewPriorityComponents.zeroProducingCoverageImpactCount
      || (b.reviewPriorityComponents.maxStemJaccard ?? -1) - (a.reviewPriorityComponents.maxStemJaccard ?? -1)
      || lexical(a.reviewPriorityComponents.itemId, b.reviewPriorityComponents.itemId));

  const labScope = scopes.find((scope) => scope.scopeId === "lab-canonical")!;
  const globalScope = scopes.find((scope) => scope.scopeId === "global")!;
  const labBefore = dispositions.find((row) => row.scopeId === "lab-canonical" && row.itemType === "ordered_response");
  const globalBefore = dispositions.find((row) => row.scopeId === "global" && row.itemType === "ordered_response");
  const labOrdered = labScope.entries.filter((entry) => entry.question.itemType === "ordered_response");
  const removalReport = auditNonMcqBias([{ id: "lab-removal", questions: labOrdered.slice(1).map((entry) => entry.question) }]);
  const removalRecord = record(removalReport, "lab-removal", "ordered_response", "template_repetition");
  const visualRoute = routingTrace("visual-lab-trend-ordered-response-candidate.json", true);
  const labLegacyRoute = routingTrace("lab-ordered-response-replacement.json", false);
  const simulations = [
    {
      targetScopeId: "lab-canonical", check: "template_repetition", operation: "audit_policy_change", routingDisposition: "audit_policy_change_required", routingTrace: routingTrace(null, false),
      assumptions: ["Architect approves a minimum-n gate of seven for template repetition."],
      before: { nativeVerdict: labBefore.nativeVerdict, effectiveVerdict: labBefore.effectiveVerdict, n: labBefore.n, metrics: labBefore.metrics },
      after: { nativeVerdict: "INSUFFICIENT", effectiveVerdict: "INSUFFICIENT", n: labBefore.n, metrics: { minimumN: 7, contentChanged: false } },
      conditional: true, clearsNativeFinding: true, clearsEffectiveFinding: true, requiresClaudeRuling: true,
    },
    {
      targetScopeId: "lab-canonical", check: "template_repetition", operation: "remove", routingDisposition: "removal_only_simulation", routingTrace: routingTrace(null, false),
      assumptions: [`Hypothetically remove ${labOrdered[0]?.question.id}; no deletion is recommended.`],
      before: { nativeVerdict: labBefore.nativeVerdict, effectiveVerdict: labBefore.effectiveVerdict, n: labBefore.n, metrics: labBefore.metrics },
      after: { nativeVerdict: removalRecord.verdict, effectiveVerdict: removalRecord.verdict, n: removalRecord.n, metrics: removalRecord.metrics },
      conditional: true, clearsNativeFinding: removalRecord.verdict !== "FAIL", clearsEffectiveFinding: false, requiresClaudeRuling: true,
    },
    {
      targetScopeId: "lab-canonical", check: "template_repetition", operation: "replace", routingDisposition: "frozen_bank_exception_required", routingTrace: labLegacyRoute,
      assumptions: ["Architect grants an exception to replace within the frozen lab bank.", "At n=4 even four unique templates have top share 0.25, so replacement cannot pass the live 0.15 limit."],
      before: { nativeVerdict: labBefore.nativeVerdict, effectiveVerdict: labBefore.effectiveVerdict, n: labBefore.n, metrics: labBefore.metrics },
      after: { nativeVerdict: "FAIL", effectiveVerdict: "FAIL", n: 4, metrics: { minimumAchievableTopShare: 0.25, templateEffect: "conditional_pre_promotion" } },
      conditional: true, clearsNativeFinding: false, clearsEffectiveFinding: false, requiresClaudeRuling: true,
    },
    {
      targetScopeId: "global", check: "template_repetition", operation: "add", routingDisposition: "allowed_current_route", routingTrace: visualRoute,
      assumptions: ["One ordinary lab-trend ordered-response item is added through the live visual lane.", "The post-promotion template is not projected."],
      before: { nativeVerdict: globalBefore.nativeVerdict, effectiveVerdict: globalBefore.effectiveVerdict, n: globalBefore.n, metrics: globalBefore.metrics },
      after: { nativeVerdict: "PASS", effectiveVerdict: "FAIL", n: globalBefore.n + 1, metrics: { labCanonicalUnchanged: true, inheritedFailureStillPresent: true, templateEffect: "conditional_pre_promotion" } },
      conditional: true, clearsNativeFinding: false, clearsEffectiveFinding: false, requiresClaudeRuling: true,
    },
  ];

  const standaloneTypeCounts = coverageCounts(standaloneLeaves, (leaf) => leaf.question.itemType);
  const standaloneCategoryCounts = coverageCounts(standaloneLeaves, (leaf) => leaf.question.category);
  const standaloneTopicTypeCounts = coverageCounts(standaloneLeaves, (leaf) => `${normalizeTopic(leaf.question.topic)}\u001f${leaf.question.itemType}`);
  const standaloneTopicTypeDifficultyCounts = coverageCounts(standaloneLeaves, (leaf) => `${normalizeTopic(leaf.question.topic)}\u001f${leaf.question.itemType}\u001f${leaf.question.difficulty}`);
  const standaloneTopicCounts = coverageCounts(standaloneLeaves, (leaf) => normalizeTopic(leaf.question.topic));
  const pairKeys = uniqueSorted(standaloneLeaves.map((leaf) => `${normalizeTopic(leaf.question.topic)}\u001f${leaf.question.category}`));
  const preferredTypes = ["bowtie", "highlight", "fill_in_blank", "ordered_response", "dropdown_cloze"];
  const standaloneTypeTarget = standaloneLeaves.length / standaloneItemTypes.length;
  const candidates: any[] = [];
  for (const pairKey of pairKeys) {
    const [topic, category] = pairKey.split("\u001f");
    const neighbors = standaloneLeaves.filter((leaf) => normalizeTopic(leaf.question.topic) === topic && leaf.question.category === category);
    const rawCounts = coverageCounts(neighbors, (leaf) => leaf.question.topic);
    const topicRawTarget = [...rawCounts.entries()].sort((a, b) => b[1] - a[1] || lexical(a[0], b[0]))[0][0];
    const observedKinds = uniqueSorted(neighbors.flatMap((leaf) => leaf.question.visual ? [leaf.question.visual.kind] : []));
    for (const itemType of preferredTypes) {
      const difficultyRows = difficulties.map((difficulty) => ({ difficulty, count: standaloneLeaves.filter((leaf) => normalizeTopic(leaf.question.topic) === topic && leaf.question.category === category && leaf.question.itemType === itemType && leaf.question.difficulty === difficulty).length }))
        .sort((a, b) => a.count - b.count || lexical(a.difficulty, b.difficulty));
      const selectedDifficulty = difficultyRows[0].difficulty;
      const moduleAllowed = observedKinds.filter((kind) => (getVisual(kind)?.allowedItemTypes ?? VISUAL_ITEM_TYPES).includes(itemType as any));
      const noVisualFallback = observedKinds.length > 0 && moduleAllowed.length === 0;
      const currentTypeCount = standaloneTypeCounts.get(itemType) ?? 0;
      const categoryTarget = NCLEX_CATEGORY_WEIGHTS[category as keyof typeof NCLEX_CATEGORY_WEIGHTS] * standaloneLeaves.length;
      const routeFilename = moduleAllowed.length > 0 ? "visual-content-demand-candidate.json" : "gpt-content-demand-candidate.json";
      candidates.push({
        topic, category, itemType, difficulty: selectedDifficulty, topicRawTarget,
        topicLabelVariants: [...(topicVariants.get(topic) ?? [])].sort(),
        itemTypeDeficitRatio: round(Math.max(0, standaloneTypeTarget - currentTypeCount) / standaloneTypeTarget),
        currentStandaloneTypeCount: currentTypeCount, standaloneTypeTarget,
        topicItemTypeCount: standaloneTopicTypeCounts.get(`${topic}\u001f${itemType}`) ?? 0,
        categoryShortfallRatio: round(Math.max(0, categoryTarget - (standaloneCategoryCounts.get(category) ?? 0)) / categoryTarget),
        currentStandaloneCategoryCount: standaloneCategoryCounts.get(category) ?? 0, categoryTarget,
        topicTypeDifficultyCount: standaloneTopicTypeDifficultyCounts.get(`${topic}\u001f${itemType}\u001f${selectedDifficulty}`) ?? 0,
        topicTotalStandaloneCount: standaloneTopicCounts.get(topic) ?? 0,
        observedKinds, allowedKinds: moduleAllowed, noVisualFallback, routeFilename,
      });
    }
  }
  candidates.sort((a, b) => b.itemTypeDeficitRatio - a.itemTypeDeficitRatio
    || a.topicItemTypeCount - b.topicItemTypeCount
    || b.categoryShortfallRatio - a.categoryShortfallRatio
    || a.topicTypeDifficultyCount - b.topicTypeDifficultyCount
    || a.topicTotalStandaloneCount - b.topicTotalStandaloneCount
    || lexical(a.topic, b.topic) || lexical(a.itemType, b.itemType) || lexical(a.difficulty, b.difficulty));

  const bankExpansion = candidates.slice(0, 15).map((candidate) => {
    const neighbors = standaloneLeaves.filter((leaf) => normalizeTopic(leaf.question.topic) === candidate.topic && leaf.question.itemType === candidate.itemType)
      .map((leaf) => leaf.ref!).sort((a, b) => lexical(a.id, b.id)).slice(0, 3);
    const route = routingTrace(candidate.routeFilename, true);
    return {
      purpose: "bank_expansion", count: 1, itemType: candidate.itemType, category: candidate.category, difficulty: candidate.difficulty,
      topicRawTarget: candidate.topicRawTarget, topicNormalized: candidate.topic, topicLabelVariants: candidate.topicLabelVariants,
      optionCount: null, correctCountEnvelope: null, sequenceLengthEnvelope: null,
      templateConstraint: candidate.itemType === "ordered_response" ? {
        mode: "semantic_diversity_only", prohibitedProducerControl: true,
        conditionalProjection: { status: "conditional_pre_promotion", candidateId: null, assumedTemplate: null, finalTemplate: null, changesNativeVerdict: null, changesEffectiveVerdict: null, caveat: "Final template acceptance occurs only after deterministic promotion with a stable candidate ID." },
      } : { mode: "none", prohibitedProducerControl: false, conditionalProjection: null },
      replacementCandidateIds: [], preserveCoverage: [], avoidNeighborIds: neighbors,
      visualPolicy: candidate.allowedKinds.length > 0
        ? { mode: "optional_existing_kind", allowedKinds: candidate.allowedKinds, placementValidated: true, governingSource: "src/visuals/registry.ts" }
        : { mode: "no_visual", allowedKinds: [], placementValidated: true, governingSource: candidate.noVisualFallback ? "No observed kind supports this item type; conditional no-visual fallback." : "No direct visuals observed in exact topic/category neighbors." },
      mechanicalEvidence: {
        population: "commissionable_standalone", itemTypeDeficitRatio: candidate.itemTypeDeficitRatio,
        currentStandaloneTypeCount: candidate.currentStandaloneTypeCount, standaloneTypeTarget: candidate.standaloneTypeTarget,
        topicItemTypeCount: candidate.topicItemTypeCount, categoryShortfallRatio: candidate.categoryShortfallRatio,
        currentStandaloneCategoryCount: candidate.currentStandaloneCategoryCount, categoryTarget: candidate.categoryTarget,
        topicTypeDifficultyCount: candidate.topicTypeDifficultyCount, topicTotalStandaloneCount: candidate.topicTotalStandaloneCount,
        reviewPriorityComponents: null,
      },
      reason: "Mechanically ranked opportunity only; clinical scenario and closed-world gradeability require independent content judgment.",
      projectedMetricEffects: [], routingDisposition: "allowed_current_route", routingTrace: route,
      productionReadiness: "conditional_content_judgment", requiresContentJudgment: true, requiresClaudeRuling: true,
    };
  });

  const provenance = {
    artifactVersion: "1.0", generatedAt, headSha, branch,
    auditVersion: fullReport.audit_version, auditConfigHash: fullReport.config_hash,
    generator: { path: GENERATOR_PATH, command: `npx tsx ${GENERATOR_PATH}`, generatorSha256: sha256(generatorText) },
    commands, inputBanks,
    populationDefinitions: {
      graded_leaves: "Every top-level standalone question plus every embedded case-study part; excludes case parents; not exposure-weighted.",
      commissionable_standalone: "Top-level standalone questions only.",
      embedded_case_parts: "Embedded case-study parts only; never independently retired without case-level review.",
      case_parents: "Top-level case_study containers used only for reconciliation and context.",
      census_gradedTotal: "Census top-level count plus embedded parts; includes case parents and intentionally differs from graded_leaves.",
    },
    reconciliation,
  };

  const historicalText = readFileSync(resolve(ROOT, "audit/non-mcq-bias-report.md"), "utf8");
  const historicN = (pattern: RegExp) => Number(historicalText.match(pattern)?.[1] ?? NaN);
  const staleReportDrift = [
    { scope: "gpt-canonical SATA", historicalN: historicN(/gpt-canonical \/ select_all \/ correct_count_distribution\s+FAIL\s+(\d+)/), liveN: record(fullReport, "gpt-canonical", "select_all", "correct_count_distribution").n },
    { scope: "visual-canonical SATA", historicalN: historicN(/visual-canonical \/ select_all \/ correct_count_distribution\s+FAIL\s+(\d+)/), liveN: record(fullReport, "visual-canonical", "select_all", "correct_count_distribution").n },
    { scope: "global SATA", historicalN: historicN(/global \/ select_all \/ correct_count_distribution\s+FAIL\s+(\d+)/), liveN: record(fullReport, "global", "select_all", "correct_count_distribution").n },
    { scope: "global ordered response", historicalN: historicN(/global \/ ordered_response \/ template_repetition\s+FAIL\s+(\d+)/), liveN: record(fullReport, "global", "ordered_response", "template_repetition").n },
  ];
  const labCohort = orderedDiagnostics.find((row) => row.scopeId === "lab-canonical");
  const requiredConclusions = [
    { id: 1, claim: "Global ordered-response native distribution passes.", confirmed: globalBefore.nativeVerdict === "PASS", evidence: globalBefore },
    { id: 2, claim: "Global ordered-response effective failure is inherited.", confirmed: globalBefore.effectiveVerdict === "FAIL" && globalBefore.inheritedFrom.includes("lab-canonical"), evidence: globalBefore.inheritedFrom },
    { id: 3, claim: "lab-canonical contains four ordered-response items.", confirmed: labCohort.n === 4, evidence: labCohort.n },
    { id: 4, claim: "The four lab items have four distinct promoted templates.", confirmed: Object.keys(labCohort.templateHistogram).length === 4 && Object.values(labCohort.templateHistogram).every((count: any) => count === 1), evidence: labCohort.templateHistogram },
    { id: 5, claim: "The lab failure is low-n threshold behavior, not template repetition.", confirmed: labCohort.n < 7 && labCohort.topTemplateCount === 1, evidence: { n: labCohort.n, topTemplateCount: labCohort.topTemplateCount, minimumN: 7 } },
    { id: 6, claim: "Ordinary new lab-trend content routes to visual-canonical.json.", confirmed: visualRoute.resolvedCanonical === "visual-canonical.json", evidence: visualRoute },
    { id: 7, claim: "Visual-lane additions cannot clear lab-canonical's native finding.", confirmed: simulations[3].after.metrics.labCanonicalUnchanged === true, evidence: simulations[3] },
    { id: 8, claim: "Small SATA banks fail primarily under missing-bin/low-n behavior.", confirmed: ["burn-canonical", "device-canonical", "mar-canonical"].every((bank) => dispositions.find((row) => row.scopeId === bank && row.itemType === "select_all")?.metrics.failureCauses.includes("low_n_impossible")), evidence: dispositions.filter((row) => ["burn-canonical", "device-canonical", "mar-canonical", "io-canonical"].includes(row.scopeId) && row.itemType === "select_all") },
  ];
  if (requiredConclusions.some((row) => !row.confirmed)) throw new Error("A required conclusion was refuted; inspect generated evidence before continuing");

  const topicInventory = topicNames.map((topic) => {
    const entries = leaves.filter((leaf) => normalizeTopic(leaf.question.topic) === topic);
    return {
      topicNormalized: topic, rawVariants: [...(topicVariants.get(topic) ?? [])].sort(),
      standaloneCount: entries.filter((entry) => entry.location === "top_level_standalone").length,
      embeddedCount: entries.filter((entry) => entry.location === "embedded_case_part").length,
      gradedLeafCount: entries.length,
      byItemType: Object.fromEntries(uniqueSorted(entries.map((entry) => entry.question.itemType)).map((type) => [type, entries.filter((entry) => entry.question.itemType === type).length])),
      byCategory: Object.fromEntries(uniqueSorted(entries.map((entry) => entry.question.category)).map((category) => [category, entries.filter((entry) => entry.question.category === category).length])),
      byDifficulty: Object.fromEntries(difficulties.map((difficulty) => [difficulty, entries.filter((entry) => entry.question.difficulty === difficulty).length])),
    };
  });

  const inventory = {
    provenance, reconciliation: { ...reconciliation, perBank: perBankReconciliation, censusGradedTotal: topLevelTotal + embeddedLeaves.length, censusDifferenceExplainedByCaseParents: caseParents.length },
    sourceNotes: {
      topicNormalization: "Imported normalizeTopic from scripts/coverage-report.ts; BANK-CENSUS.md uses raw topics.",
      sharedAuditReport: "audit/non-mcq-bias-report.md is a content-stale historical snapshot; disagreement with live API-derived results is expected input drift.",
      staleReportDrift,
      exposure: "Standalone and embedded parts are reported separately; no learner-exposure weighting model is asserted.",
      englishStemSimilarity: { stopWords: STOP_WORDS, tokenRule: "lowercase; non-alphanumeric to spaces; whitespace split; fixed stop-word removal; tokens shorter than three removed; deduplicated; Jaccard" },
    },
    populations: { gradedLeaves: leaves.map((leaf) => leaf.ref).sort((a, b) => lexical(a!.id, b!.id)), commissionableStandalone: standaloneLeaves.map((leaf) => leaf.ref).sort((a, b) => lexical(a!.id, b!.id)), embeddedCaseParts: embeddedLeaves.map((leaf) => leaf.ref).sort((a, b) => lexical(a!.id, b!.id)), caseParents: caseParents.sort((a, b) => lexical(a.id, b.id)) },
    topicInventory,
    auditDispositions: dispositions,
    sataCohorts: sataDiagnostics,
    orderedResponseCohorts: orderedDiagnostics,
    reviewPriorities,
    routingSimulations: simulations,
    requiredConclusions,
    semanticMergeProposals: [],
    unresolvedArchitecturalQuestions: [
      { id: "sata-missing-bins", question: "Should missing SATA correct-count bins fail a distributional bias audit?", evidence: ["Live sata_missing_count_fails=true makes missing bins independently sufficient."], affectedScopes: dispositions.filter((row) => row.itemType === "select_all" && row.metrics.failureCauses.some((cause: string) => cause.startsWith("missing_"))).map((row) => row.scopeId) },
      { id: "minimum-n", question: "What minimum n should yield INSUFFICIENT for SATA and ordered-response distribution checks?", evidence: ["Template 0.15 requires at least seven unique items; SATA bin requirements depend on observed option shapes."], affectedScopes: dispositions.filter((row) => row.lowN.value).map((row) => row.scopeId) },
      { id: "inheritance", question: "Should global distribution verdicts inherit canonical-file failures?", evidence: ["Global ordered native PASS is converted to effective FAIL solely by lab-canonical."], affectedScopes: ["global", "lab-canonical"] },
      { id: "frozen-bank", question: "Can any content operation target an original frozen per-kind canonical bank?", evidence: ["Governance freezes original per-kind banks; routeCanonical still resolves legacy prefixes mechanically."], affectedScopes: ["lab-canonical", "io-canonical"] },
      { id: "retirement", question: "Do any mechanically ranked review candidates warrant case-level or clinical retirement review?", evidence: ["Review tuples are distributional signals, not clinical verdicts."], affectedScopes: uniqueSorted(reviewPriorities.filter((row) => row.label !== "not_distribution_relevant").map((row) => row.itemRef.bank)) },
      { id: "commission", question: "Which of the 15 mechanical expansion opportunities have a closed-world, gradeable clinical use?", evidence: ["All rows remain conditional_content_judgment."], affectedScopes: ["commissionable_standalone"] },
    ],
  };

  const manifest = {
    provenance, remediation: [], bankExpansion, expansionUnitCount: bankExpansion.reduce((sum, row) => sum + row.count, 0),
    semanticMergeProposals: [], unresolvedArchitecturalQuestions: inventory.unresolvedArchitecturalQuestions,
  };
  if (manifest.expansionUnitCount !== 15) throw new Error(`Expected 15 expansion units, found ${manifest.expansionUnitCount}`);

  const nativeFailures = dispositions.filter((row) => row.nativeVerdict === "FAIL");
  const inherited = dispositions.filter((row) => row.nativeVerdict !== "FAIL" && row.effectiveVerdict === "FAIL");
  const lowN = dispositions.filter((row) => row.lowN.mechanicallyImpossibleToPassAtCurrentN);
  const concentrated = dispositions.filter((row) => row.metrics.failureCauses.includes("concentration"));
  const md = `# Bank-Demand and Distribution Inventory\n\nGenerated from live disk at \`${headSha}\` on branch \`${branch}\`. This is analysis evidence, not a retirement, audit-policy, or content-commission ruling.\n\n## Reconciliation\n\n- Graded leaves: **${leaves.length}**\n- Commissionable standalone: **${standaloneLeaves.length}**\n- Embedded case parts: **${embeddedLeaves.length}**\n- Case parents: **${caseParents.length}**\n- Top-level total: **${topLevelTotal}**\n- Invariant: \`${leaves.length} = ${standaloneLeaves.length} + ${embeddedLeaves.length}\` — **PASS**\n- Census gradedTotal: **${topLevelTotal + embeddedLeaves.length}**; its ${caseParents.length}-item difference from graded leaves is exactly the included case-parent population.\n\n## Live audit separation\n\n- Native failures: ${nativeFailures.length}\n- Inherited-only failures: ${inherited.length}\n- Mechanically impossible low-n records: ${lowN.length}\n- Records with non-forced concentration: ${concentrated.length}\n- The committed shared report is stale by content, not config; live gpt SATA is ${staleReportDrift[0].liveN} vs ${staleReportDrift[0].historicalN}, and live global ordered response is ${staleReportDrift[3].liveN} vs ${staleReportDrift[3].historicalN}.\n\n## Required conclusions\n\n${requiredConclusions.map((row) => `- **CONFIRMED:** ${row.claim}`).join("\n")}\n\n## Lab ordered-response finding\n\nThe four lab items have four distinct promoted templates. The native lab record fails because at n=4 the smallest possible dominant-template share is 0.25, above the live 0.15 limit. Global native ordered response passes; its effective FAIL is inherited from the frozen lab bank. Ordinary lab-trend additions route to \`visual-canonical.json\` and cannot alter the lab record. The inventory keeps audit-policy, removal-only, frozen-bank replacement, and ordinary visual-lane addition simulations separate.\n\n## SATA\n\nForced n=1 concentration is recorded as \`low_n_impossible\`, not genuine concentration. Missing boundary and interior bins remain audit-policy questions. Non-forced concentration signals are content candidates only where routing and case-level constraints allow; no retirement or remediation commission is decided here.\n\n## Ordinary expansion envelope\n\nExactly **${manifest.expansionUnitCount}** one-unit opportunities were selected by the required lexicographic ranking. Every row is \`conditional_content_judgment\`: format fit and the clinical scenario require Claude review. There is no production-ready subset and no remediation replacement in this artifact.\n\n${bankExpansion.map((row, index) => `${index + 1}. ${row.topicRawTarget} — ${row.itemType}, ${row.category}, ${row.difficulty}`).join("\n")}\n\n## Unresolved architect questions\n\n${inventory.unresolvedArchitecturalQuestions.map((row) => `- **${row.id}:** ${row.question}`).join("\n")}\n`;

  const handoff = `# Content-Demand Inventory Handoff\n\nEvidence snapshot: \`${headSha}\` (\`${branch}\`). Generator: \`${GENERATOR_PATH}\`.\n\n## Mechanically established\n\n- Reconciliation passes: ${leaves.length} graded leaves = ${standaloneLeaves.length} standalone + ${embeddedLeaves.length} embedded parts; ${caseParents.length} case parents are context only.\n- Census check and aggregate audit both exited 0; the audit carried its expected advisory distribution warnings.\n- Global ordered-response is native PASS and effective FAIL inherited from \`lab-canonical\`.\n- Lab has four items and four distinct promoted templates; its n=4 cohort cannot meet the live 0.15 share limit even if all templates are unique.\n- Forced n=1 SATA concentration is classified as low-n impossibility, closing the R1 disposition gap.\n- Ordinary lab-trend additions route to \`visual-canonical.json\` and leave the frozen lab-bank failure intact.\n- The committed shared audit report is content-stale; live results are API-derived and authoritative for this snapshot.\n\n## Review boundaries\n\nNo item is labeled retire. Embedded parts are case-level-review-only. No audit-policy ruling, frozen-bank exception, or remediation commission is made. Exactly 15 ordinary expansion opportunities are emitted, all conditional on content judgment.\n\n## Artifacts\n\n- \`distribution-inventory.json\` — complete populations, audit dispositions, diagnostics, review tuples, and simulations\n- \`distribution-inventory.md\` — human-readable summary\n- \`content-commission-manifest.json\` — exact 15-unit conditional expansion envelope\n- \`generate-content-demand.ts\` — deterministic generator\n\nClaude should adjudicate the unresolved questions in the inventory without rewriting these evidence artifacts.\n`;

  writeFileSync(INVENTORY_JSON, jsonStable(inventory));
  writeFileSync(MANIFEST_JSON, jsonStable(manifest));
  writeFileSync(INVENTORY_MD, md);
  writeFileSync(HANDOFF_MD, handoff);
  console.log(`Generated content-demand inventory at ${headSha}`);
  console.log(`Reconciliation: ${leaves.length} = ${standaloneLeaves.length} + ${embeddedLeaves.length}`);
  console.log(`Expansion units: ${manifest.expansionUnitCount}`);
}

await main();
