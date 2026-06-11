import type { Question } from "../../src/types";
import {
  ioRecordModule,
  renderIoRecordSvg,
  selfCheckIoRecord,
  validateIoRecord,
} from "../../src/visuals/kinds/io_record";
import type { IoRecordSpec } from "../../src/visuals/kinds/io_record/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
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
assert(
  JSON.stringify(ioRecordModule.allowedItemTypes) ===
    JSON.stringify(["multiple_choice", "select_all", "matrix", "fill_in_blank"]),
  "io_record placement must include numeric fill_in_blank",
);

console.log("io-record tests passed");
