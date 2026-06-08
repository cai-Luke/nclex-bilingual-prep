// Barrel: side-effect imports register each kind, then re-export the registry,
// the assembled union type, and the dispatcher. The app/scripts import THIS so
// every kind is registered before render or validation runs. Static imports
// only — no dynamic import() (it can break under file:// and undermines
// determinism).
import "./kinds"; // React-free registration barrel (self-registers every kind)

export * from "./registry";
export type { QuestionVisual } from "./types";
export { VisualStimulus } from "./VisualStimulus";
