// D-2 T01, unit 02. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "cap_gpt_2026_07_02_t01_002";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["options", {"id":"E"}, "zh"],
    before: "在恢复氧合的同时，准备 suction 和 reintubation 设备。",
    after: "在恢复氧合的同时，准备用于吸引和再次气管插管的器械。",
  }),
  setValue({
    id, path: ["options", {"id":"B"}, "zh"],
    before: "协助移除该管，并使用 100% oxygen 进行 bag-mask ventilation。",
    after: "协助拔出导管，并使用 100% 氧气进行球囊面罩通气。",
  }),
  setValue({
    id, path: ["options", {"id":"A"}, "zh"],
    before: "停止依赖该管进行通气，并说明 tracheal placement 尚未确认。",
    after: "停止依赖这根导管通气，并向团队说明尚未确认导管位于气管内。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"A"}, "zh"],
    before: "正确。波形没有显示呼出 CO2，因此不能把该管当作已确认在 trachea 内。",
    after: "正确。波形未显示有 CO2 呼出，因此尚不能确认导管位于气管内。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"E"}, "zh"],
    before: "正确。恢复氧合后可能需要重新插管和 suction 设备。",
    after: "正确。恢复氧合后，可能需要使用再次插管和吸引的器械。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"C"}, "zh"],
    before: "错误。水汽凝结不能可靠确认位置，尤其是在 continuous capnography 为 flat 且临床体征不支持时。",
    after: "错误。导管内出现冷凝水不能可靠地确认导管位置，尤其是在持续监测所见的二氧化碳波形平直，又缺乏支持导管位置正确的临床体征时。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "插管后立即出现 flat waveform，并伴随无胸廓起伏、epigastric gurgling 和双侧无呼吸音，支持 esophageal placement 而不是 tracheal placement。应先用 bag-mask oxygenation 恢复通气，同时准备移除并重新置管。",
    after: "插管后立即出现平直波形，同时未见胸廓起伏、上腹部可闻及咕噜声、双肺均无呼吸音，这些表现提示导管进入了食管而非气管。应通过球囊面罩给氧恢复通气，同时团队准备拔出导管并重新插管。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "在 rapid response 中，患者刚完成 endotracheal intubation 后，通过气管管进行 bag-valve ventilation 没有看到胸廓起伏。护士在 epigastrium 听到咕噜声，双侧没有呼吸音。如下为 capnogram。护士应预期采取哪些措施？请选择所有适用项。",
    after: "快速反应团队施救时，患者刚接受气管插管，经导管用球囊通气时未见胸廓起伏。护士在上腹部听到咕噜声，双肺均未闻及呼吸音。呼气末二氧化碳波形图如下。护士应预期采取哪些措施？请选择所有适用项。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "看到 flat capnogram 时，要问题干还给了什么线索。本题中“刚插管后”加上 epigastric sounds，使 esophageal intubation 成为最安全的判断。",
    after: "看到平直的二氧化碳波形时，要结合题干中的其他线索判断。本题中，波形出现在插管后即刻，又伴有上腹部咕噜声，最稳妥的判断是食管插管。",
  }),
];

runPatch(ops);
