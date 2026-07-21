import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { collectQuestionPopulation } from "../../lib/question-population";
import type { BankEnvelope, Question, StandaloneQuestion } from "../../src/types";

const BANKS_DIR = path.join(process.cwd(), "banks");
const QUEUE_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");

const enSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });
const zhSegmenter = new Intl.Segmenter("zh", { granularity: "sentence" });

function getSentences(text: string, lang: "en" | "zh") {
  if (!text) return [];
  const segmenter = lang === "en" ? enSegmenter : zhSegmenter;
  const segments = Array.from(segmenter.segment(text));
  const sentences = segments
    .filter((s) => s.segment.trim().length > 0)
    .map((s) => ({
      text: s.segment.trim(),
      startOffset: s.index,
      endOffset: s.index + s.segment.length,
    }));
  return sentences;
}

function computeControl(bankPath: string, topLevelId: string, embeddedId: string | null, recordKind: string) {
  const hashInput = `${bankPath}|${topLevelId}|${embeddedId || ""}|${recordKind}`;
  const hash = crypto.createHash("sha256").update(hashInput).digest();
  return hash[0] % 10 === 0;
}

function buildResponseContext(question: StandaloneQuestion) {
  const ctx: any = { type: question.itemType };
  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      ctx.options = question.options;
      ctx.correct = question.correct;
      break;
    case "fill_in_blank":
      ctx.blanks = question.blanks.map(b => ({ prompt: b.prompt, acceptable: b.acceptable, numeric: b.numeric }));
      break;
    case "matrix":
      ctx.matrix = question.matrix;
      ctx.correct = question.correct;
      break;
    case "dropdown_cloze":
      ctx.clozeStem = question.clozeStem;
      ctx.dropdowns = question.dropdowns;
      break;
    case "highlight":
      ctx.highlight = question.highlight;
      break;
    case "bowtie":
      ctx.bowtie = question.bowtie;
      break;
  }
  return ctx;
}

function getMechanicalSignals(stemEn: string, terminalEn: string, question: StandaloneQuestion | Question, enCount: number, zhCount: number) {
  const signals: any = {
    rawPlaceholderInStem: stemEn.includes("{{"),
    terminalContainsRawPlaceholder: terminalEn.includes("{{"),
    terminalBeginsThisItemOrQuestion: /^this (item|question)/i.test(terminalEn),
    terminalMentionsLearnerExpectation: /you (must|should|will)/i.test(terminalEn),
    terminalFollowsExplicitResponseDemand: false,
    bilingualSentenceAlignmentMatch: enCount === zhCount
  };

  if (question.itemType === "dropdown_cloze") {
    signals.normalizedTerminalEqualsClozeStem = terminalEn.trim() === question.clozeStem.en.trim();
    signals.normalizedTerminalContainedInClozeStem = question.clozeStem.en.includes(terminalEn.trim());
    signals.clozeStemContainedInStem = stemEn.includes(question.clozeStem.en.trim());
  }

  signals.exactEnglishTerminalRepeatedElsewhereInItem = false;
  if (question.itemType === "dropdown_cloze" && question.clozeStem.en.includes(terminalEn)) {
     signals.exactEnglishTerminalRepeatedElsewhereInItem = true;
  }
  return signals;
}

function getSegmentationConfidence(terminalEn: string) {
  if (!terminalEn) return "LOW";
  const lastChar = terminalEn.trim().slice(-1);
  if (['.', '?', '!'].includes(lastChar)) {
    return "HIGH";
  }
  return "MEDIUM";
}

async function main() {
  const files = fs.readdirSync(BANKS_DIR).filter((f) => f.endsWith(".json"));
  files.sort();

  const out = fs.createWriteStream(QUEUE_FILE, { encoding: "utf-8" });
  let queueIndex = 1;

  for (const file of files) {
    const bankPath = `banks/${file}`;
    const bankContent = fs.readFileSync(path.join(BANKS_DIR, file), "utf-8");
    const bankSha256 = crypto.createHash("sha256").update(bankContent).digest("hex");
    const bank = JSON.parse(bankContent) as BankEnvelope;

    const records = collectQuestionPopulation(bank);

    for (const record of records) {
      const q = record.question;
      const topLevelId = record.parentId ? record.parentId : q.id;
      const embeddedId = record.parentId ? q.id : null;
      const itemType = q.itemType;

      const stemEn = (q as any).stem?.en || "";
      const stemZh = (q as any).stem?.zh || "";

      let responseContext = {};
      if (itemType !== "case_study") {
        responseContext = buildResponseContext(q as StandaloneQuestion);
      }

      const enSentences = getSentences(stemEn, "en");
      const zhSentences = getSentences(stemZh, "zh");

      if (enSentences.length === 0) continue;

      const terminalEnObj = enSentences[enSentences.length - 1];
      const terminalEn = terminalEnObj.text;
      const terminalZhObj = zhSentences.length > 0 ? zhSentences[zhSentences.length - 1] : null;
      const terminalZh = terminalZhObj ? terminalZhObj.text : "";

      const penultimateEnObj = enSentences.length > 1 ? enSentences[enSentences.length - 2] : null;
      const penultimateZhObj = zhSentences.length > 1 ? zhSentences[zhSentences.length - 2] : null;

      const controlSelected = enSentences.length > 1 && computeControl(bankPath, topLevelId, embeddedId, record.kind);

      const mechanicalSignals = getMechanicalSignals(stemEn, terminalEn, q, enSentences.length, zhSentences.length);
      if (penultimateEnObj) {
         mechanicalSignals.terminalFollowsExplicitResponseDemand = /(select|place|calculate|highlight|complete)/i.test(penultimateEnObj.text);
      }

      const segmentationConfidence = getSegmentationConfidence(terminalEn);

      const row = {
        queueIndex,
        bankPath,
        bankSha256,
        topLevelQuestionId: topLevelId,
        embeddedQuestionId: embeddedId,
        recordKind: record.kind === "top_level_case_container" ? "TOP_LEVEL_CASE_CONTAINER" :
                    record.kind === "top_level_scored_leaf" ? "TOP_LEVEL_SCORED_LEAF" : "EMBEDDED_SCORED_LEAF",
        questionPath: record.path,
        itemType,
        category: (q as any).category || "mixed",
        topic: (q as any).topic || "mixed",
        difficulty: (q as any).difficulty || "medium",
        ngnSkill: (q as any).ngnSkill || null,
        stemPathEn: `${record.path}.stem.en`,
        stemPathZh: `${record.path}.stem.zh`,
        segmentationMethod: "Intl.Segmenter",
        segmentationConfidence,
        terminalOffsetsEn: [terminalEnObj.startOffset, terminalEnObj.endOffset],
        terminalOffsetsZh: terminalZhObj ? [terminalZhObj.startOffset, terminalZhObj.endOffset] : null,
        fullStemEn: stemEn,
        fullStemZh: stemZh,
        terminalSentenceEn: terminalEn,
        terminalSentenceZh: terminalZh,
        penultimateSentenceEn: penultimateEnObj ? penultimateEnObj.text : null,
        penultimateSentenceZh: penultimateZhObj ? penultimateZhObj.text : null,
        responseContext,
        rationaleCorrectEn: (q as any).rationale?.correct?.en || null,
        rationaleCorrectZh: (q as any).rationale?.correct?.zh || null,
        testTakingStrategyEn: (q as any).testTakingStrategy?.en || null,
        testTakingStrategyZh: (q as any).testTakingStrategy?.zh || null,
        sourceMetadata: (q as any).meta?.source || null,
        mechanicalSignals,
        controlSelected,
        controlSentenceEn: controlSelected && penultimateEnObj ? penultimateEnObj.text : null,
        controlSentenceZh: controlSelected && penultimateZhObj ? penultimateZhObj.text : null,
      };

      out.write(JSON.stringify(row) + "\n");
      queueIndex++;
    }
  }

  out.end();
  console.log(`Generated ${queueIndex - 1} queue rows.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
