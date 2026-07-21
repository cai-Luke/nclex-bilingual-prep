/**
 * Targeted regeneration of gpt_format10b_hemodialysis_access_prompt_followup.
 *
 * The original highlight item combined mutually contradictory normal and
 * abnormal findings and collapsed stenosis, infection, aneurysm skin risk,
 * and hand ischemia into one implausible client. This replacement preserves
 * the highlight/recognize-cues construct while limiting the scenario to AV
 * fistula stenosis/dysfunction indicators from the KDOQI implementation tool.
 */
import { setValue, runPatch } from "../patch-raw";

const id = "gpt_format10b_hemodialysis_access_prompt_followup";

runPatch([
  setValue({
    id,
    path: ["stem"],
    before: {
      en: "The dialysis unit follows the KDOQI 2019 vascular-access monitoring tools. Highlight only the access-assessment findings that require prompt follow-up for a clinically significant lesion or dysfunction, infection, aneurysm-related skin risk, or access-related hand ischemia.",
      zh: "透析单元采用 KDOQI 2019 血管通路监测工具。请只标出血管通路评估中需要及时随访的发现，包括临床显著病变或功能障碍、感染、动脉瘤相关皮肤风险或通路相关手部缺血。",
    },
    after: {
      en: "A nurse assesses an established arteriovenous fistula before and during hemodialysis. Highlight the findings that require prompt follow-up for possible access stenosis or dysfunction.",
      zh: "护士在血液透析前及透析过程中评估一处已建立的动静脉瘘。请标出需要及时随访以评估通路可能存在狭窄或功能障碍的发现。",
    },
    note: "Limit the task to one coherent clinical construct: possible AV access stenosis or dysfunction.",
  }),
  setValue({
    id,
    path: ["rationale"],
    before: {
      correct: {
        en: "A new weak or discontinuous thrill, high-pitched systolic bruit, inability to reach target flow, new cannulation difficulty, and prolonged post-needle bleeding are lesion/dysfunction indicators. Warmth, erythema, drainage, and fever suggest infection. Ulcerated nonpinchable skin over an enlarging aneurysm creates urgent bleeding risk. A cool painful numb hand with weak pulse and reduced strength suggests access-related ischemia. An unchanged continuous thrill with a warm well-perfused hand and a small resolving bruise are reassuring.",
        zh: "新出现的微弱或间断震颤、高调收缩期杂音、无法达到目标血流量、新的穿刺困难及针眼止血时间延长，都是病变/功能障碍指标。温热、红斑、引流物和发热提示感染。增大动脉瘤上方溃疡且无法捏起的皮肤具有紧急出血风险。手部冰冷、疼痛、麻木并伴脉搏减弱和力量下降，提示通路相关缺血。持续震颤无变化、手温暖且灌注良好，以及小范围正在消退的瘀斑属于较安心发现。",
      },
      byChoice: [
        { refId: "s1", en: "An unchanged continuous thrill with a warm, well-perfused hand is reassuring rather than a prompt-follow-up cue.", zh: "持续震颤无变化且手部温暖、灌注良好，属于安心发现而非及时随访线索。" },
        { refId: "s2", en: "The new abnormal thrill/bruit and inability to reach target flow are KDOQI indicators of a clinically significant access lesion.", zh: "新出现的异常震颤/杂音及无法达到目标血流量，是 KDOQI 所列临床显著通路病变指标。" },
        { refId: "s3", en: "Local inflammatory findings with purulent drainage and fever require infection evaluation.", zh: "局部炎症发现伴脓性引流和发热，需要评估感染。" },
        { refId: "s4", en: "Ulcerated, nonpinchable skin over an enlarging aneurysm is an urgent skin-integrity and bleeding-risk finding.", zh: "增大动脉瘤上方皮肤溃疡且无法捏起，是紧急皮肤完整性和出血风险发现。" },
        { refId: "s5", en: "Coolness, pain at rest, numbness, weak pulse, and reduced grip indicate moderate-to-severe distal ischemia.", zh: "冰冷、静息痛、麻木、脉搏减弱和握力下降提示中重度远端缺血。" },
        { refId: "s6", en: "A small stable bruise that is resolving without other changes is not one of the prompt lesion, infection, aneurysm, or ischemia cues.", zh: "小范围稳定且正在消退的瘀斑，在无其他变化时不属于需要及时处理的病变、感染、动脉瘤或缺血线索。" },
        { refId: "s7", en: "New cannulation difficulty plus prolonged bleeding over three sessions is a dialysis-performance pattern requiring lesion evaluation.", zh: "新穿刺困难加连续三次透析针眼止血延长，是需要评估病变的透析表现模式。" },
      ],
    },
    after: {
      correct: {
        en: "Changes from the client's usual access examination—especially a weak or discontinuous thrill and a high-pitched systolic bruit—can indicate stenosis. Inability to achieve the prescribed target blood flow, new cannulation difficulty, and bleeding that lasts longer than usual after three consecutive sessions are dialysis indicators of possible access dysfunction. These findings require follow-up and evaluation after other causes are considered. A warm, well-perfused hand and a small resolving bruise without inflammation or pain are reassuring findings in this scenario.",
        zh: "与患者平时通路检查相比，新出现的微弱或间断震颤及高调收缩期杂音可能提示狭窄。无法达到医嘱目标血流量、新出现的穿刺困难，以及连续三次透析后针眼出血时间均较平时延长，都是通路可能功能障碍的透析指标。在考虑并排除其他原因后，这些发现需要随访评估。本情境中，手部温暖且灌注良好，以及无炎症或疼痛、正在消退的小瘀斑，属于较安心的发现。",
      },
      byChoice: [
        { refId: "s1", en: "A new weak or discontinuous thrill and high-pitched systolic bruit are abnormal physical-examination findings associated with access stenosis.", zh: "新出现的微弱或间断震颤及高调收缩期杂音，是与通路狭窄相关的异常体检发现。" },
        { refId: "s2", en: "Inability to achieve the prescribed target dialysis blood flow is an indicator of possible access dysfunction.", zh: "无法达到医嘱的透析目标血流量，是通路可能功能障碍的指标。" },
        { refId: "s3", en: "New cannulation difficulty when cannulation was previously uncomplicated requires evaluation for a clinically significant access lesion.", zh: "以往穿刺顺利而新近出现穿刺困难，需要评估是否存在临床显著的通路病变。" },
        { refId: "s4", en: "Bleeding that lasts longer than usual from needle sites after three consecutive sessions is a repeated dysfunction cue, not an isolated event.", zh: "连续三次透析后针眼出血时间均较平时延长，是反复出现的功能障碍线索，而非单次偶发事件。" },
        { refId: "s5", en: "A warm hand with brisk capillary refill indicates preserved distal perfusion and is not a stenosis/dysfunction cue in this scenario.", zh: "手部温暖且毛细血管再充盈迅速，提示远端灌注良好，在本情境中不属于狭窄或功能障碍线索。" },
        { refId: "s6", en: "A small bruise that is unchanged in size and fading without warmth, drainage, or pain is consistent with a resolving cannulation bruise.", zh: "小瘀斑大小未增加且正在变淡，并无温热、引流或疼痛，符合穿刺后瘀斑逐渐消退的表现。" },
      ],
    },
    note: "Rewrite all explanations around the single stenosis/dysfunction construct and the new six-segment answer surface.",
  }),
  setValue({
    id,
    path: ["testTakingStrategy"],
    before: {
      en: "Do not reduce access assessment to 'thrill present or absent.' KDOQI uses changes in exam, dialysis performance, skin integrity, infection findings, and distal perfusion.",
      zh: "不要把通路评估简化为“有无震颤”。KDOQI 同时关注体检变化、透析表现、皮肤完整性、感染发现及远端灌注。",
    },
    after: {
      en: "Compare today's access examination and dialysis performance with the client's usual baseline. New changes and repeated performance problems are more concerning than a stable, resolving cannulation bruise.",
      zh: "将今日的通路检查及透析表现与患者平时的基线比较。新出现的变化和反复发生的透析问题，比稳定且正在消退的穿刺瘀斑更值得关注。",
    },
    note: "Align the strategy with change-from-baseline and repeated dysfunction cues.",
  }),
  setValue({
    id,
    path: ["glossary"],
    before: [
      { termEn: "thrill", termZh: "震颤", defZh: "触诊血管通路时感到的连续振动。" },
      { termEn: "clinically significant lesion", termZh: "临床显著病变", defZh: "既有影像学狭窄又有体检或透析功能异常的通路病变。" },
      { termEn: "steal syndrome", termZh: "窃血综合征", defZh: "通路分流导致远端手部灌注不足和缺血症状。" },
    ],
    after: [
      { termEn: "thrill", termZh: "震颤", defZh: "触诊血管通路时感到的振动；其强度或连续性改变可能提示通路异常。" },
      { termEn: "bruit", termZh: "血管杂音", defZh: "听诊血管通路时听到的血流声音；音调或时相改变可能提示通路异常。" },
      { termEn: "stenosis", termZh: "狭窄", defZh: "血管通路管腔变窄，可能影响通路检查表现或透析血流。" },
    ],
    note: "Remove off-construct ischemia terminology and retain only terms needed for the revised item.",
  }),
  setValue({
    id,
    path: ["meta", "source"],
    before: "National Kidney Foundation, KDOQI 2019 Vascular Access Guideline implementation tools: 'Detection and Management of Clinically Significant AV Access Lesion (Stenosis/Thrombosis),' pp. 2-3; 'Diagnosis and Management of AV Access Infections,' pp. 2-5; 'AV Access Aneurysm and Pseudoaneurysm Management,' pp. 1-4; and 'Management of Steal or AV Access-related Hand Ischemia,' pp. 3-8, https://www.kidney.org/professionals/kdoqi/guidelines-and-commentaries/vascular-access",
    after: "National Kidney Foundation, KDOQI 2019 Vascular Access Guideline implementation tool, 'Detection and Management of Clinically Significant AV Access Lesion (Stenosis/Thrombosis),' pp. 2-3, https://www.kidney.org/sites/default/files/vait-15_detection_management_clinically_significant_av_access_lesion-stenosis_thrombosis.pdf",
    note: "Cite only the KDOQI implementation tool that supports the revised construct.",
  }),
  setValue({
    id,
    path: ["highlight"],
    before: {
      segments: [
        { id: "s0", en: "Pre-dialysis and intradialytic access assessment:", zh: "透析前及透析中通路评估：" },
        { id: "s1", en: "The fistula has the client's usual continuous thrill and bruit; the hand is warm with brisk capillary refill.", zh: "瘘管有患者一贯的持续震颤和杂音；手部温暖，毛细血管再充盈迅速。", selectable: true },
        { id: "s2", en: "A new weak, discontinuous thrill and high-pitched systolic bruit are present, and the prescribed target blood flow cannot be reached.", zh: "新出现微弱、间断的震颤和高调收缩期杂音，且无法达到医嘱目标血流量。", selectable: true },
        { id: "s3", en: "The access is warm and erythematous with purulent drainage; the client has a temperature of 38.4°C (101.1°F).", zh: "通路部位温热、红斑并有脓性引流；患者体温 38.4°C（101.1°F）。", selectable: true },
        { id: "s4", en: "An enlarging aneurysmal segment has ulcerated skin that cannot be pinched away from the access.", zh: "一段正在增大的动脉瘤样通路上方皮肤已溃疡，且无法捏起与通路分离。", selectable: true },
        { id: "s5", en: "The access-side hand is cool and numb with finger pain at rest, a weak radial pulse, and reduced grip strength.", zh: "通路侧手部冰冷、麻木，手指静息痛，桡动脉搏动微弱，握力下降。", selectable: true },
        { id: "s6", en: "A small bruise from the prior cannulation is unchanged in size and fading, without warmth, drainage, or pain.", zh: "上次穿刺形成的小瘀斑大小未增加且正在变淡，无温热、引流或疼痛。", selectable: true },
        { id: "s7", en: "Cannulation has become newly difficult, and needle-site bleeding has lasted 25 minutes after each of the last three sessions.", zh: "穿刺新近变得困难，且最近连续三次透析后针眼均出血 25 分钟才停止。", selectable: true },
      ],
      correct: ["s2", "s3", "s4", "s5", "s7"],
    },
    after: {
      segments: [
        { id: "s0", en: "Access assessment findings:", zh: "血管通路评估发现：" },
        { id: "s1", en: "The fistula previously had a continuous thrill and low-pitched bruit. Today the thrill is weak and discontinuous, with a high-pitched systolic bruit over the venous segment.", zh: "该瘘管以往可触及持续震颤，并可闻及低调血管杂音。今日震颤微弱且间断，静脉段可闻及高调收缩期杂音。", selectable: true },
        { id: "s2", en: "During dialysis, the prescribed target blood-flow rate cannot be achieved.", zh: "透析过程中无法达到医嘱的目标血流速率。", selectable: true },
        { id: "s3", en: "Cannulation has become newly difficult after previously uncomplicated sessions.", zh: "以往透析穿刺顺利，但近期新出现穿刺困难。", selectable: true },
        { id: "s4", en: "Bleeding from the needle sites continues longer than usual after each of the last three sessions.", zh: "最近连续三次透析后，针眼出血持续时间均较患者平时更长。", selectable: true },
        { id: "s5", en: "The access-side hand remains warm with brisk capillary refill.", zh: "通路侧手部仍温暖，毛细血管再充盈迅速。", selectable: true },
        { id: "s6", en: "A small bruise from the prior cannulation is unchanged in size and fading, without warmth, drainage, or pain.", zh: "上次穿刺形成的小瘀斑大小未增加且正在变淡，无温热、引流或疼痛。", selectable: true },
      ],
      correct: ["s1", "s2", "s3", "s4"],
    },
    note: "Replace the checklist collage with four supported dysfunction targets and two coherent reassuring non-targets.",
  }),
]);
