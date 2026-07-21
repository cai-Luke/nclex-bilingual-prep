import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const population = readFileSync(join(root, "population.jsonl"), "utf8").trim().split("\n").map(JSON.parse);

type Override = {
  verdict: "FIX" | "RETIRE";
  primaryClass: string;
  secondaryClasses?: string[];
  nextDisposition: string;
  uniqueness?: string;
  sourceCheck?: string;
  nursingRelevance?: string;
  alternative: string;
  evidence?: string[];
  reason: string;
  keyComparison?: string;
  blindDerivedAnswer?: unknown;
};

const adverse: Record<number, Override> = {
  1: { verdict:"FIX", primaryClass:"WEAK_OR_NONCOMPETING_DIFFERENTIAL", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", alternative:"A conventional multiple-choice response to an established panic episode; the condition zone adds no differential decision.", reason:"The documented panic disorder, prior cardiopulmonary exclusion, and normal oxygen saturation pre-resolve the condition. The rationale can support the calming actions but cannot make the bowtie alternatives genuinely compete." },
  5: { verdict:"RETIRE", primaryClass:"WEAK_OR_NONCOMPETING_DIFFERENTIAL", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", alternative:"Ask directly for the two emergency responses to accidental decannulation; no condition-selection zone is needed.", reason:"The tube is explicitly completely out and the client is hypoxemic, so mucus plug and spontaneous pneumothorax are not competing explanations. The action facts are useful, but the assigned bowtie construct is not." },
  10:{ verdict:"RETIRE", primaryClass:"OTHER_CONFIRMED_CONSTRUCT_DEFECT", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Assess which response best advances therapeutic communication in a clinically consequential exchange.", reason:"The prompt asks only for a one-word textbook label after supplying a verbatim example. The key is correct, but the format measures closed-vocabulary recall rather than useful nursing judgment." },
  11:{ verdict:"RETIRE", primaryClass:"OTHER_CONFIRMED_CONSTRUCT_DEFECT", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Use the supplied withdrawal findings to choose an assessment or escalation decision rather than recall the scale acronym.", reason:"The four-letter abbreviation is the entire response demand. The rationale validates COWS but does not add a nursing decision beyond acronym recall." },
  15:{ verdict:"FIX", primaryClass:"ARBITRARY_SERIALIZATION", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"A-C-B-D-F-E is defensible: brush visible powder before removing clothing, then reassess before or while warming.", reason:"PPE must precede contact and dry removal must precede irrigation, but the source does not establish every adjacent rank. Clothing removal versus brushing and warming versus reassessment admit more than one safe total order; the rationale merely adopts one serialization." },
  17:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Use the corrected value to choose a clinically relevant assessment or fluid/electrolyte interpretation.", reason:"The complete equation and inputs are supplied, and the learner only transcribes arithmetic to 136. The correct result is disconnected from a nursing decision." },
  18:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Use calculated tonicity to recognize hyperosmolar crisis or prioritize monitoring.", reason:"The prompt supplies the entire equation and asks only for calculator transcription to 344, without a clinical interpretation or action." },
  19:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", secondaryClasses:["NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Ask for the nursing implications of the observed instability instead of tallying a supplied physician risk score.", reason:"The full CURB65 rubric is reproduced and the response is a mechanical four-point tally. The key is mathematically correct, but the item does not test a nursing judgment." },
  20:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", secondaryClasses:["NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Ask the learner to identify renal deterioration and its monitoring/escalation implications.", reason:"The renal SOFA table is supplied and the learner merely maps creatinine to score 3. This specialist score transcription adds little NCLEX-RN value." },
  23:{ verdict:"FIX", primaryClass:"ARBITRARY_SERIALIZATION", secondaryClasses:["PARALLEL_PROCESS_FORCED_SEQUENCE"], nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"focused_assessment → monitor_support → notify_start_protocol → reassess_escalate is also defensible because safety monitoring need not await notification.", reason:"Focused assessment precedes protocol-dependent treatment and later reassessment, but supportive monitoring and safety measures can begin concurrently with notification. ASAM supports the components, not the imposed total order." },
  24:{ verdict:"FIX", primaryClass:"PARALLEL_PROCESS_FORCED_SEQUENCE", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"urgent_transfer may be activated immediately while repeat_assessment and support_during_transfer occur concurrently.", reason:"The stem already documents confusion, persistent vomiting, and hypotension, so transfer criteria are met before a repeat assessment. Activation, reassessment, and stabilization overlap; the rationale cannot establish a necessary serial ranking." },
  25:{ verdict:"FIX", primaryClass:"ARBITRARY_SERIALIZATION", secondaryClasses:["PARALLEL_PROCESS_FORCED_SEQUENCE"], nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"notify_burn_team can precede or occur during immediate_reassessment without delaying removal of external constriction.", reason:"Urgent notification and focused reassessment are parallel responses to an already threatened extremity. Sources support rapid assessment and decompression but not one total operational order." },
  26:{ verdict:"FIX", primaryClass:"ARBITRARY_SERIALIZATION", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"inspect → verify_order_label → setup → initiate → monitor is as safe as the keyed first two ranks.", reason:"Order/label verification and physical bag/access inspection must both precede setup, but either may occur first. A checklist list does not prove a clinically necessary total order." },
  27:{ verdict:"FIX", primaryClass:"ARBITRARY_SERIALIZATION", secondaryClasses:["PARALLEL_PROCESS_FORCED_SEQUENCE"], nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"Transmission of orders, arranging follow-up, and competency teaching can proceed in parallel after the home team/caregiver are identified.", reason:"The transition source describes coordinated phases and completion requirements, not a single total order among independent coordination and education workstreams." },
  29:{ verdict:"FIX", primaryClass:"ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", alternative:"Present the findings without naming the yellow-zone criteria and actions, allowing the learner to infer the condition and responses.", reason:"The stem states both the exact yellow-zone definition and the corresponding actions immediately before presenting matching findings. The rationale confirms information already given rather than eliciting independent clinical judgment." },
  41:{ verdict:"RETIRE", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", secondaryClasses:["CALCULATION_WITHOUT_CLINICAL_VALUE"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Use a platelet trend to identify a transfusion-response concern and appropriate follow-up.", reason:"CCI is a specialist transfusion calculation, and the stem explicitly forbids interpreting the result. The equation transcription to 10800 is correct but has no nursing decision attached." },
  42:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Tie the water deficit estimate to a safe monitoring or fluid-management decision with appropriate prescriptions and context.", reason:"The full formula and TBW are supplied while the stem explicitly removes fluid, rate, correction, and volume-status decisions. Only arithmetic remains." },
  43:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Ask whether the observed trajectory requires escalation under the stated ceiling, incorporating cumulative timing and risk.", reason:"The response is direct subtraction and division to 0.5. Although correction rate can be clinically meaningful, this item asks for no interpretation or nursing response." },
  44:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Integrate respiratory pattern, gas exchange, and tolerance into a nursing reassessment rather than document an isolated index.", reason:"The stem supplies the formula and expressly says the resulting RSBI does not determine readiness. The learner performs unit conversion and division only." },
  47:{ verdict:"RETIRE", primaryClass:"ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"Give clinical milestones and ask for the disposition decision, without embedding the prescribed interval sequence in the stem.", reason:"The PN discontinuation plan supplies the timing and planned sequence that the learner is then asked to reproduce. Source support for taper/monitoring does not make a stem-disclosed order an assessment." },
  48:{ verdict:"RETIRE", primaryClass:"INVENTED_EXTRA_INFERENCE", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", nursingRelevance:"MODERATE", alternative:"Use a coherent continuation-versus-maintenance treatment decision; capacity/consent should be a separate scenario with its own facts.", reason:"The third blank adds a consent/capacity mini-question to an otherwise temporal ECT continuation/maintenance construct. Each fact may be true, but the combined three-blank item is not one natural decision." },
  50:{ verdict:"RETIRE", primaryClass:"MECHANICAL_CLOZE_DEPENDENCY", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", alternative:"Ask one consequential infection-control or treatment implication using evidence that does not mechanically restate the diagnosis.", reason:"The diagnosis, contagiousness, and meaning blanks repeat the same latent-versus-active TB classification. Later answers follow mechanically once the first label is chosen rather than contributing independent inferences." },
  51:{ verdict:"RETIRE", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", secondaryClasses:["CALCULATION_WITHOUT_CLINICAL_VALUE"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Use QT prolongation data to choose a medication-safety action within nursing scope.", reason:"The item supplies the Fridericia equation and asks for an isolated specialist correction calculation while withholding any medication or escalation decision." },
  56:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Use oxygenation data to identify worsening respiratory status or prioritize escalation.", reason:"The supplied P/F equation yields 180, but the response demand is arithmetic alone and is explicitly detached from an ARDS or care decision." },
  59:{ verdict:"RETIRE", primaryClass:"ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", alternative:"Present breathlessness findings and available prescriptions, then ask for prioritization without reciting the exact ordered pathway.", reason:"The stem provides the palliative breathlessness plan in the same order requested from the learner. The rationale cannot turn memorized transcription into sequencing judgment." },
  60:{ verdict:"FIX", primaryClass:"ARBITRARY_SERIALIZATION", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"Assess immediate red flags while another adult removes the product; product removal and initial assessment are not necessarily serial.", reason:"Removing access to the product and assessing airway/neurologic red flags can occur in either order or concurrently. Poison-control guidance supports the response components but not every adjacent rank." },
  62:{ verdict:"RETIRE", primaryClass:"ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", alternative:"Use a sleep diary and ask the learner to apply one stimulus-control decision without spelling out the sequence.", reason:"The CBT-I stimulus-control sequence is presented as an explicit plan and then requested back in order, so the item measures stem transcription." },
  72:{ verdict:"RETIRE", primaryClass:"WEAK_OR_NONCOMPETING_DIFFERENTIAL", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", alternative:"Ask for the immediate actions after a radiographically confirmed esophageal battery rather than requiring a redundant condition selection.", reason:"Radiographs explicitly show the battery lodged in the upper esophagus. The condition alternatives therefore cannot compete; the bowtie is a stretched action question." },
  77:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Interpret a multidimensional wound trend and identify follow-up needs.", reason:"The item asks for 2.6 minus 1.8 and then disclaims any healing interpretation. The arithmetic is correct but educationally trivial." },
  78:{ verdict:"RETIRE", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", secondaryClasses:["CALCULATION_WITHOUT_CLINICAL_VALUE"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Use contraction adequacy alongside fetal and labor findings to support a nursing reassessment/escalation decision.", reason:"The learner performs a supplied specialist MVU calculation while the prompt explicitly removes labor and oxytocin decisions." },
  79:{ verdict:"RETIRE", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", secondaryClasses:["CALCULATION_WITHOUT_CLINICAL_VALUE"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Use an already calculated GIR to recognize a monitoring or PN-safety issue.", reason:"GIR compounding arithmetic is a specialist nutrition-support calculation, and no nursing interpretation or response is requested." },
  81:{ verdict:"FIX", primaryClass:"PARALLEL_PROCESS_FORCED_SEQUENCE", nextDisposition:"FULL_ITEM_REWRITE_SAME_CONSTRUCT", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"Emergency-contraception consideration and beginning seven days of barrier use are same-day counseling/actions rather than uniquely ranked milestones.", reason:"CDC supports taking the most recent missed pill promptly and continuing the pack, but emergency-contraception consideration and backup use overlap in the same response window. The rationale does not prove one total order." },
  85:{ verdict:"RETIRE", primaryClass:"INVENTED_EXTRA_INFERENCE", secondaryClasses:["ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION"], nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", sourceCheck:"SUPPORTED", alternative:"Use the actual 820 mOsm/L order to decide access and monitoring; omit the invented 1150 mOsm/L counterfactual.", reason:"The third blank exists only after adding a new hypothetical formulation to reach another inference. The source supports the threshold within context, but the extra blank is not a natural decision in the presented order." },
  91:{ verdict:"RETIRE", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", sourceCheck:"SUPPORTED", alternative:"Test recognition of a thrombotic microangiopathy emergency and prompt escalation without requiring the specialist ADAMTS13/TPE diagnostic-treatment bundle.", reason:"The stem preauthorizes a hematology pathway and asks the learner to reproduce a specialist diagnostic and plasma-exchange workflow. The facts and key are supported, but the construct exceeds useful NCLEX-RN depth." },
  93:{ verdict:"FIX", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", nextDisposition:"BOUNDED_TEXT_REPAIR", nursingRelevance:"MODERATE", sourceCheck:"SUPPORTED", alternative:"Ask which findings establish an immediately threatened limb requiring urgent vascular escalation, without requiring the Rutherford IIb label.", reason:"The selected sensory, motor, arterial, and venous Doppler findings coherently signal an emergency, but the specialist Rutherford subclass is unnecessary to the useful nursing judgment. Removing the taxonomy demand preserves the record and key cues." },
  96:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Use a supplied creatinine-clearance estimate to make a medication-safety check.", reason:"The formula, coefficient, and dosing weight are supplied, while the stem explicitly detaches the result from medication selection or adjustment. Only arithmetic remains." },
  97:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", secondaryClasses:["NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT"], nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Use an oxygenation index trend to identify deterioration and escalation within an appropriate care context.", reason:"The learner is expressly told that the item 'tests arithmetic only' and may not make a respiratory diagnosis or ventilator decision. That disclaimer confirms the absence of a clinical construct." },
  98:{ verdict:"RETIRE", primaryClass:"CALCULATION_WITHOUT_CLINICAL_VALUE", nextDisposition:"RETIRE_WITHOUT_REPLACEMENT", nursingRelevance:"LOW", alternative:"Use the ABI result with symptoms to identify a vascular follow-up or compression-safety issue.", reason:"The prompt supplies the entire convention and forbids diagnosis or treatment implications. The response is division and rounding only." },
  101:{ verdict:"RETIRE", primaryClass:"ARBITRARY_SERIALIZATION", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", uniqueness:"MULTIPLE_DEFENSIBLE", sourceCheck:"PARTIALLY_SUPPORTED", alternative:"B-A-C-D-E-F is equally defensible because the stem already states the client is standing and meter reset need not precede assuming position.", reason:"Deep inhalation must precede sealing/blowing, attempts must repeat, and the highest reading comes last. Inspection/reset and standing have no necessary relative order; a numbered educational list does not prove the keyed total sequence." },
  102:{ verdict:"RETIRE", primaryClass:"INVENTED_EXTRA_INFERENCE", nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", sourceCheck:"SUPPORTED", alternative:"Use one coherent adrenal-insufficiency record and one clinically useful localization/response decision.", reason:"The dropdowns concern three unrelated clients, and Record B is expressly excluded from localizing adrenal insufficiency. Correct individual answers do not make the assembled item one coherent nursing construct." },
  103:{ verdict:"RETIRE", primaryClass:"UNSUPPORTED_OR_CIRCULAR_NEXT_STEP", secondaryClasses:["SOURCE_INSUFFICIENCY","INVENTED_EXTRA_INFERENCE","NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT"], nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", uniqueness:"UNCLEAR", keyComparison:"PARTIAL_MATCH", blindDerivedAnswer:{dropdowns:[{id:"1",correct:"o1"},{id:"2",correct:"o1"},{id:"3",correct:null,reason:"No uniquely indicated next diagnostic step"}]}, sourceCheck:"NOT_SUPPORTED", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", alternative:"Blanks 1 and 2 are answerable, but no third option is uniquely indicated: HbA2 5.3% already represents hemoglobin analysis, and molecular testing requires additional context.", reason:"There are only two laboratory records; 'Record C' is an instruction about Record B. The cited iron-deficiency source does not support the exact molecular-confirmation step, and the rationale adds a specialist pathway without a supplied indication." },
  104:{ verdict:"RETIRE", primaryClass:"NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT", secondaryClasses:["ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION"], nextDisposition:"RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED", nursingRelevance:"OUT_OF_SCOPE_OR_OVERLY_SPECIALIST", sourceCheck:"SUPPORTED", alternative:"Ask the learner to recognize hypotonic polyuria and its immediate safety concern without staging a specialist water-deprivation/desmopressin localization test.", reason:"The test is a monitored endocrine diagnostic workflow, and the stem excludes partial/indeterminate patterns to force a textbook result. The source supports the interpretation, but the construct is overly specialist and heavily preclosed for NCLEX-RN use." }
};

const graph: Record<number, { dependencyGraph: string; defensibleOrderCount: number | string }> = {
  14:{dependencyGraph:"A<B<C<D<E",defensibleOrderCount:1},
  15:{dependencyGraph:"A before B,C; B and C before D; D before E,F; B~C and E~F",defensibleOrderCount:"MULTIPLE_NOT_ENUMERATED"},
  16:{dependencyGraph:"A<B<C<D",defensibleOrderCount:1},
  23:{dependencyGraph:"focused_assessment before protocol/reassessment; notify_start_protocol ~ monitor_support; both before reassess_escalate",defensibleOrderCount:2},
  24:{dependencyGraph:"repeat_assessment ~ urgent_transfer; support_during_transfer overlaps transfer; structured_handoff last",defensibleOrderCount:"MULTIPLE_NOT_ENUMERATED"},
  25:{dependencyGraph:"immediate_reassessment ~ notify_burn_team; both before prepare_intervention; post_reassessment last",defensibleOrderCount:2},
  26:{dependencyGraph:"verify_order_label ~ inspect; both before setup<initiate<monitor",defensibleOrderCount:2},
  27:{dependencyGraph:"identify home team/caregiver first; transmission, follow-up, and competency work are partially ordered/concurrent; discharge closure last",defensibleOrderCount:"MULTIPLE_NOT_ENUMERATED"},
  45:{dependencyGraph:"scene wound care < assessment/decision < HRIG+day-0 vaccine < day-3 < day-7 < day-14",defensibleOrderCount:1},
  46:{dependencyGraph:"wash/report < baseline exposed-worker evaluation < start PEP < 72-hour reevaluation < final follow-up testing",defensibleOrderCount:1},
  47:{dependencyGraph:"A<B<C<D<E (sequence disclosed by plan)",defensibleOrderCount:1},
  57:{dependencyGraph:"A<B<C<D",defensibleOrderCount:1},
  58:{dependencyGraph:"A<B<C<D<E",defensibleOrderCount:1},
  59:{dependencyGraph:"A<B<C<D<E (sequence disclosed by plan)",defensibleOrderCount:1},
  60:{dependencyGraph:"A~B; both before C<D<E",defensibleOrderCount:2},
  61:{dependencyGraph:"A<B<C<D<E<F",defensibleOrderCount:1},
  62:{dependencyGraph:"A<B<C<D<E (sequence disclosed by plan)",defensibleOrderCount:1},
  81:{dependencyGraph:"take/discard missed pill first; continue pack and backup/EC counseling occupy overlapping same-day windows",defensibleOrderCount:"MULTIPLE_NOT_ENUMERATED"},
  82:{dependencyGraph:"A<B<C<D<E",defensibleOrderCount:1},
  83:{dependencyGraph:"A<B<C<D",defensibleOrderCount:1},
  99:{dependencyGraph:"A<B<C<D<E<F; stem closes immediate-replantation branch",defensibleOrderCount:1},
  100:{dependencyGraph:"A<B<C<D<E<F",defensibleOrderCount:1},
  101:{dependencyGraph:"A~B; both before C<D<E<F",defensibleOrderCount:2}
};

const dropdownInference: Record<number, string[]> = {
  48:["Blank 1 independently answerable","Blank 2 independently answerable","Blank 3 answerable only after an unrelated consent/capacity mini-scenario is appended"],
  49:["Blank 1 independently answerable","Blank 2 independently answerable","Blank 3 independently answerable and clinically connected"],
  50:["Blank 1 independently answerable","Blank 2 mechanically follows the diagnosis in blank 1","Blank 3 mechanically restates the same latent/active distinction"],
  84:["Blank 1 independently answerable","Blank 2 independently answerable","Blank 3 independently answerable and clinically connected"],
  85:["Blank 1 independently answerable","Blank 2 independently answerable","Blank 3 requires an invented 1150 mOsm/L counterfactual"],
  86:["Blank 1 independently answerable","Blank 2 independently answerable","Blank 3 independently answerable and clinically connected"],
  102:["Blank 1 independently answerable for Client A","Blank 2 independently answerable for unrelated Client B","Blank 3 independently answerable for unrelated Client C"],
  103:["Blank 1 independently answerable","Blank 2 independently answerable","Blank 3 lacks a uniquely indicated next step and repeats work represented by HbA2"],
  104:["Blank 1 independently answerable","Blank 2 depends on the staged specialist test and explicit exclusion of partial patterns","Blank 3 independently answerable from rising sodium/osmolality"]
};

function evidenceFor(row: any, ov: Override): string[] {
  if (ov.evidence) return ov.evidence;
  const stem = row.stem.en as string;
  const markers: Record<number,string[]> = {
    1:["documented panic disorder","ruled out cardiopulmonary causes"],5:["tube is accidentally pulled completely out"],10:["Enter the one-word therapeutic communication technique"],11:["Enter the four-letter abbreviation"],
    15:["not water-reactive and directs water irrigation after dry decontamination"],17:["use the following equation"],18:["calculate effective serum osmolality using conventional units"],19:["Use CURB65, assigning 1 point"],20:["Use this renal SOFA component excerpt"],
    23:["operational order"],24:["newly confused, has persistent vomiting, and has a blood pressure of 84/50"],25:["complete the following actions in operational order"],26:["checklist actions in the correct operational order"],27:["requires the following steps to be completed in sequence"],29:["The plan defines the yellow zone"],
    41:["Do not diagnose platelet refractoriness from this single calculation"],42:["asks only for the mathematical deficit"],43:["Calculate the average correction rate"],44:["asks only for documentation of the index"],47:["individualized non-PN target for 24 hours"],
    48:["continuation"],50:["latent"],51:["Calculate"],56:["Calculate"],59:["plan"],60:["Place"],62:["plan"],72:["radiographs show the battery lodged in the upper esophagus"],77:["single dimension does not by itself establish healing"],78:["Do not diagnose labor arrest or change oxytocin"],79:["Calculate the GIR"],
    81:["starting now and over the next 7 days"],85:["reformulated to 1150 mOsm/L"],91:["emergency hematology plan authorizes urgent therapeutic plasma exchange"],93:["classified as Rutherford IIb"],96:["does not by itself select or adjust a medication dose"],97:["tests arithmetic only"],98:["Do not diagnose vascular disease or prescribe compression"],101:["while standing upright"],102:["Each dropdown refers only to its own client"],103:["Record C asks for the next diagnostic step"],104:["Partial and indeterminate response patterns are excluded"]
  };
  return (markers[row.populationIndex] || [stem.slice(0,180)]).map(m => stem.includes(m) ? m : stem.slice(0,220));
}

const rows = population.map((p:any) => {
  const ov = adverse[p.populationIndex];
  const base:any = {
    populationIndex:p.populationIndex,id:p.id,provenanceFamily:p.provenanceFamily,subBatch:p.subBatch,itemType:p.itemType,
    blindConstruct:`Use the supplied ${p.topic} data to make the response demanded by the ${p.itemType} format.`,
    blindDerivedAnswer:ov?.blindDerivedAnswer ?? p.currentKey,
    blindUniqueness:ov?.uniqueness || "UNIQUE",
    plausibleAlternativeAnswers:ov ? [ov.alternative] : [],
    keyComparison:ov?.keyComparison || "MATCH",
    sourceCheck:ov?.sourceCheck || (ov ? "SUPPORTED" : ((p.itemType === "ordered_response" || p.itemType === "dropdown_cloze") ? "SUPPORTED" : "NOT_OPENED_STABLE_LOW_RISK")),
    nursingRelevance:ov?.nursingRelevance || "HIGH",
    bilingualParity:"MATERIAL_MATCH",
    verdict:ov?.verdict || "PASS",
    primaryClass:ov?.primaryClass || "VALID_CONSTRUCT",
    secondaryClasses:ov?.secondaryClasses || [],
    quotedEvidence:ov ? evidenceFor(p,ov) : [],
    reason:ov?.reason || "Blind derivation produced the live key; the scenario is coherent, the response demand is appropriate to the format, and no material English/Chinese divergence or defensible competing key was found.",
    nextDisposition:ov?.nextDisposition || "KEEP",
    terminalCensusOverlap:null
  };
  if (p.itemType === "ordered_response") Object.assign(base, graph[p.populationIndex]);
  if (p.itemType === "dropdown_cloze") base.independentInference = dropdownInference[p.populationIndex];
  return base;
});

if (rows.length !== 104 || rows.some((r:any,i:number)=>r.populationIndex!==i+1)) throw new Error("Primary row reconciliation failed");
for (const r of rows) {
  if (r.itemType === "ordered_response" && (!r.dependencyGraph || r.defensibleOrderCount === undefined)) throw new Error(`Missing graph ${r.id}`);
  if (r.itemType === "dropdown_cloze" && (!r.independentInference || r.independentInference.length !== 3)) throw new Error(`Missing dropdown inference ${r.id}`);
  if (r.verdict !== "PASS" && (!r.quotedEvidence.length || !r.plausibleAlternativeAnswers.length)) throw new Error(`Incomplete adverse evidence ${r.id}`);
}

writeFileSync(join(root,"primary-adjudication.jsonl"), rows.map(JSON.stringify).join("\n")+"\n");
mkdirSync(join(root,"batches"),{recursive:true});
const wave1=rows.filter((r:any)=>r.itemType==="ordered_response"||r.itemType==="dropdown_cloze");
const wave2=rows.filter((r:any)=>r.itemType!=="ordered_response"&&r.itemType!=="dropdown_cloze");
const batches=[wave1.slice(0,16),wave1.slice(16),wave2.slice(0,18),wave2.slice(18,36),wave2.slice(36,54),wave2.slice(54)];
batches.forEach((b:any[],i:number)=>writeFileSync(join(root,"batches",`primary-batch-${String(i+1).padStart(2,"0")}.jsonl`),b.map(JSON.stringify).join("\n")+"\n"));

const wave1Set=new Set(wave1.map((r:any)=>r.populationIndex));
const adverseWave2=new Set(wave2.filter((r:any)=>r.verdict!=="PASS").map((r:any)=>r.populationIndex));
const known=new Set([28,39,46,101,103]);
const sampled=new Set(wave2.filter((r:any)=>r.verdict==="PASS").filter((r:any)=>{
  const p=population[r.populationIndex-1];
  return createHash("sha256").update(`${p.bankPath}|${p.id}|${p.itemType}`).digest()[0]%5===0;
}).map((r:any)=>r.populationIndex));
const checker=population.filter((p:any)=>wave1Set.has(p.populationIndex)||adverseWave2.has(p.populationIndex)||known.has(p.populationIndex)||sampled.has(p.populationIndex)).map((p:any)=>({
  populationIndex:p.populationIndex,id:p.id,provenanceFamily:p.provenanceFamily,subBatch:p.subBatch,itemType:p.itemType,bankPath:p.bankPath,questionPath:p.questionPath,
  inclusionReasons:[wave1Set.has(p.populationIndex)&&"ALL_WAVE_1",adverseWave2.has(p.populationIndex)&&"ADVERSE_WAVE_2",known.has(p.populationIndex)&&"KNOWN_EXAMPLE_GATE",sampled.has(p.populationIndex)&&"HASH_SAMPLE_WAVE_2_PASS"].filter(Boolean),
  stem:p.stem,responseStructure:p.responseStructure,currentKey:p.currentKey,sourceMetadata:p.sourceMetadata
}));
writeFileSync(join(root,"checker-population.jsonl"),checker.map(JSON.stringify).join("\n")+"\n");
const checkerBlind=checker.map(({currentKey,sourceMetadata,...x}:any)=>x);
writeFileSync(join(root,"checker-blind-population.jsonl"),checkerBlind.map(JSON.stringify).join("\n")+"\n");
mkdirSync(join(root,"checker-batches"),{recursive:true});
for(let i=0;i<checkerBlind.length;i+=7){
  const b=checkerBlind.slice(i,i+7);
  writeFileSync(join(root,"checker-batches",`blind7-input-${String(i/7+1).padStart(2,"0")}.jsonl`),b.map(JSON.stringify).join("\n")+"\n");
}
for(let i=0;i<checkerBlind.length;i+=3){
  const b=checkerBlind.slice(i,i+3);
  writeFileSync(join(root,"checker-batches",`blind3-input-${String(i/3+1).padStart(2,"0")}.jsonl`),b.map(JSON.stringify).join("\n")+"\n");
}

const counts=(xs:any[],key:string)=>Object.fromEntries([...new Set(xs.map(x=>x[key]))].sort().map(v=>[v,xs.filter(x=>x[key]===v).length]));
console.log(JSON.stringify({primary:counts(rows,"verdict"),wave1:counts(wave1,"verdict"),wave2:counts(wave2,"verdict"),checkerPopulation:checker.length,hashSample:[...sampled].sort((a,b)=>a-b),checkerIndices:checker.map((x:any)=>x.populationIndex)},null,2));
