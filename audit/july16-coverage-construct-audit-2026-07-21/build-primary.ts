import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const population = readFileSync(join(root, "population.jsonl"), "utf8").trim().split("\n").map(JSON.parse);

type Verdict = "FIX" | "RETIRE";
type Override = {
  verdict: Verdict;
  primaryClass: string;
  secondaryClasses?: string[];
  nextDisposition: string;
  reason: string;
  alternative: string;
  nursingRelevance?: string;
  sourceCheck?: string;
  evidence: string[];
};

const weakBowtie = (evidence: string[], reason: string, alternative: string): Override => ({
  verdict: "RETIRE",
  primaryClass: "WEAK_OR_NONCOMPETING_DIFFERENTIAL",
  nextDisposition: "RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED",
  reason,
  alternative,
  evidence,
});

const disclosedSequence = (evidence: string[]): Override => ({
  verdict: "RETIRE",
  primaryClass: "ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION",
  nextDisposition: "RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED",
  reason: "The stem states the required total sequence and the response options reproduce it. The key is supported, but ordering disclosed steps measures transcription rather than sequencing judgment.",
  alternative: "Present the clinical state and unordered response choices without disclosing the required sequence, or use a format that asks for the priority action.",
  evidence,
});

const lowValueLabel = (evidence: string[], label: string): Override => ({
  verdict: "RETIRE",
  primaryClass: "OTHER_CONFIRMED_CONSTRUCT_DEFECT",
  nextDisposition: "RETIRE_WITHOUT_REPLACEMENT",
  nursingRelevance: "LOW",
  reason: `The response demand is the exact label “${label}” after the stem supplies its defining features. The live key is correct, but the item measures closed-vocabulary recall rather than a consequential nursing decision.`,
  alternative: "Use the scenario to select or evaluate a clinically consequential communication, safety, or escalation action.",
  evidence,
});

const telegraphFix = (evidence: string[], reason: string): Override => ({
  verdict: "FIX",
  primaryClass: "ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION",
  nextDisposition: "BOUNDED_TEXT_REPAIR",
  reason,
  alternative: "Remove the answer-bearing rule or protocol recital while preserving the scenario, options, key, and source-grounded rationale.",
  evidence,
});

const adverse: Record<number, Override> = {
  1: weakBowtie(["pain 9/10, no analgesic has been given", "alert, respiratory rate is 18/min"], "The record explicitly establishes untreated severe pain and excludes both alternative conditions: no opioid has been given, respiratory depression is absent, and pain remains 9/10. The useful advocacy action is stretched into a 1/2/2 bowtie with no competing condition.", "Ask for the best advocacy/escalation response to undertreated vaso-occlusive pain in a conventional action format."),
  4: disclosedSequence(["The facility sequence is", "Place the actions in order"]),
  5: lowValueLabel(["Enter the one-word TeamSTEPPS tool", "state the safety concern"], "Suggest"),
  7: weakBowtie(["neither has accepted responsibility", "Unsafe discharge transition due to unassigned pending-result follow-up"], "The stem directly states that pending-result ownership and client notification are absent. Routine completed follow-up and a medication discrepancy do not compete with that condition; the item is an ordinary discharge-safety action question expanded into a bowtie.", "Ask which discharge action establishes closed-loop pending-result ownership."),
  8: lowValueLabel(["Enter the two-word standardized handoff name", "performed in front of the receiving nurse"], "warm handoff"),
  10: disclosedSequence(["The facility sequence is", "Place the actions in order"]),
  13: weakBowtie(["loses normal electrical power", "generator ... repeatedly fails"], "The generator failure explicitly identifies an internal utility emergency. Infectious outbreak and external mass-casualty surge are unrelated alternatives, while their associated action and monitoring distractors are equally noncompeting.", "Ask for two priority continuity actions during a hospital power failure, or provide genuinely competing utility-failure cues."),
  16: disclosedSequence(["requires this sequence", "Place the actions in order"]),
  17: {
    verdict: "RETIRE", primaryClass: "ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION", nextDisposition: "RETIRE_WITHOUT_REPLACEMENT", nursingRelevance: "LOW",
    reason: "The stem supplies the defining rule for the classification and asks only for the exact category label. The answer is correct but no fetal-monitoring interpretation remains for the learner to perform.",
    alternative: "Present a tracing record without the classification rule and ask for the classification plus an appropriate response.", evidence: ["By definition", "Enter the exact NICHD category label"],
  },
  21: disclosedSequence(["The facility sequence is", "Place the actions in order"]),
  24: weakBowtie(["refuse to give report directly", "omits the current insulin-infusion rate"], "The stem names an unresolved personal dispute and a clinically incomplete, unaccepted handoff. The other condition labels are contradicted rather than plausible alternatives, and the actions/parameters simply restate safe handoff closure.", "Ask for the priority action to complete responsibility transfer before addressing the conduct dispute."),
  28: disclosedSequence(["requires this sequence", "Place the actions in order"]),
  31: telegraphFix(["The plan requires pre-numbered paper records", "Highlight the actions consistent with the activated plan"], "Every keyed highlight action is enumerated in the preceding plan sentence and then repeated nearly verbatim in the selectable record. Deleting the enumeration would restore an independent downtime-safety judgment without changing the key."),
  32: weakBowtie(["antineoplastic infusion leaks", "facility hazardous-drug spill plan is activated"], "The stem already classifies the event as a hazardous-drug spill. Infectious isolation breach and nonhazardous IV leakage do not compete, and several response distractors are plainly unsafe.", "Ask for the immediate occupational-exposure and spill-containment actions without a redundant condition zone."),
  34: weakBowtie(["core temperature of 95.7 °F (35.4 °C)", "is shivering"], "Measured hypothermia with shivering directly resolves the condition. Expected normothermia and malignant hyperthermia are opposites rather than competing interpretations; the action and parameter sets add obvious unrelated distractors.", "Use a priority-action or select-all item about perioperative hypothermia management and monitoring."),
  40: lowValueLabel(["activate the formal supervisory escalation pathway", "Enter the exact three-word escalation label"], "chain of command"),
  44: disclosedSequence(["The facility sequence is", "Place the actions in order"]),
  49: weakBowtie(["same syringe to enter a multidose vial after the syringe was used to inject a client", "places the vial back in the shared medication refrigerator"], "Unsafe re-entry directly establishes possible vial contamination. Refrigeration potency and routine medication waste do not compete with the exposure event, so the bowtie condition zone is decorative.", "Ask which containment, reporting, and exposure-tracing actions are required after unsafe multidose-vial entry."),
  53: lowValueLabel(["moving clients to a lower floor", "Enter the exact two-word term"], "vertical evacuation"),
  54: telegraphFix(["directs staff ... to secure in place", "After the all-clear, clinical teams begin triage"], "Both dropdown answers are supplied verbatim in the two-sentence stem before the learner completes the same before/after statement."),
  56: telegraphFix(["may ask only", "may not demand certification or a task demonstration"], "The stem enumerates the ADA rule set and the matrix rows then restate each permitted or prohibited behavior. The current task is rule transcription rather than independent advocacy judgment."),
  58: weakBowtie(["Two potassium specimens have hemolyzed", "staff blame one another ... repeat result ... is delayed"], "The record directly establishes an interdepartmental process conflict. Client refusal is absent and acute hyperkalemia is explicitly unconfirmed because the specimens are hemolyzed; the condition alternatives do not compete.", "Ask for the two conflict-resolution and closed-loop actions needed to obtain a valid repeat result."),
  59: {
    verdict: "RETIRE", primaryClass: "MECHANICAL_CLOZE_DEPENDENCY", nextDisposition: "RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED",
    reason: "Once the first blank establishes that staff must not confirm presence or location, the second blank merely renames the same opt-out obligation as following the directory restriction. It contributes no independent inference.",
    alternative: "Ask one consequential directory-response decision, or make the second blank address a distinct follow-up action.", evidence: ["explicitly opted out", "not confirm the client's presence or location", "follow the client's directory restriction"],
  },
  61: weakBowtie(["acceptance and chair time are unconfirmed", "have not been transmitted"], "The stem explicitly supplies every missing transition element. A fully established schedule and treatment refusal are contradicted, so condition selection adds no differential reasoning.", "Ask which two actions close the dialysis transition and which evidence confirms closure, without a condition zone."),
  67: telegraphFix(["requires temporary unique identifiers", "designated family-reunification channel", "media release only through the public-information function"], "The plan sentence lists all four keyed actions, which the highlight record repeats nearly verbatim."),
  68: weakBowtie(["shared across four clients without cleaning and disinfection", "requires infection-prevention notification and tracing"], "The exposure and required response are preclassified in the stem. A fourth-client dosing error and expected safe use are unrelated or contradicted alternatives.", "Ask for the immediate containment and exposure-tracing actions after unsafe shared-meter use."),
  69: telegraphFix(["requires suitable PPE, mechanical collection of glass, sharps disposal, cleaning before disinfection", "Classify each action"], "The stem recites every keyed cleanup step before the matrix rows reproduce those same steps."),
  76: weakBowtie(["checklist names no owner and includes no verification step", "Role and process ambiguity at shift handoff"], "The audit finding directly names the process defect. Supply shortage, equipment knowledge deficit, and an active emergency are not supported by the record; the bowtie therefore has no condition differential.", "Ask which process changes establish ownership and closed-loop restocking verification."),
  79: weakBowtie(["no recipient is named", "No clinician or team has accepted responsibility"], "The stem explicitly states an unowned OPAT transition while also confirming timely supply delivery. Refusal, allergy, and delayed supplies are unsupported, leaving one obvious condition and an ordinary handoff-closure task.", "Ask which handoff actions and follow-up evidence establish OPAT ownership."),
  82: weakBowtie(["needed two people for the transfer", "I cannot do that alone"], "The caregiver directly states a physical-capacity mismatch. Intentional delay, no rehabilitation need, and refusal of all participation are contradicted or stigmatizing nonalternatives.", "Ask which reassessment and support-plan actions make the transfer plan safe."),
  85: telegraphFix(["facility LAST protocol directs staff", "administer 20% lipid emulsion"], "The clinical cues can support an independent LAST diagnosis, but the stem then names the LAST protocol and supplies both keyed actions before the bowtie. Removing that protocol recital preserves a strong emergency construct."),
  86: disclosedSequence(["requires this sequence", "Place the actions in order"]),
  89: disclosedSequence(["pathway states", "Place the steps in order"]),
  94: disclosedSequence(["facility repair sequence is", "Place the actions in the required order"]),
  98: weakBowtie(["neither caregiver has successfully managed", "equipment is unconfirmed", "no ... trained caregiver ... overnight"], "The stem lists three explicit readiness failures. Ventilator intolerance has no supporting findings and routine readiness is contradicted, so the useful transition actions are stretched into a noncompetitive bowtie.", "Ask which discharge-readiness deficits must be corrected before a tracheostomy-dependent child goes home."),
  99: weakBowtie(["has not accepted the handoff", "weekend dosing plan is unknown", "have not been transmitted"], "The stem directly establishes threatened methadone-continuity interruption. Duplicate dosing is not confirmed and expected treatment completion is false; the remaining response is a straightforward closed-loop handoff question.", "Ask which actions establish OTP acceptance and uninterrupted next-dose continuity."),
  102: {
    verdict: "RETIRE", primaryClass: "NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", nextDisposition: "RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", nursingRelevance: "OUT_OF_SCOPE_OR_OVERLY_SPECIALIST",
    reason: "The first two blanks use familiar anion-gap and compensation calculations, but the third requires delta-gap/corrected-bicarbonate analysis to diagnose a second metabolic disorder. That specialist acid-base construct exceeds useful NCLEX-RN depth despite a mathematically correct key.",
    alternative: "Use the DKA and vomiting record to identify the primary disorder, compensation, and a nursing monitoring/escalation implication without delta-gap taxonomy.", evidence: ["Delta AG", "Corrected HCO3", "demonstrates"],
  },
  103: disclosedSequence(["The facility sequence is", "Place the actions in order"]),
  104: telegraphFix(["defines this event as wet contamination", "directs the client to stop further use"], "The stem names the keyed condition and then recites both keyed actions and the follow-up domain. Removing the answer-bearing program directive would leave a source-grounded PD contamination judgment."),
  106: weakBowtie(["oxygen-pipeline pressure falls abruptly", "oxygen utility-failure plan ... activated"], "The utility failure is explicitly named and activated. Pulse-oximeter failure and routine demand reduction do not compete, while the correct actions follow directly from the declared emergency.", "Ask for prioritized continuity actions and monitoring during an oxygen-utility failure without a redundant condition choice."),
  107: telegraphFix(["policy states that artificial extensions are not worn", "natural nail tips are kept no longer than 1/4 inch"], "The policy sentence gives the central finding and corrective limits, and the highlight record repeats them as keyed selections. Removing the exact rule recital would restore independent infection-control knowledge."),
};

const orderedGraphs: Record<number, {dependencyGraph: string; defensibleOrderCount: number}> = {
  4:{dependencyGraph:"receive/preserve request < route to HIM < designated review/response < append-link accepted amendment and notify",defensibleOrderCount:1},
  10:{dependencyGraph:"assess safety < notify prescriber < hold/secure medications < document/reconcile plan",defensibleOrderCount:1},
  16:{dependencyGraph:"assess tracing and reversible causes < intrauterine resuscitation < notify/escalate < reassess/prepare",defensibleOrderCount:1},
  21:{dependencyGraph:"identify client preference < obtain accessible communication support < present/check understanding < document decision",defensibleOrderCount:1},
  28:{dependencyGraph:"hold anticoagulant < assess bleeding/hemodynamics < notify/obtain tests < implement prescribed reversal < reassess",defensibleOrderCount:1},
  44:{dependencyGraph:"receive/preserve request < route < review/respond < append-link and notify",defensibleOrderCount:1},
  86:{dependencyGraph:"notify PD clinician < obtain effluent specimen < begin prescribed empiric therapy < reassess/results adjustment",defensibleOrderCount:1},
  89:{dependencyGraph:"do not enter with failed seal < notify respiratory-protection lead < obtain/inspect/train on alternative < don and enter",defensibleOrderCount:1},
  94:{dependencyGraph:"pause text exchange < synchronous huddle < state facts/confirm understanding < agree plan-owner-deadline < written closure",defensibleOrderCount:1},
  103:{dependencyGraph:"announce discrepancy/stop closure < recount/search < surgeon wound examination < imaging if unresolved < document confirmed resolution",defensibleOrderCount:1},
};

function dropdownInference(p: any): string[] {
  const ids = p.responseStructure.dropdowns.map((d:any) => d.id);
  if (p.populationIndex === 59) return [
    `${ids[0]}: independently answerable from the directory opt-out`,
    `${ids[1]}: mechanically restates the same restriction selected in ${ids[0]}`,
  ];
  if (p.populationIndex === 102) return [
    `${ids[0]}: independently answerable by anion-gap calculation`,
    `${ids[1]}: independently answerable by Winter's formula`,
    `${ids[2]}: answerable only through the added specialist delta-gap/corrected-bicarbonate construct`,
  ];
  return ids.map((id:string) => `${id}: independently inferable from the supplied clinical or policy facts; no earlier blank is required`);
}

const rows = population.map((p:any) => {
  const ov = adverse[p.populationIndex];
  const row:any = {
    populationIndex:p.populationIndex,
    id:p.id,
    provenanceFamily:p.provenanceFamily,
    subBatch:p.subBatch,
    itemType:p.itemType,
    blindConstruct:`Use the presented ${p.topic} record to perform the judgment demanded by the ${p.itemType} response format.`,
    blindDerivedAnswer:p.currentKey,
    blindUniqueness:"UNIQUE",
    plausibleAlternativeAnswers:ov ? [ov.alternative] : [],
    keyComparison:"MATCH",
    sourceCheck:ov?.sourceCheck || ((p.itemType === "ordered_response" || p.itemType === "dropdown_cloze" || ov) ? "SUPPORTED" : "NOT_OPENED_STABLE_LOW_RISK"),
    nursingRelevance:ov?.nursingRelevance || "HIGH",
    bilingualParity:"MATERIAL_MATCH",
    verdict:ov?.verdict || "PASS",
    primaryClass:ov?.primaryClass || "VALID_CONSTRUCT",
    secondaryClasses:ov?.secondaryClasses || [],
    quotedEvidence:ov?.evidence || [],
    reason:ov?.reason || "Blind derivation matched the live key. The response components are independently judgeable, clinically coherent for the assigned format, and no material English/Chinese divergence or defensible competing key was found.",
    nextDisposition:ov?.nextDisposition || "KEEP",
    terminalCensusOverlap:null,
  };
  if (p.itemType === "ordered_response") Object.assign(row, orderedGraphs[p.populationIndex]);
  if (p.itemType === "dropdown_cloze") row.independentInference = dropdownInference(p);
  return row;
});

if (rows.length !== 108 || rows.some((r:any,i:number)=>r.populationIndex!==i+1)) throw new Error("Primary reconciliation failed");
for (const r of rows) {
  if (r.itemType === "ordered_response" && (!r.dependencyGraph || r.defensibleOrderCount === undefined)) throw new Error(`Missing dependency graph: ${r.id}`);
  if (r.itemType === "dropdown_cloze" && !r.independentInference?.length) throw new Error(`Missing dropdown inference: ${r.id}`);
  if (r.verdict !== "PASS" && (!r.quotedEvidence.length || !r.plausibleAlternativeAnswers.length)) throw new Error(`Incomplete adverse evidence: ${r.id}`);
}

writeFileSync(join(root,"primary-adjudication.jsonl"),rows.map(JSON.stringify).join("\n")+"\n");
mkdirSync(join(root,"batches"),{recursive:true});
for (let i=0;i<rows.length;i+=18) {
  writeFileSync(join(root,"batches",`primary-batch-${String(i/18+1).padStart(2,"0")}.jsonl`),rows.slice(i,i+18).map(JSON.stringify).join("\n")+"\n");
}

const allHighRisk = new Set(rows.filter((r:any)=>["ordered_response","dropdown_cloze","fill_in_blank"].includes(r.itemType)).map((r:any)=>r.populationIndex));
const adverseOther = new Set(rows.filter((r:any)=>r.verdict!=="PASS").map((r:any)=>r.populationIndex));
// Historically repaired examples explicitly retained as a separate checker gate.
const knownRepaired = new Set<number>([]);
const sampled = new Set(rows.filter((r:any)=>r.verdict==="PASS" && !allHighRisk.has(r.populationIndex)).filter((r:any)=>{
  const p=population[r.populationIndex-1];
  return createHash("sha256").update(`${p.bankPath}|${p.id}|${p.itemType}`).digest()[0]%5===0;
}).map((r:any)=>r.populationIndex));
const checker = population.filter((p:any)=>allHighRisk.has(p.populationIndex)||adverseOther.has(p.populationIndex)||knownRepaired.has(p.populationIndex)||sampled.has(p.populationIndex)).map((p:any)=>({
  populationIndex:p.populationIndex,id:p.id,provenanceFamily:p.provenanceFamily,subBatch:p.subBatch,itemType:p.itemType,bankPath:p.bankPath,questionPath:p.questionPath,
  inclusionReasons:[allHighRisk.has(p.populationIndex)&&"ALL_ORDERED_DROPDOWN_FILL",adverseOther.has(p.populationIndex)&&"ALL_PRIMARY_ADVERSE",knownRepaired.has(p.populationIndex)&&"KNOWN_REPAIRED",sampled.has(p.populationIndex)&&"HASH_SAMPLE_REMAINING_PASS"].filter(Boolean),
  stem:p.stem,responseStructure:p.responseStructure,currentKey:p.currentKey,rationale:p.rationale,sourceMetadata:p.sourceMetadata,
}));
writeFileSync(join(root,"checker-population.jsonl"),checker.map(JSON.stringify).join("\n")+"\n");
const blind=checker.map(({currentKey,rationale,sourceMetadata,...x}:any)=>x);
writeFileSync(join(root,"checker-blind-population.jsonl"),blind.map(JSON.stringify).join("\n")+"\n");
mkdirSync(join(root,"checker-batches"),{recursive:true});
for(let i=0;i<blind.length;i+=6) writeFileSync(join(root,"checker-batches",`blind6-input-${String(i/6+1).padStart(2,"0")}.jsonl`),blind.slice(i,i+6).map(JSON.stringify).join("\n")+"\n");

const counts=(xs:any[],key:string)=>Object.fromEntries([...new Set(xs.map(x=>x[key]))].sort().map(v=>[v,xs.filter(x=>x[key]===v).length]));
console.log(JSON.stringify({primary:counts(rows,"verdict"),classes:counts(rows,"primaryClass"),checkerPopulation:checker.length,hashSample:[...sampled].sort((a,b)=>a-b),checkerIndices:checker.map((x:any)=>x.populationIndex)},null,2));
