import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_deepen_2026_06_22_b_moc2_07";

export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["stem", "en"],
    before: "A client is being discharged with negative-pressure wound therapy. Facility policy: the discharge handoff must name the follow-up destination responsible for the first dressing change within 24 hours. The case manager arranged skilled nursing visits beginning tomorrow. The nurse should list the follow-up destination as the ______.",
    after: "A client is going home with negative-pressure wound therapy. The discharge plan calls for the first dressing change within 24 hours. The case manager arranged skilled nursing visits beginning tomorrow. Which service should the nurse document for the dressing change? ______",
  }),
  setValue({
    id,
    path: ["stem", "zh"],
    before: "患者将带负压伤口治疗装置出院。机构政策：出院交接必须注明负责 24 小时内首次换药的随访去向。个案管理师已安排从明天开始的专业护理上门服务。护士应将随访去向填写为 ______。",
    after: "患者将带负压伤口治疗装置回家。出院计划要求在 24 小时内首次换药。个案管理师已安排从明天开始的专业护理上门服务。护士应在交接记录中填写哪项服务负责此次换药？______",
  }),
  setValue({
    id,
    path: ["blanks", {"id": "b1"}, "prompt", "en"],
    before: "follow-up destination",
    after: "Follow-up nursing service (in English)",
  }),
  setValue({
    id,
    path: ["blanks", {"id": "b1"}, "prompt", "zh"],
    before: "随访去向",
    after: "随访护理服务（用英语填写）",
  }),
  setValue({
    id,
    path: ["blanks", {"id": "b1"}, "acceptable"],
    before: ["home health agency", "home health nursing agency", "skilled home health agency", "home health nurse", "home health nursing", "visiting nurse service", "visiting nurse agency"],
    after: ["skilled nursing visits", "skilled nursing visit", "skilled nursing", "home health nursing", "visiting nurse service"],
  }),
  setValue({
    id,
    path: ["rationale", "correct", "en"],
    before: "The arranged follow-up destination is the home health agency or home health nursing service. The handoff should identify the service responsible for the first dressing change, not simply state that the client has a device.",
    after: "The case manager arranged skilled nursing visits at home. Documenting this service tells the receiving team how the first dressing change will be provided.",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "zh"],
    before: "已安排的随访去向是居家护理机构或居家护理服务。交接应明确负责首次换药的服务方，而不只是说明患者带有装置。",
    after: "个案管理师已安排专业护理上门服务。在交接记录中注明这项服务，可让接手团队了解首次换药将如何落实。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "b1"}, "en"],
    before: "Acceptable answers name the home-health follow-up destination or service, such as 'home health agency' or 'visiting nurse service.'",
    after: "Skilled nursing visits provide the wound care in this discharge plan. Home health nursing and visiting nurse service also describe the arranged service.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "b1"}, "zh"],
    before: "可接受答案应写出居家护理随访去向或服务，例如“home health agency”或“visiting nurse service”。",
    after: "出院计划安排由护士上门提供伤口护理。“Home health nursing”（居家护理）和“visiting nurse service”（护士上门服务）也可用来描述这项安排。",
  }),
  setValue({
    id,
    path: ["testTakingStrategy", "en"],
    before: "Use the clues about what was actually arranged. A discharge handoff should identify who owns the first postdischarge task.",
    after: "Connect the task due after discharge with the service already arranged to carry it out.",
  }),
  setValue({
    id,
    path: ["testTakingStrategy", "zh"],
    before: "根据题干中已经安排的服务作答。出院交接应说明出院后第一项护理任务由谁负责。",
    after: "将出院后需要完成的任务与已安排承担该任务的服务对应起来。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runPatch(ops);
}
