/**
 * Q-0007 / gen_sic_batch2_3 — same-ID repair candidate (ordered_response, banks/gemini-canonical.json).
 * Producer: Claude Code / Claude Opus 5.5. CANDIDATE ONLY — not independently reviewed.
 * Disposition: ASTRA-ADJUDICATION-2026-11-17.md, item Q-0007 ("Specify Example 1 in stem ...
 * state other approved methods exist; no general 'the standard' claim").
 * Owner steering item 5: CDC frame; WS/T 311—2023 distinction rederived for THIS procedure:
 * Annex F F.2.1–F.2.2 removes these items in the same relative order as Example 1, adding hand
 * hygiene after gloves and removing the medical protective mask at the later zone boundary.
 * Options and key A,B,C,D unchanged.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gen_sic_batch2_3";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["stem", "en"],
    before: "The nurse is preparing to leave the room of a client on contact and droplet precautions. In which order should the nurse remove the personal protective equipment (PPE)?",
    after: "The nurse is preparing to leave the room of a client on contact and droplet precautions and will remove the gloves separately from the gown, following Example 1 on CDC's poster for safely removing personal protective equipment (PPE). In which order should the nurse remove the PPE?",
    note: "Name CDC Example 1; Example 2 (gown+gloves together) is equally CDC-approved.",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "护士准备离开一位采取接触和飞沫预防措施的患者病房。护士应按什么顺序脱下个人防护装备（PPE）？",
    after: "护士准备离开一位采取接触和飞沫预防措施的患者病房，将按照CDC安全脱卸个人防护装备（PPE）海报中的示例1，把手套与隔离衣分开脱下。护士应按什么顺序脱下PPE？",
  }),
  setValue({
    id, path: ["rationale", "correct", "en"],
    before: "The standard CDC sequence for removing PPE is: 1. Gloves, 2. Goggles/Face shield, 3. Gown, 4. Mask/Respirator. Gloves are the most contaminated and removed first.",
    after: "In Example 1 of CDC's PPE removal poster, the gloves come off first because their outside is the most contaminated. Goggles or a face shield follow, handled by the head band or ear pieces. The gown is next, pulled away from the neck and shoulders while touching only its inside, and the mask or respirator is last, grasped by the bottom and then the top ties or elastics. Hand hygiene follows immediately after all PPE is removed, and between steps if the hands become contaminated. A mask is removed before leaving the room; a respirator, if worn, is removed after leaving the room and closing the door. CDC describes this as one of a variety of safe ways to remove PPE. In its Example 2, the gown and gloves are removed together, followed by eye protection and then the mask or respirator. China's hospital isolation standard (WS/T 311—2023, informative Annex F) removes these items in the same relative order as Example 1 and adds hand hygiene after glove removal; in its staged zones, the medical protective mask is removed later, when leaving the potentially contaminated zone for the clean zone.",
    note: "Removes the 'standard CDC sequence' claim and numbered list.",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "CDC脱下PPE的标准顺序是：1. 手套，2. 护目镜/面罩，3. 隔离衣，4. 口罩/呼吸器。手套污染最严重，应首先脱下。",
    after: "在CDC脱卸PPE海报的示例1中，首先脱去手套，因为手套外面污染最严重。接着通过头带或耳挂摘下护目镜或面罩。然后脱隔离衣，从颈部和肩部拉离身体，只接触其内面；最后摘口罩或呼吸器，先抓下方再抓上方的系带或松紧带。脱下全部PPE后立即进行手部卫生；脱卸过程中若双手被污染，也应在步骤之间进行手部卫生。口罩在离开病房前摘除；如佩戴呼吸器，则应在离开病房并关上门后再摘除。CDC将此作为多种安全脱卸方法之一。在其示例2中，隔离衣和手套一起脱下，随后摘护目镜或面罩，最后摘口罩或呼吸器。我国《医院隔离技术标准》（WS/T 311—2023）资料性附录F中这些物品的脱卸先后顺序与示例1相同，并在摘手套后增加了洗手和/或手消毒；在分区管理中，医用防护口罩要等到从潜在污染区进入清洁区前才摘除。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "A" }, "en"],
    before: "Gloves are removed first as they are often the most contaminated item.",
    after: "In this method, the gloves are removed separately and before the other items because their outside is the most contaminated.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "A" }, "zh"],
    before: "首先摘下手套，因为它们通常是最脏的物品。",
    after: "在这种方法中，手套单独并先于其他物品脱下，因为手套外面污染最严重。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "en"],
    before: "Identify the most contaminated item and remove it first. The mask is removed last to protect the respiratory tract as long as possible.",
    after: "Use the removal method the stem names. In both CDC examples, the mask or respirator comes off last; the methods differ in whether the gloves come off alone or together with the gown.",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "识别污染最严重的物品并首先将其脱下。口罩最后脱下，以尽可能长时间保护呼吸道。",
    after: "采用题干指定的脱卸方法。在CDC的两个示例中，口罩或呼吸器都是最后摘除；两种方法的区别在于手套是单独脱下还是与隔离衣一起脱下。",
  }),
];

runPatch(ops);
