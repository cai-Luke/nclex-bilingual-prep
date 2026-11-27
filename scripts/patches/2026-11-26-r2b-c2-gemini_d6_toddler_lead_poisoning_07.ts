/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_d6_toddler_lead_poisoning_07 (banks/gemini-canonical.json questions[439]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 4381cfe1de898fc76bfef362116385a824a4beb17d17a4b7b60fc5f8cd06a241. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_d6_toddler_lead_poisoning_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Preventing lead poisoning involves reducing dust (wet mopping, washing hands/toys) and optimizing nutrition. Iron and calcium help decrease lead absorption. Hot tap water can contain higher levels of lead from pipes; cold water should be used. Standard vacuuming (E) can stir up lead dust unless a HEPA filter is used.",
    after: "Preventing lead poisoning involves reducing dust (wet mopping, washing hands/toys) and optimizing nutrition. Iron and calcium help decrease lead absorption. Hot tap water can contain higher levels of lead from pipes; cold water should be used. Standard vacuuming can stir up lead dust unless a HEPA filter is used.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "预防铅中毒包括减少灰尘（湿拖、洗手/玩具）和优化营养。铁和钙有助于减少铅的吸收。热水龙头的水 可能含有来自管道的更高水平的铅；应使用冷水。标准吸尘 (E) 可能会激起铅尘，除非使用 HEPA 过滤器。",
    after: "预防铅中毒包括减少灰尘（湿拖、洗手/玩具）和优化营养。铁和钙有助于减少铅的吸收。热水龙头的水 可能含有来自管道的更高水平的铅；应使用冷水。标准吸尘可能会激起铅尘，除非使用 HEPA 过滤器。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
