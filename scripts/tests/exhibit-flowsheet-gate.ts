import {
  buildBlindIndex,
  gateRecord,
  serialParams,
  toCanonical,
  type ExtractionRecord,
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
  const record = baseRecord();
  record.unitAliases = [{ aliasOf: "wbc", value: "18,000/µL" }];
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "unit alias has no keyed panel entry"), "unit alias without keyed panel entry should fail");
}

{
  const dir = await mkdtemp(join(tmpdir(), "flowsheet-gate-"));
  try {
    const casesPath = join(dir, "cases.json");
    await writeFile(casesPath, JSON.stringify([{ exhibitRef: "blind_01/assessment", content: { en: "Temperature 37.0 °C.", zh: "体温37.0°C。" } }]), "utf8");
    const index = await buildBlindIndex(casesPath);
    assert(index.get("blind_01/assessment") === "Temperature 37.0 °C.", "buildBlindIndex should resolve flat blind cases");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

console.log("exhibit-flowsheet-gate tests passed");
