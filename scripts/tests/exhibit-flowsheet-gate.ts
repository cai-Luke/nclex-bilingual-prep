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
    { label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" },
    { label: "dbp", value: "94", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" },
  ],
  excludedValues: [],
  unitAliases: [{ aliasOf: "platelets", value: "18,000/µL" }],
});

const run = (record: ExtractionRecord, src = source): Finding[] => gateRecord(record, src);

{
  const findings = run(baseRecord());
  assert(noFinding(findings, "value not a verbatim substring"), "present values should not trip GATE 1");
  assert(noFinding(findings, "GATE 4 out of band"), "platelets 18,000 /µL should convert to 18 ×10^9/L and stay in band");
  assert(noFinding(findings, "missing sourceSpan"), "complete record should include sourceSpan");
}

{
  const record = baseRecord();
  record.panel![0] = { ...record.panel![0], value: "39.9" };
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "value not a verbatim substring"), "absent value should fail GATE 1");
}

{
  const record = baseRecord();
  record.panel![6] = { ...record.panel![6], sourceUnit: "×10⁹/L" };
  const findings = run(record);
  assert(hasFinding(findings, "WARN", "GATE 4 out of band"), "wrong canonical platelet unit should warn out of band");
}

{
  assert(toCanonical("platelets", "18,000", "/µL") === 18, "platelet /µL conversion should scale by 1e-3");
  assert(toCanonical("temp", "102.0", "°F") !== null, "Fahrenheit temperature should convert");
  const tempC = toCanonical("temp", "102.0", "°F")!;
  assert(tempC > 38.8 && tempC < 39.0, "102.0 °F should convert to approximately 38.9 °C");
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
  record.excludedValues = [{ label: "sbp", value: "148", reason: "post_intervention", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg." }];
  const findings = run(record);
  assert(hasFinding(findings, "FAIL", "post_intervention is a keyed context"), "post_intervention exclusion should fail Rule F");
}

{
  const record = baseRecord();
  record.panel = record.panel!.filter((entry) => entry.context !== "post_intervention");
  record.panel.push({ label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" });
  const findings = run(record);
  assert(noFinding(findings, "context 'post_intervention'"), "post_intervention panel context should pass Rule F");
}

{
  const serialSource = "At 0800 creatinine 1.1 mg/dL. At 1200 creatinine 1.4 mg/dL.";
  assert(serialParams(serialSource).includes("creatinine"), "serialParams should detect non-BP serial creatinine");
  const cleanSkip: ExtractionRecord = { exhibitRef: "test/serial", lane: "skip_serial" };
  assert(!hasFinding(run(cleanSkip, serialSource), "FAIL", "extra keys"), "well-formed skip_serial should pass shape check");
  const dirtySkip: ExtractionRecord = { exhibitRef: "test/serial", lane: "skip_serial", panel: [] };
  assert(hasFinding(run(dirtySkip, serialSource), "FAIL", "extra keys"), "skip_serial with panel should fail shape check");
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
