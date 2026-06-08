// Registry mechanics, exercised with a throwaway kind registered ONLY here
// (never in the production barrel). Covers unknown-kind rejection, selfCheck
// invocation + error propagation, placement rejection, schema-version gating,
// and duplicate-registration protection. Node-level only (no Playwright).
import { validateVisual } from "../../src/schema";
import { getVisual, listVisualKinds, registerVisual, type VisualKindModule } from "../../src/visuals/registry";
import type { ItemType, Question } from "../../src/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
const reasonsFor = (
  visual: unknown,
  options: { itemType?: ItemType; schemaVersion?: string; question?: Question },
) => {
  const reasons: string[] = [];
  validateVisual(visual, "visual", reasons, options);
  return reasons;
};

type TestSpec = { kind: "__test_only"; trigger?: boolean };

const testModule: VisualKindModule<TestSpec> = {
  kind: "__test_only",
  allowedItemTypes: ["multiple_choice"],
  requiredSchemaVersion: "1.2",
  validate: () => [],
  selfCheck: (spec) => (spec.trigger ? [{ path: "trigger", code: "self_check_failed", message: "is not allowed" }] : []),
  renderSvg: () => "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>",
  fixtures: { valid: [{ kind: "__test_only" }], invalid: [] },
};

registerVisual(testModule as VisualKindModule);

// getVisual / listVisualKinds see the registered kind
assert(getVisual("__test_only") !== undefined, "getVisual should resolve a registered kind");
assert(listVisualKinds().includes("__test_only"), "listVisualKinds should include a registered kind");

// duplicate registration throws
let threw = false;
try {
  registerVisual(testModule as VisualKindModule);
} catch {
  threw = true;
}
assert(threw, "duplicate registration must throw");

// unknown-kind rejection
{
  const reasons = reasonsFor({ kind: "__does_not_exist__" }, { itemType: "multiple_choice" });
  assert(reasons.includes("visual.kind is invalid"), `unknown kind should be rejected, got ${JSON.stringify(reasons)}`);
}

// placement rejection (matrix not in allowedItemTypes)
{
  const reasons = reasonsFor({ kind: "__test_only" }, { itemType: "matrix" });
  assert(
    reasons.includes("visual of kind __test_only is not allowed on matrix"),
    `placement should be rejected, got ${JSON.stringify(reasons)}`,
  );
}

// allowed placement passes with no errors
{
  const reasons = reasonsFor({ kind: "__test_only" }, { itemType: "multiple_choice" });
  assert(reasons.length === 0, `allowed placement should pass, got ${JSON.stringify(reasons)}`);
}

// schema-version gating
{
  const reasons = reasonsFor({ kind: "__test_only" }, { itemType: "multiple_choice", schemaVersion: "1.0" });
  assert(reasons.includes("visual requires schema 1.2"), `schema gate should fire, got ${JSON.stringify(reasons)}`);
}

// selfCheck invocation + error propagation (only when a question is supplied)
{
  const q = {} as Question;
  const triggered = reasonsFor({ kind: "__test_only", trigger: true }, { itemType: "multiple_choice", question: q });
  assert(triggered.includes("visual.trigger is not allowed"), `selfCheck error should propagate, got ${JSON.stringify(triggered)}`);

  const notTriggered = reasonsFor({ kind: "__test_only", trigger: false }, { itemType: "multiple_choice", question: q });
  assert(notTriggered.length === 0, `selfCheck should be silent when not triggered, got ${JSON.stringify(notTriggered)}`);

  // without a question, selfCheck is not invoked
  const noQuestion = reasonsFor({ kind: "__test_only", trigger: true }, { itemType: "multiple_choice" });
  assert(noQuestion.length === 0, `selfCheck must not run without a question, got ${JSON.stringify(noQuestion)}`);
}

console.log("registry-mechanics tests passed");
