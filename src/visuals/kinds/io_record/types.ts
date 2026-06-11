export interface IoEntry {
  /** Display detail, e.g. "PO water", "0.9% NaCl IV", "Foley urine". */
  label: string;
  /** Whole milliliters. Totals are always derived from entries. */
  volumeMl: number;
}

export interface IoRecordSpec {
  kind: "io_record";
  /** Display-only label for the charted period. */
  periodLabel?: { en: string; zh?: string };
  intake: IoEntry[];
  output: IoEntry[];
  caption?: { en: string; zh?: string };
}
