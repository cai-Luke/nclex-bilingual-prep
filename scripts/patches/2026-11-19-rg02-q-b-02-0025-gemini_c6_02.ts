/**
 * RG-02 Track A candidate — Q-B-02-0025 / gemini_c6_02 (banks/gemini-canonical.json questions[336]).
 * PRODUCER ARGUMENT (header and `note` fields): sealed from the RG-02 checker until Stage C.
 *
 * Confirmed defect: overlapping lid and position actions forced into an order, and an ambiguous duration option.
 * Repair: lid-holding is scoped to the water stream (location), eye-rolling to held-open lids (state),
 * and the duration option becomes the completion of a sourced minimum (Cornell EHS; CCOHS: 15 minutes).
 * The unsourced "20" is removed and no chemical-specific duration is authored. Key unchanged (A,B,C,D,E).
 * PARITY_REPAIR: byChoice A zh typo 「确保护送即时水流」. A declared rule-10 single-language exception
 * (en sibling already correct), so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c6_02";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["options", { id: "C" }, "en"],
    before: "Hold the eyelids open with the thumb and index finger.",
    after: "In the water stream, hold the eyelids open with the thumb and index finger.",
    note: "Location scope: describes lid-holding in the stream, so it presupposes option B. Same action identity.",
  }),
  setValue({
    id: ID, path: ["options", { id: "C" }, "zh"],
    before: "用拇指和食指撑开眼睑。",
    after: "在水流中用拇指和食指撑开眼睑。",
  }),
  setValue({
    id: ID, path: ["options", { id: "D" }, "en"],
    before: "Roll the eye around while flushing to ensure thorough irrigation.",
    after: "With the eyelids held open, roll the eye in all directions to irrigate the entire surface.",
    note: "State scope: presupposes option C. Removes the baseline 'while' cue. Same action identity.",
  }),
  setValue({
    id: ID, path: ["options", { id: "D" }, "zh"],
    before: "冲洗时转动眼球，以确保彻底冲洗。",
    after: "保持眼睑撑开，向各个方向转动眼球，以冲洗整个眼表。",
  }),
  setValue({
    id: ID, path: ["options", { id: "E" }, "en"],
    before: "Flush for a minimum of 15 to 20 minutes.",
    after: "Complete at least 15 minutes of continuous flushing.",
    note: "Completion event rather than an overlapping interval. Number sourced: Cornell §5.5.2 'Flush continuously for at least 15 minutes'; CCOHS 'minimum of 15 minutes'.",
  }),
  setValue({
    id: ID, path: ["options", { id: "E" }, "zh"],
    before: "冲洗至少15到20分钟。",
    after: "完成至少15分钟的持续冲洗。",
  }),
  setValue({
    id: ID, path: ["rationale", "correct", "en"],
    before: "The correct sequence starts with activating the water, positioning the eye, holding it open, ensuring coverage by moving the eye, and maintaining irrigation for the recommended duration.",
    after: "Emergency eye irrigation starts with water flow: the eyewash is activated first so that there is a stream to bring the eye into. The eye goes into the stream at once, and there the eyelids are held open with the thumb and index finger so that the water reaches the eye surface; holding them open is part of getting water onto the eye and does not delay flushing. With the eyelids held open, the eye is rolled in all directions so the water reaches the whole surface. Flushing continues without interruption until at least 15 minutes of irrigation are complete. Some chemicals need longer flushing, and medical evaluation follows.",
  }),
  setValue({
    id: ID, path: ["rationale", "correct", "zh"],
    before: "正确的顺序是从启动水源开始，定位眼睛，撑开眼睑，通过移动眼球确保覆盖，并维持建议时长的冲洗。",
    after: "紧急洗眼从出水开始：先启动洗眼站，才有水流可以让眼睛进入。眼睛随即进入水流，并在水流中用拇指和食指撑开眼睑，使水流能够到达眼球表面；撑开眼睑是让水流接触眼睛的一部分，不会延误冲洗。保持眼睑撑开，向各个方向转动眼球，使水流冲洗到整个眼表。持续不间断地冲洗，直至完成至少15分钟的冲洗。某些化学品需要更长时间的冲洗，冲洗后应接受医疗评估。",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "A" }, "zh"],
    before: "启动洗眼站是确保护送即时水流的第一步。",
    after: "启动洗眼站是确保即时出水的第一步。",
    note: "PARITY_REPAIR (translation only). The en sibling already reads 'Activating the eyewash station is the first step to ensure immediate water flow.' Declared parityException.",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "E" }, "en"],
    before: "Flushing for the full 15-20 minutes is critical for effective decontamination.",
    after: "Completing at least 15 minutes of continuous flushing is the general minimum after a chemical splash to the eye; some chemicals need longer flushing.",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "E" }, "zh"],
    before: "冲洗足足 15-20 分钟对于有效的去污至关重要。",
    after: "化学品溅入眼睛后，完成至少15分钟的持续冲洗是一般最低要求；某些化学品需要更长时间的冲洗。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
