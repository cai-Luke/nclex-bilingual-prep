export interface CapnographySpec {
  kind: "capnography";
  pattern: "normal" | "shark_fin" | "flat" | "rosc" | "rebreathing";
  /** Plateau EtCO2 in mmHg. The number rendered on the strip. */
  etco2: number;
  /** Breaths per minute; sets cycle period along the time axis. */
  respiratoryRate: number;
  /** Seconds of trace to render (sets x-axis span). Default 15. */
  durationSec?: number;
  /**
   * shark_fin only: 0..1 obstruction severity.
   * Controls Phase II slope and Phase III up-slope (loss of plateau).
   */
  severity?: number;
  /**
   * rebreathing only: inspiratory baseline offset in mmHg (> 0).
   * The baseline the waveform returns to instead of 0.
   */
  baselineEtco2?: number;
  /**
   * rosc only: { lowEtco2, highEtco2, stepAtSec } — amplitude before/after
   * the step-up and where along the strip the rise occurs.
   */
  rosc?: { lowEtco2: number; highEtco2: number; stepAtSec: number };
  caption?: {
    en: string;
    zh?: string;
  };
}
