const fs = require('fs');

const data = {
  "meta": {
    "schemaVersion": "1.4",
    "exam": "NCLEX-RN",
    "topic": "lithium toxicity",
    "category": "Pharmacological and Parenteral Therapies",
    "difficulty": "hard",
    "count": 2
  },
  "questions": [
    {
      "id": "opus_case_lithium_toxicity_01",
      "itemType": "case_study",
      "category": "Pharmacological and Parenteral Therapies",
      "topic": "lithium toxicity",
      "difficulty": "hard",
      "stem": {
        "en": "Lithium toxicity precipitated by thiazide diuretic initiation and volume depletion in a patient with bipolar disorder.",
        "zh": "由开始使用噻嗪类利尿剂和容量消耗诱发的一名双相情感障碍患者的锂中毒。"
      },
      "rationale": {
        "correct": {
          "en": "A case study evaluating the nursing care of a patient with severe lithium toxicity precipitated by hydrochlorothiazide and volume depletion.",
          "zh": "一项评估由氢氯噻嗪和容量消耗诱发的严重锂中毒患者护理的案例研究。"
        }
      },
      "testTakingStrategy": {
        "en": "Review the timeline of medication additions, hydration status, and neurological changes to understand the disease progression.",
        "zh": "回顾增加药物、水合状态和神经系统变化的时间线，以了解疾病进展。"
      },
      "glossary": [
        {
          "termEn": "Lithium toxicity",
          "termZh": "锂中毒",
          "defZh": "由于体内锂的积累而导致的一系列神经和全身症状，通常由于肾脏清除率降低引起。"
        },
        {
          "termEn": "Hemodialysis",
          "termZh": "血液透析",
          "defZh": "一种通过机器从血液中过滤废物和过量水分的治疗方法，在此处用于快速清除锂。"
        }
      ],
      "caseStudy": {
        "title": {
          "en": "Lithium toxicity in a patient with bipolar disorder",
          "zh": "双相情感障碍患者的锂中毒"
        },
        "summary": {
          "en": "A 52-year-old woman with a fifteen-year history of bipolar I disorder, well controlled on lithium carbonate 900 mg orally twice daily, is admitted to a medical-surgical unit from the emergency department. She also carries diagnoses of type 2 diabetes managed with metformin 1000 mg twice daily and newly diagnosed stage 1 hypertension. Ten days ago her primary care provider started hydrochlorothiazide (HCTZ) 25 mg daily for the hypertension. She lives alone, works as a librarian, and has a strong therapeutic alliance with her outpatient psychiatrist, whom she sees every three months. Her last outpatient lithium level, drawn six weeks ago, was 0.9 mEq/L (therapeutic range per her psychiatry clinic protocol: 0.6–1.2 mEq/L). She has no history of renal disease; her most recent outpatient creatinine four months ago was 0.9 mg/dL. She reports that over the past week she has had poor oral intake because of persistent nausea and has been urinating frequently. She attributes the nausea to \"a stomach bug\" and did not contact either provider. Her current medication administration record includes lithium carbonate 900 mg PO BID, HCTZ 25 mg PO daily, and metformin 1000 mg PO BID. There is no standing order for lithium level monitoring on admission; the admitting provider has ordered a stat serum lithium level, a basic metabolic panel, and a 12-lead ECG.\n\nThe patient arrives on the unit at 0800 accompanied by her adult daughter. She is drowsy but arousable to voice, oriented to person and place but not to date. She complains of unrelenting nausea, coarse bilateral hand tremor, and feeling \"shaky all over.\" Her daughter reports that over the past two days the patient has become increasingly confused, has had several episodes of vomiting and diarrhea, and \"can't keep water down.\" The daughter adds that her mother has seemed \"not herself\" for about a week — more irritable, unsteady on her feet, and slurring words intermittently — but the family initially attributed this to fatigue.",
          "zh": "一名有15年双相I型情感障碍病史的52岁女性，服用碳酸锂900 mg每日两次口服控制良好，从急诊科收入内外科病房。她还诊断出患有2型糖尿病，服用二甲双胍1000 mg每日两次，以及新诊断的1级高血压。10天前，她的初级保健医生为她开了氢氯噻嗪（HCTZ）25 mg每日一次治疗高血压。她独居，是一名图书管理员，与门诊精神科医生治疗联盟良好，每三个月就诊一次。她最近一次门诊的锂浓度是六周前，为0.9 mEq/L（其精神科诊所方案的治疗范围：0.6–1.2 mEq/L）。她没有肾病史；她最近一次门诊肌酐是四个月前，为0.9 mg/dL。她报告说，在过去的一周里，由于持续的恶心和尿频，她的口服摄入量很差。她将恶心归因于“胃病”，并没有联系任何医生。她目前的给药记录包括碳酸锂900 mg PO BID，HCTZ 25 mg PO daily和二甲双胍1000 mg PO BID。入院时没有监测锂浓度的常规医嘱；收治医生开具了急查血清锂浓度、基础代谢组合和12导联心电图的医嘱。\n\n患者于0800在成年女儿的陪同下到达病房。她昏昏欲睡，但可被声音唤醒，对人和地点有定向力，但对日期没有。她抱怨持续的恶心、双侧手部粗大震颤，并感到“全身发抖”。她的女儿报告说，在过去的整整两天里，患者变得越来越困惑，发作了几次呕吐和腹泻，“喝不下水”。女儿补充说，大约一周以来，她母亲似乎“不太正常”——更容易烦躁、步态不稳、间歇性言语不清——但家人最初将其归因于疲劳。"
        },
        "exhibits": [
          {
            "id": "exhibit_admission",
            "name": {
              "en": "Admission Assessment & Labs (0800)",
              "zh": "入院评估与化验 (0800)"
            },
            "content": {
              "en": "ASSESSMENT FINDINGS\nTemperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air. Weight 64 kg (her documented outpatient weight four weeks ago was 68 kg). Mucous membranes dry and tacky. Skin turgor decreased, with tenting over the sternum lasting three seconds. Pupils equal, round, reactive, 3 mm bilaterally. Coarse, irregular tremor in both hands at rest and with intention; no tremor at her last outpatient visit per psychiatry notes. Deep tendon reflexes 3+ bilaterally at the patellar and Achilles tendons with three beats of non-sustained ankle clonus. Gait not assessed because of unsteadiness; the patient is placed on fall precautions. Bowel sounds hyperactive in all four quadrants. Abdomen soft, non-tender. Lungs clear bilaterally. Heart sounds regular, no murmur. Peripheral pulses palpable but thready. Capillary refill 3 seconds in the fingernail beds. Foley catheter inserted per ED; urine output in the ED over the preceding two hours was 40 mL total (approximately 0.3 mL/kg/hr). The patient is able to follow simple commands but drifts off between questions. Glasgow Coma Scale: eye opening to voice (3), confused verbal responses (4), localizes to pain (5) — total 12.\n\nLABORATORY DATA\nSerum lithium level: 2.8 mEq/L (therapeutic range per clinic protocol: 0.6–1.2 mEq/L; levels above 1.5 mEq/L are considered toxic). Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL. eGFR calculated at 28 mL/min/1.73 m². Serum osmolality 312 mOsm/kg (reference 275–295). ECG: sinus tachycardia at 102 bpm, flattened T waves in leads V4–V6, no ST changes, QTc 460 ms.",
              "zh": "评估发现\n体温37.1 °C，心率102且规律，血压98/62，呼吸频率18，室内空气下SpO₂ 96%。体重64 kg（她四周前记录的门诊体重为68 kg）。黏膜干燥、发粘。皮肤弹性降低，胸骨上方捏起皮肤持续3秒。双侧瞳孔等大、圆形、对光反射灵敏，3 mm。休息和意向性活动时双手出现不规则的粗大震颤；根据精神科记录，她最后一次门诊就诊时没有震颤。双侧髌骨和跟腱深反射3+，伴有三次非持续性踝阵挛。由于不稳，未评估步态；对患者采取防跌倒预防措施。所有四个象限的肠鸣音活跃。腹部柔软，无压痛。双肺呼吸音清。心音规律，无杂音。周围脉搏可触及但细弱。指甲床毛细血管充盈时间3秒。急诊科留置了导尿管；过去两小时内急诊科的尿量总计为40 mL（约0.3 mL/kg/hr）。患者能够遵循简单的指令，但在问题之间会走神。格拉斯哥昏迷量表：对声音睁眼（3），言语反应混乱（4），对疼痛有定位（5）——总分12。\n\n实验室数据\n血清锂浓度：2.8 mEq/L（根据诊所方案的治疗范围：0.6–1.2 mEq/L；高于1.5 mEq/L视为中毒）。钠148 mEq/L，钾3.1 mEq/L，氯96 mEq/L，碳酸氢盐30 mEq/L，BUN 38 mg/dL，肌酐1.9 mg/dL（基线0.9 mg/dL），葡萄糖142 mg/dL，钙9.4 mg/dL，镁1.6 mg/dL（参考值1.7–2.2 mg/dL），磷3.8 mg/dL。eGFR计算为28 mL/min/1.73 m²。血清渗透压312 mOsm/kg（参考值275–295）。心电图：窦性心动过速，102 bpm，V4–V6导联T波平坦，无ST段改变，QTc 460 ms。"
            }
          }
        ],
        "stages": [
          {
            "id": "stage_1",
            "narrative": {
              "en": "Stage 1 — 0800 to 1200 (first four hours on the unit).",
              "zh": "阶段1 — 0800至1200（在病房的前四个小时）。"
            },
            "exhibits": [
              {
                "id": "exhibit_stage1",
                "name": {
                  "en": "Clinical Course (0800-1200)",
                  "zh": "临床病程 (0800-1200)"
                },
                "content": {
                  "en": "The admitting provider reviews the labs and orders: discontinue lithium, discontinue HCTZ, hold metformin (eGFR < 30), initiate normal saline (0.9% NaCl) IV bolus 500 mL over one hour then 200 mL/hr continuous, strict intake and output, serum lithium level and basic metabolic panel to be redrawn at 1200, continuous cardiac monitoring, and seizure precautions. The nurse initiates the IV fluid bolus and places the patient on telemetry. At 0930 the patient vomits 150 mL of bilious fluid and becomes more lethargic; she now opens her eyes only to loud verbal stimulation and her verbal responses are inappropriate words. Heart rate rises to 112, blood pressure 94/58. The nurse repositions the patient on her side, suctions the oropharynx, and ensures the head of bed is elevated to 30 degrees. The daughter, who has been at the bedside, becomes tearful and asks, \"Is she going to be okay? She was fine two weeks ago — is this from the new blood pressure pill?\" She also asks whether her mother's \"mental illness medicine\" caused this and whether it should be stopped permanently.",
                  "zh": "收治医生审查了化验结果并开具医嘱：停用锂，停用HCTZ，停用二甲双胍（eGFR < 30），静脉推注生理盐水（0.9% NaCl）500 mL在一小时内，然后200 mL/hr连续输注，严格记录出入量，1200重新抽血查血清锂浓度和基础代谢组合，持续心电监护，以及癫痫预防措施。护士开始静脉输液并对患者进行遥测心电监护。在0930，患者呕吐了150 mL胆汁样液体，并变得更加嗜睡；她现在只在强烈的言语刺激下睁开眼睛，并且言语反应不恰当。心率升至112，血压94/58。护士将患者重新定位为侧卧，吸引口咽部，并确保床头抬高至30度。一直陪在床边的女儿流着泪问：“她会好起来吗？两周前她还好好的——这是因为新开的降压药吗？”她还问这是否由她母亲的“精神病药物”引起，以及是否应该永久停用。"
                }
              }
            ]
          },
          {
            "id": "stage_2",
            "narrative": {
              "en": "Stage 2 — 1200 to 1800 (hours four through ten).",
              "zh": "阶段2 — 1200至1800（第四到第十小时）。"
            },
            "exhibits": [
              {
                "id": "exhibit_stage2",
                "name": {
                  "en": "Clinical Course (1200)",
                  "zh": "临床病程 (1200)"
                },
                "content": {
                  "en": "Repeat labs at 1200: lithium 2.6 mEq/L, sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.8 mg/dL, BUN 34 mg/dL, eGFR 30 mL/min/1.73 m². Urine output over the preceding four hours: 120 mL (0.5 mL/kg/hr — improved from 0.3 but still marginal). The lithium level has dropped only 0.2 mEq/L despite aggressive IV hydration. The patient remains obtunded; she now has intermittent myoclonic jerks of the upper extremities and new-onset coarse fasciculations in the facial muscles. Deep tendon reflexes remain 3+ with clonus. ECG unchanged. The provider discusses the case with nephrology; the nephrologist recommends emergent hemodialysis given the persistently elevated lithium level, worsening neurotoxicity, and impaired renal clearance. A temporary hemodialysis catheter is to be placed at the bedside. The provider also orders potassium chloride 20 mEq IV in 100 mL NS over one hour (peripheral line, infusion pump) to address the hypokalemia before dialysis. The daughter, still at the bedside, states she feels guilty for not bringing her mother in sooner and asks the nurse whether her mother will have permanent brain damage.",
                  "zh": "1200的复查化验：锂 2.6 mEq/L，钠 146 mEq/L，钾 3.4 mEq/L，肌酐 1.8 mg/dL，BUN 34 mg/dL，eGFR 30 mL/min/1.73 m²。过去四小时的尿量：120 mL（0.5 mL/kg/hr——较0.3有改善，但仍处于边缘水平）。尽管进行了积极的静脉补液，锂浓度仅下降了0.2 mEq/L。患者仍然迟钝；她现在上肢有间歇性肌阵挛抽搐，面部肌肉新出现粗大肌束颤动。深腱反射保持3+伴阵挛。心电图无改变。医生与肾脏内科讨论了此病例；鉴于锂浓度持续升高、神经毒性恶化和肾脏清除率受损，肾脏内科医生建议进行紧急血液透析。将在床边放置临时血液透析导管。医生还开具了氯化钾20 mEq静脉滴注（100 mL NS，超过一小时，外周静脉，输液泵）的医嘱，以在透析前纠正低钾血症。仍然在床边的女儿表示她对没有早点送母亲来感到内疚，并问护士她的母亲是否会造成永久性脑损伤。"
                }
              }
            ]
          },
          {
            "id": "stage_3",
            "narrative": {
              "en": "Stage 3 — 1800 to 0600 the following morning (hours ten through twenty-two).",
              "zh": "阶段3 — 1800至次日0600（第十到第二十二小时）。"
            },
            "exhibits": [
              {
                "id": "exhibit_stage3",
                "name": {
                  "en": "Clinical Course (1800-0600)",
                  "zh": "临床病程 (1800-0600)"
                },
                "content": {
                  "en": "Hemodialysis is initiated at 1900 and runs for four hours. During the first hour of dialysis the patient's blood pressure drops to 86/52 and heart rate rises to 118. The dialysis nurse reduces or pauses ultrafiltration per protocol and gives NS; blood pressure recovers to 102/66 within twenty minutes. Post-dialysis labs at 2300: lithium 1.1 mEq/L, sodium 142 mEq/L, potassium 3.8 mEq/L, creatinine 1.4 mg/dL, BUN 26 mg/dL, eGFR 42 mL/min/1.73 m². The patient is now opening her eyes spontaneously, following commands, and speaking in full sentences, though she reports feeling \"foggy\" and fatigued. Tremor has diminished to a fine, intermittent resting tremor in the right hand only. Myoclonic jerks have ceased. Deep tendon reflexes are 2+ without clonus. Heart rate 86, blood pressure 112/70, urine output 55 mL/hr. At 0200 a repeat lithium level is drawn per the nephrologist's order to check for rebound: lithium 1.3 mEq/L. The nephrologist states that a second dialysis session may be needed if the level continues to rise; the patient is to remain on continuous telemetry and have lithium levels drawn every four hours. By 0600 the lithium level is 1.2 mEq/L and the patient is alert, oriented to person, place, and date, and tolerating sips of clear liquids. She asks the nurse, \"Will I ever be able to take lithium again, or do I need a different medicine?\"",
                  "zh": "血液透析于1900开始，运行了四个小时。在透析的第一个小时内，患者的血压降至86/52，心率升至118。透析护士根据方案减少或暂停了超滤，并给予生理盐水；血压在20分钟内恢复到102/66。2300的透析后化验：锂 1.1 mEq/L，钠 142 mEq/L，钾 3.8 mEq/L，肌酐 1.4 mg/dL，BUN 26 mg/dL，eGFR 42 mL/min/1.73 m²。患者现在自发地睁开眼睛，遵循指令，并说完整的句子，尽管她报告说感到“模糊”和疲劳。震颤已减轻至仅在右手有微细的间歇性静止性震颤。肌阵挛抽搐已停止。深腱反射为2+无阵挛。心率86，血压112/70，尿量55 mL/hr。在0200，根据肾脏内科医生的医嘱重新抽血检查锂浓度以检查反弹：锂 1.3 mEq/L。肾脏内科医生指出，如果水平继续上升，可能需要进行第二次透析；患者将保持连续遥测心电监护，并每四小时抽血检查锂浓度。到0600，锂浓度为1.2 mEq/L，患者清醒，对人、地点和日期有定向力，并能耐受几口清液。她问护士：“我还能再服用锂吗，还是我需要换一种药？”"
                }
              }
            ]
          }
        ],
        "questions": [
          {
            "id": "opus_case_lithium_toxicity_q1",
            "itemType": "multiple_choice",
            "category": "Pharmacological and Parenteral Therapies",
            "topic": "lithium toxicity",
            "difficulty": "hard",
            "ngnSkill": "analyze_cues",
            "stem": {
              "en": "Based on the admission data, which of the following is the primary mechanism that precipitated the patient's toxic lithium level?",
              "zh": "根据入院数据，下列哪一项是导致患者出现中毒性锂浓度的主要机制？"
            },
            "options": [
              {
                "id": "A",
                "text": {
                  "en": "The thiazide diuretic increased sodium and water excretion, causing volume depletion and a compensatory increase in proximal tubular reabsorption of sodium and lithium.",
                  "zh": "噻嗪类利尿剂增加了钠和水的排泄，导致容量消耗，代偿性地增加了近端肾小管对钠和锂的重吸收。"
                }
              },
              {
                "id": "B",
                "text": {
                  "en": "Dehydration from poor oral intake and vomiting alone caused the toxicity without a medication interaction.",
                  "zh": "仅由口服摄入差和呕吐引起的脱水导致了毒性，没有药物相互作用。"
                }
              },
              {
                "id": "C",
                "text": {
                  "en": "The patient's long-term lithium dose was too high for her baseline renal clearance.",
                  "zh": "对于她的基线肾脏清除率来说，该患者的长期锂剂量过高。"
                }
              },
              {
                "id": "D",
                "text": {
                  "en": "Hydrochlorothiazide directly increased the absorption of lithium in the gastrointestinal tract.",
                  "zh": "氢氯噻嗪直接增加了锂在胃肠道的吸收。"
                }
              }
            ],
            "correct": ["A"],
            "rationale": {
              "correct": {
                "en": "Lithium is almost entirely renally excreted and is handled like sodium in the proximal tubule. Any state that increases proximal sodium reabsorption — such as volume depletion from thiazide diuretics — reduces lithium clearance and raises serum levels. The interaction between HCTZ and lithium, compounded by dehydration, is the precipitant.",
                "zh": "锂几乎完全经肾脏排泄，并且在近端肾小管中的处理方式与钠相似。任何增加近端钠重吸收的状态——例如噻嗪类利尿剂引起的容量消耗——都会降低锂的清除率并升高血清浓度。HCTZ和锂之间的相互作用，加上脱水，是诱发因素。"
              },
              "byChoice": [
                {
                  "refId": "A",
                  "en": "Correct. Thiazide diuretics cause volume depletion, leading to compensatory proximal tubular reabsorption of both sodium and lithium, precipitating toxicity.",
                  "zh": "正确。噻嗪类利尿剂导致容量消耗，引起代偿性的近端肾小管对钠和锂的重吸收，从而诱发毒性。"
                },
                {
                  "refId": "B",
                  "en": "Incorrect. Dehydration alone could raise the level, but the newly added thiazide is the primary precipitant because it directly impairs renal lithium clearance.",
                  "zh": "错误。单纯脱水也可能升高锂浓度，但新加用的噻嗪类药物是主要的诱发因素，因为它直接损害了肾脏的锂清除。"
                },
                {
                  "refId": "C",
                  "en": "Incorrect. The dose has been stable for years, and her last level was therapeutic. The addition of HCTZ is the precipitant.",
                  "zh": "错误。剂量多年来一直稳定，她最近一次的水平也是治疗性的。新加用HCTZ是诱发因素。"
                },
                {
                  "refId": "D",
                  "en": "Incorrect. Thiazides interact with lithium at the renal tubular level by altering clearance, not by affecting gastrointestinal absorption.",
                  "zh": "错误。噻嗪类药物通过改变清除率在肾小管水平与锂相互作用，而不是通过影响胃肠道吸收。"
                }
              ]
            },
            "testTakingStrategy": {
              "en": "Recall that lithium and sodium share renal transport mechanisms; interventions that deplete sodium often cause lithium retention.",
              "zh": "回想一下，锂和钠具有共同的肾脏转运机制；消耗钠的干预措施通常会导致锂潴留。"
            },
            "glossary": []
          },
          {
            "id": "opus_case_lithium_toxicity_q2",
            "itemType": "multiple_choice",
            "category": "Management of Care",
            "topic": "lithium toxicity",
            "difficulty": "hard",
            "ngnSkill": "take_action",
            "stem": {
              "en": "At 0930 (Stage 1), after the patient vomits and exhibits declining neurological status and hemodynamic instability, which set of actions is the highest priority for the nurse to perform immediately?",
              "zh": "在0930（阶段1），在患者呕吐并表现出神经状态下降和血流动力学不稳定后，护士立即执行的首要操作是哪一组？"
            },
            "options": [
              {
                "id": "A",
                "text": {
                  "en": "Position the patient laterally, suction the airway, and notify the provider.",
                  "zh": "将患者置于侧卧位，吸引气道，并通知医生。"
                }
              },
              {
                "id": "B",
                "text": {
                  "en": "Administer an antiemetic to stop the vomiting and position the patient upright.",
                  "zh": "给予止吐药以止吐，并将患者置于直立位。"
                }
              },
              {
                "id": "C",
                "text": {
                  "en": "Redraw a stat serum lithium level and perform a full neurological assessment.",
                  "zh": "重新急查血清锂浓度，并进行全面的神经系统评估。"
                }
              },
              {
                "id": "D",
                "text": {
                  "en": "Increase the rate of the continuous normal saline infusion and assess capillary refill.",
                  "zh": "增加持续静脉滴注生理盐水的速度，并评估毛细血管充盈时间。"
                }
              }
            ],
            "correct": ["A"],
            "rationale": {
              "correct": {
                "en": "The patient's declining level of consciousness with active vomiting creates an aspiration risk; airway compromise is the most immediate life threat. The worsening obtundation and hypotension signal that the current treatment plan is insufficient. Protecting the airway and notifying the provider are the priority pair.",
                "zh": "患者意识水平下降伴活动性呕吐造成了误吸风险；气道受损是最直接的生命威胁。恶化的迟钝和低血压表明目前的治疗方案是不够的。保护气道和通知医生是首要任务。"
              },
              "byChoice": [
                {
                  "refId": "A",
                  "en": "Correct. Lateral positioning and suctioning protect the airway from aspiration, and the provider must be notified to escalate care.",
                  "zh": "正确。侧卧位和吸引保护气道免受误吸，同时必须通知医生以升级护理。"
                },
                {
                  "refId": "B",
                  "en": "Incorrect. Antiemetics take time to work and do not protect the airway of an obtunded patient who is actively vomiting now.",
                  "zh": "错误。止吐药起效需要时间，并且不能保护现在正处于活动性呕吐的迟钝患者的气道。"
                },
                {
                  "refId": "C",
                  "en": "Incorrect. While important, airway protection must precede laboratory redraws and detailed assessments.",
                  "zh": "错误。虽然重要，但必须先保护气道，然后再重新抽血化验和进行详细评估。"
                },
                {
                  "refId": "D",
                  "en": "Incorrect. The nurse cannot independently alter the IV fluid rate without a provider order in this context, and airway protection remains the top priority.",
                  "zh": "错误。在这种情况下，没有医生医嘱，护士不能独立改变静脉输液速度，而且气道保护仍然是首要任务。"
                }
              ]
            },
            "testTakingStrategy": {
              "en": "Apply the ABCs (Airway, Breathing, Circulation). An obtunded patient who is vomiting is at immediate risk of losing their airway.",
              "zh": "应用ABCs（气道、呼吸、循环）原则。呕吐的迟钝患者有立即失去气道的风险。"
            },
            "glossary": []
          },
          {
            "id": "opus_case_lithium_toxicity_q3",
            "itemType": "multiple_choice",
            "category": "Physiological Adaptation",
            "topic": "lithium toxicity",
            "difficulty": "hard",
            "ngnSkill": "generate_solutions",
            "stem": {
              "en": "At 1200 (Stage 2), the nephrologist recommends emergent hemodialysis. The nurse understands that which combination of findings provides the strongest clinical indication for this intervention?",
              "zh": "在1200（阶段2），肾脏内科医生建议进行紧急血液透析。护士理解以下哪种表现组合为这一干预提供了最强有力的临床指征？"
            },
            "options": [
              {
                "id": "A",
                "text": {
                  "en": "Decreased level of consciousness and progressive neurotoxicity with impaired renal clearance despite IV hydration.",
                  "zh": "尽管进行了静脉补液，但意识水平下降和进行性神经毒性伴随肾脏清除率受损。"
                }
              },
              {
                "id": "B",
                "text": {
                  "en": "A lithium level of 2.6 mEq/L with persistent nausea and vomiting.",
                  "zh": "锂浓度为2.6 mEq/L伴持续恶心和呕吐。"
                }
              },
              {
                "id": "C",
                "text": {
                  "en": "An eGFR of 30 mL/min/1.73 m² with hyperactive bowel sounds and normal saline bolus completion.",
                  "zh": "eGFR为30 mL/min/1.73 m²伴肠鸣音活跃和生理盐水推注完成。"
                }
              },
              {
                "id": "D",
                "text": {
                  "en": "Inadequate urine output of 0.5 mL/kg/hr with isolated hypokalemia.",
                  "zh": "尿量不足0.5 mL/kg/hr伴孤立性低钾血症。"
                }
              }
            ],
            "correct": ["A"],
            "rationale": {
              "correct": {
                "en": "Dialysis is indicated because severe lithium toxicity is accompanied by decreased level of consciousness/progressive neurotoxicity and impaired renal clearance, with minimal improvement after IV fluids. The neurotoxicity is the decisive escalation cue.",
                "zh": "提示需要透析，因为严重的锂中毒伴随着意识水平下降/进行性神经毒性和肾脏清除受损，且静脉补液后改善极小。神经毒性是决定性的升级信号。"
              },
              "byChoice": [
                {
                  "refId": "A",
                  "en": "Correct. Progressive neurotoxicity combined with impaired renal clearance means the kidneys cannot clear lithium fast enough; hemodialysis removes lithium directly from the blood.",
                  "zh": "正确。进行性神经毒性结合肾脏清除受损意味着肾脏无法足够快地清除锂；血液透析直接从血液中清除锂。"
                },
                {
                  "refId": "B",
                  "en": "Incorrect. While 2.6 mEq/L is toxic, nausea and vomiting alone do not represent severe, progressing neurotoxicity demanding immediate hemodialysis.",
                  "zh": "错误。虽然2.6 mEq/L属于中毒水平，但单纯的恶心和呕吐并不代表需要立即进行血液透析的严重、进展性神经毒性。"
                },
                {
                  "refId": "C",
                  "en": "Incorrect. Bowel sounds and fluid boluses are not indications for dialysis. The neurotoxicity dictates the urgency.",
                  "zh": "错误。肠鸣音和补液不是透析的指征。神经毒性决定了紧急程度。"
                },
                {
                  "refId": "D",
                  "en": "Incorrect. Hypokalemia requires replacement but does not alone necessitate hemodialysis for lithium toxicity.",
                  "zh": "错误。低钾血症需要补充，但单凭低钾不足以成为针对锂中毒进行血液透析的必要条件。"
                }
              ]
            },
            "testTakingStrategy": {
              "en": "Remember that severe neurological symptoms (like altered level of consciousness and myoclonus) combined with poor renal clearance are key indications for extracorporeal removal of lithium.",
              "zh": "记住，严重的神经系统症状（如意识水平改变和肌阵挛）结合肾脏清除不良，是体外清除锂的关键指征。"
            },
            "glossary": []
          },
          {
            "id": "opus_case_lithium_toxicity_q4",
            "itemType": "multiple_choice",
            "category": "Pharmacological and Parenteral Therapies",
            "topic": "lithium toxicity",
            "difficulty": "hard",
            "ngnSkill": "take_action",
            "stem": {
              "en": "At Stage 2, the provider orders potassium chloride 20 mEq IV in 100 mL NS over one hour via peripheral line on an infusion pump. Which action should the nurse take before administering this medication?",
              "zh": "在阶段2，医生医嘱氯化钾20 mEq静脉滴注（100 mL NS，超过一小时，外周静脉，输液泵）。在给药前，护士应采取哪项操作？"
            },
            "options": [
              {
                "id": "A",
                "text": {
                  "en": "Hold the infusion and clarify the order because the ordered concentration and rate exceed usual peripheral limits.",
                  "zh": "暂停输液并澄清医嘱，因为医嘱的浓度和速度超过了常见的外周静脉限制。"
                }
              },
              {
                "id": "B",
                "text": {
                  "en": "Administer the infusion exactly as ordered because it is on an infusion pump and the patient has cardiac monitoring.",
                  "zh": "完全按医嘱给药，因为使用了输液泵并且患者有心电监护。"
                }
              },
              {
                "id": "C",
                "text": {
                  "en": "Administer the infusion by gravity drip rather than an infusion pump to decrease the risk of phlebitis.",
                  "zh": "通过重力滴注而不是输液泵给药，以降低静脉炎的风险。"
                }
              },
              {
                "id": "D",
                "text": {
                  "en": "Ensure the patient's serum calcium level is drawn prior to initiating the infusion.",
                  "zh": "在开始输液之前确保抽取了患者的血清钙浓度。"
                }
              }
            ],
            "correct": ["A"],
            "rationale": {
              "correct": {
                "en": "Before administering, the nurse checks the facility IV potassium protocol and recognizes that the ordered rate/concentration (20 mEq in 100 mL) exceeds the unit’s usual peripheral limit (typically 10 mEq/100 mL). The nurse holds the infusion and clarifies the order.",
                "zh": "在给药前，护士检查设施的静脉补钾方案，并认识到医嘱的速度/浓度（100 mL中20 mEq）超过了病房通常的外周限制（通常为10 mEq/100 mL）。护士暂停输液并澄清医嘱。"
              },
              "byChoice": [
                {
                  "refId": "A",
                  "en": "Correct. Rapid or concentrated peripheral IV potassium infusion can cause fatal cardiac arrhythmia or severe phlebitis. The order exceeds typical safety limits and requires clarification.",
                  "zh": "正确。快速或高浓度的外周静脉钾输注可能引起致命的心律失常或严重的静脉炎。该医嘱超过了典型的安全限制，需要澄清。"
                },
                {
                  "refId": "B",
                  "en": "Incorrect. Administering the IV potassium as ordered without verifying the concentration against the unit's peripheral limits is a dangerous medication error.",
                  "zh": "错误。不验证浓度是否符合病房外周限制而按医嘱给予静脉补钾，是一个危险的用药错误。"
                },
                {
                  "refId": "C",
                  "en": "Incorrect. Intravenous potassium should never be given by gravity drip; it must always be given via a calibrated infusion pump.",
                  "zh": "错误。静脉补钾绝不能通过重力滴注给药；必须始终通过校准的输液泵给药。"
                },
                {
                  "refId": "D",
                  "en": "Incorrect. Calcium levels are not directly related to the immediate safety of this potassium infusion rate.",
                  "zh": "错误。钙浓度与这种钾输注速度的直接安全性没有直接关系。"
                }
              ]
            },
            "testTakingStrategy": {
              "en": "IV potassium chloride is a high-alert medication. Always verify maximum peripheral concentrations and rates before administration.",
              "zh": "静脉注射氯化钾是高危药物。给药前务必核实外周最大浓度和速度。"
            },
            "glossary": []
          },
          {
            "id": "opus_case_lithium_toxicity_q5",
            "itemType": "multiple_choice",
            "category": "Reduction of Risk Potential",
            "topic": "lithium toxicity",
            "difficulty": "medium",
            "ngnSkill": "evaluate_outcomes",
            "stem": {
              "en": "At 0200, the patient's lithium level rises to 1.3 mEq/L from the immediate post-dialysis level of 1.1 mEq/L. How should the nurse interpret this finding?",
              "zh": "在0200，患者的锂浓度从透析后即刻的1.1 mEq/L上升至1.3 mEq/L。护士应如何解释这一发现？"
            },
            "options": [
              {
                "id": "A",
                "text": {
                  "en": "This represents expected post-dialysis lithium rebound due to redistribution from tissue compartments, requiring continued serial monitoring.",
                  "zh": "这代表了预期的透析后锂反弹，由于组织室的重新分布所致，需要继续连续监测。"
                }
              },
              {
                "id": "B",
                "text": {
                  "en": "This indicates the hemodialysis was ineffective and must be restarted immediately.",
                  "zh": "这表明血液透析无效，必须立即重新开始。"
                }
              },
              {
                "id": "C",
                "text": {
                  "en": "This suggests the patient has secretly ingested additional lithium while on the unit.",
                  "zh": "这提示患者在病房内秘密摄入了额外的锂。"
                }
              },
              {
                "id": "D",
                "text": {
                  "en": "This represents definitive resolution of the toxicity and indicates lithium levels no longer need to be monitored.",
                  "zh": "这代表了毒性的彻底消除，并表明不再需要监测锂浓度。"
                }
              }
            ],
            "correct": ["A"],
            "rationale": {
              "correct": {
                "en": "The rise from 1.1 to 1.3 mEq/L represents lithium rebound — redistribution of lithium from the intracellular and tissue compartments back into the serum after dialysis has cleared the extracellular lithium. This is expected.",
                "zh": "从1.1上升到1.3 mEq/L代表锂的反弹——透析清除了细胞外液中的锂后，锂从细胞内和组织室重新分布回血清。这是预期内的。"
              },
              "byChoice": [
                {
                  "refId": "A",
                  "en": "Correct. Lithium rebound is common and expected, which is why serial monitoring is essential to ensure levels eventually stabilize.",
                  "zh": "正确。锂反弹是常见且符合预期的，这就是为什么需要连续监测以确保浓度最终稳定。"
                },
                {
                  "refId": "B",
                  "en": "Incorrect. Hemodialysis was effective at clearing extracellular lithium. The rebound does not immediately necessitate restart unless it exceeds toxic thresholds again.",
                  "zh": "错误。血液透析有效地清除了细胞外液中的锂。反弹不需要立即重新开始，除非浓度再次超过中毒阈值。"
                },
                {
                  "refId": "C",
                  "en": "Incorrect. Rebound is a known pharmacokinetic phenomenon, not evidence of secret ingestion.",
                  "zh": "错误。反弹是一种已知的药代动力学现象，而不是秘密摄入的证据。"
                },
                {
                  "refId": "D",
                  "en": "Incorrect. Interpreting the level as definitive resolution and stopping monitoring could miss a clinically significant rebound.",
                  "zh": "错误。将该浓度解释为彻底消除并停止监测，可能会漏掉具有临床意义的反弹。"
                }
              ]
            },
            "testTakingStrategy": {
              "en": "Recall that hemodialysis rapidly clears blood levels, but intracellular lithium takes time to equilibrate, leading to a typical 'rebound' increase in blood levels post-dialysis.",
              "zh": "回想一下，血液透析能迅速清除血液中的浓度，但细胞内锂需要时间来平衡，从而导致透析后血液浓度的典型“反弹”增加。"
            },
            "glossary": []
          },
          {
            "id": "opus_case_lithium_toxicity_q6",
            "itemType": "select_all",
            "category": "Psychosocial Integrity",
            "topic": "lithium toxicity",
            "difficulty": "medium",
            "ngnSkill": "generate_solutions",
            "stem": {
              "en": "The daughter states she feels guilty and asks if the patient will have brain damage and if lithium should be stopped permanently. What are the most appropriate nursing responses? (Select all that apply)",
              "zh": "女儿表示她感到内疚，并询问患者是否会有脑损伤以及是否应永久停用锂。最合适的护理回应是什么？（选择所有适用的）"
            },
            "options": [
              {
                "id": "A",
                "text": {
                  "en": "The improvement in her alertness is a positive sign, but the medical team will continue to monitor her closely.",
                  "zh": "她警觉性的提高是一个积极的信号，但医疗团队将继续密切监测她。"
                }
              },
              {
                "id": "B",
                "text": {
                  "en": "This toxicity was caused by a specific drug interaction and dehydration, not by anything you failed to do.",
                  "zh": "这种毒性是由特定的药物相互作用和脱水引起的，而不是因为你没做什么。"
                }
              },
              {
                "id": "C",
                "text": {
                  "en": "The decision to restart lithium will be made together by the psychiatrist and your mother once she is fully recovered.",
                  "zh": "一旦你母亲完全康复，精神科医生和她将共同做出是否重新开始服用锂的决定。"
                }
              },
              {
                "id": "D",
                "text": {
                  "en": "She will recover completely without any lasting effects.",
                  "zh": "她将完全康复，没有任何后遗症。"
                }
              },
              {
                "id": "E",
                "text": {
                  "en": "Because of this severe reaction, she should never take lithium again.",
                  "zh": "因为这种严重的反应，她不应该再服用锂了。"
                }
              },
              {
                "id": "F",
                "text": {
                  "en": "Let's focus on her current treatment plan rather than dwelling on the past.",
                  "zh": "让我们把重点放在她目前的治疗计划上，而不是纠结于过去。"
                }
              }
            ],
            "correct": ["A", "B", "C"],
            "rationale": {
              "correct": {
                "en": "Psychosocial support and accurate health teaching are within RN scope and essential for therapeutic alliance. Acknowledging guilt, giving factual reassurance without false promises, and deferring future medical decisions to providers are appropriate.",
                "zh": "心理社会支持和准确的健康宣教在注册护士的执业范围内，对治疗联盟至关重要。承认内疚，在没有虚假承诺的情况下给予基于事实的保证，以及将未来的医疗决策留给医生是合适的。"
              },
              "byChoice": [
                {
                  "refId": "A",
                  "en": "Correct. This provides factual reassurance based on observed data while maintaining realistic expectations.",
                  "zh": "正确。这基于观察到的数据提供了事实上的保证，同时保持了现实的期望。"
                },
                {
                  "refId": "B",
                  "en": "Correct. This statement directly addresses the daughter's guilt by explaining the actual mechanism (interaction and dehydration).",
                  "zh": "正确。这句话通过解释实际机制（相互作用和脱水）直接解决了女儿的内疚感。"
                },
                {
                  "refId": "C",
                  "en": "Correct. Future prescribing decisions are within the provider's scope, and clarifying this defers appropriately.",
                  "zh": "正确。未来的处方决策在医生的执业范围内，澄清这一点是恰当的推迟。"
                },
                {
                  "refId": "D",
                  "en": "Incorrect. This is false reassurance. Nurses cannot definitively promise the absence of long-term effects.",
                  "zh": "错误。这是虚假的保证。护士不能明确保证没有长期影响。"
                },
                {
                  "refId": "E",
                  "en": "Incorrect. Telling the family she should never take lithium again exceeds RN scope and may be clinically inaccurate.",
                  "zh": "错误。告诉家属她不应该再服用锂超出了注册护士的执业范围，并且在临床上可能是不准确的。"
                },
                {
                  "refId": "F",
                  "en": "Incorrect. Dismissing the daughter's guilt invalidates her feelings and impairs the therapeutic relationship.",
                  "zh": "错误。无视女儿的内疚感会否定她的感受，并损害治疗关系。"
                }
              ]
            },
            "testTakingStrategy": {
              "en": "Therapeutic communication should acknowledge feelings, provide facts, and avoid false reassurance or making medical promises.",
              "zh": "治疗性沟通应承认患者的感受，提供事实，并避免虚假的保证或做出医疗承诺。"
            },
            "glossary": []
          }
        ]
      }
    },
    {
      "id": "opus_case_lithium_toxicity_bowtie",
      "itemType": "bowtie",
      "category": "Pharmacological and Parenteral Therapies",
      "topic": "lithium toxicity",
      "difficulty": "hard",
      "ngnSkill": "take_action",
      "stem": {
        "en": "A 52-year-old woman with bipolar I disorder on stable lithium therapy presents with obtundation, new myoclonic jerks, and facial fasciculations. Ten days ago, she was started on hydrochlorothiazide. Her serum lithium is 2.6 mEq/L and eGFR is impaired. Despite aggressive IV hydration, her symptoms and lithium level show minimal improvement.",
        "zh": "一名患有双相I型情感障碍的52岁女性，接受稳定的锂治疗，表现出迟钝、新发肌阵挛抽搐和面部肌束颤动。10天前，她开始服用氢氯噻嗪。她的血清锂浓度为2.6 mEq/L，eGFR受损。尽管进行了积极的静脉补液，她的症状和锂浓度改善极小。"
      },
      "condition": {
        "tokens": [
          { "id": "cond1", "en": "Severe lithium toxicity", "zh": "严重的锂中毒" },
          { "id": "cond2", "en": "Bipolar disorder exacerbation", "zh": "双相情感障碍恶化" },
          { "id": "cond3", "en": "Acute gastroenteritis", "zh": "急性胃肠炎" }
        ],
        "correct": "cond1"
      },
      "actions": {
        "tokens": [
          { "id": "act1", "en": "Prepare the patient for emergent hemodialysis", "zh": "为患者进行紧急血液透析做准备" },
          { "id": "act2", "en": "Maintain aspiration precautions", "zh": "维持防误吸预防措施" },
          { "id": "act3", "en": "Continue IV fluid resuscitation as the sole treatment", "zh": "继续静脉补液作为唯一的治疗" },
          { "id": "act4", "en": "Administer next scheduled dose of lithium", "zh": "给予下一次预定的锂剂量" }
        ],
        "correct": ["act1", "act2"]
      },
      "parameters": {
        "tokens": [
          { "id": "param1", "en": "Serial serum lithium levels", "zh": "连续血清锂浓度" },
          { "id": "param2", "en": "Neurological status", "zh": "神经系统状态" },
          { "id": "param3", "en": "Serum glucose", "zh": "血清葡萄糖" },
          { "id": "param4", "en": "Serum calcium", "zh": "血清钙" }
        ],
        "correct": ["param1", "param2"]
      },
      "rationale": {
        "correct": {
          "en": "The most likely condition is severe lithium toxicity precipitated by thiazide diuretic–lithium interaction and volume depletion. Emergent hemodialysis is required due to minimal clearance with IV fluids and progressive neurotoxicity. Protecting the airway remains a priority. Serial lithium levels and neurological status must be monitored to evaluate the effectiveness of dialysis and detect potential rebound.",
          "zh": "最可能的病况是由噻嗪类利尿剂-锂的相互作用和容量消耗诱发的严重锂中毒。由于静脉补液清除极小以及进行性神经毒性，需要进行紧急血液透析。保护气道仍然是优先事项。必须连续监测锂浓度和神经系统状态，以评估透析的有效性并发现潜在的反弹。"
        },
        "byChoice": [
          {
            "refId": "cond1",
            "en": "Correct. The supratherapeutic lithium level, progressive neurotoxicity, acute kidney injury, and clear temporal relationship to HCTZ initiation confirm this diagnosis.",
            "zh": "正确。超治疗水平的锂浓度、进行性神经毒性、急性肾损伤，以及与开始使用HCTZ明确的时间关系证实了这一诊断。"
          },
          {
            "refId": "cond2",
            "en": "Incorrect. Neurological findings like myoclonus, hyperreflexia, and clonus are not features of mania.",
            "zh": "错误。肌阵挛、反射亢进和阵挛等神经系统发现不是躁狂的特征。"
          },
          {
            "refId": "cond3",
            "en": "Incorrect. While vomiting and diarrhea contributed to volume depletion, simple dehydration does not produce a lithium level of 2.6 mEq/L or profound neurotoxic signs.",
            "zh": "错误。虽然呕吐和腹泻导致了容量消耗，但单纯脱水不会产生2.6 mEq/L的锂浓度或严重的神经毒性体征。"
          },
          {
            "refId": "act1",
            "en": "Correct. Dialysis is the definitive treatment for severe lithium neurotoxicity unresponsive to IV hydration with impaired renal function.",
            "zh": "正确。透析是治疗对静脉补液无反应且肾功能受损的严重锂神经毒性的最终疗法。"
          },
          {
            "refId": "act2",
            "en": "Correct. The patient is obtunded with active vomiting; protecting the airway is a continuous priority.",
            "zh": "正确。患者迟钝并伴有活动性呕吐；保护气道是持续的首要任务。"
          },
          {
            "refId": "act3",
            "en": "Incorrect. Four hours of vigorous hydration dropped the lithium minimally; the kidneys cannot clear it fast enough, and delaying dialysis risks irreversible injury.",
            "zh": "错误。四个小时的积极补液仅使锂浓度微降；肾脏无法足够快地清除它，延迟透析有不可逆损伤的风险。"
          },
          {
            "refId": "act4",
            "en": "Incorrect. Lithium is the cause of the toxicity and giving another dose would worsen neurotoxicity.",
            "zh": "错误。锂是导致中毒的原因，再次给药会加重神经毒性。"
          },
          {
            "refId": "param1",
            "en": "Correct. Tracking lithium concentration before and after dialysis is essential to confirm clearance and detect rebound.",
            "zh": "正确。在透析前后追踪锂浓度对于确认清除率和发现反弹至关重要。"
          },
          {
            "refId": "param2",
            "en": "Correct. Improvement in neurological findings correlates with falling lithium levels and confirms toxicity is resolving.",
            "zh": "正确。神经系统表现的改善与锂浓度的下降相关，证实了毒性正在消退。"
          },
          {
            "refId": "param3",
            "en": "Incorrect. Serum glucose is not a priority evaluation metric for lithium toxicity resolution or dialysis effectiveness.",
            "zh": "错误。血清葡萄糖不是评估锂中毒消退或透析有效性的优先指标。"
          },
          {
            "refId": "param4",
            "en": "Incorrect. Serum calcium is normal here and is not a priority marker for acute lithium clearance or post-dialysis rebound.",
            "zh": "错误。此处血清钙正常，不是急性锂清除或透析后反弹的优先标志物。"
          }
        ]
      },
      "testTakingStrategy": {
        "en": "In severe lithium toxicity, the presence of progressive neurotoxicity demands extracorporeal removal, as the kidneys alone cannot compensate fast enough.",
        "zh": "在严重的锂中毒中，进行性神经毒性的出现需要体外清除，因为单靠肾脏无法足够快地代偿。"
      },
      "glossary": []
    }
  ]
};

fs.writeFileSync('/Users/holemini/Desktop/Project Shrimp/banks/banks-raw/opus-lithium_toxicity-2026-06-14.json', JSON.stringify(data, null, 2));
console.log('JSON compiled and saved successfully.');
