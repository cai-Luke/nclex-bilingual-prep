/**
 * Repair raw Batch 6 staging artifacts introduced by the Safety-category rename
 * and by copying Batch 6B from a rendered inline response.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getRawQuestions, parseBankText } from "../../src/bankImport";
import { type PatchOp, runPatch, setValue } from "../patch-raw";

const inputIndex = process.argv.indexOf("--in");
if (inputIndex === -1 || !process.argv[inputIndex + 1]) {
  throw new Error("Expected --in <raw-bank.json>.");
}

const inputPath = resolve(process.argv[inputIndex + 1]);
const bank = parseBankText(readFileSync(inputPath, "utf8"));
const questions = getRawQuestions(bank);
const ops: PatchOp[] = [];

const cleanRenderedSource = (source: string): string =>
  source
    .replace(/\[(https:\/\/[^\]\s]+)\]\(\1\)/g, "$1")
    .replace(/\[(https:\/\/)/g, "$1");

const cleanRenderedSignature = (signature: string): string => {
  const prefixEnd = signature.indexOf("](https://");
  if (prefixEnd === -1) return signature;
  const prefix = signature.slice(0, prefixEnd);
  const marker = `%22,%22skill_signature%22:%22${prefix})`;
  const markerIndex = signature.indexOf(marker, prefixEnd);
  if (markerIndex === -1) {
    throw new Error(`Unrecognized rendered skill_signature artifact: ${signature}`);
  }
  return prefix + signature.slice(markerIndex + marker.length);
};

for (const question of questions) {
  if (!question || typeof question !== "object" || Array.isArray(question)) continue;
  const record = question as Record<string, unknown>;
  const id = record.id;
  if (typeof id !== "string") throw new Error("Question without a string id.");

  if (record.category === "Safety and Infection Control") {
    ops.push(setValue({
      id,
      path: ["category"],
      before: "Safety and Infection Control",
      after: "Safety and Infection Prevention and Control",
      note: "Apply the canonical Safety-category rename ratified before this raw bank landed.",
    }));
  }

  const meta = record.meta;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) continue;
  const metaRecord = meta as Record<string, unknown>;

  if (typeof metaRecord.source === "string") {
    const cleaned = cleanRenderedSource(metaRecord.source);
    if (cleaned !== metaRecord.source) {
      ops.push(setValue({
        id,
        path: ["meta", "source"],
        before: metaRecord.source,
        after: cleaned,
        note: "Remove Markdown-link rendering artifacts from the inline JSON response.",
      }));
    }
  }

  if (typeof metaRecord.skill_signature === "string") {
    const cleaned = cleanRenderedSignature(metaRecord.skill_signature);
    if (cleaned !== metaRecord.skill_signature) {
      ops.push(setValue({
        id,
        path: ["meta", "skill_signature"],
        before: metaRecord.skill_signature,
        after: cleaned,
        note: "Restore the skill signature after inline Markdown-link rendering.",
      }));
    }
  }
}

const questionIds = new Set(
  questions.flatMap((question) => {
    if (!question || typeof question !== "object" || Array.isArray(question)) return [];
    const id = (question as Record<string, unknown>).id;
    return typeof id === "string" ? [id] : [];
  }),
);

const alkalosisId = "gpt_balance6a_2026_07_16_dc_abg_acid_base_12";
if (questionIds.has(alkalosisId)) {
  ops.push(setValue({
    id: alkalosisId,
    path: ["stem"],
    before: {
      en: "A client has prolonged nasogastric suction. Results are pH 7.51, PaCO2 48 mm Hg, HCO3 37 mEq/L, and chloride 88 mEq/L. The client has no chronic lung disease. For metabolic alkalosis, expected PaCO2 rises about 0.6–0.75 mm Hg for each 1 mEq/L rise in HCO3 above 24 mEq/L and generally does not exceed 55 mm Hg from compensation alone.",
      zh: "一名患者长期接受鼻胃管吸引。检查结果：pH 7.51、PaCO2 48 mm Hg、HCO3 37 mEq/L、氯 88 mEq/L。患者无慢性肺病。代谢性碱中毒时，HCO3每高于24 mEq/L 1 mEq/L，预计PaCO2约升高0.6–0.75 mm Hg；仅由代偿引起的PaCO2通常不超过55 mm Hg。",
    },
    after: {
      en: "A client has prolonged nasogastric suction. Results are pH 7.51, PaCO2 48 mm Hg, HCO3 37 mEq/L, and chloride 88 mEq/L. The client has no chronic lung disease. For this item, use 40 mm Hg as the reference PaCO2. For metabolic alkalosis, expected PaCO2 rises about 0.6–0.75 mm Hg for each 1 mEq/L rise in HCO3 above 24 mEq/L and generally does not exceed 55 mm Hg from compensation alone.",
      zh: "一名患者长期接受鼻胃管吸引。检查结果：pH 7.51、PaCO2 48 mm Hg、HCO3 37 mEq/L、氯 88 mEq/L。患者无慢性肺病。本题以40 mm Hg作为PaCO2参考值。代谢性碱中毒时，HCO3每高于24 mEq/L 1 mEq/L，预计PaCO2约升高0.6–0.75 mm Hg；仅由代偿引起的PaCO2通常不超过55 mm Hg。",
    },
    note: "Supply the 40 mm Hg reference used by the rationale's closed-world compensation calculation.",
  }));
}

const nailId = "gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17";
if (questionIds.has(nailId)) {
  ops.push(setValue({
    id: nailId,
    path: ["meta", "source"],
    before: "CDC, Clinical Safety: Hand Hygiene for Healthcare Workers, fingernail safety section on artificial extensions for high-risk patients and natural nail length, https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html",
    after: "CDC, Clinical Safety: Hand Hygiene for Healthcare Workers, fingernail safety section on artificial extensions for high-risk patients, https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html; CDC, Guideline for Hand Hygiene in Health-Care Settings, Recommendations 6.A–6.B on artificial fingernails and natural nail tips less than 1/4 inch, https://www.cdc.gov/infection-control/media/pdfs/Guideline-Hand-Hygiene-P.pdf",
    note: "Pin the CDC guideline section supporting the supplied 1/4-inch natural-nail limit.",
  }));
}

const probeId = "gpt_balance6b_2026_07_16_mx_standard_precautions_hygiene_18";
if (questionIds.has(probeId)) {
  ops.push(
    setValue({
      id: probeId,
      path: ["matrix", "columns", { id: "q18_c03" }, "en"],
      before: "Sterilization or a validated sterile-device pathway",
      after: "Sterilization",
      note: "Restore the commission's critical-device boundary for entry into sterile tissue.",
    }),
    setValue({
      id: probeId,
      path: ["matrix", "columns", { id: "q18_c03" }, "zh"],
      before: "灭菌或经验证的无菌器械流程",
      after: "灭菌",
    }),
    setValue({
      id: probeId,
      path: ["rationale", "correct"],
      before: {
        en: "Reusable probes are classified by the tissue contacted. Intact-skin contact requires cleaning and low-level disinfection. Mucous-membrane or nonintact-skin contact requires cleaning and at least high-level disinfection. Entry into sterile tissue requires sterilization or a validated sterile-device pathway. A cover does not lower the required level.",
        zh: "可重复使用探头应根据接触组织分类。接触完整皮肤需要清洁和低水平消毒；接触黏膜或非完整皮肤需要清洁和至少高水平消毒；进入无菌组织需要灭菌或经验证的无菌器械流程。保护套不会降低所需再处理级别。",
      },
      after: {
        en: "Reusable probes are classified by the tissue contacted. Intact-skin contact requires cleaning and low-level disinfection. Mucous-membrane or nonintact-skin contact requires cleaning and at least high-level disinfection. Entry into sterile tissue requires sterilization. A cover does not lower the required level.",
        zh: "可重复使用探头应根据接触组织分类。接触完整皮肤需要清洁和低水平消毒；接触黏膜或非完整皮肤需要清洁和至少高水平消毒；进入无菌组织需要灭菌。保护套不会降低所需再处理级别。",
      },
    }),
    setValue({
      id: probeId,
      path: ["rationale", "byChoice", 3, "en"],
      before: "A device entering sterile tissue is critical and requires sterilization or a validated sterile-device pathway.",
      after: "A device entering sterile tissue is critical and requires sterilization.",
    }),
    setValue({
      id: probeId,
      path: ["rationale", "byChoice", 3, "zh"],
      before: "进入无菌组织的器械属于关键器械，需要灭菌或经验证的无菌器械流程。",
      after: "进入无菌组织的器械属于关键器械，需要灭菌。",
    }),
  );
}

runPatch(ops);
