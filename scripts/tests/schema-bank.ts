import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as schemaModule from "../../src/schema";
import { schemaVersionAtLeast, supportedSchemaVersions, validateBankObject, validateQuestion } from "../../src/schema";
import { toExportEnvelope } from "../../src/bankImport";
import type { Question, SchemaVersion } from "../../src/types";

const validEmptyBank = {
  meta: {
    schemaVersion: "1.0",
    count: 0,
  },
  questions: [],
};

assert.equal(validateBankObject(validEmptyBank).ok, true);
assert.equal(validateBankObject([]).ok, true);
assert.equal(validateBankObject(validEmptyBank, { requireMeta: true }).ok, true);

const requiredBareArray = validateBankObject([], { requireMeta: true });
assert.equal(requiredBareArray.ok, false);
if (!requiredBareArray.ok) {
  assert(requiredBareArray.reasons.some((reason) => reason.includes("meta with schemaVersion is required")));
}

const requiredMissingVersion = validateBankObject({ meta: { count: 0 }, questions: [] }, { requireMeta: true });
assert.equal(requiredMissingVersion.ok, false);
if (!requiredMissingVersion.ok) {
  assert(requiredMissingVersion.reasons.some((reason) => reason.includes("meta.schemaVersion must be one of")));
}

assert.equal(schemaVersionAtLeast("1.9", "1.2"), true);
assert.equal(schemaVersionAtLeast("1.2", "1.7"), false);
assert.throws(() => schemaVersionAtLeast("2.0" as SchemaVersion, "1.9"), /Unsupported schema version: 2\.0/);
assert.throws(() => schemaVersionAtLeast(undefined as unknown as SchemaVersion, "1.9"), /Unsupported schema version/);
assert.throws(() => schemaVersionAtLeast("1.9", "2.0" as SchemaVersion), /Unsupported schema version: 2\.0/);

for (const version of supportedSchemaVersions) {
  const [, minor] = version.split(".");
  assert(Number(minor) <= 9, `schema version ${version} exceeds the single-digit minor invariant`);
}
assert.deepEqual(
  Object.keys(schemaModule).filter((name) => /rank|index/i.test(name)),
  [],
  "schema module must not publicly export a version rank or index",
);

const applySource = readFileSync(new URL("../apply-structured-measurements.ts", import.meta.url), "utf8");
assert(!applySource.includes('schemaVersion: "1.8",'), "applicator must not hard-pin schemaVersion 1.8");
assert(
  applySource.includes('schemaVersionAtLeast(existingSchemaVersion, "1.8")'),
  "applicator must ratchet the existing schema version against the 1.8 floor",
);
const appliedVersion = (existing: SchemaVersion): SchemaVersion =>
  schemaVersionAtLeast(existing, "1.8") ? existing : "1.8";
assert.equal(appliedVersion("1.7"), "1.8");
assert.equal(appliedVersion("1.8"), "1.8");
assert.equal(appliedVersion("1.9"), "1.9");

const staleCount = validateBankObject({
  ...validEmptyBank,
  meta: {
    ...validEmptyBank.meta,
    count: 1,
  },
});
assert.equal(staleCount.ok, false);
if (!staleCount.ok) {
  assert(staleCount.reasons.includes("meta.count 1 does not match questions.length 0"));
}

const invalidCount = validateBankObject({
  ...validEmptyBank,
  meta: {
    ...validEmptyBank.meta,
    count: 0.5,
  },
});
assert.equal(invalidCount.ok, false);
if (!invalidCount.ok) {
  assert(invalidCount.reasons.includes("meta.count must be a non-negative integer"));
}

const pair = (text: string) => ({ en: text, zh: "测试文本" });

const rationaleVisual = {
  kind: "capnography",
  pattern: "normal",
  etco2: 38,
  respiratoryRate: 16,
  durationSec: 12,
  caption: { en: "Normal capnography waveform", zh: "正常二氧化碳波形" },
};

const optionRationales = [
  { refId: "A", en: "A rationale.", zh: "A 解析。" },
  { refId: "B", en: "B rationale.", zh: "B 解析。" },
  { refId: "C", en: "C rationale.", zh: "C 解析。" },
];

const baseOptionQuestion = {
  id: "rationale_visual_mc",
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "capnography teaching",
  difficulty: "easy",
  stem: pair("Which waveform is expected?"),
  rationale: {
    correct: pair("The waveform teaches the normal square shape after answer reveal."),
    byChoice: optionRationales,
  },
  testTakingStrategy: pair("Match the waveform to the respiratory pattern."),
  glossary: [],
  options: [
    { id: "A", en: "Normal ventilation", zh: "正常通气" },
    { id: "B", en: "Bronchospasm", zh: "支气管痉挛" },
    { id: "C", en: "Disconnected circuit", zh: "回路断开" },
  ],
  correct: ["A"],
};

const withRationaleVisuals = (visuals: unknown[]) => ({
  ...baseOptionQuestion,
  rationale: {
    ...baseOptionQuestion.rationale,
    visuals,
  },
});

const schema12VisualQuestion = {
  ...baseOptionQuestion,
  id: "schema_12_visual_question",
  visual: rationaleVisual,
  meta: {
    visual_justification: "The waveform is required to identify the ventilation pattern.",
    collapse_test: "Removing the waveform removes the tested pattern.",
  },
};
const stale12Floor = validateBankObject({
  meta: { schemaVersion: "1.1", count: 1 },
  questions: [schema12VisualQuestion],
});
assert.equal(stale12Floor.ok, false);
if (!stale12Floor.ok) {
  assert(stale12Floor.reasons.includes("questions[0]: visual requires meta.schemaVersion 1.2"));
}
assert.equal(validateBankObject({
  meta: { schemaVersion: "1.2", count: 1 },
  questions: [schema12VisualQuestion],
}).ok, true);

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
}).ok, true);

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals(Array.from({ length: 6 }, () => rationaleVisual))],
}).ok, true);

const nonArrayRationaleVisuals = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...baseOptionQuestion,
    rationale: {
      ...baseOptionQuestion.rationale,
      visuals: rationaleVisual,
    },
  }],
});
assert.equal(nonArrayRationaleVisuals.ok, false);
if (!nonArrayRationaleVisuals.ok) {
  assert(nonArrayRationaleVisuals.reasons.includes("questions[0]: rationale.visuals must be an array when present"));
}

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...withRationaleVisuals([rationaleVisual]),
    id: "rationale_visual_ordered_response",
    itemType: "ordered_response",
    correct: ["A", "B", "C"],
  }],
}).ok, true);

const emptyRationaleVisuals = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([])],
});
assert.equal(emptyRationaleVisuals.ok, false);
if (!emptyRationaleVisuals.ok) {
  assert(emptyRationaleVisuals.reasons.includes("questions[0]: rationale.visuals must not be empty (omit the field for no visuals)"));
}

const tooManyRationaleVisuals = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals(Array.from({ length: 7 }, () => rationaleVisual))],
});
assert.equal(tooManyRationaleVisuals.ok, false);
if (!tooManyRationaleVisuals.ok) {
  assert(tooManyRationaleVisuals.reasons.includes("questions[0]: rationale.visuals must contain at most 6 entries"));
}

const badKindRationaleVisual = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([{ kind: "not_a_visual" }])],
});
assert.equal(badKindRationaleVisual.ok, false);
if (!badKindRationaleVisual.ok) {
  assert(badKindRationaleVisual.reasons.includes("questions[0]: rationale.visuals[0].kind is invalid"));
}

const floor14 = validateBankObject({
  meta: { schemaVersion: "1.4", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
});
assert.equal(floor14.ok, false);
if (!floor14.ok) {
  assert(floor14.reasons.includes("questions[0]: rationale.visuals requires meta.schemaVersion 1.5"));
}

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
}).ok, true);

assert.equal(validateBankObject([withRationaleVisuals([rationaleVisual])]).ok, true);

const embeddedCaseStudy = {
  id: "rationale_visual_case",
  itemType: "case_study",
  category: "Physiological Adaptation",
  topic: "case rationale visuals",
  difficulty: "medium",
  stem: pair("Review the case."),
  rationale: { correct: pair("Case rationale.") },
  testTakingStrategy: pair("Use the exhibit and each part."),
  glossary: [],
  caseStudy: {
    title: pair("Respiratory case"),
    exhibits: [{ id: "nurses_note", title: pair("Nurses note"), content: pair("Client is being monitored.") }],
    questions: [
      withRationaleVisuals([rationaleVisual]),
      {
        ...baseOptionQuestion,
        id: "rationale_visual_case_part_2",
      },
    ],
  },
};

const schema11CaseStudy = {
  ...embeddedCaseStudy,
  id: "schema_11_case",
  caseStudy: {
    ...embeddedCaseStudy.caseStudy,
    questions: [
      { ...baseOptionQuestion, id: "schema_11_case_part_1" },
      { ...baseOptionQuestion, id: "schema_11_case_part_2" },
    ],
  },
};
const stale11Floor = validateBankObject({
  meta: { schemaVersion: "1.0", count: 1 },
  questions: [schema11CaseStudy],
});
assert.equal(stale11Floor.ok, false);
if (!stale11Floor.ok) {
  assert(stale11Floor.reasons.includes("questions[0]: case_study requires meta.schemaVersion 1.1"));
}
assert.equal(validateBankObject({
  meta: { schemaVersion: "1.1", count: 1 },
  questions: [schema11CaseStudy],
}).ok, true);

const embeddedFloor14 = validateBankObject({
  meta: { schemaVersion: "1.4", count: 1 },
  questions: [embeddedCaseStudy],
});
assert.equal(embeddedFloor14.ok, false);
if (!embeddedFloor14.ok) {
  assert(embeddedFloor14.reasons.includes("questions[0]: rationale.visuals requires meta.schemaVersion 1.5"));
}

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [embeddedCaseStudy],
}).ok, true);

const caseStudy16 = {
  ...embeddedCaseStudy,
  id: "schema_16_case",
  rationale: { correct: pair("Schema 1.6 metadata is inert.") },
  caseStudy: {
    ...embeddedCaseStudy.caseStudy,
    exhibits: [{
      id: "baseline",
      type: "text",
      title: pair("Baseline"),
      content: pair("Baseline exhibit."),
    }],
    stages: [{
      id: "stage_1",
      title: pair("Stage 1"),
      trigger: pair("The client develops a new symptom."),
      narrative: pair("Stage narrative."),
      timeOffset: "30 minutes later",
      exhibits: [{
        id: "stage_note",
        type: "text",
        title: pair("Stage note"),
        content: pair("Stage exhibit."),
      }],
    }],
    questions: [
      { ...withRationaleVisuals([rationaleVisual]), id: "schema_16_case_part_1", stageId: "baseline" },
      {
        ...baseOptionQuestion,
        id: "schema_16_case_part_2",
        answerableAfterStageId: "stage_1",
      },
    ],
  },
};

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.6", count: 1 },
  questions: [caseStudy16],
}).ok, true);

const stale16Floor = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [caseStudy16],
});
assert.equal(stale16Floor.ok, false);
if (!stale16Floor.ok) {
  assert(stale16Floor.reasons.includes("questions[0]: unfolding case-study metadata requires meta.schemaVersion 1.6"));
}

const pacerVisual = {
  kind: "rhythm_strip",
  rhythm: "asystole",
  rateBpm: 0,
  durationSec: 6,
  seed: 1,
  pacer: {
    mode: "ventricular",
    setRateBpm: 60,
    spikeTimesSec: [1, 2, 3],
    capturedSpikeTimesSec: [1, 3],
    finding: "failure_to_capture",
  },
};

const pacerQuestion = {
  ...baseOptionQuestion,
  id: "schema_17_pacer_question",
  visual: pacerVisual,
  meta: {
    visual_justification: "The strip must show which pacing spikes capture.",
    expected: { pacerFinding: "failure_to_capture" },
  },
};

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.7", count: 1 },
  questions: [pacerQuestion],
}).ok, true);

const stale17Floor = validateBankObject({
  meta: { schemaVersion: "1.6", count: 1 },
  questions: [pacerQuestion],
});
assert.equal(stale17Floor.ok, false);
if (!stale17Floor.ok) {
  assert(stale17Floor.reasons.includes("questions[0]: pacer rhythm_strip requires meta.schemaVersion 1.7"));
}

const embeddedPacerCase = {
  ...embeddedCaseStudy,
  id: "schema_17_embedded_pacer_case",
  caseStudy: {
    ...embeddedCaseStudy.caseStudy,
    questions: [
      { ...pacerQuestion, id: "schema_17_embedded_pacer_case_part_1" },
      { ...baseOptionQuestion, id: "schema_17_embedded_pacer_case_part_2" },
    ],
  },
};

const staleEmbedded17Floor = validateBankObject({
  meta: { schemaVersion: "1.6", count: 1 },
  questions: [embeddedPacerCase],
});
assert.equal(staleEmbedded17Floor.ok, false);
if (!staleEmbedded17Floor.ok) {
  assert(staleEmbedded17Floor.reasons.includes("questions[0]: pacer rhythm_strip requires meta.schemaVersion 1.7"));
}

const badStageTrigger = validateBankObject({
  meta: { schemaVersion: "1.6", count: 1 },
  questions: [{
    ...caseStudy16,
    caseStudy: {
      ...caseStudy16.caseStudy,
      stages: [{
        ...caseStudy16.caseStudy.stages[0],
        trigger: { en: "English only" },
      }],
    },
  }],
});
assert.equal(badStageTrigger.ok, false);
if (!badStageTrigger.ok) {
  assert(badStageTrigger.reasons.includes("questions[0]: caseStudy.stages[0].trigger.en and caseStudy.stages[0].trigger.zh are required"));
}

// U+FFFD (replacement character) is never legitimate content — it signals an
// encoding round-trip corruption. Reject it in any string field, at any depth.
const replacementInStem = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{ ...baseOptionQuestion, stem: { en: "ok", zh: "速率�四舍五入" } }],
});
assert.equal(replacementInStem.ok, false);
if (!replacementInStem.ok) {
  assert(replacementInStem.reasons.includes(
    "questions[0]: stem.zh contains a U+FFFD replacement character (encoding corruption)",
  ));
}

const replacementInOption = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...baseOptionQuestion,
    options: [
      { id: "A", en: "Normal ventilation", zh: "正常�通气" },
      { id: "B", en: "Bronchospasm", zh: "支气管痉挛" },
      { id: "C", en: "Disconnected circuit", zh: "回路断开" },
    ],
  }],
});
assert.equal(replacementInOption.ok, false);
if (!replacementInOption.ok) {
  assert(replacementInOption.reasons.includes(
    "questions[0]: options[0].zh contains a U+FFFD replacement character (encoding corruption)",
  ));
}

const replacementInEmbeddedExhibit = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...embeddedCaseStudy,
    caseStudy: {
      ...embeddedCaseStudy.caseStudy,
      exhibits: [{ id: "nurses_note", title: pair("Nurses note"), content: { en: "Monitored.", zh: "正在�监测。" } }],
    },
  }],
});
assert.equal(replacementInEmbeddedExhibit.ok, false);
if (!replacementInEmbeddedExhibit.ok) {
  assert(replacementInEmbeddedExhibit.reasons.some((reason) =>
    reason.includes("caseStudy.exhibits[0].content.zh contains a U+FFFD replacement character")),
  );
}

const exportEnvelope = toExportEnvelope([withRationaleVisuals([rationaleVisual]) as unknown as Question]);
assert.equal(exportEnvelope.meta?.schemaVersion, "1.5");
const schema16ExportEnvelope = toExportEnvelope([caseStudy16 as unknown as Question]);
assert.equal(schema16ExportEnvelope.meta?.schemaVersion, "1.6");
const schema17ExportEnvelope = toExportEnvelope([pacerQuestion as unknown as Question]);
assert.equal(schema17ExportEnvelope.meta?.schemaVersion, "1.7");

const structuredMeasurementsCase = {
  ...embeddedCaseStudy,
  id: "schema_18_structured_measurements_case",
  caseStudy: {
    ...embeddedCaseStudy.caseStudy,
    exhibits: [{
      id: "labs_vitals",
      title: pair("Labs and vitals"),
      content: pair("Structured measurements are shown below."),
      structuredMeasurements: {
        panels: [
          {
            kind: "labs",
            columns: [{ id: "ed", label: pair("ED") }],
            rows: [
              {
                key: "potassium",
                label: pair("Potassium"),
                values: [{ columnId: "ed", value: "6.2", unit: "mEq/L" }],
              },
              {
                key: "troponin_i",
                label: pair("Troponin I"),
                values: [{ columnId: "ed", value: "0.18", unit: "ng/mL" }],
              },
              {
                key: "sao2",
                label: pair("SaO2"),
                values: [{ columnId: "ed", value: "85", unit: "%" }],
              },
            ],
          },
          {
            kind: "vitals",
            columns: [{ id: "arrival", label: pair("Arrival") }],
            rows: [
              {
                key: "spo2",
                label: pair("SpO2"),
                values: [{ columnId: "arrival", value: "88", unit: "%" }],
              },
            ],
          },
        ],
      },
    }],
  },
};

assert.equal(validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [structuredMeasurementsCase],
}).ok, true);

const stale18Floor = validateBankObject({
  meta: { schemaVersion: "1.7", count: 1 },
  questions: [structuredMeasurementsCase],
});
assert.equal(stale18Floor.ok, false);
if (!stale18Floor.ok) {
  assert(stale18Floor.reasons.includes("questions[0]: structuredMeasurements requires meta.schemaVersion 1.8"));
}

const badStructuredColumn = structuredClone(structuredMeasurementsCase);
badStructuredColumn.caseStudy.exhibits[0].structuredMeasurements.panels[0].rows[0].values[0].columnId = "missing";
const badColumnResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badStructuredColumn],
});
assert.equal(badColumnResult.ok, false);
if (!badColumnResult.ok) {
  assert(badColumnResult.reasons.some((reason) => reason.includes("columnId 'missing' does not match a column id")));
}

const badStructuredUnit = structuredClone(structuredMeasurementsCase);
badStructuredUnit.caseStudy.exhibits[0].structuredMeasurements.panels[0].rows[0].values[0].unit = "mg/dL";
const badUnitResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badStructuredUnit],
});
assert.equal(badUnitResult.ok, false);
if (!badUnitResult.ok) {
  assert(badUnitResult.reasons.some((reason) => reason.includes("unit 'mg/dL' is not accepted for measurement key 'potassium'")));
}

const badStructuredComparator = structuredClone(structuredMeasurementsCase);
badStructuredComparator.caseStudy.exhibits[0].structuredMeasurements.panels[0].rows[0].values[0].value = ">6.2";
const badComparatorResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badStructuredComparator],
});
assert.equal(badComparatorResult.ok, false);
if (!badComparatorResult.ok) {
  assert(badComparatorResult.reasons.some((reason) => reason.includes("exact scalar without comparator symbols")));
}

const badStructuredFlag = structuredClone(structuredMeasurementsCase);
(badStructuredFlag.caseStudy.exhibits[0].structuredMeasurements.panels[0].rows[0].values[0] as Record<string, unknown>).flag = "H";
const badFlagResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badStructuredFlag],
});
assert.equal(badFlagResult.ok, false);
if (!badFlagResult.ok) {
  assert(badFlagResult.reasons.some((reason) => reason.includes("flag is not allowed in structuredMeasurements v1")));
}

const badStructuredKind = structuredClone(structuredMeasurementsCase);
badStructuredKind.caseStudy.exhibits[0].structuredMeasurements.panels[1].rows[0].key = "troponin_i";
const badKindResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badStructuredKind],
});
assert.equal(badKindResult.ok, false);
if (!badKindResult.ok) {
  assert(badKindResult.reasons.some((reason) => reason.includes("troponin_i") && reason.includes("cannot appear in a vitals panel")));
}

const badSao2Vitals = structuredClone(structuredMeasurementsCase);
badSao2Vitals.caseStudy.exhibits[0].structuredMeasurements.panels[1].rows[0].key = "sao2";
badSao2Vitals.caseStudy.exhibits[0].structuredMeasurements.panels[1].rows[0].label = pair("SaO2");
const badSao2VitalsResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badSao2Vitals],
});
assert.equal(badSao2VitalsResult.ok, false);
if (!badSao2VitalsResult.ok) {
  assert(badSao2VitalsResult.reasons.some((reason) => reason.includes("sao2") && reason.includes("cannot appear in a vitals panel")));
}

const pedsStructuredPopulation = structuredClone(structuredMeasurementsCase);
(pedsStructuredPopulation.caseStudy.exhibits[0].structuredMeasurements as {
  population?: string;
}).population = "peds_child";
const gatedStructuredPopulation = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [pedsStructuredPopulation],
});
assert.equal(gatedStructuredPopulation.ok, false);
if (!gatedStructuredPopulation.ok) {
  assert(gatedStructuredPopulation.reasons.includes(
    "questions[0]: structuredMeasurements.population is gated until schema 2.0",
  ));
}

const badStructuredPopulation = structuredClone(structuredMeasurementsCase);
(badStructuredPopulation.caseStudy.exhibits[0].structuredMeasurements as {
  population?: string;
}).population = "neonate";
const badPopulationResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [badStructuredPopulation],
});
assert.equal(badPopulationResult.ok, false);
if (!badPopulationResult.ok) {
  assert(badPopulationResult.reasons.some((reason) => reason.includes("population must be adult, peds_child, or peds_infant")));
}

const strictStructuredClean = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [structuredMeasurementsCase],
}, { rejectUnknownKeys: true });
assert.equal(strictStructuredClean.ok, true);

const strictStructuredExtra = structuredClone(structuredMeasurementsCase);
(strictStructuredExtra.caseStudy.exhibits[0].structuredMeasurements.panels[0].rows[0].values[0] as Record<string, unknown>).sourceUnit = "mEq/L";
const strictStructuredExtraResult = validateBankObject({
  meta: { schemaVersion: "1.8", count: 1 },
  questions: [strictStructuredExtra],
}, { rejectUnknownKeys: true });
assert.equal(strictStructuredExtraResult.ok, false);
if (!strictStructuredExtraResult.ok) {
  assert(strictStructuredExtraResult.reasons.some((reason) => reason.includes("has unknown key 'sourceUnit'")));
}

const schema18ExportEnvelope = toExportEnvelope([structuredMeasurementsCase as unknown as Question]);
assert.equal(schema18ExportEnvelope.meta?.schemaVersion, "1.8");

const strictClean = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [withRationaleVisuals([rationaleVisual])],
}, { rejectUnknownKeys: true });
assert.equal(strictClean.ok, true);

const strictQuestionExtra = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...withRationaleVisuals([rationaleVisual]),
    stray: true,
  }],
}, { rejectUnknownKeys: true });
assert.equal(strictQuestionExtra.ok, false);
if (!strictQuestionExtra.ok) {
  assert(strictQuestionExtra.reasons.includes("questions[0] has unknown key 'stray'"));
}

const strictGlossaryTermDef = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1 },
  questions: [{
    ...withRationaleVisuals([rationaleVisual]),
    glossary: [{ termEn: "Term", termZh: "术语", defZh: "定义", termDef: "legacy" }],
  }],
}, { rejectUnknownKeys: true });
assert.equal(strictGlossaryTermDef.ok, false);
if (!strictGlossaryTermDef.ok) {
  assert(strictGlossaryTermDef.reasons.includes("questions[0].glossary[0] has unknown key 'termDef'"));
}

const strictBankMetaExtra = validateBankObject({
  meta: { schemaVersion: "1.5", count: 1, generatedAt: "2026-06-24" },
  questions: [withRationaleVisuals([rationaleVisual])],
}, { rejectUnknownKeys: true });
assert.equal(strictBankMetaExtra.ok, false);
if (!strictBankMetaExtra.ok) {
  assert(strictBankMetaExtra.reasons.includes("$.meta has unknown key 'generatedAt'"));
}

const forgivingQuestionImport = validateQuestion({
  ...baseOptionQuestion,
  glossary: [{ termEn: "Term", termZh: "术语", defZh: "定义", termDef: "legacy" }],
});
assert.equal(forgivingQuestionImport.ok, true);

console.log("bank schema tests passed");
