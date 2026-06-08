import type { RhythmStripVisual } from "./kinds/rhythmStrip";

// Append-only: add ` | CapnographyVisual` etc. as kinds land. This is the ONLY
// shared compile-time touch-point when adding a visual kind.
export type QuestionVisual = RhythmStripVisual;

export interface VisualBase {
  kind: string;
  caption?: { en: string; zh?: string };
}
