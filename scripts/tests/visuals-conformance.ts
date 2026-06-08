// Generic conformance harness: every registered visual kind is validated through
// its own colocated fixtures. When a future kind is added with fixtures, it is
// covered here automatically — no new test code.
import "../../src/visuals/kinds"; // register all production kinds (React-free barrel)
import { allVisualModules } from "../../src/visuals/registry";
import type { Question } from "../../src/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const modules = allVisualModules();
assert(modules.length > 0, "no visual kinds registered");

// A throwaway Question for selfCheck smoke-runs (no kind in U0 uses it).
const dummyQuestion = {
  id: "q",
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "t",
  difficulty: "medium",
  stem: { en: "e", zh: "z" },
  rationale: { correct: { en: "e", zh: "z" } },
  testTakingStrategy: { en: "e", zh: "z" },
  glossary: [],
  options: [{ id: "A", en: "a", zh: "a" }],
  correct: ["A"],
} as unknown as Question;

for (const mod of modules) {
  // valid fixtures pass validate with zero errors
  for (const [i, spec] of mod.fixtures.valid.entries()) {
    const errs = mod.validate(spec as never);
    assert(errs.length === 0, `${mod.kind} valid fixture[${i}] produced errors: ${JSON.stringify(errs)}`);

    // renderSvg is well-formed and free of formatting failures
    const svg = mod.renderSvg(spec as never);
    assert(svg.startsWith("<svg"), `${mod.kind} valid fixture[${i}] renderSvg must start with <svg`);
    assert(svg.trimEnd().endsWith("</svg>"), `${mod.kind} valid fixture[${i}] renderSvg must close </svg>`);
    assert(!svg.includes("NaN") && !svg.includes("undefined"), `${mod.kind} valid fixture[${i}] renderSvg leaked NaN/undefined`);

    // determinism: identical input → identical output, twice (incl. re-seed)
    assert(mod.renderSvg(spec as never) === svg, `${mod.kind} valid fixture[${i}] renderSvg is non-deterministic`);
    assert(mod.renderSvg(spec as never) === svg, `${mod.kind} valid fixture[${i}] renderSvg drifted on re-seed`);

    // selfCheck, if present, runs without throwing on valid fixtures
    if (mod.selfCheck) {
      mod.selfCheck(spec as never, dummyQuestion);
    }
  }

  // invalid fixtures produce an error with the expected code
  for (const [i, { spec, expectCode }] of mod.fixtures.invalid.entries()) {
    const errs = mod.validate(spec as never);
    assert(
      errs.some((e) => e.code === expectCode),
      `${mod.kind} invalid fixture[${i}] expected code ${expectCode}, got ${JSON.stringify(errs.map((e) => e.code))}`,
    );
  }
}

console.log(`visuals-conformance tests passed (${modules.length} kind(s): ${modules.map((m) => m.kind).join(", ")})`);
