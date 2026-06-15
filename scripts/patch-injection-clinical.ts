import fs from 'fs';
import path from 'path';

const filePath = '/Users/holemini/Desktop/Project Shrimp/banks/banks-raw/injection-site-smoke-raw-2026-06-15.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Fix Q5: mc_layer_highlight_05
// It was decorative because it named the route. Now it asks for the target layer of the route shown.
const q5 = data.questions.find((q: any) => q.id === "gpt_injection_smoke_2026_06_15_mc_layer_highlight_05");
if (q5) {
  q5.topic = "Target layer identification from visual";
  q5.stem = {
    en: "The nurse reviews the injection-site visual. Which tissue layer is the intended target for the route shown?",
    zh: "护士查看注射部位图。图中显示的给药途径的目标组织层是哪一层？"
  };
  // options are A: Epidermis, B: Dermis, C: Subcutaneous tissue, D: Muscle.
  // The visual is subcutaneous. Correct is C. This matches existing.
}

// Fix Q6: sata_im_cues_06
// It was decorative because it named IM. 
const q6 = data.questions.find((q: any) => q.id === "gpt_injection_smoke_2026_06_15_sata_im_cues_06");
if (q6) {
  q6.stem = {
    en: "The image shows an injection technique. Which visual cues correctly describe the route shown? Select all that apply.",
    zh: "图中显示一种注射技术。哪些视觉线索正确描述了图中显示的给药途径？选择所有适用项。"
  };
  // The options A, B, C are correct for IM (which is the visual route).
  // Option D and E were originally what? Let's check original.
  // If we just change the stem, A,B,C still describe the image, D,E still do not. 
}

// Fix Q8: matrix_route_match_08
// It was a definition matching question, completely decorative.
const q8 = data.questions.find((q: any) => q.id === "gpt_injection_smoke_2026_06_15_matrix_route_match_08");
if (q8) {
  q8.topic = "Visual technique analysis";
  q8.stem = {
    en: "The nurse reviews the injection-site visual. Classify whether each statement accurately describes the technique shown.",
    zh: "护士查看注射部位图。对每项描述进行分类：它是否准确描述了图中显示的技术？"
  };
  // The visual is intradermal.
  q8.matrix.rows = [
    {
      id: "r1",
      en: "The medication is placed in the dermis",
      zh: "药液进入真皮层"
    },
    {
      id: "r2",
      en: "The medication is placed in the subcutaneous tissue",
      zh: "药液进入皮下组织"
    },
    {
      id: "r3",
      en: "The needle enters at a 10 to 15 degree angle",
      zh: "针头以 10 至 15 度角进入"
    },
    {
      id: "r4",
      en: "The needle enters at a 45 to 90 degree angle",
      zh: "针头以 45 至 90 度角进入"
    }
  ];
  q8.matrix.columns = [
    {
      id: "c1",
      en: "Accurate",
      zh: "准确"
    },
    {
      id: "c2",
      en: "Inaccurate",
      zh: "不准确"
    }
  ];
  q8.correct = [
    { rowId: "r1", columnIds: ["c1"] }, // accurate for intradermal
    { rowId: "r2", columnIds: ["c2"] }, // inaccurate
    { rowId: "r3", columnIds: ["c1"] }, // accurate for intradermal
    { rowId: "r4", columnIds: ["c2"] }  // inaccurate
  ];
  q8.rationale.correct = {
    en: "The visual shows an intradermal injection, which targets the dermis at a shallow 10 to 15 degree angle.",
    zh: "图示为皮内注射，其目标为真皮层，进针角度较浅（10至15度）。"
  };
  q8.rationale.byChoice = [
    { refId: "r1", en: "Accurate; the needle tip ends in the dermis.", zh: "准确；针尖最终位于真皮层。" },
    { refId: "r2", en: "Inaccurate; the tip is above the subcutaneous tissue.", zh: "不准确；针尖在皮下组织上方。" },
    { refId: "r3", en: "Accurate; the needle enters at a very shallow angle consistent with intradermal administration.", zh: "准确；进针角度非常浅，符合皮内给药。" },
    { refId: "r4", en: "Inaccurate; 45-90 degrees is used for subcutaneous or intramuscular routes.", zh: "不准确；45-90度用于皮下或肌内给药。" }
  ];
  q8.testTakingStrategy = {
    en: "First identify the route from the image, then evaluate each statement against that route.",
    zh: "首先根据图像识别给药途径，然后评估每项描述是否符合该途径。"
  };
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Q5, Q6, Q8 patched successfully");
