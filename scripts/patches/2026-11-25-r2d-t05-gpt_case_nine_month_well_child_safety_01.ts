/**
 * R2 D-2 tranche 5, unit 03: zh-only meaning repair for gpt_case_nine_month_well_child_safety_01 (banks/gpt-canonical.json questions[348]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T05/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_nine_month_well_child_safety_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_update"},"content","zh"],
    before: "经过结构化教学后，Danielle 正确说出 Liam 应继续后向乘坐，直到达到其具体安全座椅后向模式的身高或体重上限；应独自仰卧睡在无松散床品的婴儿床中；且不应使用苯海拉明助眠。关于对乙酰氨基酚，她说会使用药物配套注射器并给 3.75 mL。询问食物时，她说会把热狗切成小圆片，但没有提到葡萄。若可能误服，她说会拨打 911，但没有提到 Poison Control。Danielle 说：“我知道楼梯需要安全门，放清洁用品的柜子需要锁。我今天买不起，能帮我获得这些设备吗？在此之前，我会让 Liam 在封闭的游戏区活动并直接看护，把清洁用品移到上锁且他无法接触的地方。”护士提供书面教育材料、Poison Control 磁贴、社区资源，并安排 1 个月后随访。",
    after: "经过结构化教学后，Danielle 正确说出 Liam 应继续后向乘坐，直到达到其具体安全座椅后向模式的身高或体重上限；应独自仰卧睡在无松散床品的婴儿床中；且不应使用苯海拉明助眠。关于对乙酰氨基酚，她说会使用药物配套注射器并给 3.75 mL。询问食物时，她说会把热狗切成小圆片，但没有提到葡萄。若可能误服，她说会拨打 911，但没有提到中毒控制中心。Danielle 说：“我知道楼梯需要安全门，放清洁用品的柜子需要锁。我今天买不起，能帮我获得这些设备吗？在此之前，我会让 Liam 在封闭的游戏区活动并直接看护，把清洁用品移到上锁且他无法接触的地方。”护士提供书面教育材料、中毒控制中心的磁贴、社区资源，并安排 1 个月后随访。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_nine_month_well_child_safety_01_q5"},"options",{"id":"notify_if_exposure"},"zh"],
    before: "若报告近期或反复过量给药，应通知医护提供者并按指示联系 Poison Control。",
    after: "若报告近期或反复过量给药，应通知医护提供者并按指示联系中毒控制中心。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_nine_month_well_child_safety_01_q5"},"options",{"id":"serum_labs_by_provider"},"zh"],
    before: "若医护提供者或 Poison Control 认为需要，应准备采集血清对乙酰氨基酚水平和肝功能检查。",
    after: "若医护提供者或中毒控制中心认为需要，应准备采集血清对乙酰氨基酚水平和肝功能检查。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_nine_month_well_child_safety_01_q5"},"rationale","byChoice",{"refId":"notify_if_exposure"},"zh"],
    before: "可能的近期或反复过量超出常规教学范围，需要医护提供者和 Poison Control 指导。",
    after: "可能的近期或反复过量超出常规教学范围，需要医护提供者和中毒控制中心的指导。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_nine_month_well_child_safety_01_q6"},"rationale","correct","zh"],
    before: "Danielle 能准确复述后向安全座椅、安全睡眠、不用苯海拉明助眠，以及病例所列对乙酰氨基酚剂量。把热狗切成圆片且未提葡萄需要立即再教育，因为圆形/圆柱形仍有危险。任何误服都打 911 的说法不完整；对清醒、能呼吸的儿童应联系 Poison Control，911 用于无反应、呼吸困难或抽搐等严重情况。她明确指出需要的设备、说明费用障碍、请求帮助并提出临时保护计划。因此应协助解决获取途径，并核实临时保护措施是否可行。",
    after: "Danielle 能准确复述后向安全座椅、安全睡眠、不用苯海拉明助眠，以及病例所列对乙酰氨基酚剂量。把热狗切成圆片且未提葡萄需要立即再教育，因为圆形/圆柱形仍有危险。任何误服都打 911 的说法不完整；对清醒、能呼吸的儿童应联系中毒控制中心，911 用于无反应、呼吸困难或抽搐等严重情况。她明确指出需要的设备、说明费用障碍、请求帮助并提出临时保护计划。因此应协助解决获取途径，并核实临时保护措施是否可行。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
