export type MarRoute =
  | "PO" | "IV" | "IVPB" | "IM" | "SubQ" | "SL" | "PR" | "topical" | "inhaled" | "ophthalmic" | "NG";
export type MarStatus = "given" | "held" | "due" | "missed" | "late" | "not_given";

export interface MarMedication {
  /** Generic name (brand optional in parentheses). Display string. */
  name: string;
  /** Display dose, e.g. "40 mg", "5000 units". Dose ARITHMETIC is U6's job, not mar's. */
  dose: string;
  route: MarRoute;
  /** e.g. "q6h", "daily", "BID", "PRN q4h". Display string. */
  frequency: string;
  /** Administration events; each time must be a member of MarSpec.timeGrid. */
  administrations: { time: string; status: MarStatus }[];
  /** Visual emphasis + audit aid only; not a clinical assertion. */
  isHighAlert?: boolean;
}

export interface MarSpec {
  kind: "mar";
  /** Column labels for time slots, e.g. ["0600","1200","1800","2400"]. Non-empty, unique. */
  timeGrid: string[];
  /** >=1 medication rows. */
  medications: MarMedication[];
  caption?: { en: string; zh?: string };
}
