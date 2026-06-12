import type { RhythmStripVisual } from "./kinds/rhythmStrip";
import type { CapnographySpec } from "./kinds/capnography/types";
import type { VitalsTrendSpec } from "./kinds/vitals_trend/types";
import type { LabTrendSpec } from "./kinds/lab_trend/types";
import type { MarSpec } from "./kinds/mar/types";
import type { IoRecordSpec } from "./kinds/io_record/types";
import type { MedLabelSpec } from "./kinds/medication_label/types";

// Append-only: add ` | CapnographyVisual` etc. as kinds land. This is the ONLY
// shared compile-time touch-point when adding a visual kind.
export type QuestionVisual = RhythmStripVisual | CapnographySpec | VitalsTrendSpec | LabTrendSpec | MarSpec | IoRecordSpec | MedLabelSpec;

export interface VisualBase {
  kind: string;
  caption?: { en: string; zh?: string };
}
