import { escapeXml } from "../../primitives/escapeXml";
import { fmt } from "../../primitives/graphPaper";
import { registerVisual, type VisualError, type VisualKindModule } from "../../registry";
import {
  INJECTION_ROUTES,
  LAYER_BANDS,
  ROUTE_TABLE,
  VESSEL_GEOMETRY,
  type InjectionRoute,
  type InjectionTarget,
} from "./routes";
import type { InjectionSiteSpec } from "./types";

const WIDTH = 480;
const HEIGHT = 360;
const TISSUE_X = 140;
const TISSUE_WIDTH = 320;
const SURFACE_Y = LAYER_BANDS[0].y0;
const TIP_X = 350;
const BARREL_LENGTH = 58;
const ROUTES = new Set<InjectionRoute>(INJECTION_ROUTES);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isInjectionRoute = (value: unknown): value is InjectionRoute =>
  typeof value === "string" && ROUTES.has(value as InjectionRoute);

export const validateInjectionSite = (spec: InjectionSiteSpec): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  const errors: VisualError[] = [];

  if (value.kind !== "injection_site") {
    errors.push({ path: "kind", code: "invalid_kind", message: "must be 'injection_site'" });
  }
  if (!isInjectionRoute(value.route)) {
    errors.push({
      path: "route",
      code: "invalid_route",
      message: "must be intradermal, subcutaneous, intramuscular, or intravenous",
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

export const selfCheckInjectionSite = (
  spec: InjectionSiteSpec,
  question: unknown,
): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  if (value.kind !== "injection_site") return [];

  const errors: VisualError[] = [];
  if (!isInjectionRoute(value.route)) {
    errors.push({
      path: "route",
      code: "self_check_invalid_route",
      message: "must map to a supported route geometry",
    });
    return errors;
  }

  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : {};
  if (!nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }

  const expected = isRecord(meta.expected) ? meta.expected : null;
  if (expected === null || !nonEmptyString(expected.route)) {
    errors.push({
      path: "meta.expected.route",
      code: "self_check_no_expected_cue",
      message: "must declare the depicted route",
    });
    return errors;
  }

  if (expected.route !== value.route) {
    errors.push({
      path: "meta.expected.route",
      code: "self_check_route_mismatch",
      message: "does not match the visual route",
    });
  }

  if (
    expected.target !== undefined &&
    expected.target !== ROUTE_TABLE[value.route].target
  ) {
    errors.push({
      path: "meta.expected.target",
      code: "self_check_target_mismatch",
      message: "does not match the canonical route target",
    });
  }

  return errors;
};

const targetY = (target: InjectionTarget): number => {
  if (target === "vessel") return VESSEL_GEOMETRY.cy;
  const band = LAYER_BANDS.find((candidate) => candidate.key === target);
  return band ? (band.y0 + band.y1) / 2 : SURFACE_Y;
};

export interface InjectionNeedleGeometry {
  entryX: number;
  entryY: number;
  tipX: number;
  tipY: number;
  barrelX: number;
  barrelY: number;
  barrelPerpX: number;
  barrelPerpY: number;
}

export const getInjectionNeedleGeometry = (
  route: InjectionRoute,
): InjectionNeedleGeometry => {
  const routeGeometry = ROUTE_TABLE[route];
  const radians = (routeGeometry.angleDeg * Math.PI) / 180;
  const tipY = targetY(routeGeometry.target);
  const depth = tipY - SURFACE_Y;
  const horizontalRun =
    routeGeometry.angleDeg === 90 ? 0 : depth / Math.tan(radians);
  const entryX = TIP_X - horizontalRun;
  const barrelX = entryX - Math.cos(radians) * BARREL_LENGTH;
  const barrelY = SURFACE_Y - Math.sin(radians) * BARREL_LENGTH;
  const perpendicularX = -Math.sin(radians);
  const perpendicularY = Math.cos(radians);

  return {
    entryX,
    entryY: SURFACE_Y,
    tipX: TIP_X,
    tipY,
    barrelX,
    barrelY,
    barrelPerpX: perpendicularX * 10,
    barrelPerpY: perpendicularY * 10,
  };
};

const renderBands = () =>
  LAYER_BANDS.map(
    (band) => `<g data-layer="${band.key}">
<rect x="${fmt(TISSUE_X)}" y="${fmt(band.y0)}" width="${fmt(TISSUE_WIDTH)}" height="${fmt(band.y1 - band.y0)}" fill="${band.fill}" stroke="#ffffff" stroke-width="1"/>
<text x="${fmt(TISSUE_X + 12)}" y="${fmt((band.y0 + band.y1) / 2 + 4)}" font-family="system-ui, sans-serif" font-size="${fmt(12)}" font-weight="600" fill="${band.key === "muscle" ? "#ffffff" : "#573b2d"}">${escapeXml(band.label)}</text>
</g>`,
  ).join("\n");

export const renderInjectionSiteSvg = (spec: InjectionSiteSpec): string => {
  const route = isInjectionRoute(spec.route) ? spec.route : "intradermal";
  const needle = getInjectionNeedleGeometry(route);
  const ariaLabel = escapeXml(spec.caption?.en ?? "Injection cross-section");
  const barrelStartX = needle.barrelX - needle.barrelPerpX;
  const barrelStartY = needle.barrelY - needle.barrelPerpY;
  const barrelEndX = needle.barrelX + needle.barrelPerpX;
  const barrelEndY = needle.barrelY + needle.barrelPerpY;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(WIDTH)} ${fmt(HEIGHT)}" role="img" aria-label="${ariaLabel}" data-kind="injection_site">
<rect x="0" y="0" width="${fmt(WIDTH)}" height="${fmt(HEIGHT)}" fill="#ffffff"/>
<rect x="${fmt(TISSUE_X)}" y="${fmt(SURFACE_Y)}" width="${fmt(TISSUE_WIDTH)}" height="${fmt(LAYER_BANDS[LAYER_BANDS.length - 1].y1 - SURFACE_Y)}" fill="none" stroke="#7c5a4b" stroke-width="1.5"/>
${renderBands()}
<ellipse data-element="blood-channel" cx="${fmt(VESSEL_GEOMETRY.cx)}" cy="${fmt(VESSEL_GEOMETRY.cy)}" rx="${fmt(VESSEL_GEOMETRY.rx)}" ry="${fmt(VESSEL_GEOMETRY.ry)}" fill="#8b1e3f" stroke="#5f1530" stroke-width="2"/>
<ellipse cx="${fmt(VESSEL_GEOMETRY.cx)}" cy="${fmt(VESSEL_GEOMETRY.cy)}" rx="${fmt(VESSEL_GEOMETRY.rx - 5)}" ry="${fmt(VESSEL_GEOMETRY.ry - 4)}" fill="#d56a7f"/>
<g stroke-linecap="round" stroke-linejoin="round">
<path data-element="needle" d="M ${fmt(needle.entryX)} ${fmt(needle.entryY)} L ${fmt(needle.tipX)} ${fmt(needle.tipY)}" fill="none" stroke="#475569" stroke-width="4"/>
<path d="M ${fmt(needle.entryX)} ${fmt(needle.entryY)} L ${fmt(needle.tipX)} ${fmt(needle.tipY)}" fill="none" stroke="#e2e8f0" stroke-width="1.3"/>
<line data-element="syringe-barrel" x1="${fmt(needle.barrelX)}" y1="${fmt(needle.barrelY)}" x2="${fmt(needle.entryX)}" y2="${fmt(needle.entryY)}" stroke="#64748b" stroke-width="12"/>
<line data-element="syringe-barrel" x1="${fmt(needle.barrelX)}" y1="${fmt(needle.barrelY)}" x2="${fmt(needle.entryX)}" y2="${fmt(needle.entryY)}" stroke="#dbeafe" stroke-width="7"/>
<line data-element="syringe-barrel" x1="${fmt(barrelStartX)}" y1="${fmt(barrelStartY)}" x2="${fmt(barrelEndX)}" y2="${fmt(barrelEndY)}" stroke="#475569" stroke-width="4"/>
<circle cx="${fmt(needle.tipX)}" cy="${fmt(needle.tipY)}" r="${fmt(3.5)}" fill="#1e293b"/>
</g>
</svg>`;
};

const fixtures: VisualKindModule<InjectionSiteSpec>["fixtures"] = {
  valid: [
    { kind: "injection_site", route: "intramuscular" },
    { kind: "injection_site", route: "subcutaneous" },
    {
      kind: "injection_site",
      route: "intradermal",
      caption: { en: "Skin cross-section", zh: "皮肤横断面" },
    },
    { kind: "injection_site", route: "intravenous" },
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    {
      spec: { kind: "injection_site", route: "intraosseous" },
      expectCode: "invalid_route",
    },
    {
      spec: { kind: "injection_site", route: "intradermal", caption: { en: "" } },
      expectCode: "caption_en_required",
    },
    {
      spec: {
        kind: "injection_site",
        route: "intradermal",
        caption: { en: "x", zh: "" },
      },
      expectCode: "caption_zh_empty",
    },
  ],
};

export const injectionSiteModule: VisualKindModule<InjectionSiteSpec> = {
  kind: "injection_site",
  validate: validateInjectionSite,
  selfCheck: selfCheckInjectionSite,
  renderSvg: renderInjectionSiteSvg,
  fixtures,
};

registerVisual(injectionSiteModule as VisualKindModule);
