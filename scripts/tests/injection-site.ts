import type { Question } from "../../src/types";
import {
  getInjectionNeedleGeometry,
  injectionSiteModule,
  renderInjectionSiteSvg,
  selfCheckInjectionSite,
  validateInjectionSite,
} from "../../src/visuals/kinds/injection_site";
import {
  INJECTION_ROUTES,
  ROUTE_TABLE,
  type InjectionRoute,
} from "../../src/visuals/kinds/injection_site/routes";
import {
  BYSTANDER_VESSEL,
  getRenderedVesselGeometry,
  segmentIntersectsEllipse,
  tipInsideEllipse,
} from "../../src/visuals/kinds/injection_site/geometry";
import type { InjectionSiteSpec } from "../../src/visuals/kinds/injection_site/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const codes = (errors: ReturnType<typeof validateInjectionSite>) =>
  errors.map((error) => error.code);

const questionWithMeta = (meta: Record<string, unknown>) =>
  ({ meta }) as unknown as Question;

assert(
  codes(validateInjectionSite({ kind: "injection_site", route: "intraosseous" as never }))
    .includes("invalid_route"),
  "unsupported route must fail",
);
assert(
  codes(validateInjectionSite({
    kind: "injection_site",
    route: "intradermal",
    caption: { en: "" },
  })).includes("caption_en_required"),
  "empty English caption must fail",
);
assert(
  codes(validateInjectionSite({
    kind: "injection_site",
    route: "subcutaneous",
    vessel: "intra_arterial" as never,
  })).includes("invalid_vessel_relation"),
  "unsupported vessel relation must fail",
);

const paths = new Set<string>();
for (const route of INJECTION_ROUTES) {
  const spec: InjectionSiteSpec = { kind: "injection_site", route };
  const svg = renderInjectionSiteSvg(spec);
  assert(svg === renderInjectionSiteSvg(spec), `${route} rendering must be deterministic`);
  assert(svg.startsWith("<svg") && svg.endsWith("</svg>"), `${route} SVG must be well formed`);
  assert(svg.includes('data-kind="injection_site"'), `${route} SVG must identify its kind`);
  const path = svg.match(/<path data-element="needle" d="([^"]+)"/)?.[1];
  assert(path, `${route} SVG must expose the needle geometry hook`);
  paths.add(path!);

  const geometry = getInjectionNeedleGeometry(route);
  const coordinates = [
    ["entryX", geometry.entryX, 480],
    ["entryY", geometry.entryY, 360],
    ["tipX", geometry.tipX, 480],
    ["tipY", geometry.tipY, 360],
    ["barrelX", geometry.barrelX, 480],
    ["barrelY", geometry.barrelY, 360],
    ["barrelStartX", geometry.barrelX - geometry.barrelPerpX, 480],
    ["barrelStartY", geometry.barrelY - geometry.barrelPerpY, 360],
    ["barrelEndX", geometry.barrelX + geometry.barrelPerpX, 480],
    ["barrelEndY", geometry.barrelY + geometry.barrelPerpY, 360],
  ] as const;
  coordinates.forEach(([key, value, max]) => {
    assert(value >= 0 && value <= max, `${route} ${key} must remain in frame`);
  });

  assert(!svg.includes('data-element="blood-channel"'), `${route} bare spec must not render a blood channel`);
  assert(!/[°]/.test(svg) && !/\bangle\b/i.test(svg), `${route} must not render angle text`);
  assert(!/\b(vein|vessel|lumen)\b/i.test(svg), `${route} must not label the vessel`);
  assert(!/data-[^=]*route/i.test(svg), `${route} must not expose the route as metadata`);

  const visibleLabels = Array.from(
    svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g),
    (match) => match[1],
  );
  const permittedLabels = new Set([
    "Epidermis",
    "Dermis",
    "Subcutaneous tissue",
    "Muscle",
  ]);
  assert(
    visibleLabels.every((label) => permittedLabels.has(label)),
    `${route} must render only the four permitted anatomical labels`,
  );
}
assert(paths.size === 4, "all four route needle paths must be distinct");

const im = getInjectionNeedleGeometry("intramuscular");
const id = getInjectionNeedleGeometry("intradermal");
const slopeFromSurface = (route: InjectionRoute) => {
  const geometry = getInjectionNeedleGeometry(route);
  return Math.abs(geometry.tipY - geometry.entryY) /
    Math.max(Math.abs(geometry.tipX - geometry.entryX), Number.EPSILON);
};
assert(
  slopeFromSurface("intramuscular") > slopeFromSurface("intradermal"),
  "intramuscular needle must be steeper than intradermal",
);
assert(im.tipY > id.tipY, "intramuscular needle must terminate deeper than intradermal");
assert(
  ROUTE_TABLE.intravenous.target === "vessel",
  "intravenous route must terminate in the fixed blood channel",
);

for (const route of INJECTION_ROUTES.filter((candidate) => candidate !== "intravenous")) {
  const spec: InjectionSiteSpec = { kind: "injection_site", route, vessel: "bystander" };
  const svg = renderInjectionSiteSvg(spec);
  assert(svg.includes('data-element="blood-channel"'), `${route} bystander vessel must render`);

  const geometry = getInjectionNeedleGeometry(route);
  assert(
    !segmentIntersectsEllipse(
      { x: geometry.entryX, y: geometry.entryY },
      { x: geometry.tipX, y: geometry.tipY },
      BYSTANDER_VESSEL,
    ),
    `${route} bystander vessel must remain clear of the needle`,
  );
}

const ivWithTarget: InjectionSiteSpec = {
  kind: "injection_site",
  route: "intravenous",
  vessel: "target",
};
const ivSvg = renderInjectionSiteSvg(ivWithTarget);
const ivGeometry = getInjectionNeedleGeometry("intravenous");
const ivVessel = getRenderedVesselGeometry("intravenous", "target", {
  x: ivGeometry.tipX,
  y: ivGeometry.tipY,
});
assert(ivSvg.includes('data-element="blood-channel"'), "intravenous target vessel must render");
assert(ivVessel !== null, "intravenous target vessel geometry must resolve");
assert(
  tipInsideEllipse({ x: ivGeometry.tipX, y: ivGeometry.tipY }, ivVessel!),
  "intravenous target vessel must contain the needle tip",
);

const intramuscular: InjectionSiteSpec = {
  kind: "injection_site",
  route: "intramuscular",
};
const matching = selfCheckInjectionSite(intramuscular, questionWithMeta({
  visual_justification: "The learner must read the angle and tip depth from the figure.",
  expected: { route: "intramuscular", target: "muscle" },
}));
assert(matching.length === 0, `matching expected cue must pass: ${JSON.stringify(matching)}`);

const targetOnSubcutaneous = selfCheckInjectionSite({
  kind: "injection_site",
  route: "subcutaneous",
  vessel: "target",
}, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
  expected: { route: "subcutaneous", target: "subcutaneous" },
}));
assert(
  targetOnSubcutaneous.some((error) => error.code === "self_check_target_requires_iv"),
  "target vessel relation on non-IV route must fail selfCheck",
);

const bareIv = selfCheckInjectionSite({
  kind: "injection_site",
  route: "intravenous",
}, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
  expected: { route: "intravenous", target: "vessel" },
}));
assert(
  bareIv.some((error) => error.code === "self_check_iv_requires_target"),
  "intravenous route must require target vessel relation in selfCheck",
);

const fullIv = selfCheckInjectionSite(ivWithTarget, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
  expected: { route: "intravenous", target: "vessel", vesselEntry: true },
}));
assert(fullIv.length === 0, `intravenous target vessel cue must pass: ${JSON.stringify(fullIv)}`);

const vesselEntryMismatch = selfCheckInjectionSite(intramuscular, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
  expected: { route: "intramuscular", target: "muscle", vesselEntry: true },
}));
assert(
  vesselEntryMismatch.some((error) => error.code === "self_check_vessel_entry_mismatch"),
  "expected vesselEntry must match rendered vessel-entry state",
);

const routeMismatch = selfCheckInjectionSite(intramuscular, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
  expected: { route: "subcutaneous", target: "muscle" },
}));
assert(
  routeMismatch.some((error) => error.code === "self_check_route_mismatch"),
  "mismatched expected route must fail",
);

const targetMismatch = selfCheckInjectionSite(intramuscular, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
  expected: { route: "intramuscular", target: "dermis" },
}));
assert(
  targetMismatch.some((error) => error.code === "self_check_target_mismatch"),
  "mismatched expected target must fail",
);

const noExpected = selfCheckInjectionSite(intramuscular, questionWithMeta({
  visual_justification: "The figure is load-bearing.",
}));
assert(
  noExpected.some((error) => error.code === "self_check_no_expected_cue"),
  "missing expected route must fail",
);

const noJustification = selfCheckInjectionSite(intramuscular, questionWithMeta({
  expected: { route: "intramuscular", target: "muscle" },
}));
assert(
  noJustification.some((error) => error.code === "self_check_missing_justification"),
  "missing visual justification must fail",
);

let malformed: ReturnType<typeof selfCheckInjectionSite> | undefined;
try {
  malformed = selfCheckInjectionSite({} as InjectionSiteSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformed?.length === 0, "malformed selfCheck input must return []");
assert(injectionSiteModule.allowedItemTypes === undefined, "injection_site must use global placement");

console.log("injection-site tests passed");
