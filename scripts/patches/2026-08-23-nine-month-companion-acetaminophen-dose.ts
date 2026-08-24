/**
 * Case-only clinical consistency repair for Liam's acetaminophen teaching.
 *
 * Liam's documented weight of 8.9 kg (about 19.6 lb) falls in the AAP
 * 18-to-23-lb (8-to-10-kg) band. For 160 mg/5 mL liquid acetaminophen, the
 * current AAP table lists 3.75 mL for that band, not 5 mL.
 *
 * This patch intentionally leaves the separately committed standalone bow-tie
 * untouched. It also preserves all case IDs, internal row/reference IDs,
 * answer keys, scoring, structure, and unrelated safety teaching.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/gpt-canonical.json";
export const PATCH_REASON = "correct nine-month companion case acetaminophen weight-band dose teaching";

const id = "gpt_case_nine_month_well_child_safety_01";

const ops: PatchOp[] = [
  setValue({
    id,
    path: ["caseStudy", "stages", { id: "stage_2" }, "exhibits", { id: "stage_2_update" }, "content", "en"],
    before: "As the nurse begins teaching, Danielle becomes tearful and says nobody taught her how to do these things. She aged out of foster care at 18 and has little family support. She reports that her partner becomes frustrated when Liam cries at night and suggested diphenhydramine, but she says he has not harmed Liam and usually leaves the room. Liam pulls the cosmetics pouch partly out of the diaper bag and tries to unzip it. Inside are lipstick, a compact mirror, and infant acetaminophen liquid 160 mg/5 mL without a child-resistant cap. Danielle says she removed the cap because it was hard to open quickly and gives about 1 tablespoon, or 15 mL, when Liam has a fever. The clinic/package table in the record lists 5 mL for Liam's weight band.",
    after: "As the nurse begins teaching, Danielle becomes tearful and says nobody taught her how to do these things. She aged out of foster care at 18 and has little family support. She reports that her partner becomes frustrated when Liam cries at night and suggested diphenhydramine, but she says he has not harmed Liam and usually leaves the room. Liam pulls the cosmetics pouch partly out of the diaper bag and tries to unzip it. Inside are lipstick, a compact mirror, and infant acetaminophen liquid 160 mg/5 mL without a child-resistant cap. Danielle says she removed the cap because it was hard to open quickly and gives about 1 tablespoon, or 15 mL, when Liam has a fever. The clinic/package table in the record lists 3.75 mL for Liam's weight band.",
    note: "Correct the source-derived weight-band dose while preserving the 160 mg/5 mL concentration and reported 15 mL error.",
  }),
  setValue({
    id,
    path: ["caseStudy", "stages", { id: "stage_2" }, "exhibits", { id: "stage_2_update" }, "content", "zh"],
    before: "护士开始教学时，Danielle 哭了起来，说没人教过她这些事。她 18 岁离开寄养系统，几乎没有家庭支持。她说伴侣在 Liam 夜间哭闹时会烦躁，并建议用苯海拉明，但她表示伴侣没有伤害过 Liam，通常只是离开房间。Liam 把化妆包部分拉出尿布包，并试图拉开拉链。里面有口红、粉盒镜和 160 mg/5 mL 的婴儿对乙酰氨基酚口服液，且没有儿童安全瓶盖。Danielle 说因为瓶盖难以及时打开，她把瓶盖拿掉了；Liam 发热时她会给约 1 汤匙，即 15 mL。病历中的诊所/包装剂量表列明 Liam 体重范围的剂量为 5 mL。",
    after: "护士开始教学时，Danielle 哭了起来，说没人教过她这些事。她 18 岁离开寄养系统，几乎没有家庭支持。她说伴侣在 Liam 夜间哭闹时会烦躁，并建议用苯海拉明，但她表示伴侣没有伤害过 Liam，通常只是离开房间。Liam 把化妆包部分拉出尿布包，并试图拉开拉链。里面有口红、粉盒镜和 160 mg/5 mL 的婴儿对乙酰氨基酚口服液，且没有儿童安全瓶盖。Danielle 说因为瓶盖难以及时打开，她把瓶盖拿掉了；Liam 发热时她会给约 1 汤匙，即 15 mL。病历中的诊所/包装剂量表列明 Liam 体重范围的剂量为 3.75 mL。",
    note: "Mirror the corrected weight-band dose in Simplified Chinese.",
  }),
  setValue({
    id,
    path: ["caseStudy", "stages", { id: "stage_3" }, "exhibits", { id: "stage_3_update" }, "content", "en"],
    before: "After structured teaching, Danielle correctly states that Liam should remain rear-facing until he reaches the rear-facing height or weight limit for his specific seat, should sleep alone on his back in a crib with no loose bedding, and should not receive diphenhydramine for sleep. For acetaminophen, she says she will use the syringe that came with the medicine and give 5 mL. When asked about foods, she says she will cut hot dogs into small circles and does not mention grapes. For possible ingestion, she says she will call 911 but does not mention Poison Control. She says she will try to get gates and cabinet locks this weekend. The nurse provides written teaching, a Poison Control magnet, community resources, and a follow-up appointment in one month.",
    after: "After structured teaching, Danielle correctly states that Liam should remain rear-facing until he reaches the rear-facing height or weight limit for his specific seat, should sleep alone on his back in a crib with no loose bedding, and should not receive diphenhydramine for sleep. For acetaminophen, she says she will use the syringe that came with the medicine and give 3.75 mL. When asked about foods, she says she will cut hot dogs into small circles and does not mention grapes. For possible ingestion, she says she will call 911 but does not mention Poison Control. She says she will try to get gates and cabinet locks this weekend. The nurse provides written teaching, a Poison Control magnet, community resources, and a follow-up appointment in one month.",
    note: "Make the teach-back exhibit reflect the corrected AAP weight-band dose.",
  }),
  setValue({
    id,
    path: ["caseStudy", "stages", { id: "stage_3" }, "exhibits", { id: "stage_3_update" }, "content", "zh"],
    before: "经过结构化教学后，Danielle 正确说出 Liam 应继续后向乘坐，直到达到其具体安全座椅后向模式的身高或体重上限；应独自仰卧睡在无松散床品的婴儿床中；且不应使用苯海拉明助眠。关于对乙酰氨基酚，她说会使用药物配套注射器并给 5 mL。询问食物时，她说会把热狗切成小圆片，但没有提到葡萄。若可能误服，她说会拨打 911，但没有提到 Poison Control。她说会尽量在周末买到安全门和柜锁。护士提供书面教育材料、Poison Control 磁贴、社区资源，并安排 1 个月后随访。",
    after: "经过结构化教学后，Danielle 正确说出 Liam 应继续后向乘坐，直到达到其具体安全座椅后向模式的身高或体重上限；应独自仰卧睡在无松散床品的婴儿床中；且不应使用苯海拉明助眠。关于对乙酰氨基酚，她说会使用药物配套注射器并给 3.75 mL。询问食物时，她说会把热狗切成小圆片，但没有提到葡萄。若可能误服，她说会拨打 911，但没有提到 Poison Control。她说会尽量在周末买到安全门和柜锁。护士提供书面教育材料、Poison Control 磁贴、社区资源，并安排 1 个月后随访。",
    note: "Mirror the corrected teach-back dose in Simplified Chinese.",
  }),
  setValue({
    id,
    path: ["caseStudy", "questions", { id: "gpt_case_nine_month_well_child_safety_01_q5" }, "stem", "en"],
    before: "Danielle reports giving Liam about 1 tablespoon (15 mL) of 160 mg/5 mL acetaminophen when he has a fever. The clinic/package table in the record lists 5 mL for Liam's weight band. Which actions should the nurse take before the family leaves? Select all that apply.",
    after: "Danielle reports giving Liam about 1 tablespoon (15 mL) of 160 mg/5 mL acetaminophen when he has a fever. The clinic/package table in the record lists 3.75 mL for Liam's weight band. Which actions should the nurse take before the family leaves? Select all that apply.",
    note: "Correct the answer-bearing q5 dose comparison without changing its actions or key.",
  }),
  setValue({
    id,
    path: ["caseStudy", "questions", { id: "gpt_case_nine_month_well_child_safety_01_q5" }, "stem", "zh"],
    before: "Danielle 报告 Liam 发热时会给约 1 汤匙（15 mL）的 160 mg/5 mL 对乙酰氨基酚。病历中的诊所/包装剂量表列明 Liam 体重范围的剂量为 5 mL。家属离开前，护士应采取哪些措施？请选择所有适用项。",
    after: "Danielle 报告 Liam 发热时会给约 1 汤匙（15 mL）的 160 mg/5 mL 对乙酰氨基酚。病历中的诊所/包装剂量表列明 Liam 体重范围的剂量为 3.75 mL。家属离开前，护士应采取哪些措施？请选择所有适用项。",
    note: "Mirror the corrected q5 dose comparison in Simplified Chinese.",
  }),
  setValue({
    id,
    path: ["caseStudy", "questions", { id: "gpt_case_nine_month_well_child_safety_01_q6" }, "matrix", "rows", { id: "acetaminophen_5ml" }, "en"],
    before: "States she will use the syringe and give the clinic/package dose of 5 mL.",
    after: "States she will use the syringe and give the clinic/package dose of 3.75 mL.",
    note: "Correct q6's answer-bearing teach-back row while preserving its adequate-understanding key.",
  }),
  setValue({
    id,
    path: ["caseStudy", "questions", { id: "gpt_case_nine_month_well_child_safety_01_q6" }, "matrix", "rows", { id: "acetaminophen_5ml" }, "zh"],
    before: "说出会使用注射器，并给诊所/包装标示的 5 mL 剂量。",
    after: "说出会使用注射器，并给诊所/包装标示的 3.75 mL 剂量。",
    note: "Mirror the corrected q6 teach-back row in Simplified Chinese.",
  }),
];

runPatch(ops);
