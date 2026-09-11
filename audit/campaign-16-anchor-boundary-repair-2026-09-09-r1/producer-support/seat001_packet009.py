import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from producer_io import write_packet

def R(part, boundary, disposition, evidence, leak, bilingual, confidence, exception):
    return dict(partId=part, proposedBoundary=boundary, disposition=disposition,
                earliestBoundaryEvidence=evidence, laterStageLeakCheck=leak,
                bilingualRelation=bilingual, confidence=confidence, exceptionReason=exception)

rows = [
R('gpt_case_premium_2026_06_10_case05_mc_assessment_01', {'kind':'baseline'}, 'BASELINE',
  'The global visit already supplies difficulty with dense medication labels, elementary reading level, preferred Spanish, and a request for nephew involvement. The bilingual response choices can be assessed for a respectful health-literacy inquiry using this initial context.',
  'The lab_and_call update reports whether a picture schedule helped and clarifies later nephew permission. Neither result is needed to choose a non-shaming initial assessment response that addresses the client directly.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_2026_06_10_case05_matrix_understanding_02', {'kind':'baseline'}, 'BASELINE',
  'Every matrix cue is present in the bilingual global visit and repeated in the row: irregular thyroid-pill use, excessive label text, Spanish preference, requested nephew involvement, and a basic phone. The task classifies barriers and potential supports rather than actual later adherence.',
  'lab_and_call adds observed benefit from pictures, refill misses, and a lab trend. Those later findings do not change whether the initial five explicitly supplied cues are barriers or potential supports.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_2026_06_10_case05_cloze_teaching_03', {'kind':'baseline'}, 'BASELINE',
  'The baseline reading and language needs justify comparing a preferred-language picture schedule with dense English text or complex physiology. Both-language dropdowns also specify how understanding will be checked, so the teaching strategy is answerable before its use.',
  'lab_and_call explicitly reports that the picture schedule helped. That is later validation of an already answerable teaching choice and must not be used to delay or determine this planning boundary.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_2026_06_10_case05_sata_adherence_04', {'kind':'baseline'}, 'BASELINE',
  'The bilingual baseline summary explicitly identifies refill planning and client-directed support as needs; the global visit adds irregular dosing, the waking/work routine, language barriers, a phone, and requested nephew involvement. The options propose prevention of refill gaps and permission-seeking, without requiring a completed later refill failure.',
  'lab_and_call gives a specific two-dose refill lapse, later permission, and TSH improvement, but these merely reinforce the preventive strategies already supported by the baseline summary and visit. The hidden rationale reference to that lapse is not required pre-answer evidence.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_2026_06_10_case05_mc_evaluate_05', {'kind':'baseline'}, 'BASELINE',
  'This part supplies complete candidate follow-up findings in both languages, including the client reporting benefit from a picture schedule and describing consistent waking-time dosing. With the initial adherence problem, those stated candidates can be compared for evidence of learning without retrieving an observed update.',
  'lab_and_call repeats the helpful-picture-schedule statement and also adds labs and missed refills. The item asks which supplied finding best demonstrates success, not which event actually occurred; no later confirmation is needed to evaluate the alternatives.', 'PARALLEL', 'HIGH', None),
R('gpt_case_gap_2026_06_11_pressure_ltc_part_1_matrix_risk', {'kind':'baseline'}, 'BASELINE',
  'The global skin-risk huddle describes limited turning, wet briefs and stool exposure, poor intake, heels on the mattress, and blanchable sacral redness in both languages. The matrix repeats each finding and asks its prevention concern, requiring zero stage updates.',
  'stage_48h reports offloading, moisture treatment, improved intake, and resolution of redness. Those responses are unnecessary for identifying the original risk drivers and would disclose later effectiveness while classifying baseline cues.', 'PARALLEL', 'HIGH', None),
R('gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan', {'kind':'baseline'}, 'BASELINE',
  'The bilingual global huddle provides the resident immobility, heel pressure, incontinence exposure, poor intake, and intact reddened skin. These initial risks directly support evaluating the proposed repositioning, offloading, moisture, support-surface, and dietitian actions.',
  'stage_48h shows several selected preventive measures already implemented and followed by improvement. That later response confirms the plan but is not information needed to select initial prevention measures.', 'PARALLEL', 'HIGH', None),
R('gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate', {'kind':'baseline'}, 'BASELINE',
  'The global resident context establishes the need for assisted repositioning. In both languages the delegation alternatives explicitly distinguish following a posted plan and reporting changes from independently assessing, staging, revising frequency, or selecting a surface; no later assessment data are required.',
  'The stage_48h staff documentation confirms that an individualized plan was implemented. The safe-delegation option already includes the condition of an established posted plan, so that later confirmation is not required to judge the task.', 'PARALLEL', 'HIGH', None),
R('gpt_case_gap_2026_06_11_pressure_ltc_part_4_cloze_outcome', 'stage_48h', 'STAGE',
  'Both-language stem and cloze explicitly ask evaluation of the actual 48-hour update and do not supply its skin findings. stage_48h first reports moisture control, redness resolving after pressure relief, intact skin, less burning, and improved intake needed to assess the plan trajectory.',
  'Baseline alone provides risk and discomfort with no response data. Here the observed response is the subject of the outcome-evaluation task, rather than evidence used to justify an earlier intervention choice; stage_48h is the earliest and only applicable update.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_health_literacy_diabetes_01_matrix_cues', {'kind':'baseline'}, 'BASELINE',
  'The global nurse note and assessment supply glipizide misuse, skipped breakfast, the low fasting readings, intact foot skin, and preference for pictures with short instructions. The same bilingual facts are repeated in the matrix, so focused-teaching versus follow-up classification needs no declared update.',
  'planning adds provider requests and available education/referral resources without changing any matrix cue. Those resources are unnecessary to classify the medication-use, glucose, foot, and learning findings already visible globally.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_health_literacy_diabetes_01_cloze_priority', {'kind':'baseline'}, 'BASELINE',
  'The global bilingual clinic note describes taking the new glucose-lowering pill when shaky and skipping breakfast, while the global log provides repeated low values. This is sufficient context for choosing the priority symptom-management teaching from the supplied cloze alternatives.',
  'planning requests reinforcement of medication safety and lists team resources, but contributes no missing symptom or glucose finding. Existing planning anchors on other siblings do not determine this part boundary.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_risk', {'kind':'baseline'}, 'BASELINE',
  'All five bilingual matrix findings are documented in the global rehabilitation note and focused assessment: slowly blanching sacrum, avoided fluids, four days without stool, assisted walker standing with limited endurance, and daughter night-work/fall concerns. Multiple-concern classification is possible at baseline.',
  'discharge_planning adds therapy availability, bowel orders, and unit protocols. It does not supply a missing risk cue, and the existing stage-bound delegation sibling is not a reason to delay this baseline risk matrix.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer', {'kind':'baseline'}, 'BASELINE',
  'The own bilingual stem specifies a bed-to-chair transfer with a walker, and the global note establishes that the client can stand with assistance. The provided environmental setup, preparation, tolerance assessment, transfer, and reach-safety actions can be ordered from that context.',
  'The afternoon gait assessment and equipment-training availability in discharge_planning are not required to order this explicitly described assisted transfer. The part needs neither later endurance results nor discharge decisions.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_rehab_pressure_bowel_02_cloze_skin', {'kind':'baseline'}, 'BASELINE',
  'The global bilingual focused assessment and summary already identify limited mobility, urinary moisture, assisted repositioning, and sacral color change. These facts support selecting the skin-risk cause and prevention bundle in the own cloze.',
  'discharge_planning mentions a unit prevention bundle and prescribed bowel regimen, but the skin measures are answerable from the existing risks. The stool-softener alternative is a supplied distractor, not a prerequisite to the pressure-risk judgment.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_rehab_pressure_bowel_02_fib_intake', {'kind':'baseline'}, 'BASELINE',
  'The English and Chinese stems provide every quantity and the stated ounce-to-milliliter conversion for the intake calculation: water, milk, and soup. The requested total can be derived entirely from the part itself before any case update.',
  'discharge_planning contains no intake quantities used by this calculation. Therapy, bowel orders, and prevention protocols cannot change the arithmetic supplied in the stem and are not needed to answer it.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_caregiver_adaptation_dementia_03_matrix_cues', {'kind':'baseline'}, 'BASELINE',
  'The two global bilingual home-visit exhibits report wrist holding and yelling, disabled smoke alarm, short spouse sleep, missed antihypertensive doses, and absence of wrist injury. Every finding is restated in the matrix, allowing interpretation before resources are introduced.',
  'support_plan supplies respite, social work, therapy, provider, and adult-son availability but no missing assessment finding. Resource availability is not needed to identify the baseline strain, safety, coordination, and reassuring cues.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_caregiver_adaptation_dementia_03_mc_response', {'kind':'baseline'}, 'BASELINE',
  'The own bilingual stem supplies the spouse distressed statement, and global notes already describe exhaustion, wrist holding, fear of losing control, and no visible injury. These visible facts suffice to compare the offered therapeutic responses and immediate support inquiry.',
  'support_plan details specific services and son participation. The selected response opens assessment of support needed today without presuming any particular service is available, so later resource information is unnecessary.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_occupational_exposure_vaccine_04_or_initial', {'kind':'baseline'}, 'BASELINE',
  'The global bilingual incident note describes the puncture, unactivated used needle, ongoing clinic line, and available source contact. The global policy gives immediate wound care, reporting, source privacy, and employee-health follow-up; the own options supply the care-coverage action needed for the sequence.',
  'qi_review introduces disposal-system hazards and uncertain hepatitis B antibody documentation. Those may inform subsequent exposure assessment and quality improvement, but are not required to order the initial actions already grounded in global policy.', 'PARALLEL', 'HIGH', None),
R('gpt_case_premium_next_case_occupational_exposure_vaccine_04_cloze_exposure', {'kind':'baseline'}, 'BASELINE',
  'The bilingual global incident explicitly describes skin puncture by a used needle, and the global policy prescribes washing and employee-health risk assessment. These facts directly support the exposure-route and initial-management cloze without opening qi_review.',
  'The later container observations and hepatitis B documentation question do not change the stated exposure route or first response. No sibling quality-improvement anchor or later immunity information is required for this part.', 'PARALLEL', 'HIGH', None),
]

write_packet('repair-009', rows, '/root/producer_001_009')
