import type { ItemType, Question } from "../types";

export interface VisualError {
  /** Path relative to the visual object, e.g. "rateBpm" or "caption.en". "" means the visual itself. */
  path: string;
  /** Stable machine code; fixtures.invalid assert against this. */
  code: string;
  /** Human-readable reason fragment. The schema report composes the final string from path + message. */
  message: string;
}

export interface VisualKindModule<S extends { kind: string } = { kind: string }> {
  kind: S["kind"];
  /** Minimum bank schemaVersion that may carry this kind. Default "1.2". */
  requiredSchemaVersion?: string;
  /** Item types this kind may attach to. Default: the global visual-supporting set. */
  allowedItemTypes?: ItemType[];
  /** Structural + range validation of the spec ALONE. Maps to the schema doc's validation rules. */
  validate(spec: S): VisualError[];
  /** Optional cross-consistency check of render-vs-answer. Arithmetic gates live here. */
  selfCheck?(spec: S, question: Question): VisualError[];
  /** Pure, deterministic, XML-escaped SVG string. No DOM, no Date, no Math.random, no fetch. */
  renderSvg(spec: S): string;
  /** Colocated fixtures the conformance harness runs automatically. */
  fixtures: {
    valid: S[];
    invalid: Array<{ spec: unknown; expectCode: string }>;
  };
}

const registry = new Map<string, VisualKindModule>();

export function registerVisual(m: VisualKindModule): void {
  if (registry.has(m.kind)) throw new Error(`duplicate visual kind: ${m.kind}`);
  registry.set(m.kind, m);
}
export function getVisual(kind: string): VisualKindModule | undefined {
  return registry.get(kind);
}
export function listVisualKinds(): string[] {
  return [...registry.keys()];
}
export function allVisualModules(): VisualKindModule[] {
  return [...registry.values()];
}

/** The global default placement set, mirroring the current schema doc. */
export const VISUAL_ITEM_TYPES: ItemType[] = ["multiple_choice", "select_all", "matrix"];
