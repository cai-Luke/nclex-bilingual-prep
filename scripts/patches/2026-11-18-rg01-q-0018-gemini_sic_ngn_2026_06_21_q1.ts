/**
 * Q-0018 / gemini_sic_ngn_2026_06_21_q1 — same-ID repair candidate, EXPLANATION-ONLY.
 * Producer: Claude Code / Claude Opus 5.5. CANDIDATE ONLY — not independently reviewed.
 * Disposition: ASTRA-ADJUDICATION-2026-11-17.md, item Q-0018 (CONFIRM OVERCLAIM; key defensible
 * for bundled gown/gloves method; qualify bilingual rationale and strategy to the named method
 * while preserving airborne respirator removal after exit/door closure). No key change.
 * Owner steering item 5: WS/T 311—2023 distinction rederived for THIS procedure: Annex F F.2.1
 * removes gloves (with hand hygiene), then eye protection, then the gown, i.e. eye protection
 * BEFORE the gown, unlike the bundled method this item tests; F.2.2 removes the medical
 * protective mask after leaving the contaminated zone. Stem, options and key unchanged.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gemini_sic_ngn_2026_06_21_q1";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["rationale", "correct", "en"],
    before: "According to standard CDC guidelines for airborne precautions (such as tuberculosis), PPE must be removed in a sequence that prevents self-contamination and release of airborne pathogens. Gloves and gown (highly contaminated) are removed first inside the room, followed by goggles/face shield. The nurse must then exit the room and close the door tightly to maintain negative pressure before removing the N95 respirator outside the room, because removing it inside would expose the nurse's airway to suspended microdroplets. Hand hygiene is performed immediately after.",
    after: "This item uses CDC's PPE removal method in which the gown and gloves are removed together, shown as Example 2 on CDC's poster. Inside the room, the gown and gloves come off together, with the gown rolled inside out while the gloves are peeled off at the same time, followed by goggles or a face shield. For airborne precautions such as suspected tuberculosis, CDC directs that all PPE except the respirator be removed before exiting, and that the respirator be removed after leaving the room and closing the door, so the nurse does not breathe air that may contain infectious particles; closing the door also helps the airborne infection isolation room keep its negative pressure. Hand hygiene follows immediately after the respirator is removed. In CDC's Example 1, the gloves come off first by themselves and eye protection is removed before the gown; that method is also safe, but it does not match the combined gown-and-glove step in this item. China's hospital isolation standard (WS/T 311—2023, informative Annex F) likewise removes the gloves, with hand hygiene, and then eye protection before the gown, and removes the medical protective mask after leaving the contaminated zone, consistent with removing respiratory protection outside the patient's room.",
    note: "Name the method (CDC Example 2); remove 'standard CDC guidelines' universality.",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "根据 CDC 关于空气传播隔离（如结核病）的标准指南，必须按能够防止自我污染和防止空气传播病原体释放的顺序移除 PPE。首先在病房内脱下手套和隔离衣（高度污染），然后脱下护目镜/面罩。接着，护士必须离开病房并紧紧关闭病房门以维持负压，然后才能在病房外脱下 N95 呼吸器，因为在病房内脱下会使护士的呼吸道暴露于悬浮的微滴中。之后立即进行手部卫生。",
    after: "本题采用的是CDC将隔离衣和手套一起脱下的PPE脱卸方法，即CDC海报中的示例2。在病房内，先将隔离衣和手套一起脱下：将隔离衣由内向外卷起，同时剥下手套；接着摘下护目镜或面罩。对于疑似结核病等空气传播隔离，CDC要求除呼吸器外的所有PPE均在离开病房前脱下，呼吸器则在离开病房并关上门后再摘除，以免护士吸入可能含有传染性颗粒的空气；关门也有助于空气传播隔离病房维持负压。摘除呼吸器后立即进行手部卫生。在CDC的示例1中，手套单独先脱，护目镜或面罩在隔离衣之前摘除；这种方法同样安全，但与本题中隔离衣和手套合并为一个步骤的选项不符。我国《医院隔离技术标准》（WS/T 311—2023）资料性附录F同样是先摘手套并进行手卫生，再摘护目镜/防护面屏，然后脱隔离衣；医用防护口罩在离开污染区后才摘除，这与在病房外摘除呼吸防护用品的原则一致。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "A" }, "en"],
    before: "Gloves and gown are the most heavily contaminated items and are always removed first inside the client's room to prevent spreading pathogens.",
    after: "In this method, the gown and gloves, the most heavily contaminated items, are removed together inside the client's room, before eye protection. In CDC's other illustrated method, the gloves come off first by themselves and eye protection is removed before the gown.",
    note: "Confirmed OVERCLAIM ('always removed first') removed.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "A" }, "zh"],
    before: "手套和隔离衣是污染最严重的物品，必须首先在患者病房内脱下，以防病原体扩散。",
    after: "在这种方法中，污染最严重的隔离衣和手套在患者病房内一起脱下，先于护目镜或面罩。在CDC图示的另一种方法中，手套单独先脱，护目镜或面罩则在隔离衣之前摘除。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "en"],
    before: "Remember the critical airborne exception: all PPE is removed inside the room except for the respiratory protection (N95 or PAPR), which must be removed outside the closed room.",
    after: "Remember the critical airborne exception: all PPE is removed inside the room except the respirator, which is removed after leaving the room and closing the door. The order of the items removed inside the room depends on the removal method; this item uses the method in which the gown and gloves come off together.",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "记住空气传播隔离的关键例外：除呼吸防护装备（N95 或 PAPR）必须在关闭的病房外脱下之外，所有其他 PPE 均在病房内脱下。",
    after: "记住空气传播隔离的关键例外：除呼吸器外，所有PPE都在病房内脱下，呼吸器则在离开病房并关上门后再摘除。病房内各项物品的脱卸顺序取决于所采用的方法；本题采用隔离衣和手套一起脱下的方法。",
  }),
];

runPatch(ops);
