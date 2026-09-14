import type { Question } from "../../src/types";
import {
  burnMapModule,
  renderBurnMapSvg,
  selfCheckBurnMap,
  validateBurnMap,
} from "../../src/visuals/kinds/burn_map";
import {
  BURN_REGION_KEYS,
  REGION_GEOMETRY,
  TBSA_PCT,
  type BurnPopulation,
} from "../../src/visuals/kinds/burn_map/regions";
import type { BurnMapSpec } from "../../src/visuals/kinds/burn_map/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const adult: BurnMapSpec = {
  kind: "burn_map",
  population: "adult",
  burns: ["trunk_anterior", "leg_l_anterior", "leg_r_anterior"],
};

const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;
const codes = (errors: ReturnType<typeof validateBurnMap>) => errors.map((error) => error.code);

for (const population of ["adult", "pediatric"] as BurnPopulation[]) {
  const total = BURN_REGION_KEYS.reduce((sum, key) => sum + TBSA_PCT[population][key], 0);
  assert(total === 100, `${population} Rule-of-Nines table must sum to 100, got ${total}`);
}

assert(codes(validateBurnMap({ ...adult, population: "neonate" as never })).includes("invalid_population"), "invalid population must fail");
assert(codes(validateBurnMap({ ...adult, burns: ["left_foot" as never] })).includes("invalid_region"), "invalid region must fail");
assert(codes(validateBurnMap({ ...adult, burns: ["trunk_anterior", "trunk_anterior"] })).includes("duplicate_region"), "duplicate region must fail");

const fullChain = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must sum the shaded regions and use the result in Parkland arithmetic.",
  weight_kg: 70,
  round: 0,
  derived_values_keyed: {
    tbsa_pct: 36,
    parkland_total_ml: 10080,
    parkland_first8h_ml: 5040,
    parkland_rate_first8h_ml_hr: 630,
  },
}));
assert(fullChain.length === 0, `correct adult arithmetic must pass: ${JSON.stringify(fullChain)}`);

const mismatch = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must sum the shaded regions.",
  derived_values_keyed: { tbsa_pct: 40 },
}));
assert(mismatch.some((error) => error.code === "self_check_value_mismatch"), "wrong keyed TBSA must fail");

const missingWeight = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must calculate Parkland volume.",
  derived_values_keyed: { parkland_total_ml: 10080 },
}));
assert(missingWeight.some((error) => error.code === "self_check_weight_missing"), "Parkland derivation without weight must fail");

const noKeyed = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must inspect the map.",
  derived_values_keyed: { unknown: 36 },
}));
assert(noKeyed.some((error) => error.code === "self_check_no_keyed_values"), "meta without recognized key must fail");

const pediatric = selfCheckBurnMap({
  kind: "burn_map",
  population: "pediatric",
  burns: ["head_anterior", "head_posterior", "trunk_anterior"],
}, questionWithMeta({
  visual_justification: "The learner must use the pediatric table selected by the map.",
  derived_values_keyed: { tbsa_pct: 36 },
}));
assert(pediatric.length === 0, `pediatric table must drive recompute: ${JSON.stringify(pediatric)}`);

const matchingBlank = selfCheckBurnMap(adult, {
  itemType: "fill_in_blank",
  meta: {
    visual_justification: "The learner must enter the computed TBSA.",
    round: 0,
    derived_values_keyed: { tbsa_pct: 36 },
  },
  blanks: [{ id: "tbsa", numeric: { value: 36, tolerance: 0 } }],
} as unknown as Question);
assert(matchingBlank.length === 0, `numeric blank matching a derived value must pass: ${JSON.stringify(matchingBlank)}`);

const wrongBlank = selfCheckBurnMap(adult, {
  itemType: "fill_in_blank",
  meta: {
    visual_justification: "The learner must enter the computed TBSA.",
    round: 0,
    derived_values_keyed: { tbsa_pct: 36 },
  },
  blanks: [{ id: "tbsa", numeric: { value: 35.6, tolerance: 0 } }],
} as unknown as Question);
assert(
  wrongBlank.some((error) => error.code === "self_check_answer_value_mismatch"),
  "numeric blank not matching any present rounded derived value must fail",
);

let malformed: ReturnType<typeof selfCheckBurnMap> | undefined;
try {
  malformed = selfCheckBurnMap({} as BurnMapSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformed?.length === 0, "malformed selfCheck input must return []");

const svg = renderBurnMapSvg(adult);
assert(renderBurnMapSvg(adult) === svg, "burn-map rendering must be deterministic");
assert(svg.includes('data-kind="burn_map"'), "burn map must identify its kind");
assert(svg.includes('data-region="trunk_anterior"') && svg.includes('fill="#dc2626" fill-opacity="0.55"'), "burned region must use solid translucent red");
assert(svg.includes('data-region="head_anterior"') && svg.includes('fill="#f7f7f5"'), "unburned region must use neutral fill");
assert(svg.includes('clip-path="url(#burn-posterior-clip)"'), "posterior detail lines must be clipped to the body silhouette");
assert(svg.includes('stroke="#64748b" stroke-width="1.6"'), "burn map outlines must stay legible against neutral anatomy");
assert(svg.includes('viewBox="0 0 800 600"'), "approved figure must retain its landscape envelope");
assert(svg.includes('clip-path="url(#burn-anterior-clip)"'), "anterior detail must stay inside the body silhouette");
const root = svg.match(/^<svg\b[^>]*>/)?.[0] ?? "";
assert(!/\b(?:width|height)=/.test(root), "the application must control SVG display size");
assert(!/<(?:image|foreignObject|script)\b/.test(svg), "burn-map output must remain self-contained vector geometry");
assert(Object.keys(REGION_GEOMETRY).length === 13, "all thirteen independently selectable regions must remain present");

// Test patient laterality from each whole contour, independently of its first
// coordinate or the current shoulder/hip landmark. All commands use x/y pairs.
for (const view of ["anterior", "posterior"] as const) {
  const center = view === "anterior" ? 210 : 590;
  for (const limb of ["arm", "leg"] as const) {
    for (const side of ["l", "r"] as const) {
      const key = `${limb}_${side}_${view}` as const;
      const coordinates = REGION_GEOMETRY[key].d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
      assert(coordinates.length >= 6 && coordinates.length % 2 === 0, `${key} must have complete coordinate pairs`);
      const xs = coordinates.filter((_, index) => index % 2 === 0);
      const onViewerLeft = view === "anterior" ? side === "r" : side === "l";
      assert(onViewerLeft ? Math.max(...xs) <= center : Math.min(...xs) >= center, `${key} must stay on the patient's correct side`);
    }
  }
}

for (const key of BURN_REGION_KEYS) {
  const singleRegionSvg = renderBurnMapSvg({ kind: "burn_map", population: "adult", burns: [key] });
  assert(
    singleRegionSvg.includes(`data-region="${key}"`) && singleRegionSvg.includes(`data-region="${key}" d="${REGION_GEOMETRY[key].d}" fill="#dc2626" fill-opacity="0.55"`),
    `${key} must visibly select its own keyed region`,
  );
  const selectedFills = singleRegionSvg.match(/fill="#dc2626" fill-opacity="0.55"/g) ?? [];
  assert(selectedFills.length === 1, `${key} single-region render must shade exactly one keyed fill`);
}

for (const side of ["l", "r"] as const) {
  const burns = ["genitalia", `leg_${side}_anterior`] as BurnMapSpec["burns"];
  const combined = renderBurnMapSvg({ ...adult, burns });
  assert((combined.match(/fill="#dc2626" fill-opacity="0.55"/g) ?? []).length === 2, "perineum and adjacent leg must remain separate fill owners");
  assert(combined === renderBurnMapSvg({ ...adult, burns: [...burns].reverse() }), "selection order must not alter region painting");
}

const visibleLabels = Array.from(svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g), (match) => match[1]);
assert(
  visibleLabels.every((label) => !/%|Parkland|10080|5040|630|36/.test(label)),
  `visible SVG labels must not reveal derived answers: ${JSON.stringify(visibleLabels)}`,
);
assert(
  JSON.stringify(burnMapModule.allowedItemTypes) ===
    JSON.stringify(["multiple_choice", "select_all", "matrix", "fill_in_blank"]),
  "burn_map placement must include numeric fill_in_blank",
);

console.log("burn-map tests passed");
