/** Checker-oriented source and cue repairs for GPT scored-format batch 9A. */
import { runPatch, setValue } from "../patch-raw";

const battery = "gpt_format9a_esophageal_button_battery";
const npwt = "gpt_format9a_npwt_escalation";

runPatch([
  setValue({
    id: battery,
    path: ["stem"],
    before: {
      en: "A 2-year-old child was witnessed swallowing a new 20-mm lithium coin-cell battery 40 minutes ago. The child can swallow, has no known honey allergy, and has eaten nothing since the event. Honey is immediately available. The child now drools and resists swallowing. Anteroposterior and lateral radiographs show the battery lodged in the upper esophagus. Breathing is currently unlabored. Complete the bow-tie. Honey must not delay emergency transport or removal.",
      zh: "一名 2 岁儿童 40 分钟前被目击吞下一枚新的 20 mm 锂纽扣电池。儿童能够吞咽，无已知蜂蜜过敏，事件后未进食，现场可立即取得蜂蜜。儿童现流口水并拒绝吞咽。正位和侧位 X 线显示电池卡在上段食管，目前呼吸不费力。请完成蝴蝶结题。蜂蜜绝不能延误急诊转运或取出。",
    },
    after: {
      en: "A 2-year-old child was witnessed swallowing a new 20-mm lithium coin-cell battery 40 minutes ago. The child is alert, handles secretions, and can swallow without coughing or choking. The child has no known honey allergy, has eaten nothing since the event, and honey is immediately available. Anteroposterior and lateral radiographs show the battery lodged in the upper esophagus. Breathing is currently unlabored. Complete the bow-tie. Honey must not delay emergency transport or removal.",
      zh: "一名 2 岁儿童 40 分钟前被目击吞下一枚新的 20 mm 锂纽扣电池。儿童清醒，能处理口腔分泌物，并可吞咽且不咳嗽或呛咳。儿童无已知蜂蜜过敏，事件后未进食，现场可立即取得蜂蜜。正位和侧位 X 线显示电池卡在上段食管，目前呼吸不费力。请完成蝴蝶结题。蜂蜜绝不能延误急诊转运或取出。",
    },
    note: "Remove a contradictory swallowing cue so the Poison Center honey eligibility condition is explicit.",
  }),
  setValue({
    id: npwt,
    path: ["meta", "source"],
    before: "FDA, Negative Pressure Wound Therapy (NPWT) safety and labeling material, bleeding and infection precautions, https://www.fda.gov/medical-devices/guidance-documents-medical-devices-and-radiation-emitting-products/non-powered-suction-apparatus-device-intended-negative-pressure-wound-therapy-npwt-class-ii-special; 3M/Solventum, V.A.C. Therapy patient safety information and alarm/troubleshooting instructions (therapy off more than 2 hours; bleeding and infection warnings), https://www.solventum.com/en-us/home/f/b5005265132/",
    after: "FDA, Negative Pressure Wound Therapy (NPWT) safety and labeling material, bleeding and infection precautions, https://www.fda.gov/medical-devices/guidance-documents-medical-devices-and-radiation-emitting-products/non-powered-suction-apparatus-device-intended-negative-pressure-wound-therapy-npwt-class-ii-special; Solventum, V.A.C. Therapy Clinical Guidelines, bleeding warning and therapy-off-more-than-two-hours instructions, https://assets.solventum.com/is/content/mmmspinco/VAC-Therapy-Clinical-Guidelinespdf; Solventum, V.A.C. Therapy for Patients, https://www.solventum.com/en-us/home/medical/advanced-wound-care/negative-pressure-wound-therapy/vac-therapy/vac-for-patients/",
    note: "Pin the manufacturer claims to the exact current clinical-guideline and patient-safety pages.",
  }),
]);
