/** Temperature Counterpart R1, independently reviewed 2026-09-13: 7 gpt-canonical.json bilingual temperature-display normalizations, including the two source-value reconciliations (TC-04 TB case, TC-14 COPD case) verified against NIST conversion arithmetic. */
import { setValue, replaceText, runPatch, type PatchOp } from "../patch-raw";

runPatch([
  {
    "kind": "replaceText",
    "id": "gpt_2026_06_19_case_ici_pneumonitis_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "baseline_assessment"
      },
      "content",
      "en"
    ],
    "before": "37.1 C",
    "after": "98.8 °F (37.1 °C)",
    "note": "Temperature counterpart R1 TC-06-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_canonical_matrix_newborn_findings_045",
    "path": [
      "matrix",
      "rows",
      {
        "id": "r4"
      },
      "zh"
    ],
    "before": "36.0 C（96.8 F）",
    "after": "96.8 °F (36.0 °C)",
    "note": "Temperature counterpart R1 TC-07-zh: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_case_infection_control_clustered_care_01",
    "path": [
      "caseStudy",
      "stages",
      {
        "id": "stage_2"
      },
      "exhibits",
      {
        "id": "stage_2_1130_status"
      },
      "content",
      "en"
    ],
    "before": "38.4 C",
    "after": "101.1 °F (38.4 °C)",
    "note": "Temperature counterpart R1 TC-08-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_case_nine_month_well_child_safety_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "baseline_record"
      },
      "content",
      "zh"
    ],
    "before": "37.1 C",
    "after": "98.8 °F (37.1 °C)",
    "note": "Temperature counterpart R1 TC-09-zh: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_case_warfarin_mvr_2026_06_11_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "initial_assessment_labs"
      },
      "content",
      "en"
    ],
    "before": "36.9 C",
    "after": "98.4 °F (36.9 °C)",
    "note": "Temperature counterpart R1 TC-10-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_case_warfarin_mvr_2026_06_11_01",
    "path": [
      "caseStudy",
      "stages",
      {
        "id": "stage_2_2200"
      },
      "exhibits",
      {
        "id": "stage_2_update"
      },
      "content",
      "en"
    ],
    "before": "37.0 C",
    "after": "98.6 °F (37.0 °C)",
    "note": "Temperature counterpart R1 TC-11-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_case_warfarin_mvr_2026_06_11_01",
    "path": [
      "caseStudy",
      "stages",
      {
        "id": "stage_3_0645"
      },
      "exhibits",
      {
        "id": "stage_3_deterioration"
      },
      "content",
      "en"
    ],
    "before": "37.1 C",
    "after": "98.8 °F (37.1 °C)",
    "note": "Temperature counterpart R1 TC-12-en: independently reviewed display normalization."
  }
]);
