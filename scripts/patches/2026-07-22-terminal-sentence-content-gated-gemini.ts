import { setValue } from "../patch-raw";
import {
  runContentGatedPatch,
  type ContentChange,
} from "./terminal-sentence-content-gated-runner";

const replacements = [
  {
    queue: 922,
    id: "gap_50_sic_09",
    before: {
      en: "After administering an intramuscular injection, the nurse should immediately {{1}} and dispose of the syringe in the sharps container without {{2}}.",
      zh: "在进行肌内注射后，护士应立即 {{1}} 并将注射器丢弃在锐器盒中，而不能 {{2}}。",
    },
    after: {
      en: "A nurse has just administered an intramuscular injection and is preparing to dispose of the used needle and syringe.",
      zh: "护士刚完成一次肌内注射，正在准备处置用过的针头和注射器。",
    },
  },
  {
    queue: 1103,
    id: "gemini_hpm_ngn_2026_06_22_q3",
    before: {
      en: "A nurse is providing discharge education to a parent regarding car seat safety for their 18-month-old toddler. The nurse teaches that the toddler must be secured in a {{seat_type}} car seat until they reach the maximum height or weight limit of the seat. The harness straps should be positioned {{strap_level}} the child's shoulders, and the chest clip must be secured at the level of the {{clip_level}}.",
      zh: "护士正在向家长提供关于 18 个月大幼儿汽车安全座椅出院指导。护士指导称，幼儿必须固定在{{seat_type}}汽车安全座椅中，直到达到该座椅的最大身高或体重限制。安全带肩带应定位在孩子肩膀的{{strap_level}}，胸夹必须固定在{{clip_level}}的水平。",
    },
    after: {
      en: "Before discharge, the parent of an 18-month-old toddler asks the nurse to review correct car-seat setup.",
      zh: "出院前，一名 18 个月大幼儿的家长请护士复核汽车安全座椅的正确设置。",
    },
  },
  {
    queue: 1108,
    id: "gemini_hpm_ngn_2026_06_22_q8",
    before: {
      en: "A nurse is teaching a new mother about safe sleep guidelines to reduce the risk of Sudden Infant Death Syndrome (SIDS). The nurse instructs that the infant should always be placed in the {{position}} position for sleep. The sleeping surface must be a {{surface}} mattress with {{items}} in the crib.",
      zh: "护士正在指导新手妈妈关于降低婴儿猝死综合征（SIDS）风险的安全睡眠指南。护士指导称，婴儿睡眠时应始终处于{{position}}。睡眠表面必须是{{surface}}床垫，且婴儿床内{{items}}。",
    },
    after: {
      en: "A new parent asks the nurse to review how to prepare the infant's crib for safe sleep at home.",
      zh: "一名新手家长请护士复核如何在家中为婴儿准备安全的睡眠环境。",
    },
  },
] as const;

const changes: ContentChange[] = replacements.map((entry) => ({
  queue: entry.queue,
  id: entry.id,
  path: ["stem"],
  before: entry.before,
  after: entry.after,
  op: setValue({
    id: entry.id,
    path: ["stem"],
    before: entry.before,
    after: entry.after,
    note: `Queue ${entry.queue}: replace ordinary stem with neutral bilingual setup prose.`,
  }),
}));

const healthyId = "trad_batchC_25";
const healthyStemBefore = "护士正在计划一项社区健康计划。哪种理念最符合《健康中国 2030》（此处对应美国 Healthy People 2030）的基础目标？";
const healthyStemAfter = "护士正在计划一项社区健康计划。哪种理念最符合《健康人民 2030》（Healthy People 2030）的基础目标？";
const healthyRationaleBefore = "《健康人民 2030》(Healthy People 2030) 强调健康的社会决定因素、健康公平和健康素养，这是改善所有人群健康的基础。";
const healthyRationaleAfter = "《健康人民 2030》（Healthy People 2030）强调健康的社会决定因素、健康公平和健康素养，这是改善所有人群健康的基础。";

changes.push(
  {
    queue: 735,
    id: healthyId,
    path: ["stem", "zh"],
    before: healthyStemBefore,
    after: healthyStemAfter,
    op: setValue({
      id: healthyId,
      path: ["stem", "zh"],
      before: healthyStemBefore,
      after: healthyStemAfter,
      note: "INTENTIONAL_SINGLE_LOCALE_REPAIR: queue 735 normalizes the incorrect Chinese programme identity and removes translator-facing commentary; the English sibling is verified clean and unchanged.",
    }),
  },
  {
    queue: 735,
    id: healthyId,
    path: ["rationale", "correct", "zh"],
    before: healthyRationaleBefore,
    after: healthyRationaleAfter,
    op: setValue({
      id: healthyId,
      path: ["rationale", "correct", "zh"],
      before: healthyRationaleBefore,
      after: healthyRationaleAfter,
      note: "INTENTIONAL_SINGLE_LOCALE_REPAIR: queue 735 uses the same normalized Chinese programme identity in the rationale; the English sibling is verified clean and unchanged.",
    }),
  },
);

runContentGatedPatch({
  bankPath: "banks/gemini-canonical.json",
  reason: "apply Claude-approved terminal-sentence content-gated Gemini repairs",
  changes,
  strictParity: false,
  assertPostconditions(bank) {
    for (const entry of replacements) {
      const question = bank.questions.find((candidate: any) => candidate.id === entry.id);
      for (const locale of ["en", "zh"]) {
        const stem = question?.stem?.[locale];
        if (!stem || /\{\{[^}]+\}\}/.test(stem)) {
          throw new Error(`queue ${entry.queue} stem.${locale} is empty or contains a placeholder`);
        }
        if (stem === question?.clozeStem?.[locale]) {
          throw new Error(`queue ${entry.queue} stem.${locale} duplicates clozeStem`);
        }
      }
      if (!question?.dropdowns || !question?.clozeStem) {
        throw new Error(`queue ${entry.queue} lost dropdown response fields`);
      }
    }
    const healthy = bank.questions.find((candidate: any) => candidate.id === healthyId);
    const serialized = JSON.stringify(healthy);
    if (serialized.includes("健康中国") || serialized.includes("此处对应")) {
      throw new Error("queue 735 retains the incorrect programme identity or translator commentary");
    }
    if (!serialized.includes("《健康人民 2030》（Healthy People 2030）")) {
      throw new Error("queue 735 lacks the normalized bilingual identity");
    }
  },
});
