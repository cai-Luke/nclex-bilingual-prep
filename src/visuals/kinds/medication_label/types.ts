export type MedLabelAmountUnit = "mg" | "mcg" | "g" | "units" | "mEq" | "mmol";
export type MedLabelPerUnit = "mL" | "tablet" | "capsule";

export interface MedLabelExtraField {
  /** Printed ancillary fact only; never a load-bearing value. */
  label: string;
  value: string;
}

export interface MedLabelSpec {
  kind: "medication_label";
  drugName: string;
  amount: number;
  amountUnit: MedLabelAmountUnit;
  perQty: number;
  perUnit: MedLabelPerUnit;
  showDerivedConcentration?: boolean;
  fields?: MedLabelExtraField[];
  caption?: { en: string; zh?: string };
}
