import { createHash } from "node:crypto";
import type { Question } from "../../src/types";
import {
  ioRecordModule,
  renderIoRecordSvg,
  selfCheckIoRecord,
  validateIoRecord,
} from "../../src/visuals/kinds/io_record";
import { measureDocTable, renderDocTable, type DocTableInput } from "../../src/visuals/primitives/table";
import type { IoRecordSpec } from "../../src/visuals/kinds/io_record/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

const docTableHeight = (svgFragment: string): number => {
  const match = svgFragment.match(/<rect x="0" y="0" width="[^"]+" height="([^"]+)"/);
  if (!match) throw new Error("doc table outer rect height not found");
  return Number(match[1]);
};

const fixture: IoRecordSpec = {
  kind: "io_record",
  periodLabel: { en: "0700-1500 shift" },
  intake: [
    { label: "PO water", volumeMl: 480 },
    { label: "0.9% NaCl IV", volumeMl: 1000 },
    { label: "IV piggyback antibiotic", volumeMl: 100 },
  ],
  output: [
    { label: "Foley urine", volumeMl: 600 },
    { label: "Emesis", volumeMl: 150 },
  ],
};

const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;
const codes = (errors: ReturnType<typeof validateIoRecord>) => errors.map((error) => error.code);

assert(codes(validateIoRecord({
  kind: "io_record",
  intake: [{ label: "PO", volumeMl: 2.5 }],
  output: [],
})).includes("invalid_volume"), "non-integer volume must fail validation");

assert(codes(validateIoRecord({
  kind: "io_record",
  intake: [],
  output: [],
})).includes("no_entries"), "empty record must fail validation");

assert(codes(validateIoRecord({
  kind: "io_record",
  intake: [{ label: "IV", volumeMl: 50_000 }],
  output: [],
})).includes("volume_out_of_range"), "oversized entry must fail validation");

assert(codes(validateIoRecord({
  kind: "io_record",
  intake: [{ label: "", volumeMl: 100 }],
  output: [],
})).includes("entry_label_missing"), "empty label must fail validation");

const validSelfCheck = selfCheckIoRecord(fixture, questionWithMeta({
  visual_justification: "The learner must derive the totals and net balance from the entries.",
  derived_values_keyed: {
    intake_total_ml: 1580,
    output_total_ml: 750,
    net_balance_ml: 830,
  },
}));
assert(validSelfCheck.length === 0, `correct totals must pass selfCheck: ${JSON.stringify(validSelfCheck)}`);

const mismatch = selfCheckIoRecord(fixture, questionWithMeta({
  visual_justification: "The learner must derive the net balance.",
  derived_values_keyed: { net_balance_ml: 999 },
}));
assert(
  mismatch.some((error) => error.code === "self_check_total_mismatch"),
  "wrong keyed total must fail selfCheck",
);

const noKeyedValues = selfCheckIoRecord(fixture, questionWithMeta({
  visual_justification: "The learner must derive the net balance.",
}));
assert(
  noKeyedValues.some((error) => error.code === "self_check_no_keyed_values"),
  "meta without derived_values_keyed must fail selfCheck",
);

const invalidSelfCheckVolume = selfCheckIoRecord({
  kind: "io_record",
  intake: [{ label: "PO", volumeMl: 2.5 }],
  output: [],
}, questionWithMeta({
  visual_justification: "The learner must derive the intake total.",
  derived_values_keyed: { intake_total_ml: 2.5 },
}));
assert(
  invalidSelfCheckVolume.some((error) => error.code === "self_check_invalid_volume"),
  "invalid entry volume must fail the internal consistency selfCheck",
);

let malformedResult: ReturnType<typeof selfCheckIoRecord> | undefined;
try {
  malformedResult = selfCheckIoRecord({} as IoRecordSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformedResult?.length === 0, "malformed selfCheck input must return []");

const svg = renderIoRecordSvg(fixture);
assert(renderIoRecordSvg(fixture) === svg, "rendering must be deterministic");
assert(svg.includes(">1580<"), "render must include computed intake total");
assert(svg.includes(">750<"), "render must include computed output total");
assert(svg.includes(">+830<"), "render must include signed computed net balance");

const tableInput: DocTableInput = {
  title: "Intake & Output Record",
  columns: [
    { key: "item", label: "", widthFr: 3, align: "left" },
    { key: "vol", label: "Volume (mL)", widthFr: 1.4, align: "right" },
  ],
  rows: [{ cells: { item: "Intake" }, rowHeader: true }, { cells: { item: "Total", vol: "100" } }],
  width: 420,
  rowHeight: 24,
  headerHeight: 28,
};
assert(
  measureDocTable(tableInput) === docTableHeight(renderDocTable(tableInput)),
  "measureDocTable must match rendered doc-table height",
);

const expectedFixtureHashes = [
  "867af95e916f520be3ad741b717545eba2774710209b4b957ac06f095cfdbd74",
  "c061a8b04c1b87bb20d50ee33dd09bea28ed6e96983e71bc1ba2671350bb7e62",
];
ioRecordModule.fixtures.valid.forEach((spec, index) => {
  const actual = sha256(renderIoRecordSvg(spec));
  assert(
    actual === expectedFixtureHashes[index],
    `io_record fixture[${index}] SVG hash drift: expected ${expectedFixtureHashes[index]}, got ${actual}`,
  );
});

assert(
  JSON.stringify(ioRecordModule.allowedItemTypes) ===
    JSON.stringify(["multiple_choice", "select_all", "matrix", "fill_in_blank"]),
  "io_record placement must include numeric fill_in_blank",
);

console.log("io-record tests passed");
