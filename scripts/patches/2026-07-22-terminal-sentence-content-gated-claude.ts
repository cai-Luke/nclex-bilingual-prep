import { setValue } from "../patch-raw";
import {
  runContentGatedPatch,
  type ContentChange,
} from "./terminal-sentence-content-gated-runner";

const id = "opus_case_lithium_toxicity_01";
const beforeStem = {
  en: "Lithium toxicity precipitated by thiazide diuretic initiation and volume depletion in a patient with bipolar disorder.",
  zh: "由开始使用噻嗪类利尿剂和容量消耗诱发的一名双相情感障碍患者的锂中毒。",
};
const afterStem = {
  en: "A 52-year-old woman with bipolar I disorder is admitted after a week of worsening gastrointestinal and neurologic symptoms.",
  zh: "一名患有双相 I 型障碍的 52 岁女性因胃肠道和神经系统症状持续一周加重而入院。",
};
const beforeSummary = {
  en: "A 52-year-old woman with a fifteen-year history of bipolar I disorder, well controlled on lithium carbonate 900 mg orally twice daily, is admitted to a medical-surgical unit from the emergency department. She also carries diagnoses of type 2 diabetes managed with metformin 1000 mg twice daily and newly diagnosed stage 1 hypertension. Ten days ago her primary care provider started hydrochlorothiazide (HCTZ) 25 mg daily for the hypertension. She lives alone, works as a librarian, and has a strong therapeutic alliance with her outpatient psychiatrist, whom she sees every three months. Her last outpatient lithium level, drawn six weeks ago, was 0.9 mEq/L (therapeutic range per her psychiatry clinic protocol: 0.6–1.2 mEq/L). She has no history of renal disease; her most recent outpatient creatinine four months ago was 0.9 mg/dL. She reports that over the past week she has had poor oral intake because of persistent nausea and has been urinating frequently. She attributes the nausea to \"a stomach bug\" and did not contact either provider. Her current medication administration record includes lithium carbonate 900 mg PO BID, HCTZ 25 mg PO daily, and metformin 1000 mg PO BID. There is no standing order for lithium level monitoring on admission; the admitting provider has ordered a stat serum lithium level, a basic metabolic panel, and a 12-lead ECG.\n\nThe patient arrives on the unit at 0800 accompanied by her adult daughter. She is drowsy but arousable to voice, oriented to person and place but not to date. She complains of unrelenting nausea, coarse bilateral hand tremor, and feeling \"shaky all over.\" Her daughter reports that over the past two days the patient has become increasingly confused, has had several episodes of vomiting and diarrhea, and \"can't keep water down.\" The daughter adds that her mother has seemed \"not herself\" for about a week — more irritable, unsteady on her feet, and slurring words intermittently — but the family initially attributed this to fatigue.",
  zh: "一名有15年双相I型情感障碍病史的52岁女性，服用碳酸锂900 mg每日两次口服控制良好，从急诊科收入内外科病房。她还诊断出患有2型糖尿病，服用二甲双胍1000 mg每日两次，以及新诊断的1级高血压。10天前，她的初级保健医生为她开了氢氯噻嗪（HCTZ）25 mg每日一次治疗高血压。她独居，是一名图书管理员，与门诊精神科医生治疗联盟良好，每三个月就诊一次。她最近一次门诊的锂浓度是六周前，为0.9 mEq/L（其精神科诊所方案的治疗范围：0.6–1.2 mEq/L）。她没有肾病史；她最近一次门诊肌酐是四个月前，为0.9 mg/dL。她报告说，在过去的一周里，由于持续的恶心和尿频，她的口服摄入量很差。她将恶心归因于“胃病”，并没有联系任何医生。她目前的给药记录包括碳酸锂900 mg PO BID，HCTZ 25 mg PO daily和二甲双胍1000 mg PO BID。入院时没有监测锂浓度的常规医嘱；收治医生开具了急查血清锂浓度、基础代谢组合和12导联心电图的医嘱。\n\n患者于0800在成年女儿的陪同下到达病房。她昏昏欲睡，但可被声音唤醒，对人和地点有定向力，但对日期没有。她抱怨持续的恶心、双侧手部粗大震颤，并感到“全身发抖”。她的女儿报告说，在过去的整整两天里，患者变得越来越困惑，发作了几次呕吐和腹泻，“喝不下水”。女儿补充说，大约一周以来，她母亲似乎“不太正常”——更容易烦躁、步态不稳、间歇性言语不清——但家人最初将其归因于疲劳。",
};

const changes: ContentChange[] = [
  {
    queue: 147,
    id,
    path: ["stem"],
    before: beforeStem,
    after: afterStem,
    op: setValue({
      id,
      path: ["stem"],
      before: beforeStem,
      after: afterStem,
      note: "Queue 147: replace mechanism-revealing container stem with neutral presentation framing.",
    }),
  },
  {
    queue: 147,
    id,
    path: ["caseStudy", "summary"],
    before: beforeSummary,
    after: undefined,
    op: setValue({
      id,
      path: ["caseStudy", "summary"],
      before: beforeSummary,
      after: undefined,
      note: "Queue 147: remove the optional summary that restates the precipitating mechanism.",
    }),
  },
];

runContentGatedPatch({
  bankPath: "banks/claude-canonical.json",
  reason: "apply Claude-approved terminal-sentence content-gated queue 147 repair",
  changes,
  assertPostconditions(bank) {
    const question = bank.questions.find((entry: any) => entry.id === id);
    if (!question?.stem?.en || !question?.stem?.zh) throw new Error("queue 147 bilingual stem is empty");
    if (question.caseStudy.summary !== undefined) throw new Error("queue 147 caseStudy.summary was not removed");
    if (/lithium|thiazide|volume depletion|锂|噻嗪|容量消耗/i.test(`${question.stem.en} ${question.stem.zh}`)) {
      throw new Error("queue 147 neutral stem still names the precipitant or diagnosis");
    }
  },
});
