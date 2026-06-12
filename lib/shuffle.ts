import type { Question, OptionQuestion, CaseStudyQuestion, StandaloneQuestion } from "../src/types";

// FNV-1a 32-bit hash — stable, deterministic string → seed
export function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// splitmix32 PRNG — each call advances state, returns value in [0, 2^32)
export function makePrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
    return (z ^ (z >>> 16)) >>> 0;
  };
}

// Knuth–Fisher–Yates — returns a new array, never mutates input
export function fisherYates<T>(arr: readonly T[], rand: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rand() % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function deterministicShuffle<T>(arr: readonly T[], seedMaterial: string): T[] {
  return fisherYates(arr, makePrng(fnv1a32(seedMaterial)));
}

function shuffleOptionItem(q: OptionQuestion): OptionQuestion {
  const shuffledOptions = deterministicShuffle(q.options, q.id);

  // Reorder byChoice to match the new option order (cleanliness only;
  // byChoice is refId-keyed so correctness is unaffected by array order).
  const { byChoice } = q.rationale;
  let shuffledByChoice = byChoice;
  if (byChoice !== undefined) {
    const map = new Map(byChoice.map((c) => [c.refId, c]));
    const matched = shuffledOptions.map((opt) => map.get(opt.id)).filter((c): c is NonNullable<typeof c> => c !== undefined);
    // Defensive: preserve any byChoice entries whose refId has no matching option
    const unmatched = byChoice.filter((c) => !shuffledOptions.some((opt) => opt.id === c.refId));
    shuffledByChoice = [...matched, ...unmatched];
  }

  return {
    ...q,
    options: shuffledOptions,
    rationale: {
      ...q.rationale,
      ...(shuffledByChoice !== undefined ? { byChoice: shuffledByChoice } : {}),
    },
  };
}

function shuffleCaseStudy(q: CaseStudyQuestion): CaseStudyQuestion {
  return {
    ...q,
    caseStudy: {
      ...q.caseStudy,
      questions: q.caseStudy.questions.map((nested) => shuffle(nested) as StandaloneQuestion),
    },
  };
}

/**
 * Pure, deterministic shuffle of a bank item.
 *
 * - Option-type items (multiple_choice, select_all, ordered_response): options array
 *   is reordered via Fisher-Yates seeded by item.id. Option IDs and the correct
 *   array are unchanged — IDs remain tied to their option content.
 * - Case studies: each nested question is recursively shuffled.
 * - All other item types (fill_in_blank, matrix, dropdown_cloze): returned unchanged.
 *
 * Idempotent for a given seed: shuffle(shuffle(q)) === shuffle(q).
 * Actually NOT idempotent in general — calling shuffle twice applies the permutation
 * twice. To get the canonical promoted form, call shuffle exactly once from the draft.
 */
export function shuffle(q: Question): Question {
  if (
    q.itemType === "multiple_choice" ||
    q.itemType === "select_all" ||
    q.itemType === "ordered_response"
  ) {
    return shuffleOptionItem(q);
  }
  if (q.itemType === "case_study") {
    return shuffleCaseStudy(q);
  }
  return q;
}
