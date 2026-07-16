/** Final producer-side source-pin polish for the 2026-07-16 GPT coverage-balance batch 5 raw bank. */
import { setValue, runPatch } from "../patch-raw";

const advocacy1 = "gpt_balance5_2026_07_16_hl_client_advocacy_01";
const dialysis7 = "gpt_balance5_2026_07_16_bt_discharge_handoff_07";
const fire17 = "gpt_balance5_2026_07_16_bt_perioperative_care_17";
const fetal18 = "gpt_balance5_2026_07_16_hl_intrapartum_fetal_monitoring_18";

runPatch([
  setValue({
    id: advocacy1,
    path: ["meta", "source"],
    before: "HHS Office for Human Research Protections (OHRP), Withdrawal of Subjects from Research Guidance, Regulatory Background (45 CFR 46.116(a)(8)) and Guidance A, https://www.hhs.gov/ohrp/regulations-and-policy/guidance/guidance-on-withdrawal-of-subject/index.html",
    after: "45 CFR § 46.116(b)(8), voluntary participation and the right to discontinue without penalty or loss of benefits, https://www.govinfo.gov/content/pkg/CFR-2025-title45-vol1/pdf/CFR-2025-title45-vol1-sec46-116.pdf; HHS Office for Human Research Protections (OHRP), Withdrawal of Subjects from Research Guidance, Guidance A—discontinuing research interactions, interventions, and collection of additional identifiable private information, https://www.hhs.gov/ohrp/regulations-and-policy/guidance/guidance-on-withdrawal-of-subject/index.html",
    note: "Replace the guidance's historical pre-2018 paragraph number with the current Common Rule citation while retaining the exact withdrawal guidance.",
  }),
  setValue({
    id: dialysis7,
    path: ["meta", "source"],
    before: "CMS, Discharge Planning Rule Supports Interoperability and Patient Preferences, requirement to send necessary medical information to the responsible follow-up provider, https://www.cms.gov/newsroom/fact-sheets/cms-discharge-planning-rule-supports-interoperability-and-patient-preferences; CMS, End-Stage Renal Disease Network Program, care coordination and data-sharing context, https://www.cms.gov/medicare/quality/quality-improvement-programs/end-stage-renal-disease-esrd-network-programs",
    after: "42 CFR § 494.170(d), transfer of requested dialysis medical-record information to the receiving facility, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-494/subpart-E/section-494.170; National Kidney Foundation, Traveling While on Dialysis—arranging destination appointments and transmitting treatment dates, prescription, recent treatment records, access information, laboratory results, and medication information, https://www.kidney.org/news-stories/traveling-while-dialysis-start-here",
    note: "Replace broad discharge and ESRD-program pages with sources that directly support dialysis appointment readiness and the named transfer record set.",
  }),
  setValue({
    id: fire17,
    path: ["meta", "source"],
    before: "FDA, NDA 208288 Other Review—alcohol-based preoperative skin preparation labeling review, directions and flammability warnings to remove pooled solution/wet materials and wait until completely dry before draping or using cautery/laser; surgical-fire discussion, https://www.accessdata.fda.gov/drugsatfda_docs/nda/2018/208288Orig1s000OtherR.pdf",
    after: "FDA, NDA 208288 Other Review—alcohol-based preoperative skin preparation labeling review, directions and flammability warnings to remove pooled solution/wet materials and wait until completely dry before draping or using cautery/laser, https://www.accessdata.fda.gov/drugsatfda_docs/nda/2018/208288Orig1s000OtherR.pdf; FDA, Practical Advice for Preventing Surgical Fires, pp. 27–28—coordinate oxygen delivery, eliminate pooled alcohol preparation, allow drying, and communicate before activating an electrosurgical ignition source, https://www.fda.gov/files/drugs/published/Slides-from-Webinar--Practical-Advice-for-Preventing-Surgical-Fires--Safety-Strategies-from-the-Front-Lines-%28PDF%29.pdf",
    note: "Add the exact FDA surgical-fire source supporting the oxygen, fuel, ignition, and team-coordination decisions.",
  }),
  setValue({
    id: fetal18,
    path: ["meta", "source"],
    before: "NICE NG229, Fetal monitoring in labour, Recommendations 1.4.5–1.4.8—differentiate maternal and fetal heartbeats, available confirmation methods, and special importance in second stage, https://www.nice.org.uk/guidance/ng229/chapter/recommendations",
    after: "NICE NG229, Fetal monitoring in labour, Recommendations 1.4.5–1.4.9 and 1.4.34–1.4.36—differentiate maternal and fetal heartbeats, use an appropriate confirmation method, improve transducer signal quality, and apply heightened vigilance in second-stage labor, https://www.nice.org.uk/guidance/ng229/chapter/recommendations",
    note: "Extend the pin to the transducer-repositioning recommendation and the dedicated second-stage maternal-signal cautions.",
  }),
]);
