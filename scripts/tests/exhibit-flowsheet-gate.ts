import {
  buildBlindIndex,
  gateRecord,
  serialParams,
  toCanonical,
  type ExtractionRecord,
  type ExhibitSource,
  type Finding,
} from "../exhibit-flowsheet-gate";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const assert = (condition: unknown, message: string): void => {
  if (!condition) throw new Error(message);
};

const hasFinding = (findings: Finding[], level: Finding["level"], text: string): boolean =>
  findings.some((finding) => finding.level === level && finding.msg.includes(text));

const noFinding = (findings: Finding[], text: string): boolean =>
  !findings.some((finding) => finding.msg.includes(text));

const source = [
  "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air.",
  "Platelets 18,000/µL and creatinine 1.2 mg/dL were reported.",
  "Blood pressure after labetalol: 148/94 mm Hg.",
].join(" ");

const baseRecord = (): ExtractionRecord => ({
  exhibitRef: "test/exhibit",
  lane: "extract",
  panel: [
    { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air." },
    { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air." },
    { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air." },
    { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air." },
    { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air." },
    { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Temperature 37.1 °C, heart rate 88, blood pressure 118/72, respiratory rate 18, SpO2 97% on room air." },
    { label: "platelets", value: "18,000", sourceUnit: "/µL", sourceSpan: "Platelets 18,000/µL and creatinine 1.2 mg/dL were reported." },
    { label: "creatinine", value: "1.2", sourceUnit: "mg/dL", sourceSpan: "Platelets 18,000/µL and creatinine 1.2 mg/dL were reported." },
  ],
  excludedValues: [],
  unitAliases: [{ aliasOf: "platelets", value: "18,000/µL" }],
});

const run = (record: ExtractionRecord, src = source): Finding[] => gateRecord(record, src);

{
  const findings = run(baseRecord());
  assert(noFinding(findings, "value not a verbatim substring"), "present values should not trip GATE 1");
  assert(noFinding(findings, "GATE 4 out of band"), "platelets 18,000 /µL should convert to 18 ×10³/µL and stay in band");
  assert(noFinding(findings, "missing sourceSpan"), "complete record should include sourceSpan");
  assert(noFinding(findings, "source carries nonstandard/conflicting unit"), "genuine no-unit implicit vitals should not warn");
}

{
  const record = baseRecord();
  record.panel![5] = { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "RR: 24 bpm." };
  const findings = run(record, "RR: 24 bpm.");
  assert(hasFinding(findings, "WARN", "source carries nonstandard/conflicting unit 'bpm'"), "conflicting explicit RR unit should warn instead of laundering silently");
}

{
  const record = baseRecord();
  record.panel![1] = { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "HR 118/min." };
  const findings = run(record, "HR 118/min.");
  assert(hasFinding(findings, "WARN", "source carries nonstandard/conflicting unit '/min'"), "conflicting explicit HR unit should warn instead of laundering silently");
}

{
  const record = baseRecord();
  record.panel![0] = { ...record.panel![0], value: "39.9" };
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "value not a verbatim substring"), "absent value should fail GATE 1");
}

{
  const record = baseRecord();
  const plateletSpan = "Platelets 18,000 K/µL and creatinine 1.2 mg/dL were reported.";
  record.panel![6] = { ...record.panel![6], sourceUnit: "K/µL", sourceSpan: plateletSpan };
  const findings = run(record, source.replace("Platelets 18,000/µL and creatinine 1.2 mg/dL were reported.", plateletSpan));
  assert(hasFinding(findings, "WARN", "GATE 4 out of band"), "wrong canonical platelet unit should warn out of band");
}

{
  assert(toCanonical("platelets", "18,000", "/µL") === 18, "platelet /µL conversion should scale by 1e-3");
  assert(toCanonical("platelets", "18", "×10⁹/L") === 18, "platelet ×10⁹/L should preserve compact CBC magnitude");
  const magnesium = toCanonical("magnesium", "1.4", "mEq/L");
  assert(magnesium !== null && magnesium > 1.70 && magnesium < 1.71, "magnesium mEq/L should convert to mg/dL by analyte");
  assert(toCanonical("calcium", "4.5", "mEq/L")! > 9.0 && toCanonical("calcium", "4.5", "mEq/L")! < 9.1, "total calcium mEq/L should convert to mg/dL by analyte");
  assert(toCanonical("ionized_calcium", "2.4", "mEq/L") === 1.2, "ionized calcium mEq/L should convert to mmol/L by analyte");
  assert(toCanonical("temp", "102.0", "°F") !== null, "Fahrenheit temperature should convert");
  const tempC = toCanonical("temp", "102.0", "°F")!;
  assert(tempC > 38.8 && tempC < 39.0, "102.0 °F should convert to approximately 38.9 °C");
}

{
  const record: ExtractionRecord = {
    exhibitRef: "test/magnesium",
    lane: "extract",
    panel: [{ label: "magnesium", value: "1.4", sourceUnit: "mEq/L", sourceSpan: "Magnesium 1.4 mEq/L." }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, "Magnesium 1.4 mEq/L.");
  assert(noFinding(findings, "not recognized"), "magnesium mEq/L should be an accepted source unit");
  assert(noFinding(findings, "could not convert"), "magnesium mEq/L should have a conversion factor");
}

{
  const source = "Hour 18 labs: BUN 18, Cr 0.8, calcium 7.9, glucose 220, lactate 2.6.";
  const record: ExtractionRecord = {
    exhibitRef: "test/inferred_units",
    lane: "extract",
    panel: [
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "BUN 18" },
      { label: "creatinine", value: "0.8", sourceUnit: "mg/dL", sourceSpan: "Cr 0.8" },
      { label: "glucose", value: "220", sourceUnit: "mg/dL", sourceSpan: "glucose 220" },
      { label: "lactate", value: "2.6", sourceUnit: "mmol/L", sourceSpan: "lactate 2.6" },
    ],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, source);
  assert(noFinding(findings, "sourceUnit 'mg/dL' is not a verbatim source unit"), "opt-in inferred units should pass Rule C when the value has no adjacent unit");
  assert(hasFinding(findings, "WARN", "sourceUnit 'mg/dL' is inferred and value is plausible under multiple accepted units"), "ambiguous inferred BUN should warn");
  assert(hasFinding(findings, "WARN", "source mentions 'calcium' with a numeric value but no adjacent unit"), "unitless numeric calcium should get the GATE 2 subclass warning");
}

{
  const source = "Hour 18 labs: calcium 7.9.";
  const record: ExtractionRecord = {
    exhibitRef: "test/no_calcium_inference",
    lane: "extract",
    panel: [{ label: "calcium", value: "7.9", sourceUnit: "mg/dL", sourceSpan: "calcium 7.9" }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, source);
  assert(hasFinding(findings, "FAIL", "sourceUnit 'mg/dL' is not a verbatim source unit"), "bare calcium must not infer mg/dL");
}

{
  const source = "Repeat labs: Cr 2.4 mg/dL.";
  const omitted: ExtractionRecord = { exhibitRef: "test/cr_omitted", lane: "extract", panel: [], excludedValues: [], unitAliases: [] };
  assert(hasFinding(run(omitted, source), "WARN", "source mentions 'creatinine'"), "GATE 2 should recognize Cr abbreviation");

  const keyed: ExtractionRecord = {
    exhibitRef: "test/cr_keyed",
    lane: "extract",
    panel: [{ label: "creatinine", value: "2.4", sourceUnit: "mg/dL", sourceSpan: "Cr 2.4 mg/dL" }],
    excludedValues: [],
    unitAliases: [],
  };
  assert(noFinding(run(keyed, source), "source mentions 'creatinine'"), "Cr 2.4 mg/dL must be accountably keyable");
}

{
  const source = "Labs: aPTT >150 seconds.";
  const record: ExtractionRecord = {
    exhibitRef: "test/comparator_exclusion",
    lane: "extract",
    panel: [],
    excludedValues: [{ label: "ptt", value: ">150", reason: "comparator", sourceSpan: "aPTT >150 seconds" }],
    unitAliases: [],
  };
  const findings = run(record, source);
  assert(noFinding(findings, "reason 'comparator'"), "comparator exclusion reason should be accepted");
  assert(noFinding(findings, "source mentions 'ptt'"), "comparator exclusion should account for the ptt label");
}

{
  const source = "Labs: aPTT >50000 seconds.";
  const bounded: ExtractionRecord = {
    exhibitRef: "test/bounded_high",
    lane: "extract",
    panel: [{ label: "ptt", value: "50000", sourceUnit: "seconds", sourceSpan: "aPTT >50000 seconds", bound: ">" }],
    excludedValues: [],
    unitAliases: [],
  };
  assert(noFinding(run(bounded, source), "GATE 4 out of band"), "greater-than bound should ignore the sanity maximum");
  const exact = structuredClone(bounded);
  delete exact.panel![0].bound;
  assert(hasFinding(run(exact, source), "FAIL", "store it in bound"), "dropping a source comparator should fail loudly");
  assert(hasFinding(run(exact, source), "WARN", "GATE 4 out of band"), "same high value without a bound should warn");
}

{
  const source = "Creatinine <0.01 mg/dL.";
  const bounded: ExtractionRecord = {
    exhibitRef: "test/bounded_low",
    lane: "extract",
    panel: [{ label: "creatinine", value: "0.01", sourceUnit: "mg/dL", sourceSpan: "Creatinine <0.01 mg/dL", bound: "<" }],
    excludedValues: [],
    unitAliases: [],
  };
  assert(noFinding(run(bounded, source), "GATE 4 out of band"), "less-than bound should ignore the sanity minimum");
  const exact = structuredClone(bounded);
  delete exact.panel![0].bound;
  assert(hasFinding(run(exact, source), "FAIL", "store it in bound"), "dropping a source comparator should fail loudly");
  assert(hasFinding(run(exact, source), "WARN", "GATE 4 out of band"), "same low value without a bound should warn");
}

{
  const source = "Labs: aPTT >150 seconds.";
  const comparatorInValue: ExtractionRecord = {
    exhibitRef: "test/comparator_value",
    lane: "extract",
    panel: [{ label: "ptt", value: ">150", sourceUnit: "seconds", sourceSpan: "aPTT >150 seconds" }],
    excludedValues: [],
    unitAliases: [],
  };
  assert(hasFinding(run(comparatorInValue, source), "FAIL", "store the comparator in bound"), "comparator-bearing values should fail with bound guidance");
}

const pediatricSource = (enText: string, zhText = ""): ExhibitSource => ({
  contentEn: enText,
  contentZh: zhText,
  contextEn: enText,
  contextZh: zhText,
});

const populationRecord = (population?: unknown): ExtractionRecord => ({
  exhibitRef: "test/population",
  lane: "extract",
  ...(population !== undefined ? { population } : {}),
  panel: [],
  excludedValues: [],
  unitAliases: [],
});

{
  const source = pediatricSource("A 9-month-old client presents with fever.");
  assert(hasFinding(gateRecord(populationRecord(), source), "FAIL", "subject-scoped pediatric context"), "English pediatric client age should require population");
  assert(hasFinding(gateRecord(populationRecord("adult"), source), "FAIL", "subject-scoped pediatric context"), "adult declaration should fail for a pediatric client");
  assert(noFinding(gateRecord(populationRecord("peds_infant"), source), "subject-scoped pediatric context"), "peds_infant should satisfy the pediatric detector");
}

for (const zhText of [
  "9月龄患儿因发热入院。",
  "9个月大的患儿因发热入院。",
  "2岁患儿因咳嗽就诊。",
  "新生儿因呼吸困难入院。",
  "婴儿因发热来诊。",
  "幼儿因呕吐就诊。",
  "儿童因皮疹入院。",
  "学龄前儿童因喘息来诊。",
]) {
  const findings = gateRecord(populationRecord(), pediatricSource("Assessment available.", zhText));
  assert(hasFinding(findings, "FAIL", "subject-scoped pediatric context"), `Chinese pediatric subject marker should require population: ${zhText}`);
}

{
  const adultAge = gateRecord(populationRecord(), pediatricSource("An 18-year-old client presents for follow-up."));
  assert(noFinding(adultAge, "pediatric"), "18-year-old must not trigger pediatric FAIL or WARN");
}

for (const text of [
  "The adult client's pediatric ICU nurse reviews the plan.",
  "The patient's infant is visiting with the family.",
  "The adult client asks how to prepare infant formula.",
]) {
  const findings = gateRecord(populationRecord("adult"), pediatricSource(text));
  assert(noFinding(findings, "subject-scoped pediatric context"), `adult false positive must not FAIL: ${text}`);
  assert(hasFinding(findings, "WARN", "unscoped pediatric"), `unscoped pediatric noun should WARN: ${text}`);
}

{
  const findings = gateRecord(populationRecord("adult"), pediatricSource("成人患者由专科护士评估。", "成人患者由儿科护士评估。"));
  assert(noFinding(findings, "subject-scoped pediatric context"), "儿科 must not create a pediatric-client FAIL");
  assert(hasFinding(findings, "WARN", "unscoped pediatric"), "儿科 should route to unscoped review");
}

for (const text of [
  "The 80-kg adult receives dopamine at 5 mcg/kg/min.",
  "The adult receives heparin at 18 units/kg/hr.",
  "The adult oncology client receives chemotherapy dosed by body weight.",
]) {
  const findings = gateRecord(populationRecord("adult"), pediatricSource(text));
  assert(noFinding(findings, "pediatric"), `weight-based dosing must trigger neither pediatric FAIL nor WARN: ${text}`);
}

{
  const record: ExtractionRecord = {
    exhibitRef: "test/calcium",
    lane: "extract",
    panel: [{ label: "calcium", value: "1.20", sourceUnit: "mmol/L", sourceSpan: "Ionized calcium 1.20 mmol/L." }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, "Ionized calcium 1.20 mmol/L.");
  assert(hasFinding(findings, "FAIL", "explicit ionized calcium source must be labeled ionized_calcium"), "explicit ionized calcium should not be keyed as total calcium");
}

{
  const record: ExtractionRecord = {
    exhibitRef: "test/calcium",
    lane: "extract",
    panel: [{ label: "calcium", value: "1.20", sourceUnit: "mmol/L", sourceSpan: "Calcium 1.20 mmol/L." }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, "Calcium 1.20 mmol/L.");
  assert(hasFinding(findings, "WARN", "bare calcium value is out of normal band"), "bare calcium should warn when value fits ionized rather than total");
}

{
  const record: ExtractionRecord = {
    exhibitRef: "test/calcium",
    lane: "extract",
    panel: [{ label: "calcium", value: "9.2", sourceUnit: "mg/dL", sourceSpan: "Calcium 9.2 mg/dL." }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, "Calcium 9.2 mg/dL.");
  assert(noFinding(findings, "bare calcium value is out of normal band"), "ordinary bare total calcium should not get an identity warning");
}

{
  const record = baseRecord();
  delete record.panel![0].sourceUnit;
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "missing sourceUnit"), "missing sourceUnit should fail Rule C");
}

{
  const record = baseRecord();
  record.panel![7] = { ...record.panel![7], sourceUnit: "bananas" };
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "not recognized"), "unrecognized sourceUnit should fail Rule C");
}

{
  const record = baseRecord();
  delete record.panel![0].sourceSpan;
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "missing sourceSpan"), "missing panel sourceSpan should fail Rule E");
}

{
  const record = baseRecord();
  record.excludedValues = [{ label: "creatinine", value: "1.2", reason: "prior" }];
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "missing sourceSpan"), "missing excluded sourceSpan should fail Rule E");
}

{
  const record = baseRecord();
  record.excludedValues = [{ label: "creatinine", value: "1.2", reason: "prior", sourceSpan: "creatinine 1.2 mg/dL" }];
  const findings = run(record);
  assert(noFinding(findings, "reason 'prior' requires a current panel value"), "prior exclusion should pass when the same label has a current panel value");
}

{
  const record = baseRecord();
  record.panel = record.panel!.filter((entry) => entry.label !== "creatinine");
  record.excludedValues = [{ label: "creatinine", value: "1.2", reason: "prior", sourceSpan: "creatinine 1.2 mg/dL" }];
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "reason 'prior' requires a current panel value"), "prior-only exclusions should fail instead of deleting baseline values");
}

{
  const pacuSpan = "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000.";
  const liverSpan = "AST 28, ALT 22, total bilirubin 0.6.";
  const vitalsSpan = "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air.";
  const pocSpan = "Point-of-care glucose 142 mg/dL.";
  const refeedingSource = [vitalsSpan, pocSpan, pacuSpan, liverSpan].join(" ");
  const refeedingBaseline: ExtractionRecord = {
    exhibitRef: "gpt_case_refeeding_syndrome_tpn_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: vitalsSpan },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: vitalsSpan },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: vitalsSpan },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: vitalsSpan },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: vitalsSpan },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: vitalsSpan },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: pocSpan },
    ],
    excludedValues: [
      { label: "sodium", value: "138", reason: "prior", sourceSpan: pacuSpan },
      { label: "potassium", value: "3.5", reason: "prior", sourceSpan: pacuSpan },
      { label: "chloride", value: "102", reason: "prior", sourceSpan: pacuSpan },
      { label: "bicarbonate", value: "24", reason: "prior", sourceSpan: pacuSpan },
      { label: "bun", value: "18", reason: "prior", sourceSpan: pacuSpan },
      { label: "creatinine", value: "0.8", reason: "prior", sourceSpan: pacuSpan },
      { label: "glucose", value: "156", reason: "prior", sourceSpan: pacuSpan },
      { label: "calcium", value: "8.4", reason: "prior", sourceSpan: pacuSpan },
      { label: "phosphate", value: "2.8", reason: "prior", sourceSpan: pacuSpan },
      { label: "magnesium", value: "1.8", reason: "prior", sourceSpan: pacuSpan },
      { label: "wbc", value: "9,200", reason: "prior", sourceSpan: pacuSpan },
      { label: "hemoglobin", value: "11.0", reason: "prior", sourceSpan: pacuSpan },
      { label: "platelets", value: "210,000", reason: "prior", sourceSpan: pacuSpan },
      { label: "ast", value: "28", reason: "prior", sourceSpan: liverSpan },
      { label: "alt", value: "22", reason: "prior", sourceSpan: liverSpan },
      { label: "total_bilirubin", value: "0.6", reason: "prior", sourceSpan: liverSpan },
    ],
    unitAliases: [],
  };
  const findings = run(refeedingBaseline, refeedingSource);
  const priorNoCurrent = findings.filter(
    (finding) => finding.level === "FAIL" && finding.msg.includes("reason 'prior' requires a current panel value"),
  );
  assert(refeedingBaseline.excludedValues?.length === 16, "origin fixture should retain all 16 prior exclusions");
  assert(priorNoCurrent.length === 15, `origin fixture should produce exactly 15 prior_no_current failures, got ${priorNoCurrent.length}`);
  assert(
    !priorNoCurrent.some((finding) => finding.msg.includes("glucose=156")),
    "prior glucose 156 should be accepted because current POC glucose 142 supplies the same normalized key",
  );
}

{
  const record = baseRecord();
  record.panel![0] = { ...record.panel![0], sourceSpan: "Temperature was 37.1 C." };
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "sourceSpan not a verbatim substring"), "non-verbatim sourceSpan should fail Rule E");
}

{
  const record = baseRecord();
  record.panel!.push({ label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" });
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "duplicate current label"), "duplicate current panel label should fail Rule D");
}

{
  const record = baseRecord();
  record.excludedValues = [{ label: "sbp", value: "148", reason: "post_intervention", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg." }];
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "post_intervention is a keyed context"), "post_intervention exclusion should fail Rule F");
}

{
  const record = baseRecord();
  record.panel = record.panel!.filter((entry) => entry.label !== "sbp" && entry.label !== "dbp");
  record.panel.push({ label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" });
  record.panel.push({ label: "dbp", value: "94", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" });
  const findings = run(record);
  assert(noFinding(findings, "context 'post_intervention'"), "post_intervention panel context should pass Rule F");
  assert(noFinding(findings, "duplicate current label"), "single post-intervention BP pair should not trip duplicate label guard");
}

{
  const serialSource = "At 0800 creatinine 1.1 mg/dL. At 1200 creatinine 1.4 mg/dL.";
  assert(serialParams(serialSource).includes("creatinine"), "serialParams should detect non-BP serial creatinine");
  const hourSerialSource = "At hour 8, RR 18 and SpO2 97% on room air. At hour 12, RR 20 and SpO2 96% on room air.";
  assert(serialParams(hourSerialSource).includes("rr"), "serialParams should detect relative-hour serial RR");
  assert(serialParams(hourSerialSource).includes("spo2"), "serialParams should detect relative-hour serial SpO2");
  const subscriptSerialSource = "At 0945, SpO₂ 88% on 3 L. At 1030, SpO₂ is 89% on 6 L.";
  assert(serialParams(subscriptSerialSource).includes("spo2"), "serialParams should detect serial SpO₂ with subscript ₂");
  const cleanSkip: ExtractionRecord = { exhibitRef: "test/serial", lane: "skip_serial" };
  assert(!hasFinding(run(cleanSkip, serialSource), "FAIL", "extra keys"), "well-formed skip_serial should pass shape check");
  const dirtySkip: ExtractionRecord = { exhibitRef: "test/serial", lane: "skip_serial", panel: [] };
  assert(hasFinding(run(dirtySkip, serialSource), "FAIL", "extra keys"), "skip_serial with panel should fail shape check");
}

{
  const abgSource = "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L.";
  const record: ExtractionRecord = {
    exhibitRef: "test/abg",
    lane: "extract",
    panel: [
      { label: "ph", value: "7.32", sourceUnit: "(unitless)", sourceSpan: abgSource },
      { label: "paco2", value: "32", sourceUnit: "mmHg", sourceSpan: abgSource },
      { label: "hco3_abg", value: "20", sourceUnit: "mEq/L", sourceSpan: abgSource },
      { label: "lactate", value: "4.2", sourceUnit: "mmol/L", sourceSpan: abgSource },
    ],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, abgSource);
  assert(hasFinding(findings, "WARN", "source mentions 'pao2'"), "GATE 2 should warn when PaO2 is omitted from an ABG panel");
}

{
  const abgSource = "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L.";
  const record: ExtractionRecord = {
    exhibitRef: "test/abg",
    lane: "extract",
    panel: [
      { label: "ph", value: "7.32", sourceUnit: "(unitless)", sourceSpan: abgSource },
      { label: "paco2", value: "32", sourceUnit: "mmHg", sourceSpan: abgSource },
      { label: "pao2", value: "68", sourceUnit: "mmHg", sourceSpan: abgSource },
      { label: "hco3_abg", value: "20", sourceUnit: "mEq/L", sourceSpan: abgSource },
      { label: "lactate", value: "4.2", sourceUnit: "mmol/L", sourceSpan: abgSource },
    ],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, abgSource);
  assert(noFinding(findings, "source mentions 'pao2'"), "complete ABG panel should not warn for PaO2");
}

{
  const sao2Source = "ABG results: pH 7.31, PaCO2 58 mmHg, PaO2 54 mmHg, arterial oxygen saturation SaO2 85%.";
  const record: ExtractionRecord = {
    exhibitRef: "test/sao2",
    lane: "extract",
    panel: [{ label: "sao2", value: "85", sourceUnit: "%", sourceSpan: "SaO2 85%" }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, sao2Source);
  assert(noFinding(findings, "not recognized"), "sao2 should be an accepted structured-only key");
  assert(noFinding(findings, "source mentions 'spo2'"), "SaO2 should not be swept as SpO2");
}

{
  const sao2Source = "ABG results: SaO2 85%.";
  const record: ExtractionRecord = {
    exhibitRef: "test/sao2_missing",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, sao2Source);
  assert(hasFinding(findings, "WARN", "source mentions 'sao2'"), "SaO2 should sweep as sao2 when unaccounted");
  assert(noFinding(findings, "source mentions 'spo2'"), "SaO2 should not sweep as spo2 when unaccounted");
}

{
  const troponinSource = "Cardiac markers: troponin I 0.18 ng/mL and BNP 420 pg/mL.";
  const record: ExtractionRecord = {
    exhibitRef: "test/troponin_i",
    lane: "extract",
    panel: [{ label: "troponin_i", value: "0.18", sourceUnit: "ng/mL", sourceSpan: "troponin I 0.18 ng/mL" }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, troponinSource);
  assert(noFinding(findings, "not recognized"), "troponin_i should be an accepted structured-only key");
  assert(noFinding(findings, "source mentions 'troponin_t'"), "troponin I should not sweep as troponin_t");
}

{
  const bareTroponinSource = "Cardiac markers: troponin 0.18 ng/mL.";
  const record: ExtractionRecord = {
    exhibitRef: "test/bare_troponin",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(record, bareTroponinSource);
  assert(noFinding(findings, "source mentions 'troponin_i'"), "bare troponin should not infer troponin_i");
  assert(noFinding(findings, "source mentions 'troponin_t'"), "bare troponin should not infer troponin_t");
}

{
  const record = baseRecord();
  record.unitAliases = [{ aliasOf: "wbc", value: "18,000/µL" }];
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "unit alias has no keyed panel entry"), "unit alias without keyed panel entry should fail");
}

const multiColumnSource = "PACU labs 6 hours earlier: glucose 156 mg/dL, phosphorus 2.8 mg/dL. Current point-of-care glucose 142 mg/dL. Vital signs: HR 92.";
const multiColumnRecord = (): ExtractionRecord => ({
  exhibitRef: "test/multi_column",
  lane: "extract",
  columns: [
    { id: "pacu", panelKind: "labs", label: { en: "PACU (6 h prior)", zh: "麻醉恢复室（6小时前）" }, evidence: "PACU labs 6 hours earlier" },
    { id: "current", panelKind: "labs", label: { en: "Current", zh: "当前" }, evidence: "Current point-of-care glucose 142 mg/dL." },
  ],
  panel: [
    { label: "glucose", value: "156", sourceUnit: "mg/dL", sourceSpan: "glucose 156 mg/dL", columnId: "pacu" },
    { label: "phosphate", value: "2.8", sourceUnit: "mg/dL", sourceSpan: "phosphorus 2.8 mg/dL", columnId: "pacu" },
    { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "point-of-care glucose 142 mg/dL", columnId: "current" },
    { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 92." },
  ],
  excludedValues: [],
  unitAliases: [],
});

{
  const findings = run(multiColumnRecord(), multiColumnSource);
  assert(noFinding(findings, "(G1)"), "qualifying multi-column record should have unique ids");
  assert(noFinding(findings, "(G2)"), "all explicit entries should resolve by panel kind");
  assert(noFinding(findings, "(G3)"), "labs may be explicit while vitals remain implicit");
  assert(noFinding(findings, "(G4)"), "both declared columns are used");
  assert(noFinding(findings, "(G5)"), "same analyte in different columns is valid");
  assert(noFinding(findings, "(G6)"), "column evidence should be source-contained");
  assert(noFinding(findings, "(G7)"), "required explicit-column fields should pass");
}

{
  const record = multiColumnRecord();
  record.columns![1].id = "pacu";
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "duplicate id 'pacu' within labs (G1)"), "duplicate column ids should fail G1");
}

{
  const record = multiColumnRecord();
  record.panel![2].columnId = "missing";
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "does not resolve in labs (G2)"), "unknown columnId should fail G2");
}

{
  const record = multiColumnRecord();
  delete record.panel![2].columnId;
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "requires columnId on the explicit path (G3)"), "mixed explicit/implicit labs should fail G3");
}

{
  const record = multiColumnRecord();
  record.panel = record.panel!.filter((entry) => entry.columnId !== "current");
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "column 'current' has no referencing panel entry (G4)"), "unused authored column should fail G4");
}

{
  const record = multiColumnRecord();
  record.panel!.splice(1, 0, { label: "glucose", value: "156", sourceUnit: "mg/dL", sourceSpan: "glucose 156 mg/dL", columnId: "pacu" });
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "duplicate (glucose, pacu) cell (G5)"), "duplicate row/column cell should fail G5");
}

{
  const record = multiColumnRecord();
  record.columns![0].evidence = "PACU dataset yesterday";
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "evidence not a verbatim substring of source (G6)"), "mismatched evidence should fail G6");
}

{
  const record = multiColumnRecord();
  record.columns![0].label = { en: "", zh: "麻醉恢复室" };
  assert(hasFinding(run(record, multiColumnSource), "FAIL", "label.en must be a non-empty string (G7)"), "empty bilingual labels should fail G7");
}

{
  const historicalOnly: ExtractionRecord = {
    exhibitRef: "test/historical_only",
    lane: "extract",
    columns: [{ id: "pacu", panelKind: "labs", label: { en: "PACU (6 h prior)", zh: "麻醉恢复室（6小时前）" }, evidence: "PACU labs 6 hours earlier" }],
    panel: [{ label: "glucose", value: "156", sourceUnit: "mg/dL", sourceSpan: "glucose 156 mg/dL", columnId: "pacu" }],
    excludedValues: [],
    unitAliases: [],
  };
  const findings = run(historicalOnly, multiColumnSource);
  assert(noFinding(findings, "(G1)"), "one explicit historical-only column should be valid");
  assert(noFinding(findings, "(G4)"), "historical-only records must not fabricate a current column");
}

{
  const legacy = baseRecord();
  assert(legacy.columns === undefined, "legacy fixture should not opt into explicit columns");
  assert(noFinding(run(legacy), "(G1)"), "legacy records stay outside G1-G7");
  assert(noFinding(run(legacy), "(G7)"), "legacy records stay outside G1-G7");
}

{
  const malformedLegacy = baseRecord();
  malformedLegacy.panel![0].columnId = "current";
  assert(
    hasFinding(run(malformedLegacy), "FAIL", "panel entries with columnId require declared columns (G2)"),
    "free-floating columnId without columns must fail the gate before the applicator",
  );
}

{
  const dir = await mkdtemp(join(tmpdir(), "flowsheet-gate-"));
  try {
    const casesPath = join(dir, "cases.json");
    await writeFile(casesPath, JSON.stringify([{ exhibitRef: "blind_01/assessment", content: { en: "Temperature 37.0 °C.", zh: "体温37.0°C。" } }]), "utf8");
    const index = await buildBlindIndex(casesPath);
    assert(index.get("blind_01/assessment")?.contentEn === "Temperature 37.0 °C.", "buildBlindIndex should resolve flat blind cases");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

console.log("exhibit-flowsheet-gate tests passed");
