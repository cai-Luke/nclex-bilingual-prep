import { readFile } from "node:fs/promises";

interface Question {
  id: string;
  itemType: string;
  category: string;
  topic: string;
  difficulty: string;
  stem: { en: string; zh: string };
  options?: any[];
  correct?: any;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were",
  "of", "to", "for", "in", "on", "at", "by", "with", "this", "that",
  "these", "those", "client", "nurse", "patient", "has", "have", "had",
  "which", "who", "whom", "whose", "what", "where", "when", "why",
  "how", "should", "would", "could", "will", "shall", "can", "may",
  "might", "must", "about", "above", "after", "again", "against",
  "all", "am", "any", "as", "be", "because", "been", "before", "being",
  "below", "between", "both", "during", "each", "few", "from", "further",
  "if", "into", "more", "most", "other", "some", "such", "than", "too",
  "very", "s", "t", "don", "shouldn", "now"
]);

function tokenize(text: string): Set<string> {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const tokens = normalized.split(/\s+/).filter(token => token.length > 2 && !STOP_WORDS.has(token));
  return new Set(tokens);
}

function getJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function getOverlapCoefficient(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  return intersection.size / Math.min(setA.size, setB.size);
}

async function main() {
  const filePath = "banks/gemini-canonical.json";
  try {
    const data = JSON.parse(await readFile(filePath, "utf8"));
    const questions: Question[] = data.questions || [];
    console.log(`Analyzing ${questions.length} questions in ${filePath} for redundancies...\n`);

    const tokenSets = questions.map(q => ({
      q,
      tokens: tokenize(q.stem.en)
    }));

    const duplicates: Array<{
      q1: Question;
      q2: Question;
      jaccard: number;
      overlap: number;
    }> = [];

    for (let i = 0; i < tokenSets.length; i++) {
      for (let j = i + 1; j < tokenSets.length; j++) {
        const t1 = tokenSets[i];
        const t2 = tokenSets[j];
        
        const jaccard = getJaccardSimilarity(t1.tokens, t2.tokens);
        const overlap = getOverlapCoefficient(t1.tokens, t2.tokens);

        // Filter criteria: High similarity in both, or very high overlap
        if (jaccard > 0.45 || overlap > 0.8) {
          duplicates.push({
            q1: t1.q,
            q2: t2.q,
            jaccard,
            overlap
          });
        }
      }
    }

    // Sort by Jaccard similarity descending
    duplicates.sort((a, b) => b.jaccard - a.jaccard);

    console.log(`Found ${duplicates.length} potential duplicate pairs:\n`);
    for (const dup of duplicates) {
      console.log(`=========================================`);
      console.log(`Pair: [${dup.q1.id}] and [${dup.q2.id}]`);
      console.log(`Type: ${dup.q1.itemType} vs ${dup.q2.itemType}`);
      console.log(`Topic: "${dup.q1.topic}" vs "${dup.q2.topic}"`);
      console.log(`Metrics: Jaccard: ${dup.jaccard.toFixed(3)}, Overlap: ${dup.overlap.toFixed(3)}`);
      console.log(`--- Stem 1 [${dup.q1.id}]:`);
      console.log(dup.q1.stem.en);
      console.log(`--- Stem 2 [${dup.q2.id}]:`);
      console.log(dup.q2.stem.en);
      console.log(`\n`);
    }

  } catch (err) {
    console.error("Error reading/processing file:", err);
  }
}

main();
