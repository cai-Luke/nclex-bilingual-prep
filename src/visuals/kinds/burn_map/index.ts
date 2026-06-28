import { escapeXml } from "../../primitives/escapeXml";
import { fmt, fmtNum, roundTo } from "../../primitives/graphPaper";
import { type VisualError, type VisualKindModule, registerVisual } from "../../registry";
import {
  BODY_INK,
  BURN_REGION_KEYS,
  REGION_GEOMETRY,
  TBSA_PCT,
  renderRegionShape,
  type BurnPopulation,
  type BurnRegionKey,
} from "./regions";
import type { BurnMapSpec } from "./types";

const POPULATIONS = new Set<BurnPopulation>(["adult", "pediatric"]);
const REGION_KEYS = new Set<BurnRegionKey>(BURN_REGION_KEYS);
const KEYED_DERIVATIONS = [
  "tbsa_pct",
  "parkland_total_ml",
  "parkland_first8h_ml",
  "parkland_rate_first8h_ml_hr",
] as const;

type DerivationKey = (typeof KEYED_DERIVATIONS)[number];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPositiveFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isBurnRegion = (value: unknown): value is BurnRegionKey =>
  typeof value === "string" && REGION_KEYS.has(value as BurnRegionKey);

export const validateBurnMap = (spec: BurnMapSpec): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  if (value.kind !== "burn_map") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'burn_map'" }];
  }

  const errors: VisualError[] = [];
  if (value.population !== undefined && !POPULATIONS.has(value.population as BurnPopulation)) {
    errors.push({
      path: "population",
      code: "invalid_population",
      message: "must be 'adult' or 'pediatric'",
    });
  }

  if (!Array.isArray(value.burns) || value.burns.length === 0) {
    errors.push({ path: "burns", code: "burns_empty", message: "must be a non-empty array" });
  } else {
    const seen = new Set<string>();
    value.burns.forEach((region, index) => {
      if (!isBurnRegion(region)) {
        errors.push({
          path: `burns[${index}]`,
          code: "invalid_region",
          message: "must be a supported whole burn region",
        });
        return;
      }
      if (seen.has(region)) {
        errors.push({
          path: `burns[${index}]`,
          code: "duplicate_region",
          message: "must not repeat a burn region",
        });
      }
      seen.add(region);
    });
  }

  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errors.push({
        path: "caption.en",
        code: "caption_en_required",
        message: "is required when caption is present",
      });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errors.push({
        path: "caption.zh",
        code: "caption_zh_empty",
        message: "must be non-empty when present",
      });
    }
  }
  return errors;
};

const structuralBurns = (value: unknown): BurnRegionKey[] | null => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const burns: BurnRegionKey[] = [];
  const seen = new Set<BurnRegionKey>();
  for (const region of value) {
    if (!isBurnRegion(region) || seen.has(region)) return null;
    burns.push(region);
    seen.add(region);
  }
  return burns;
};

const deriveValues = (
  population: BurnPopulation,
  burns: BurnRegionKey[],
  weightKg: number | null,
  roundPlaces: number,
): Partial<Record<DerivationKey, number>> => {
  const tbsa = burns.reduce((sum, region) => sum + TBSA_PCT[population][region], 0);
  const values: Partial<Record<DerivationKey, number>> = {
    tbsa_pct: roundTo(tbsa, roundPlaces),
  };
  if (weightKg !== null) {
    const total = 4 * weightKg * tbsa;
    values.parkland_total_ml = roundTo(total, roundPlaces);
    values.parkland_first8h_ml = roundTo(total / 2, roundPlaces);
    values.parkland_rate_first8h_ml_hr = roundTo(total / 2 / 8, roundPlaces);
  }
  return values;
};

export const selfCheckBurnMap = (
  spec: BurnMapSpec,
  question: unknown,
): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  if (value.kind !== "burn_map") return [];

  const errors: VisualError[] = [];
  const burns = structuralBurns(value.burns);
  const population = value.population === undefined ? "adult" : value.population;
  if (burns === null || !POPULATIONS.has(population as BurnPopulation)) {
    errors.push({
      path: "burns",
      code: "self_check_invalid_burns",
      message: "must contain unique supported whole regions",
    });
    return errors;
  }

  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : null;
  if (meta === null || !nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }

  const keyed = meta !== null && isRecord(meta.derived_values_keyed)
    ? meta.derived_values_keyed
    : null;
  const presentKeys = keyed === null
    ? []
    : KEYED_DERIVATIONS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));
  if (presentKeys.length === 0) {
    errors.push({
      path: "meta.derived_values_keyed",
      code: "self_check_no_keyed_values",
      message: "must declare at least one supported burn-map derivation",
    });
  }

  const needsWeight = presentKeys.some((key) => key !== "tbsa_pct");
  const weightKg = meta !== null && isPositiveFinite(meta.weight_kg) ? meta.weight_kg : null;
  if (needsWeight && weightKg === null) {
    errors.push({
      path: "meta.weight_kg",
      code: "self_check_weight_missing",
      message: "must be a finite positive number for Parkland derivations",
    });
  }

  const roundPlaces =
    meta !== null && (meta.round === 0 || meta.round === 1 || meta.round === 2)
      ? meta.round
      : 0;
  const computed = deriveValues(
    population as BurnPopulation,
    burns,
    weightKg,
    roundPlaces,
  );

  for (const key of presentKeys) {
    const expected = computed[key];
    if (expected === undefined) continue;
    if (keyed?.[key] !== expected) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_value_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${fmtNum(expected)}`,
      });
    }
  }

  if (
    isRecord(question) &&
    question.itemType === "fill_in_blank" &&
    Array.isArray(question.blanks)
  ) {
    const presentDerivedValues = presentKeys
      .map((key) => computed[key])
      .filter((derived): derived is number => derived !== undefined);
    question.blanks.forEach((blank, index) => {
      if (!isRecord(blank) || !isRecord(blank.numeric) || typeof blank.numeric.value !== "number") return;
      const blankValue = blank.numeric.value;
      if (!presentDerivedValues.includes(blankValue)) {
        errors.push({
          path: `blanks[${index}].numeric.value`,
          code: "self_check_answer_value_mismatch",
          message: `numeric answer ${fmtNum(blankValue)} does not match any present computed derived value`,
        });
      }
    });
  }

  return errors;
};

const regionAttributes = (burned: boolean): string =>
  burned ? 'fill="#dc2626" fill-opacity="0.55"' : 'fill="#f1f5f9"';

export const renderBurnMapSvg = (spec: BurnMapSpec): string => {
  const population = spec.population ?? "adult";
  const burned = new Set(Array.isArray(spec.burns) ? spec.burns : []);
  const fills = BURN_REGION_KEYS
    .filter((key) => REGION_GEOMETRY[key] !== undefined)
    .map((key) => renderRegionShape(key, regionAttributes(burned.has(key))))
    .join("\n");
  const outlines = BURN_REGION_KEYS
    .filter((key) => REGION_GEOMETRY[key] !== undefined)
    .map((key) => `<path d="${REGION_GEOMETRY[key].d}"/>`)
    .join("");
  const clipPaths = (["anterior", "posterior"] as const)
    .map((view) => {
      const paths = BURN_REGION_KEYS
        .filter((key) => REGION_GEOMETRY[key].view === view)
        .map((key) => `<path d="${REGION_GEOMETRY[key].d}"/>`)
        .join("");
      return `<clipPath id="burn-${view}-clip">${paths}</clipPath>`;
    })
    .join("");
  const ariaLabel = escapeXml(spec.caption?.en ?? "Burn diagram");
  const populationLabel = population === "pediatric" ? "Pediatric" : "Adult";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(850)} ${fmt(640)}" role="img" aria-label="${ariaLabel}" data-kind="burn_map" data-population="${population}">
<rect x="0" y="0" width="${fmt(850)}" height="${fmt(640)}" fill="#ffffff"/>
<defs>${clipPaths}</defs>
<rect x="${fmt(8)}" y="${fmt(8)}" width="${fmt(834)}" height="${fmt(624)}" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
<line x1="${fmt(425)}" y1="${fmt(8)}" x2="${fmt(425)}" y2="${fmt(632)}" stroke="#e2e8f0"/>
<text x="${fmt(20)}" y="${fmt(30)}" font-family="Georgia, serif" font-size="${fmt(16)}" font-weight="600" fill="#1e293b">Burn Surface Assessment</text>
<text x="${fmt(822)}" y="${fmt(30)}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${fmt(14)}" fill="#475569">${escapeXml(populationLabel)}</text>
<g>${fills}</g>
<g stroke="#64748b" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" fill="none">
${outlines}
<g clip-path="url(#burn-anterior-clip)">${BODY_INK.anterior}</g>
<g clip-path="url(#burn-posterior-clip)">${BODY_INK.posterior}</g>
</g>
<text x="${fmt(250)}" y="${fmt(622)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fmt(16)}" font-weight="700" fill="#334155">Anterior</text>
<text x="${fmt(600)}" y="${fmt(622)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fmt(16)}" font-weight="700" fill="#334155">Posterior</text>
</svg>`;
};

const fixtures: VisualKindModule<BurnMapSpec>["fixtures"] = {
  valid: [
    {
      kind: "burn_map",
      population: "adult",
      burns: ["trunk_anterior", "leg_l_anterior", "leg_r_anterior"],
      caption: { en: "Burn diagram", zh: "烧伤示意图" },
    },
    {
      kind: "burn_map",
      burns: [
        "arm_l_anterior",
        "arm_l_posterior",
        "arm_r_anterior",
        "arm_r_posterior",
        "head_anterior",
      ],
    },
    {
      kind: "burn_map",
      population: "pediatric",
      burns: ["head_anterior", "head_posterior", "trunk_anterior"],
    },
    {
      kind: "burn_map",
      population: "adult",
      burns: ["genitalia"],
      caption: { en: "Burn diagram", zh: "烧伤示意图" },
    },
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    { spec: { kind: "burn_map", population: "neonate", burns: ["head_anterior"] }, expectCode: "invalid_population" },
    { spec: { kind: "burn_map", burns: [] }, expectCode: "burns_empty" },
    { spec: { kind: "burn_map", burns: ["left_foot"] }, expectCode: "invalid_region" },
    { spec: { kind: "burn_map", burns: ["trunk_anterior", "trunk_anterior"] }, expectCode: "duplicate_region" },
    { spec: { kind: "burn_map", burns: ["head_anterior"], caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "burn_map", burns: ["head_anterior"], caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const burnMapModule: VisualKindModule<BurnMapSpec> = {
  kind: "burn_map",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateBurnMap,
  selfCheck: selfCheckBurnMap,
  renderSvg: renderBurnMapSvg,
  fixtures,
};

registerVisual(burnMapModule as VisualKindModule);
