export type InjectionRoute =
  | "intradermal"
  | "subcutaneous"
  | "intramuscular"
  | "intravenous";

export type SkinLayerKey = "epidermis" | "dermis" | "subcutaneous" | "muscle";

export type InjectionTarget = SkinLayerKey | "vessel";

export interface RouteGeometry {
  /** Angle measured from the skin-surface plane. */
  angleDeg: number;
  target: InjectionTarget;
}

// Fixed teaching geometry. Source verification is required before content opens.
export const ROUTE_TABLE: Record<InjectionRoute, RouteGeometry> = {
  intradermal: { angleDeg: 10, target: "dermis" },
  subcutaneous: { angleDeg: 45, target: "subcutaneous" },
  intramuscular: { angleDeg: 90, target: "muscle" },
  intravenous: { angleDeg: 25, target: "vessel" },
};

export const INJECTION_ROUTES = Object.keys(ROUTE_TABLE) as InjectionRoute[];

export interface LayerBand {
  key: SkinLayerKey;
  y0: number;
  y1: number;
  fill: string;
  label: string;
}

export const LAYER_BANDS: LayerBand[] = [
  { key: "epidermis", y0: 80, y1: 96, fill: "#f8d7b5", label: "Epidermis" },
  { key: "dermis", y0: 96, y1: 150, fill: "#efb38f", label: "Dermis" },
  {
    key: "subcutaneous",
    y0: 150,
    y1: 235,
    fill: "#f6df8d",
    label: "Subcutaneous tissue",
  },
  { key: "muscle", y0: 235, y1: 330, fill: "#b96868", label: "Muscle" },
];
