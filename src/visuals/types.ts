import type { RhythmStripVisual } from "./kinds/rhythmStrip";
import type { CapnographySpec } from "./kinds/capnography/types";
import type { VitalsTrendSpec } from "./kinds/vitals_trend/types";
import type { LabTrendSpec } from "./kinds/lab_trend/types";
import type { MarSpec } from "./kinds/mar/types";
import type { IoRecordSpec } from "./kinds/io_record/types";
import type { MedLabelSpec } from "./kinds/medication_label/types";
import type { DeviceScreenSpec } from "./kinds/device_screen/types";
import type { BurnMapSpec } from "./kinds/burn_map/types";

// Append-only: add ` | CapnographyVisual` etc. as kinds land. This is the ONLY
// shared compile-time touch-point when adding a visual kind.
export type QuestionVisual = RhythmStripVisual | CapnographySpec | VitalsTrendSpec | LabTrendSpec | MarSpec | IoRecordSpec | MedLabelSpec | DeviceScreenSpec | BurnMapSpec;

export interface VisualBase {
  kind: string;
  caption?: { en: string; zh?: string };
}
