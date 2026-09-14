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

// Original chart geometry in a shared body-local coordinate system.
// Reflection below is anatomical: anterior patient-left is viewer-right;
// posterior patient-left is viewer-left. Every fill owner is disjoint.
type View = "anterior" | "posterior";
type Geometry = { view: View; d: string };
type Segment = readonly ["M" | "L" | "Q" | "C" | "Z", ...number[]];
type Contour = readonly Segment[];
const CENTERS: Record<View, number> = { anterior: 210, posterior: 590 };

// Coordinates are absolute within each local contour; the same point/curve
// is used on both sides of each selectable seam (including the groin).
const head: Contour = [
  ["M", -11, 143], ["L", -11, 130],
  ["C", -19, 124, -25, 109, -25, 92],
  ["C", -25, 75, -16, 65, 0, 65],
  ["C", 16, 65, 25, 75, 25, 92],
  ["C", 25, 109, 19, 124, 11, 130],
  ["L", 11, 143], ["Q", 0, 147, -11, 143], ["Z"],
];
const trunkStart: Contour = [
  ["M", -11, 143], ["C", -22, 146, -45, 146, -60, 152],
  ["C", -52, 160, -48, 175, -49, 189],
  ["C", -48, 211, -39, 235, -40, 254],
  ["C", -40, 269, -43, 279, -45, 288],
];
const trunkEnd: Contour = [
  ["C", 43, 279, 40, 269, 40, 254],
  ["C", 39, 235, 48, 211, 49, 189],
  ["C", 48, 175, 52, 160, 60, 152],
  ["C", 45, 146, 22, 146, 11, 143],
  ["Q", 0, 147, -11, 143], ["Z"],
];
const frontTrunk: Contour = [
  ...trunkStart,
  ["C", -35, 294, -23, 301, -12, 309],
  ["Q", 0, 313, 12, 309],
  ["C", 23, 301, 35, 294, 45, 288],
  ...trunkEnd,
];
const backTrunk: Contour = [
  ...trunkStart,
  ["C", -43, 308, -21, 326, 0, 316],
  ["C", 21, 326, 43, 308, 45, 288],
  ...trunkEnd,
];

// Grouped hand adapted from Gemini's frozen R1 contour with owner permission.
// The affine placement fits Astra's wrist and follows its abducted forearm.
// One continuous arm fill owns the hand; no wrist seam or finger-detail ink.
const groupedHand: Contour = [
  ["C", -102, 324, -107, 330, -111, 339],
  ["C", -112, 343, -109, 345, -106, 345],
  ["C", -104, 345, -102, 344, -102, 348],
  ["C", -102, 356, -102, 364, -101, 370],
  ["C", -100, 374, -97, 375, -96, 373],
  ["C", -93, 371, -90, 368, -89, 364],
  ["C", -87, 352, -86, 336, -85, 320],
];
const fittedHand: Contour = groupedHand.map(([op, ...values]) => [
  op, ...values.map((v, i) => i % 2 === 0
    ? Math.round((-116 + 0.9 * (v + 97) - 0.15 * (values[i + 1] - 320)) * 100) / 100
    : Math.round((318 + 0.72 * (v - 320)) * 100) / 100),
]);
const arm: Contour = [
  ["M", -60, 152],
  // Fuller upper arm and forearm, with a gradual taper to the same wrist.
  ["C", -73, 155, -82, 168, -85, 183],
  ["C", -88, 197, -91, 211, -95, 225],
  ["C", -97, 233, -99, 241, -102, 249],
  ["C", -108, 266, -112, 284, -114, 297],
  ["Q", -115, 308, -116, 318],
  ...fittedHand,
  ["C", -102, 310, -96, 303, -92, 298],
  ["C", -85, 284, -80, 265, -78, 249],
  ["Q", -74, 237, -74, 225],
  ["C", -69, 210, -57, 198, -49, 189],
  ["C", -48, 175, -52, 160, -60, 152], ["Z"],
];
const perineum: Contour = [
  ["M", -12, 309], ["Q", 0, 313, 12, 309],
  ["C", 10, 320, 5, 327, 0, 331],
  ["C", -5, 327, -10, 320, -12, 309], ["Z"],
];
// Viewer-left leg. The anterior boundary meets the perineal point. The
// posterior upper curve is exactly the reversed gluteal boundary above.
const legUpper: Contour = [
  ["C", -48, 307, -47, 341, -43, 383],
  ["C", -40, 410, -35, 427, -35, 441],
  ["C", -38, 457, -36, 475, -31, 496],
  ["L", -30, 522],
];
const frontFoot: Contour = [
  ["C", -30, 533, -33, 541, -39, 549],
  ["Q", -44, 555, -41, 559], ["Q", -31, 564, -17, 560],
  ["C", -12, 558, -17, 546, -17, 537],
];
const backFoot: Contour = [
  ["C", -30, 534, -33, 541, -36, 548],
  ["C", -39, 554, -35, 559, -30, 560],
  ["Q", -23, 563, -18, 559],
  ["C", -14, 555, -17, 546, -17, 537],
];
const legInside: Contour = [
  ["L", -16, 516],
  ["C", -18, 496, -13, 478, -12, 462],
  ["C", -11, 451, -14, 445, -14, 434],
  ["C", -14, 406, -6, 363, 0, 331],
];
const frontLeg: Contour = [
  ["M", -45, 288], ...legUpper, ...frontFoot, ...legInside,
  ["C", -5, 327, -10, 320, -12, 309],
  ["C", -23, 301, -35, 294, -45, 288], ["Z"],
];
const backLeg: Contour = [
  ["M", -45, 288], ...legUpper, ...backFoot, ...legInside,
  ["L", 0, 316], ["C", -21, 326, -43, 308, -45, 288], ["Z"],
];

const place = (shape: Contour, view: View, reflect = false): string =>
  shape.map(([op, ...values]) => op + (values.length ? " " + values.map(
    (value, i) => i % 2 === 0 ? CENTERS[view] + (reflect ? -value : value) : value,
  ).join(" ") : "")).join(" ");
const region = (shape: Contour, view: View, reflect = false): Geometry =>
  ({ view, d: place(shape, view, reflect) });

export const REGION_GEOMETRY: Record<BurnRegionKey, Geometry> = {
  head_anterior: region(head, "anterior"),
  head_posterior: region(head, "posterior"),
  trunk_anterior: region(frontTrunk, "anterior"),
  trunk_posterior: region(backTrunk, "posterior"),
  arm_l_anterior: region(arm, "anterior", true),
  arm_l_posterior: region(arm, "posterior"),
  arm_r_anterior: region(arm, "anterior"),
  arm_r_posterior: region(arm, "posterior", true),
  leg_l_anterior: region(frontLeg, "anterior", true),
  leg_l_posterior: region(backLeg, "posterior"),
  leg_r_anterior: region(frontLeg, "anterior"),
  leg_r_posterior: region(backLeg, "posterior", true),
  genitalia: region(perineum, "anterior"),
};

const ink = (shape: Contour, view: View): string => `<path d="${place(shape, view)}"/>`;
export const BODY_INK: Record<View, string> = {
  anterior: ink([
    ["M", -8, 158], ["Q", -21, 153, -33, 158],
    ["M", 8, 158], ["Q", 21, 153, 33, 158],
    ["M", -9, 129], ["Q", 0, 133, 9, 129],
  ], "anterior"),
  posterior: ink([
    ["M", 0, 154], ["C", -2, 181, 2, 211, 0, 235],
    ["M", -23, 173], ["Q", -15, 190, -23, 204],
    ["M", 23, 173], ["Q", 15, 190, 23, 204],
    ["M", 0, 297], ["L", 0, 316],
  ], "posterior"),
};

export const renderRegionShape = (key: BurnRegionKey, attributes: string): string =>
  `<path data-region="${key}" d="${REGION_GEOMETRY[key].d}" ${attributes}/>`;
