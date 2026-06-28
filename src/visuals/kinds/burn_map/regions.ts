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

type Geometry = { view: View; d: string };

export const REGION_GEOMETRY: Record<BurnRegionKey, Geometry> = {
  head_anterior: {
    view: "anterior",
    d: "M 238,145 C 238,136 239,130 235,123 C 224,108 218,92 218,66 C 218,34 282,34 282,66 C 282,92 276,108 265,123 C 261,130 262,136 262,145 Z",
  },
  head_posterior: {
    view: "posterior",
    d: "M 588,145 C 588,136 589,130 585,123 C 574,108 568,92 568,66 C 568,34 632,34 632,66 C 632,92 626,108 615,123 C 611,130 612,136 612,145 Z",
  },
  trunk_anterior: {
    view: "anterior",
    d: "M 235,145 Q 215,145 180,155 L 190,180 L 200,310 L 235,320 Q 250,310 265,320 L 300,310 L 310,180 L 320,155 Q 285,145 265,145 Z",
  },
  trunk_posterior: {
    view: "posterior",
    d: "M 585,145 Q 565,145 530,155 L 540,180 L 550,310 Q 550,360 600,350 Q 650,360 650,310 L 660,180 L 670,155 Q 635,145 615,145 Z",
  },
  arm_l_anterior: {
    view: "anterior",
    d: "M 310,180 L 360,260 L 370,300 L 375,330 Q 385,340 393,325 L 390,310 L 397,312 Q 400,305 395,298 L 385,290 Q 370,220 320,155 L 310,180 Z",
  },
  arm_l_posterior: {
    view: "posterior",
    d: "M 540,180 L 490,260 L 480,300 L 475,330 Q 465,340 457,325 L 460,310 L 453,312 Q 450,305 455,298 L 465,290 Q 480,220 530,155 L 540,180 Z",
  },
  arm_r_anterior: {
    view: "anterior",
    d: "M 190,180 L 140,260 L 130,300 L 125,330 Q 115,340 107,325 L 110,310 L 103,312 Q 100,305 105,298 L 115,290 Q 130,220 180,155 L 190,180 Z",
  },
  arm_r_posterior: {
    view: "posterior",
    d: "M 660,180 L 710,260 L 720,300 L 725,330 Q 735,340 743,325 L 740,310 L 747,312 Q 750,305 745,298 L 735,290 Q 720,220 670,155 L 660,180 Z",
  },
  leg_l_anterior: {
    view: "anterior",
    d: "M 265,320 L 300,310 L 295,440 L 285,550 L 295,580 Q 280,585 265,580 L 265,550 L 260,440 L 250,360 Q 260,350 265,320 Z",
  },
  leg_l_posterior: {
    view: "posterior",
    d: "M 550,310 Q 550,360 600,350 L 590,440 L 585,550 L 595,580 Q 580,585 565,580 L 565,550 L 555,440 Z",
  },
  leg_r_anterior: {
    view: "anterior",
    d: "M 200,310 L 235,320 Q 240,350 250,360 L 240,440 L 235,550 L 235,580 Q 220,585 205,580 L 215,550 L 205,440 Z",
  },
  leg_r_posterior: {
    view: "posterior",
    d: "M 600,350 Q 650,360 650,310 L 645,440 L 635,550 L 635,580 Q 620,585 605,580 L 615,550 L 610,440 Z",
  },
  genitalia: {
    view: "anterior",
    d: "M 235,320 Q 250,310 265,320 Q 260,350 250,360 Q 240,350 235,320 Z",
  },
};

export const BODY_INK: Record<View, string> = {
  anterior: '<path d="M 230,106 Q 250,128 270,106" opacity="0.42"/>',
  posterior:
    '<path d="M 550,310 Q 600,330 650,310" opacity="0.45"/>' +
    '<path d="M 600,320 L 600,350" opacity="0.5"/>',
};

export const renderRegionShape = (
  key: BurnRegionKey,
  attributes: string,
): string =>
  `<path data-region="${key}" d="${REGION_GEOMETRY[key].d}" ${attributes}/>`;
