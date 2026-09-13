/** Temperature Counterpart R1, independently reviewed 2026-09-13: 5 claude-canonical.json bilingual temperature-display normalizations. No clinical fact changed; values already matched cross-language before this display fix. */
import { setValue, replaceText, runPatch, type PatchOp } from "../patch-raw";

runPatch([
  {
    "kind": "replaceText",
    "id": "opus22_case_postpartum_intrusive_thoughts_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "assessment_labs"
      },
      "content",
      "en"
    ],
    "before": "36.8 C",
    "after": "98.2 °F (36.8 °C)",
    "note": "Temperature counterpart R1 TC-01-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "opus22_case_postpartum_intrusive_thoughts_01",
    "path": [
      "caseStudy",
      "stages",
      {
        "id": "stage_2_follow_up"
      },
      "exhibits",
      {
        "id": "stage_2_symptoms"
      },
      "content",
      "en"
    ],
    "before": "36.9 C",
    "after": "98.4 °F (36.9 °C)",
    "note": "Temperature counterpart R1 TC-02-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "opus22_case_postpartum_intrusive_thoughts_01",
    "path": [
      "caseStudy",
      "stages",
      {
        "id": "stage_3_response"
      },
      "exhibits",
      {
        "id": "stage_3_improvement"
      },
      "content",
      "en"
    ],
    "before": "36.7 C",
    "after": "98.1 °F (36.7 °C)",
    "note": "Temperature counterpart R1 TC-03-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "opus25_case_tb_airborne_treatment_monitoring_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "initial_assessment"
      },
      "content",
      "en"
    ],
    "before": "38.3 C (101.0 F)",
    "after": "100.9 °F (38.3 °C)",
    "note": "Temperature counterpart R1 TC-04-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "opus27_case_ipv_prenatal_care_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "ex2_initial_assessment"
      },
      "content",
      "en"
    ],
    "before": "36.8 C",
    "after": "98.2 °F (36.8 °C)",
    "note": "Temperature counterpart R1 TC-05-en: independently reviewed display normalization."
  }
]);
