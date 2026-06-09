import type { RhythmStripVisual } from "./kinds/rhythmStrip";
import type { CapnographySpec } from "./kinds/capnography/types";
import type { VitalsTrendSpec } from "./kinds/vitals_trend/types";
import type { LabTrendSpec } from "./kinds/lab_trend/types";

// Append-only: add ` | CapnographyVisual` etc. as kinds land. This is the ONLY
// shared compile-time touch-point when adding a visual kind.
export type QuestionVisual = RhythmStripVisual | CapnographySpec | VitalsTrendSpec | LabTrendSpec;

export interface VisualBase {
  kind: string;
  caption?: { en: string; zh?: string };
}
