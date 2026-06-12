import { fmt } from "../../primitives/graphPaper";

export type BurnPopulation = "adult" | "pediatric";

export type BurnRegionKey =
  | "head_anterior"
  | "head_posterior"
  | "trunk_anterior"
  | "trunk_posterior"
  | "arm_l_anterior"
  | "arm_l_posterior"
  | "arm_r_anterior"
  | "arm_r_posterior"
  | "leg_l_anterior"
  | "leg_l_posterior"
  | "leg_r_anterior"
  | "leg_r_posterior"
  | "genitalia";

// Pediatric values support rendering and arithmetic, but pediatric content
// remains blocked until an authoritative source is recorded in the U8 audit.
export const TBSA_PCT: Record<BurnPopulation, Record<BurnRegionKey, number>> = {
  adult: {
    head_anterior: 4.5,
    head_posterior: 4.5,
    trunk_anterior: 18,
    trunk_posterior: 18,
    arm_l_anterior: 4.5,
    arm_l_posterior: 4.5,
    arm_r_anterior: 4.5,
    arm_r_posterior: 4.5,
    leg_l_anterior: 9,
    leg_l_posterior: 9,
    leg_r_anterior: 9,
    leg_r_posterior: 9,
    genitalia: 1,
  },
  pediatric: {
    head_anterior: 9,
    head_posterior: 9,
    trunk_anterior: 18,
    trunk_posterior: 18,
    arm_l_anterior: 4.5,
    arm_l_posterior: 4.5,
    arm_r_anterior: 4.5,
    arm_r_posterior: 4.5,
    leg_l_anterior: 6.75,
    leg_l_posterior: 6.75,
    leg_r_anterior: 6.75,
    leg_r_posterior: 6.75,
    genitalia: 1,
  },
};

export const BURN_REGION_KEYS = Object.keys(TBSA_PCT.adult) as BurnRegionKey[];

type View = "anterior" | "posterior";

type Geometry =
  | { view: View; tag: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { view: View; tag: "rect"; x: number; y: number; width: number; height: number; rx: number }
  | { view: View; tag: "polygon"; points: Array<[number, number]> };

export const REGION_GEOMETRY: Record<BurnRegionKey, Geometry> = {
  head_anterior: { view: "anterior", tag: "ellipse", cx: 120, cy: 54, rx: 25, ry: 31 },
  trunk_anterior: { view: "anterior", tag: "rect", x: 84, y: 88, width: 72, height: 104, rx: 25 },
  arm_l_anterior: { view: "anterior", tag: "rect", x: 55, y: 91, width: 23, height: 111, rx: 11 },
  arm_r_anterior: { view: "anterior", tag: "rect", x: 162, y: 91, width: 23, height: 111, rx: 11 },
  leg_l_anterior: {
    view: "anterior",
    tag: "polygon",
    points: [[89, 187], [117, 187], [112, 309], [85, 309]],
  },
  leg_r_anterior: {
    view: "anterior",
    tag: "polygon",
    points: [[123, 187], [151, 187], [155, 309], [128, 309]],
  },
  genitalia: {
    view: "anterior",
    tag: "polygon",
    points: [[110, 187], [130, 187], [120, 205]],
  },
  head_posterior: { view: "posterior", tag: "ellipse", cx: 360, cy: 54, rx: 25, ry: 31 },
  trunk_posterior: { view: "posterior", tag: "rect", x: 324, y: 88, width: 72, height: 104, rx: 25 },
  arm_l_posterior: { view: "posterior", tag: "rect", x: 295, y: 91, width: 23, height: 111, rx: 11 },
  arm_r_posterior: { view: "posterior", tag: "rect", x: 402, y: 91, width: 23, height: 111, rx: 11 },
  leg_l_posterior: {
    view: "posterior",
    tag: "polygon",
    points: [[329, 187], [357, 187], [352, 309], [325, 309]],
  },
  leg_r_posterior: {
    view: "posterior",
    tag: "polygon",
    points: [[363, 187], [391, 187], [395, 309], [368, 309]],
  },
};

export const renderRegionShape = (
  key: BurnRegionKey,
  attributes: string,
): string => {
  const geometry = REGION_GEOMETRY[key];
  if (geometry.tag === "ellipse") {
    return `<ellipse data-region="${key}" cx="${fmt(geometry.cx)}" cy="${fmt(geometry.cy)}" rx="${fmt(geometry.rx)}" ry="${fmt(geometry.ry)}" ${attributes}/>`;
  }
  if (geometry.tag === "rect") {
    return `<rect data-region="${key}" x="${fmt(geometry.x)}" y="${fmt(geometry.y)}" width="${fmt(geometry.width)}" height="${fmt(geometry.height)}" rx="${fmt(geometry.rx)}" ${attributes}/>`;
  }
  const points = geometry.points.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");
  return `<polygon data-region="${key}" points="${points}" ${attributes}/>`;
};
