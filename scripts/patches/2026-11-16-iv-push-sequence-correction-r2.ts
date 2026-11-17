/**
 * Same-ID clinical-content correction for claude_a_or_iv_push_safety_14
 * (ordered_response, banks/claude-canonical.json).
 *
 * Work order: scratch/IV-PUSH-SEQUENCE-CLAUDE-CODE-WORK-ORDER-2026-11-16.md
 * Producer: Claude Code / Claude Opus 5.5. CANDIDATE ONLY — not independently reviewed.
 *
 * REVISION r2 — answers ASTRA-PRODUCER-REPAIR-REQUEST.md (r1 candidate
 * 99000aa3… BLOCKED). Same 20-path surface and same baseline preconditions.
 * Changed vs r1: stem (states the vial is not yet checked, so the listed vial
 * check is the initial one — Taylor Skill 5-4 steps 7-8, 18); rationale.correct
 * and byChoice C (repeat checks named as good practice, not unsafe);
 * rationale.correct and byChoice D (flush hazard conditional on exceeding the
 * drug's recommended rate — ISMP 5.3; accommodates adenosine's labeled rapid
 * saline flush). Options and all other r1 text unchanged.
 *
 * The existing key C,A,B,E,D is retained for an explicitly specified
 * away-from-bedside preparation workflow (ISMP 2015 IV push guidelines
 * 4.1b, 4.1c, 4.4, 5.1-5.3). The stem now states that workflow; options C, B,
 * and D are scoped by location/object (no relative-sequence words) so the
 * order is unique; rationale and strategy drop the false universal sequence
 * and the answer letters (P4).
 *
 * Preserved: item ID, itemType, taxonomy, option IDs and display order,
 * correct, glossary, option A and E text, byChoice A, all other records,
 * bank meta. Every op is an exact before/after setValue on a named leaf path.
 *
 * Integration (after independent review only): copy to scripts/patches/,
 * change the import to "../patch-raw", and run with identical --in/--out on
 * banks/claude-canonical.json plus --allow-canonical --reason --strict-parity.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/claude-canonical.json";
export const PATCH_REASON =
  "scope IV push ordered-response item to an away-from-bedside preparation workflow; remove sequence cues and positional rationale letters";

const id = "claude_a_or_iv_push_safety_14";

export const ops: PatchOp[] = [
  // --- stem -----------------------------------------------------------------
  setValue({
    id,
    path: ["stem", "en"],
    before: "A nurse prepares to administer an IV push medication. Place the following steps in the correct order.",
    after:
      "A nurse in a designated medication preparation area has taken a vial of an ordered IV push medication from the medication supply but has not yet checked its label against the medication administration record. The nurse must draw up the dose before going to the client's bedside for administration. Place the following selected steps in the correct order.",
    note: "r2: state that the vial is not yet checked, so the listed vial/MAR comparison is the initial check (Astra finding 1).",
  }),
  setValue({
    id,
    path: ["stem", "zh"],
    before: "一位护士准备给予静脉推注药物。请将以下步骤按正确顺序排列。",
    after:
      "护士在指定的药物准备区，已从药品供应处取出一瓶医嘱规定的静脉推注药物，但尚未将药瓶标签与给药记录核对。护士需要先抽取药物，再前往患者床旁给药。请将下列选定的给药步骤按正确顺序排列。",
    note: "r2: parity with EN not-yet-checked premise; retains 选定的 (D-3).",
  }),

  // --- options (IDs and display order unchanged; text only) ------------------
  setValue({
    id,
    path: ["options", { id: "B" }, "en"],
    before: "Verify the client using two patient identifiers.",
    after: "At the bedside, verify the client using two patient identifiers.",
    note: "Location scope per spec pattern.",
  }),
  setValue({
    id,
    path: ["options", { id: "B" }, "zh"],
    before: "使用两种患者识别方式核实患者身份。",
    after: "在患者床旁，使用两种患者识别方式核实患者身份。",
    note: "Location scope per spec pattern.",
  }),
  setValue({
    id,
    path: ["options", { id: "C" }, "en"],
    before: "Compare the medication label to the medication administration record.",
    after: "In the medication preparation area, compare the medication vial label with the medication administration record.",
    note: "Location + object scope: separates this check from the bedside final check and from the syringe label created when drawing up.",
  }),
  setValue({
    id,
    path: ["options", { id: "C" }, "zh"],
    before: "将药物标签与给药记录进行核对。",
    after: "在药物准备区，将药瓶标签与给药记录进行核对。",
    note: "Location + object scope.",
  }),
  setValue({
    id,
    path: ["options", { id: "D" }, "en"],
    before: "Flush the IV line with a compatible solution after administration.",
    after: "Flush the medication remaining in the IV line with a compatible solution.",
    note: "Remove sequence cue; object scope distinguishes the subsequent flush from a pre-administration patency flush.",
  }),
  setValue({
    id,
    path: ["options", { id: "D" }, "zh"],
    before: "给药后用相容溶液冲洗静脉管路。",
    after: "用相容溶液冲净静脉管路中残留的药物。",
    note: "Remove 给药后 sequence cue; object scope.",
  }),

  // --- rationale.correct (removes answer letters, P4) -------------------------
  setValue({
    id,
    path: ["rationale", "correct", "en"],
    before:
      "Safe IV push follows the five rights sequence: verify the medication, prepare the dose, confirm the patient identity, administer at the correct rate (E), then flush to clear the line.",
    after:
      "Because the vial has not yet been checked, the nurse compares its label with the medication administration record before withdrawing any medication, confirming the right drug and dose for this client's order; drawing up the dose without this check would mean preparing an unverified medication. This check prepares a known client's ordered dose and does not confirm the client's identity, and rechecking the vial and syringe after preparation is also good practice. Because the syringe will leave the preparation area, it is labeled immediately after it is drawn up. At the bedside, the nurse confirms the client with two identifiers before giving anything. Before injecting, the nurse also completes the final check of the labeled syringe against the medication administration record and assesses the IV site, its patency, and medication-specific safety such as allergies and compatibility; the earlier checks do not replace this final check. The medication is given at the prescribed, verified rate, and a compatible flush follows at the rate and volume appropriate for the drug and institutional guidelines. The medication left in the line enters the bloodstream at the speed of the flush, so a flush faster than the drug's recommended rate can deliver that residual dose too quickly.",
    note: "r2: initial-check premise tied to stem; repeat check named as good practice; flush hazard made conditional (Astra findings 1-2).",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "zh"],
    before: "安全的静脉推注遵循五对给药顺序：核对药物（C）、准备剂量（A）、确认患者身份（B）、按正确速率给药（E）、最后冲管（D）。",
    after:
      "由于药瓶尚未核对，护士在抽取任何药物前，将药瓶标签与给药记录核对，确认该患者医嘱的药物和剂量正确；未经此核对就抽取药物，意味着准备了未经核对的药物。这一核对是为已知患者的医嘱准备药物，并不是确认患者身份；药物准备后再次核对药瓶和注射器也是良好做法。由于注射器将被带离药物准备区，抽取药物后应立即标注标签。到达床旁后，护士在给予任何药物前使用两种识别方式确认患者身份。注射前，护士还需对照给药记录完成已标注注射器的最终核对，并评估静脉穿刺部位及其通畅性，以及该药物相关的安全事项，如过敏史和配伍相容性；之前的核对不能替代这一最终核对。药物按医嘱并经核实的速率给予，随后以符合该药物及机构指南的速率和容量使用相容溶液冲管。管路中残留的药物会以冲管的速度进入血液，因此若冲管速度超过该药物推荐的给药速率，残留药物可能过快进入血液。",
    note: "r2: parity with EN; removes （C）（A）（B）（E）（D）.",
  }),

  // --- rationale.byChoice (A retained unchanged) -----------------------------
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "B" }, "en"],
    before:
      "Patient identification occurs before administration, not before preparation, to confirm the right patient receives the prepared dose.",
    after:
      "Because the dose is prepared away from the bedside, the nurse confirms the client with two identifiers at the bedside before giving the medication, so the labeled syringe reaches the right client. When a medication is prepared at the bedside, identifying the client before preparation is also safe; what matters is that identity is confirmed before administration.",
    note: "Removes the false universal 'not before preparation' claim.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "B" }, "zh"],
    before: "患者身份确认在给药前进行，而不是在准备前，以确认正确患者接受准备好的剂量。",
    after:
      "由于药物是在床旁以外的地点准备的，护士在床旁给药前使用两种识别方式确认患者身份，以确保已标注的注射器用于正确的患者。若在床旁准备药物，在准备前确认患者身份同样是安全的；关键在于给药前必须确认患者身份。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "C" }, "en"],
    before: "Verifying the medication against the order is the first step before any preparation occurs.",
    after:
      "The vial has not yet been checked, so comparing its label with the medication administration record before withdrawing the dose confirms the right drug, strength, dose, and route for this client's order and keeps an unverified medication from being drawn up. Rechecking the vial and the labeled syringe after preparation is also good practice; none of these preparation checks replaces the final check against the record at the bedside.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "C" }, "zh"],
    before: "在任何准备工作之前，核对药物与医嘱是第一步。",
    after:
      "药瓶尚未核对，因此在抽取药物前将药瓶标签与给药记录核对，可确认该患者医嘱的药物、规格、剂量和给药途径正确，避免抽取未经核对的药物。药物准备后再次核对药瓶和已标注的注射器也是良好做法；但这些准备阶段的核对都不能替代床旁给药前对照给药记录进行的最终核对。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "D" }, "en"],
    before: "Flushing after administration ensures the full dose is delivered and clears the line of residual medication.",
    after:
      "A compatible flush after the medication clears the drug left in the IV line so the full dose reaches the client. That residual drug enters the bloodstream at the speed of the flush, so the flush follows the rate and volume appropriate for the drug and institutional guidelines; a flush faster than the drug's recommended rate can deliver the residual dose too quickly.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "D" }, "zh"],
    before: "给药后冲管确保完整剂量输送并清除管路中的残余药物。",
    after:
      "给药后使用相容溶液冲管，可将静脉管路中残留的药物冲入体内，确保患者获得全部剂量。残留药物会以冲管的速度进入血液，因此冲管的速率和容量应符合该药物及机构指南的要求；若冲管速度超过该药物推荐的给药速率，残留药物可能过快进入血液。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "E" }, "en"],
    before: "Administration at the correct rate follows patient identification to ensure drug safety.",
    after:
      "The medication is given only after the client's identity, the final medication check, and the IV site have been confirmed, and it is pushed at the prescribed, verified rate, because injecting too quickly can cause adverse effects.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "E" }, "zh"],
    before: "按正确速率给药在患者身份确认后进行，以确保用药安全。",
    after:
      "只有在确认患者身份、完成最终药物核对并评估静脉通路后才能给药，并按医嘱并经核实的速率推注，因为推注过快可能引起不良反应。",
  }),

  // --- testTakingStrategy ----------------------------------------------------
  setValue({
    id,
    path: ["testTakingStrategy", "en"],
    before: "The safe medication administration sequence: verify (order) → prepare → identify patient → give → flush.",
    after:
      "Separate preparation-area actions from bedside actions: verify the medication against the order before drawing it up and label the syringe immediately, then confirm the client's identity at the bedside before giving it. The five rights are checks to complete before administration, not a fixed sequence of steps; never give a medication that has not been verified and prepared.",
  }),
  setValue({
    id,
    path: ["testTakingStrategy", "zh"],
    before: "安全给药顺序：核对（医嘱）→准备→确认患者→给药→冲管。",
    after:
      "区分药物准备区的操作与床旁操作：抽取药物前对照医嘱核对药物，抽取后立即标注注射器，再到床旁于给药前确认患者身份。五对原则是给药前必须完成的核对内容，而不是固定的步骤顺序；绝不能给予未经核对和准备的药物。",
  }),
];

runPatch(ops);
