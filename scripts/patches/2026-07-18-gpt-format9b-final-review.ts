/** Collision replacement and source pinning for GPT scored-format batch 9B. */
import { runPatch, setValue } from "../patch-raw";

const wound = "gpt_format9b_wound_surface_area";
const ectConsent = "gpt_format9b_ect_consent_capacity";

runPatch([
  setValue({
    id: wound,
    path: ["stem"],
    before: {
      en: "Using the simple ruler convention, measure the greatest wound length and the greatest width perpendicular to that length. The wound measures 6.4 cm by 3.7 cm. Use surface area = greatest length × greatest perpendicular width. Calculate the area in cm² and round to the nearest tenth. This arithmetic does not establish wound volume, stage, tissue percentage, or healing by itself.",
      zh: "采用简单直尺测量法：测量伤口最大长度，以及与该长度垂直的最大宽度。伤口测量为 6.4 cm × 3.7 cm。使用：表面积 = 最大长度 × 与其垂直的最大宽度。计算面积，单位为 cm²，并四舍五入到小数点后一位。该计算本身不能确定伤口体积、分期、组织比例或愈合情况。",
    },
    after: {
      en: "At two wound-clinic visits, the nurse measures the same wound after cleansing, with the client in the same position and using the same method. The deepest point measured 2.6 cm at baseline and 1.8 cm today. Calculate the absolute decrease in wound depth in centimeters using baseline depth − current depth. Round to the nearest tenth. This single dimension does not by itself establish healing, stage, or tissue composition.",
      zh: "在两次伤口门诊复诊时，护士均在清洁伤口后、患者体位相同且测量方法相同的条件下测量同一伤口。基线时最深处为 2.6 cm，今天为 1.8 cm。使用“基线深度 − 当前深度”计算伤口深度的绝对减少值，单位为厘米，并四舍五入到小数点后一位。单一维度本身不能确定伤口已经愈合、伤口分期或组织构成。",
    },
    note: "Replace the duplicated length-times-width construct with a distinct serial depth-change calculation.",
  }),
  setValue({
    id: wound,
    path: ["rationale"],
    before: {
      correct: {
        en: "Surface area = 6.4 cm × 3.7 cm = 23.68 cm², which rounds to 23.7 cm². The selected measurement convention uses the greatest length and the greatest width perpendicular to it; the rectangular estimate can be tracked consistently but does not describe depth or tissue composition.",
        zh: "表面积 = 6.4 cm × 3.7 cm = 23.68 cm²，四舍五入为 23.7 cm²。所选测量约定使用最大长度及其垂直方向的最大宽度；该矩形估算可用于一致记录，但不能描述深度或组织构成。",
      },
      byChoice: [
        {
          refId: "b1",
          en: "Multiplying 6.4 by 3.7 gives 23.68, which rounds to 23.7 cm².",
          zh: "6.4 × 3.7 = 23.68，四舍五入为 23.7 cm²。",
        },
      ],
    },
    after: {
      correct: {
        en: "Absolute depth decrease = 2.6 cm − 1.8 cm = 0.8 cm. Serial wound dimensions should be obtained with a consistent technique; the depth is measured at the deepest point. A smaller depth is one trend datum and must be interpreted with the rest of the wound assessment.",
        zh: "深度绝对减少值 = 2.6 cm − 1.8 cm = 0.8 cm。连续伤口尺寸应采用一致方法测量；深度取伤口最深处。深度变小只是一项趋势数据，必须结合其余伤口评估结果解释。",
      },
      byChoice: [
        {
          refId: "b1",
          en: "Subtracting the current depth from the baseline depth gives 2.6 − 1.8 = 0.8 cm.",
          zh: "用基线深度减去当前深度：2.6 − 1.8 = 0.8 cm。",
        },
      ],
    },
  }),
  setValue({
    id: wound,
    path: ["testTakingStrategy"],
    before: {
      en: "Use the perpendicular width supplied in the stem, multiply once, and apply the stated rounding only at the end.",
      zh: "使用题干给出的垂直宽度，相乘一次，并在最后按要求四舍五入。",
    },
    after: {
      en: "For an absolute decrease, subtract the newer measurement from the baseline and keep the requested unit.",
      zh: "计算绝对减少值时，用基线测量值减去较新的测量值，并保留题目要求的单位。",
    },
  }),
  setValue({
    id: wound,
    path: ["glossary"],
    before: [
      { termEn: "greatest length", termZh: "最大长度", defZh: "伤口最长轴的测量值。" },
      { termEn: "perpendicular width", termZh: "垂直宽度", defZh: "与最大长度成直角方向测得的最大宽度。" },
      { termEn: "surface area", termZh: "表面积", defZh: "本题用长度乘宽度得到的二维矩形估算值。" },
    ],
    after: [
      { termEn: "wound depth", termZh: "伤口深度", defZh: "从伤口可见表面到伤床最深处的距离。" },
      { termEn: "baseline", termZh: "基线", defZh: "用于与后续结果比较的初始测量值。" },
      { termEn: "absolute decrease", termZh: "绝对减少值", defZh: "用较早数值减去较新数值得到的实际差值。" },
    ],
  }),
  setValue({
    id: wound,
    path: ["meta", "source"],
    before: "A Comparison of Wound Area Measurement Techniques: Visitrak Versus Photography, simple ruler method section (greatest length multiplied by greatest width perpendicular to it), Journal of Clinical Nursing / PMC, https://pmc.ncbi.nlm.nih.gov/articles/PMC3080766/",
    after: "Open RN, Nursing Skills, Chapter 20 Wound Care, wound-assessment section (measure the deepest point to the wound surface and document in centimeters), https://www.ncbi.nlm.nih.gov/books/NBK593201/; Federal Bureau of Prisons, Prevention and Management of Acute and Chronic Wounds, wound-assessment table (serial length, width, and deepest-point depth in centimeters), https://www.bop.gov/resources/pdfs/wounds.pdf",
  }),
  setValue({
    id: wound,
    path: ["blanks"],
    before: [
      {
        id: "b1",
        prompt: { en: "wound surface area (cm²)", zh: "伤口表面积（cm²）" },
        acceptable: ["23.7", "23.7 cm²", "23.7 cm2"],
        numeric: { value: 23.7, tolerance: 0, unit: "cm²" },
      },
    ],
    after: [
      {
        id: "b1",
        prompt: { en: "absolute decrease in wound depth (cm)", zh: "伤口深度绝对减少值（cm）" },
        acceptable: ["0.8", "0.8 cm"],
        numeric: { value: 0.8, tolerance: 0, unit: "cm" },
      },
    ],
  }),
  setValue({
    id: wound,
    path: ["id"],
    before: wound,
    after: "gpt_format9b_wound_depth_change",
    note: "Give the replacement construct an accurate globally unique id.",
  }),
  setValue({
    id: ectConsent,
    path: ["meta", "source"],
    before: "Clinical Practice Guidelines for the Use of Electroconvulsive Therapy, Indian Journal of Psychiatry 2023, sections 'Informed consent' and 'Consent in special situations' (information, voluntariness, ongoing consent, capacity assessment, nominated representative/surrogate pathway, and participation of the patient), https://pmc.ncbi.nlm.nih.gov/articles/PMC10096214/",
    after: "Clinical Practice Guidelines for the Use of Electroconvulsive Therapy, Indian Journal of Psychiatry 2023, sections 'Informed consent' and 'Consent in special situations' (information, voluntariness, ongoing consent, surrogate pathway, continued patient participation, and renewed direct consent when capacity returns), https://pmc.ncbi.nlm.nih.gov/articles/PMC10096214/; American Academy of Family Physicians, Evaluating Medical Decision-Making Capacity in Practice (understanding, appreciation, reasoning, and communication; decision-specific assessment), https://www.aafp.org/pubs/afp/issues/2018/0701/p40.html",
    note: "Add the exact source for the four-part decision-making-capacity test used by the keyed option.",
  }),
]);
