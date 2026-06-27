import type { InjectionRoute } from "./routes";
import type { VesselRelation } from "./types";

export interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface Point {
  x: number;
  y: number;
}

export const IV_VESSEL_RADII = { rx: 25, ry: 11 } as const;
export const IV_VESSEL_DEPTH_Y = 162;

export const BYSTANDER_VESSEL: Ellipse = {
  cx: 205,
  cy: 190,
  rx: 22,
  ry: 10,
} as const;

export const getRenderedVesselGeometry = (
  route: InjectionRoute,
  vessel: VesselRelation | undefined,
  tip: Point,
): Ellipse | null => {
  if (vessel === "target") {
    return {
      cx: tip.x,
      cy: tip.y,
      rx: IV_VESSEL_RADII.rx,
      ry: IV_VESSEL_RADII.ry,
    };
  }
  if (vessel === "bystander") return BYSTANDER_VESSEL;
  return null;
};

export const segmentIntersectsEllipse = (
  p0: Point,
  p1: Point,
  e: Ellipse,
): boolean => {
  const ax = (p0.x - e.cx) / e.rx;
  const ay = (p0.y - e.cy) / e.ry;
  const bx = (p1.x - e.cx) / e.rx;
  const by = (p1.y - e.cy) / e.ry;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0
    ? 0
    : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  return qx * qx + qy * qy <= 1;
};

export const tipInsideEllipse = (tip: Point, e: Ellipse): boolean =>
  ((tip.x - e.cx) / e.rx) ** 2 + ((tip.y - e.cy) / e.ry) ** 2 <= 1;
