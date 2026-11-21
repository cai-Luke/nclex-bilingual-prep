import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_gap_jun12_matrix_iv_phlebitis_01";

export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["topic"],
    before: "Sleep & Rest",
    after: "Skin & Wound Care",
  }),
  setValue({
    id,
    path: ["correct", 1, "columnIds", 0],
    before: "c1",
    after: "c2",
  }),
  setValue({
    id,
    path: ["matrix", "columns", {"id": "c1"}, "en"],
    before: "Continue IV and reassess per policy",
    after: "Continue using the IV and reassess the site",
  }),
  setValue({
    id,
    path: ["matrix", "columns", {"id": "c1"}, "zh"],
    before: "继续使用该静脉通路，并按规定复评",
    after: "继续使用该静脉通路，并复评穿刺部位",
  }),
  setValue({
    id,
    path: ["matrix", "columns", {"id": "c2"}, "en"],
    before: "Discontinue IV, restart at a new site, and notify provider if systemic signs occur",
    after: "Remove the catheter and use a new site if IV access is still needed",
  }),
  setValue({
    id,
    path: ["matrix", "columns", {"id": "c2"}, "zh"],
    before: "停止该静脉通路，另选新部位置管；若有全身症状则通知医务人员",
    after: "拔除导管，如仍需静脉通路则另选部位置管",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "en"],
    before: "No signs and very mild early irritation can be monitored per policy, but marked pain with erythema/swelling, a palpable cord, or purulent drainage indicates phlebitis that requires discontinuing the IV and restarting at a new site.",
    after: "A healthy site can remain in use with regular reassessment. Two or more of the following findings warrant catheter removal even when mild: pain at the site, redness, and swelling. A palpable venous cord or purulent drainage also warrants removal.",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "zh"],
    before: "无异常或非常轻微的早期刺激可按规定观察；但明显疼痛伴发红/肿胀、可触及条索或脓性分泌物提示静脉炎，需要停止该通路并另选新部位置管。",
    after: "穿刺部位无异常时，可继续使用导管并定期复评。穿刺部位疼痛、发红和肿胀中只要出现两项或以上，即使程度轻微也应拔管。可触及静脉条索或出现脓性分泌物时也应拔管。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "r1"}, "en"],
    before: "A grade 0 site has no phlebitis cues, so continuing and reassessing per policy is appropriate.",
    after: "A healthy site has a Visual Infusion Phlebitis (VIP) score of 0. Continue using the catheter and check the site regularly.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "r1"}, "zh"],
    before: "0 级部位无静脉炎线索，因此可继续使用并按规定复评。",
    after: "穿刺部位无异常，视觉输液静脉炎（VIP）评分为 0 分。可继续使用导管并定期检查穿刺部位。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "r2"}, "en"],
    before: "Mild pain with faint erythema and slight swelling is an early finding that can be closely monitored according to facility policy.",
    after: "Redness and swelling already meet the VIP score 2 threshold for early phlebitis. Tenderness is an additional finding. Remove the catheter even though the signs are mild.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "r2"}, "zh"],
    before: "轻度疼痛、淡红斑和轻微肿胀属于早期表现，可按机构规定密切观察。",
    after: "发红和肿胀已达到早期静脉炎的 VIP 评分 2 分标准，触诊时还有压痛。即使表现轻微，也应拔管。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "r5"}, "en"],
    before: "Purulent drainage with a venous cord suggests severe phlebitis or infection risk, requiring removal and escalation if systemic signs are present.",
    after: "Purulent drainage at a site with a palpable venous cord raises concern for infection. Remove the catheter and promptly report the findings to the provider.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "r5"}, "zh"],
    before: "条索伴脓性分泌物提示严重静脉炎或感染风险，应拔管；如有全身症状需上报。",
    after: "静脉出现可触及的条索，且穿刺点有脓性分泌物，提示可能存在感染。应拔除导管，并及时向医疗提供者报告这些表现。",
  }),
  setValue({
    id,
    path: ["testTakingStrategy", "en"],
    before: "Escalate IV-site findings when pain is marked, inflammation tracks along the vein, a cord is palpable, or drainage appears.",
    after: "Consider the combination of findings at each site. Several mild signs together can warrant the same action as more advanced inflammation.",
  }),
  setValue({
    id,
    path: ["testTakingStrategy", "zh"],
    before: "若输液部位疼痛明显、炎症沿静脉延伸、可触及条索或出现分泌物，应升级处理。",
    after: "综合评估每个穿刺部位的表现。多种轻微体征同时出现时，可能需要采取与较严重炎症相同的措施。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runPatch(ops);
}
