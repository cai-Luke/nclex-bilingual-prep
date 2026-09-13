/** Overnight pile independent review: in-place mucositis case-study replacement (opus_tpn_case_mucositis_01) plus the 5 hard-cases-canonical.json temperature counterpart display normalizations from Temperature Counterpart R1, independently reviewed 2026-09-13. */
import { setValue, replaceText, runPatch, type PatchOp } from "../patch-raw";

runPatch([
  {
    "kind": "setValue",
    "id": "opus_tpn_case_mucositis_01",
    "path": [
      "caseStudy"
    ],
    "before": {
      "title": {
        "en": "Severe chemotherapy-induced mucositis with total parenteral nutrition dependence and central line complications",
        "zh": "严重的化疗诱发黏膜炎合并全胃肠外营养依赖及中心静脉导管并发症"
      },
      "summary": {
        "en": "A 58-year-old woman with acute myeloid leukemia (AML) is on day 12 of induction chemotherapy (cytarabine and daunorubicin, \"7+3\" regimen) on an inpatient oncology unit. She has a triple-lumen peripherally inserted central catheter (PICC) in her right basilic vein placed on admission. Her medical history includes well-controlled type 2 diabetes (metformin, held during admission; sliding-scale insulin in use), mild chronic kidney disease (baseline creatinine 1.3 mg/dL), and a 30-pack-year smoking history. She is profoundly neutropenic (absolute neutrophil count less than 100/µL) and has been on neutropenic precautions. Five days ago she developed progressive oral and esophageal pain, was unable to swallow liquids, and was started on total parenteral nutrition (TPN) via her PICC line at 85 mL/hr, a dedicated lumen. Current orders include TPN with standard amino acids, dextrose, lipids, electrolytes, and multivitamins; morphine patient-controlled analgesia (PCA) for mucositis pain; fluconazole 400 mg IV daily for antifungal prophylaxis; cefepime 2 g IV every 8 hours for febrile neutropenia coverage; ice chips for comfort as tolerated; chlorhexidine-free sodium bicarbonate mouth rinses every 4 hours; strict intake and output; daily weights; and capillary blood glucose monitoring every 6 hours with sliding-scale insulin coverage.\n\nAt the start of the night shift the nurse receives handoff that the patient has been increasingly miserable over the past 24 hours. She is rating her mouth and throat pain 9 out of 10 despite PCA use, is refusing all oral care attempts, drooling into a basin, and has not voided in the past 5 hours. The day nurse reports the TPN bag was changed 2 hours ago and that the patient \"spiked a temp\" at the end of day shift but the provider was not yet notified. The patient appears flushed and is curled on her side.",
        "zh": "一名58岁急性髓系白血病（AML）女性患者，在肿瘤内科住院部接受诱导化疗（阿糖胞苷和柔红霉素，“7+3”方案）第12天。入院时在其右侧贵要静脉留置了三腔经外周静脉穿刺中心静脉导管（PICC）。既往病史包括控制良好的2型糖尿病（二甲双胍，入院期间停用；使用滑动标尺法胰岛素）、轻度慢性肾脏病（基线肌酐 1.3 mg/dL），以及30包年的吸烟史。患者处于重度中性粒细胞减少状态（绝对中性粒细胞计数低于100/µL），并已采取中性粒细胞减少保护性隔离措施。5天前她出现进行性口腔和食管疼痛，无法吞咽液体，开始通过PICC导管专用腔以 85 mL/hr 的速度输注全胃肠外营养（TPN）。目前的医嘱包括：含有标准氨基酸、葡萄糖、脂肪乳、电解质和多种维生素的TPN；用于缓解黏膜炎疼痛的吗啡患者自控镇痛（PCA）；氟康唑 400 mg 静脉注射 每日一次，预防真菌感染；头孢吡肟 2 g 静脉注射 每8小时一次，覆盖中性粒细胞减少伴发热；根据耐受情况提供碎冰块以缓解不适；每4小时使用不含氯己定的碳酸氢钠漱口水漱口；严格记录出入量；每日称重；以及每6小时监测一次末梢血糖，并根据滑动标尺法给予胰岛素。\n\n夜班开始时，护士接班得知患者在过去24小时内越来越痛苦。尽管使用了PCA，她对口腔和咽喉疼痛的评分仍为9分（满分10分），拒绝所有口腔护理尝试，口水流入口杯中，并且在过去5小时内没有排尿。白班护士报告说，TPN输液袋在2小时前已更换，患者在白班结束时“体温飙升”，但尚未通知医生。患者面色潮红，蜷缩侧卧。"
      },
      "exhibits": [
        {
          "id": "exhibit_baseline",
          "title": {
            "en": "Assessment & Baseline Labs (Start of Shift)",
            "zh": "评估与基线实验室检查（接班时）"
          },
          "content": {
            "en": "Baseline assessment at start of night shift: Temperature 102.0 °F (38.9 °C) orally (elevated from 99 °F (37.2 °C) twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air. Weight is 64.2 kg, up 1.8 kg from admission weight of 62.4 kg. The patient is alert but appears fatigued and in significant distress from pain. Oral examination reveals confluent, deep ulcerations across the buccal mucosa, tongue, and soft palate with white-yellow pseudomembranes and areas of bleeding — consistent with World Health Organization grade IV mucositis. Lips are cracked and bleeding. Thick, ropy saliva pools in the oropharynx. The patient gags and winces when attempting to open her mouth fully. Skin is warm, flushed, and dry. The right upper arm PICC dressing is intact but the insertion site shows new erythema extending approximately 2 cm from the insertion point, with mild tenderness on palpation; no purulent drainage is visible, but the area was not erythematous at the previous dressing assessment 48 hours ago. Abdomen is soft, mildly distended, with hypoactive bowel sounds. No stool in 3 days. Peripheral edema is trace bilateral in the lower extremities. Urine output has been 120 mL over the last 8 hours (approximately 15 mL/hr), decreased from 40–50 mL/hr the day prior.\n\nBaseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 ×10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18 ×10³/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated). Blood cultures were drawn from the PICC and peripherally at the time of the temperature spike but results are pending.",
            "zh": "夜班接班时的基线评估：口腔体温 102.0 °F (38.9 °C)（较12小时前的99 °F (37.2 °C)升高），心率 112 次/分且规律，血压 96/58 mmHg（较白天的118/72 mmHg下降），呼吸频率 22 次/分，室内空气下 SpO₂ 95%。体重 64.2 kg，较入院体重的 62.4 kg 增加了 1.8 kg。患者神志清醒，但显得疲乏且因疼痛而极其痛苦。口腔检查显示颊黏膜、舌和软腭有融合的深部溃疡，伴有黄白色假膜和出血区域——符合世界卫生组织（WHO）IV级黏膜炎的标准。嘴唇干裂出血。浓稠的绳状唾液在口咽部积聚。当尝试完全张口时，患者会恶心并退缩。皮肤温暖、潮红且干燥。右上臂PICC敷料完整，但穿刺部位周围出现向外延伸约 2 cm 的新发红斑，触诊有轻微压痛；未见脓性引流物，但在48小时前评估敷料时该区域并无红斑。腹部软，轻度膨隆，肠鸣音减弱。3天未排便。双下肢有极轻度的外周水肿。过去8小时尿量为 120 mL（约 15 mL/hr），较前一天的 40–50 mL/hr 减少。\n\n护士接班前6小时抽取的基线实验室检查结果：白细胞（WBC） 0.3 ×10³/µL（ANC 低于 100/µL），血红蛋白 7.8 g/dL，血小板 18 ×10³/µL，血尿素氮（BUN） 32 mg/dL，肌酐 1.6 mg/dL（较基线 1.3 升高），钠 138 mEq/L，钾 3.2 mEq/L（偏低），氯 101 mEq/L，碳酸氢盐 22 mEq/L，镁 1.4 mg/dL（偏低），磷 2.8 mg/dL，钙 8.0 mg/dL，白蛋白 2.1 g/dL（偏低），前白蛋白 8 mg/dL（偏低，提示营养风险及伴随CRP升高的炎症状态），血糖 268 mg/dL（升高；4小时前为 312 mg/dL），AST 42 U/L，ALT 38 U/L，总胆红素 1.0 mg/dL，甘油三酯 310 mg/dL（升高），乳酸 2.8 mmol/L（轻度升高），C反应蛋白（CRP） 14.2 mg/dL（升高）。在体温飙升时已从PICC和外周抽取血培养，结果待回报。"
          },
          "structuredMeasurements": {
            "panels": [
              {
                "kind": "vitals",
                "columns": [
                  {
                    "id": "current",
                    "label": {
                      "en": "Current",
                      "zh": "当前"
                    }
                  }
                ],
                "rows": [
                  {
                    "key": "temp",
                    "label": {
                      "en": "Temperature",
                      "zh": "体温"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "38.9",
                        "unit": "°C"
                      }
                    ]
                  },
                  {
                    "key": "hr",
                    "label": {
                      "en": "Heart rate",
                      "zh": "心率"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "112",
                        "unit": "bpm"
                      }
                    ]
                  },
                  {
                    "key": "sbp",
                    "label": {
                      "en": "Systolic BP",
                      "zh": "收缩压"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "96",
                        "unit": "mmHg"
                      }
                    ]
                  },
                  {
                    "key": "dbp",
                    "label": {
                      "en": "Diastolic BP",
                      "zh": "舒张压"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "58",
                        "unit": "mmHg"
                      }
                    ]
                  },
                  {
                    "key": "rr",
                    "label": {
                      "en": "Respiratory rate",
                      "zh": "呼吸频率"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "22",
                        "unit": "/min"
                      }
                    ]
                  },
                  {
                    "key": "spo2",
                    "label": {
                      "en": "SpO2",
                      "zh": "脉搏血氧饱和度"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "95",
                        "unit": "%"
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "labs",
                "columns": [
                  {
                    "id": "labs_6h_prior",
                    "label": {
                      "en": "6 h prior",
                      "zh": "6 小时前"
                    }
                  }
                ],
                "rows": [
                  {
                    "key": "wbc",
                    "label": {
                      "en": "WBC",
                      "zh": "白细胞"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "0.3",
                        "unit": "×10³/µL"
                      }
                    ]
                  },
                  {
                    "key": "hemoglobin",
                    "label": {
                      "en": "Hemoglobin",
                      "zh": "血红蛋白"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "7.8",
                        "unit": "g/dL"
                      }
                    ]
                  },
                  {
                    "key": "platelets",
                    "label": {
                      "en": "Platelets",
                      "zh": "血小板"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "18,000",
                        "unit": "/µL"
                      }
                    ]
                  },
                  {
                    "key": "bun",
                    "label": {
                      "en": "BUN",
                      "zh": "尿素氮"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "32",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "creatinine",
                    "label": {
                      "en": "Creatinine",
                      "zh": "肌酐"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "1.6",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "sodium",
                    "label": {
                      "en": "Sodium",
                      "zh": "血钠"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "138",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "potassium",
                    "label": {
                      "en": "Potassium",
                      "zh": "血钾"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "3.2",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "chloride",
                    "label": {
                      "en": "Chloride",
                      "zh": "血氯"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "101",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "bicarbonate",
                    "label": {
                      "en": "Bicarbonate",
                      "zh": "碳酸氢盐"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "22",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "magnesium",
                    "label": {
                      "en": "Magnesium",
                      "zh": "血镁"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "1.4",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "phosphate",
                    "label": {
                      "en": "Phosphate",
                      "zh": "血磷"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "2.8",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "calcium",
                    "label": {
                      "en": "Calcium",
                      "zh": "总钙"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "8.0",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "glucose",
                    "label": {
                      "en": "Glucose",
                      "zh": "血糖"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "268",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "ast",
                    "label": {
                      "en": "AST",
                      "zh": "谷草转氨酶"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "42",
                        "unit": "U/L"
                      }
                    ]
                  },
                  {
                    "key": "alt",
                    "label": {
                      "en": "ALT",
                      "zh": "谷丙转氨酶"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "38",
                        "unit": "U/L"
                      }
                    ]
                  },
                  {
                    "key": "total_bilirubin",
                    "label": {
                      "en": "Total bilirubin",
                      "zh": "总胆红素"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "1.0",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "lactate",
                    "label": {
                      "en": "Lactate",
                      "zh": "乳酸"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "2.8",
                        "unit": "mmol/L"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ],
      "stages": [
        {
          "id": "stage_1",
          "exhibits": [
            {
              "id": "exhibit_stage1",
              "title": {
                "en": "Clinical Update: Stage 1",
                "zh": "临床更新：第1阶段"
              },
              "content": {
                "en": "The nurse notifies the provider of the new fever (102 °F (38.9 °C)), hypotension (96/58), tachycardia (112), oliguria, the PICC site erythema, and the lab abnormalities. The provider orders a 500 mL normal saline bolus (given cautiously given the patient's fluid retention), repeat blood cultures from the PICC and a peripheral site, a stat basic metabolic panel, lactate, and blood glucose. The provider also orders potassium chloride 40 mEq IV over 4 hours and magnesium sulfate 2 g IV over 2 hours to correct electrolyte deficits before rechecking levels. The nurse administers the fluid bolus and electrolyte replacements. Two hours later, repeat vitals show temperature 102.6 °F (39.2 °C), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air. Urine output is only 30 mL over the 2 hours following the bolus. The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising). The nurse notes the TPN infusion rate has not been adjusted and the blood glucose trend is upward. The patient is now shivering with rigors. The PICC site erythema has not changed. The nurse recognizes the clinical picture is worsening and urgently re-contacts the provider.",
                "zh": "护士向医生报告了新发的发热（102 °F (38.9 °C)）、低血压（96/58 mmHg）、心动过速（112 次/分）、少尿、PICC部位红斑以及异常的实验室结果。医生下达医嘱给予 500 mL 生理盐水推注（考虑到患者有体液潴留，推注需谨慎），从PICC和外周重新抽血培养，急查基础代谢指标、乳酸和血糖。医生还医嘱在4小时内静脉输注氯化钾 40 mEq，并在2小时内静脉输注硫酸镁 2 g，以纠正电解质紊乱后复查水平。护士执行了液体推注和电解质补充。2小时后，复查生命体征显示：体温 102.6 °F (39.2 °C)，心率 118 次/分，血压 92/54 mmHg（尽管推注了液体仍在恶化），呼吸频率 24 次/分，室内空气下 SpO₂ 94%。推注后2小时内的尿量仅为 30 mL。急查实验室结果回报：钾 3.0 mEq/L（尽管进行了补充仍偏低），镁 1.3 mg/dL（无变化），肌酐 1.9 mg/dL（升高），血糖 324 mg/dL（升高；TPN的葡萄糖负荷超过了滑动标尺法胰岛素的覆盖范围），乳酸 3.6 mmol/L（升高）。护士注意到TPN输注速率未作调整，且血糖呈上升趋势。患者现在出现寒战。PICC部位的红斑没有变化。护士意识到临床情况正在恶化，紧急再次联系医生。"
              },
              "structuredMeasurements": {
                "panels": [
                  {
                    "kind": "vitals",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "temp",
                        "label": {
                          "en": "Temperature",
                          "zh": "体温"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "39.2",
                            "unit": "°C"
                          }
                        ]
                      },
                      {
                        "key": "hr",
                        "label": {
                          "en": "Heart rate",
                          "zh": "心率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "118",
                            "unit": "bpm",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "sbp",
                        "label": {
                          "en": "Systolic BP",
                          "zh": "收缩压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "92",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "dbp",
                        "label": {
                          "en": "Diastolic BP",
                          "zh": "舒张压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "54",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "rr",
                        "label": {
                          "en": "Respiratory rate",
                          "zh": "呼吸频率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "24",
                            "unit": "/min"
                          }
                        ]
                      },
                      {
                        "key": "spo2",
                        "label": {
                          "en": "SpO2",
                          "zh": "脉搏血氧饱和度"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "94",
                            "unit": "%"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "labs",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "potassium",
                        "label": {
                          "en": "Potassium",
                          "zh": "血钾"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "3.0",
                            "unit": "mEq/L",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "magnesium",
                        "label": {
                          "en": "Magnesium",
                          "zh": "血镁"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.3",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "creatinine",
                        "label": {
                          "en": "Creatinine",
                          "zh": "肌酐"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.9",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "glucose",
                        "label": {
                          "en": "Glucose",
                          "zh": "血糖"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "324",
                            "unit": "mg/dL"
                          }
                        ]
                      },
                      {
                        "key": "lactate",
                        "label": {
                          "en": "Lactate",
                          "zh": "乳酸"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "3.6",
                            "unit": "mmol/L",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "title": {
            "en": "Stage 1 Update",
            "zh": "第1阶段更新"
          }
        },
        {
          "id": "stage_2",
          "exhibits": [
            {
              "id": "exhibit_stage2",
              "title": {
                "en": "Clinical Update: Stage 2",
                "zh": "临床更新：第2阶段"
              },
              "content": {
                "en": "The provider orders transfer to a step-down unit for closer hemodynamic monitoring. A second 500 mL normal saline bolus is ordered, along with a continuous insulin infusion at 2 units/hr with hourly blood glucose checks per hospital protocol, given that the blood glucose is now persistently above 300 mg/dL and sliding scale is inadequate. The TPN rate is reduced to 60 mL/hr to decrease the dextrose load. The provider adds vancomycin 1 g IV (for empiric gram-positive coverage given the PICC site change and concern for catheter-related bloodstream infection, or CRBSI) and orders the interventional radiology team to be on standby for possible PICC removal and source-control planning. The microbiology lab calls with a preliminary blood culture report: the PICC-drawn culture is flagging positive for gram-positive cocci in clusters at 8 hours of incubation; the peripheral culture drawn simultaneously has not yet flagged. The early flagging of the PICC culture before the peripheral culture is highly concerning for CRBSI, though not definitive until paired cultures grow the same organism with >2-hour differential time to positivity. Repeat vitals after interventions: temperature 102.9 °F (39.4 °C), heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen). Blood glucose is 245 mg/dL on the insulin drip (trending down). Urine output improves slightly to 25 mL/hr. Oral assessment is unchanged — the mucositis is confluent and the patient has not performed mouth rinses in over 6 hours because of pain; the PCA morphine demand history shows she has been pressing the button at maximum frequency. The nurse faces critical decisions about line management, glycemic control monitoring, oral care facilitation, and pain reassessment.",
                "zh": "医生医嘱将患者转至过渡病房进行更密切的血流动力学监测。医嘱给予第二次 500 mL 生理盐水推注，鉴于血糖现持续高于 300 mg/dL 且滑动标尺法胰岛素不足以控制，同时医嘱按医院方案以 2 单位/小时 的速度持续静脉泵入胰岛素，并每小时监测血糖。TPN速率降至 60 mL/hr 以减少葡萄糖负荷。医生加用万古霉素 1 g 静脉滴注（考虑到PICC部位的变化及怀疑导管相关血流感染（CRBSI），用于经验性覆盖革兰氏阳性菌），并指示介入放射团队待命，以便计划可能的PICC拔除及感染源控制。微生物实验室打来电话报告初步血培养结果：培养8小时时，从PICC抽取的培养瓶提示簇状革兰氏阳性球菌阳性；同时抽取的周围血培养尚未报阳。PICC培养早于外周培养报阳的情况高度怀疑为CRBSI，但在成对培养物生长出相同病原体且报阳时间差大于2小时之前，尚不能确诊。干预后的复查生命体征：体温 102.9 °F (39.4 °C)，心率 122 次/分，血压 100/62 mmHg（第二次推注后略有改善），呼吸频率 22 次/分，通过 2 L 鼻导管吸氧下 SpO₂ 95%（现需补充氧气）。在胰岛素滴注下血糖为 245 mg/dL（呈下降趋势）。尿量略微改善至 25 mL/hr。口腔评估未见改变——黏膜炎呈融合状，因疼痛患者已超过6小时未进行漱口；PCA吗啡的按压记录显示她一直以最大频率按压按钮。护士面临关于导管管理、血糖控制监测、口腔护理协助和疼痛重新评估的关键决策。"
              },
              "structuredMeasurements": {
                "panels": [
                  {
                    "kind": "vitals",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "temp",
                        "label": {
                          "en": "Temperature",
                          "zh": "体温"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "39.4",
                            "unit": "°C",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "hr",
                        "label": {
                          "en": "Heart rate",
                          "zh": "心率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "122",
                            "unit": "bpm",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "sbp",
                        "label": {
                          "en": "Systolic BP",
                          "zh": "收缩压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "100",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "dbp",
                        "label": {
                          "en": "Diastolic BP",
                          "zh": "舒张压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "62",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "rr",
                        "label": {
                          "en": "Respiratory rate",
                          "zh": "呼吸频率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "22",
                            "unit": "/min",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "spo2",
                        "label": {
                          "en": "SpO2",
                          "zh": "脉搏血氧饱和度"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "95",
                            "unit": "%",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "labs",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "glucose",
                        "label": {
                          "en": "Glucose",
                          "zh": "血糖"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "245",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "title": {
            "en": "Stage 2 Update",
            "zh": "第2阶段更新"
          }
        },
        {
          "id": "stage_3",
          "exhibits": [
            {
              "id": "exhibit_stage3",
              "title": {
                "en": "Clinical Update: Stage 3",
                "zh": "临床更新：第3阶段"
              },
              "content": {
                "en": "The PICC-drawn blood culture is confirmed as coagulase-negative Staphylococcus (later speciated as Staphylococcus epidermidis), with the PICC culture turning positive more than 2 hours before the peripheral culture, confirming CRBSI. The provider orders PICC removal. Because urgent central access is required to continue TPN and maintain glycemic stability, a new triple-lumen PICC is placed at a new site in the left arm under ID guidance with repeat cultures planned, and TPN is resumed at 60 mL/hr through the new line. Vancomycin is continued; cefepime is continued for neutropenic fever coverage. After 8 hours on the insulin drip, blood glucose has stabilized at 180–200 mg/dL. Repeat labs: potassium 3.8 mEq/L (improving after aggressive replacement), magnesium 1.8 mg/dL (improving), creatinine 1.7 mg/dL (plateau, slight improvement), lactate 1.9 mmol/L (trending down), triglycerides 280 mg/dL (still elevated but decreasing with the reduced TPN rate). Temperature is 100.6 °F (38.1 °C) (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned). Urine output has improved to 35–40 mL/hr. The patient reports mouth pain is now 6 out of 10 after the PCA dose was optimized and a scheduled IV acetaminophen was added; she is able to tolerate gentle sodium bicarbonate rinses again with coaching. The new PICC site is clean, dry, and without erythema. The nurse evaluates these trends and determines whether the patient is improving, identifies ongoing monitoring priorities, and plans for nutritional reassessment as the mucositis trajectory changes.",
                "zh": "PICC抽取的血培养确认为凝固酶阴性葡萄球菌（后经鉴定为表皮葡萄球菌），且PICC培养报阳时间比外周培养早超过2小时，证实为CRBSI。医生医嘱拔除PICC。由于继续TPN和维持血糖稳定急需中心静脉通路，在感染科指导下于左臂新部位放置了新的三腔PICC，并计划复查培养。TPN以 60 mL/hr 的速度通过新导管恢复输注。继续使用万古霉素；继续使用头孢吡肟覆盖中性粒细胞减少伴发热。胰岛素滴注8小时后，血糖稳定在 180–200 mg/dL。复查实验室结果：钾 3.8 mEq/L（在积极补充后改善），镁 1.8 mg/dL（改善），肌酐 1.7 mg/dL（进入平台期，轻微改善），乳酸 1.9 mmol/L（呈下降趋势），甘油三酯 280 mg/dL（仍偏高，但随着TPN速率降低而下降）。体温 100.6 °F (38.1 °C)（较最高值呈下降趋势），心率 98 次/分，血压 110/68 mmHg，呼吸频率 18 次/分，室内空气下 SpO₂ 97%（已撤除补充氧气）。尿量改善至 35–40 mL/hr。在优化PCA剂量并加入定时静脉注射对乙酰氨基酚后，患者报告口腔疼痛现为6分（满分10分）；在指导下，她能够再次耐受温和的碳酸氢钠漱口。新PICC穿刺部位清洁、干燥，无红斑。护士评估这些趋势并判断患者病情是否改善，确定持续监测的重点，并随着黏膜炎病程的变化计划重新进行营养评估。"
              },
              "structuredMeasurements": {
                "panels": [
                  {
                    "kind": "vitals",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "temp",
                        "label": {
                          "en": "Temperature",
                          "zh": "体温"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "38.1",
                            "unit": "°C",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "hr",
                        "label": {
                          "en": "Heart rate",
                          "zh": "心率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "98",
                            "unit": "bpm",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "sbp",
                        "label": {
                          "en": "Systolic BP",
                          "zh": "收缩压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "110",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "dbp",
                        "label": {
                          "en": "Diastolic BP",
                          "zh": "舒张压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "68",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "rr",
                        "label": {
                          "en": "Respiratory rate",
                          "zh": "呼吸频率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "18",
                            "unit": "/min",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "spo2",
                        "label": {
                          "en": "SpO2",
                          "zh": "脉搏血氧饱和度"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "97",
                            "unit": "%",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "labs",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "potassium",
                        "label": {
                          "en": "Potassium",
                          "zh": "血钾"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "3.8",
                            "unit": "mEq/L",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "magnesium",
                        "label": {
                          "en": "Magnesium",
                          "zh": "血镁"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.8",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "creatinine",
                        "label": {
                          "en": "Creatinine",
                          "zh": "肌酐"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.7",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "lactate",
                        "label": {
                          "en": "Lactate",
                          "zh": "乳酸"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.9",
                            "unit": "mmol/L",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "title": {
            "en": "Stage 3 Update",
            "zh": "第3阶段更新"
          }
        }
      ],
      "questions": [
        {
          "id": "opus_tpn_case_mucositis_01_q1",
          "itemType": "multiple_choice",
          "category": "Physiological Adaptation",
          "topic": "Sepsis & Septic Shock",
          "ngnSkill": "analyze_cues",
          "stem": {
            "en": "At Stage 1, after the fluid bolus and electrolyte replacements, the patient's condition continues to worsen. Based on the new clinical findings, what is the most likely emerging complication, and which cue is the highest priority to communicate to the provider?",
            "zh": "在第1阶段，给予液体推注和电解质补充后，患者病情继续恶化。基于新的临床表现，最可能出现的新发并发症是什么？沟通时优先级最高的临床线索是哪个？"
          },
          "options": [
            {
              "id": "opt_C",
              "en": "Localized PICC insertion site infection; new erythema extending 2 cm without purulent drainage.",
              "zh": "局部PICC穿刺部位感染；新发延伸 2 cm 的红斑，无脓性引流物。"
            },
            {
              "id": "opt_B",
              "en": "Hypovolemic shock resulting from severe mucositis-associated dehydration; oliguria of 30 mL over 2 hours.",
              "zh": "重度黏膜炎脱水导致的低血容量性休克；2小时内尿量仅为 30 mL。"
            },
            {
              "id": "opt_A",
              "en": "Sepsis likely originating from a catheter-related bloodstream infection; worsening hypotension despite the fluid bolus.",
              "zh": "可能源自导管相关血流感染的脓毒症；尽管推注液体血压仍持续恶化。"
            },
            {
              "id": "opt_D",
              "en": "Medication-induced anaphylaxis; the onset of shivering with rigors after antibiotic and electrolyte administration.",
              "zh": "药物引起的过敏反应；在给予抗生素和电解质后出现寒战。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "The nurse should recognize that the constellation of findings—fever in a neutropenic patient, hemodynamic instability unresponsive to fluids, rising lactate, and new PICC insertion site erythema—is most consistent with sepsis, likely from a catheter-related bloodstream infection (CRBSI). The single most critical cue to emphasize is the persistent hemodynamic deterioration despite the fluid bolus, as it signals progression toward septic shock.",
              "zh": "护士应意识到，这一系列临床表现（中性粒细胞减少患者发热、对液体复苏无反应的血流动力学不稳定、乳酸升高以及新发PICC穿刺部位红斑）最符合脓毒症，很可能源于导管相关血流感染（CRBSI）。最需强调的关键线索是尽管推注了液体但血流动力学仍持续恶化，因为这预示着正向脓毒性休克进展。"
            },
            "byChoice": [
              {
                "refId": "opt_D",
                "en": "While rigors can occur with adverse reactions, in the context of persistent fever, rising lactate, and an indwelling central line with site changes, sepsis is the most likely and most dangerous hypothesis that must be addressed first.",
                "zh": "虽然寒战也可见于不良反应，但在持续发热、乳酸升高和留置中心静脉导管伴局部变化的背景下，脓毒症是最可能也是最危险的假设，必须首先予以处理。"
              },
              {
                "refId": "opt_C",
                "en": "Failing to recognize systemic involvement because there is no purulent drainage is an error. Neutropenic patients lack adequate neutrophils to mount a purulent response, so subtle erythema with fever and hypotension suggests a systemic bloodstream infection, not just a localized one.",
                "zh": "因为没有脓性引流物而未意识到全身性受累是错误的。中性粒细胞减少的患者缺乏足够的中性粒细胞来产生化脓反应，因此伴有发热和低血压的轻微红斑提示全身性血流感染，而不仅仅是局部感染。"
              },
              {
                "refId": "opt_B",
                "en": "Poor intake and dehydration may contribute to hypotension and lactate elevation. Here, fever, profound neutropenia, new PICC-site erythema, rigors and deterioration despite a fluid challenge make sepsis the urgent working hypothesis; dehydration alone does not account adequately for the full pattern.",
                "zh": "摄入不足及脱水可促成低血压和乳酸升高。但本病例的发热、重度中性粒细胞减少、新发 PICC 处红斑、寒战及补液后仍恶化，使脓毒症成为需要紧急处理的工作假设；单纯脱水不能充分解释全部表现。"
              },
              {
                "refId": "opt_A",
                "en": "In profound neutropenia, the patient lacks an adequate inflammatory response, making even subtle signs of infection highly significant. Persistent hypotension after a fluid challenge with rising lactate indicates systemic inflammatory response and early sepsis.",
                "zh": "在重度中性粒细胞减少的情况下，患者缺乏足够的炎症反应，使得即使是细微的感染迹象也具有极高的意义。补液后持续低血压伴乳酸升高提示全身炎症反应和早期脓毒症。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Prioritize systemic, life-threatening hypotheses (sepsis) over localized (site infection) or less acutely critical (dehydration) explanations when signs of shock (hypotension unresponsive to fluids, rising lactate) are present.",
            "zh": "当出现休克体征（对补液无反应的低血压、乳酸升高）时，应优先考虑全身性、危及生命的假设（脓毒症），而不是局部的（部位感染）或急性危险较低的（脱水）解释。"
          },
          "glossary": [
            {
              "termEn": "Catheter-related bloodstream infection (CRBSI)",
              "termZh": "导管相关血流感染",
              "defZh": "一种严重的并发症，指病原微生物从中心静脉导管侵入血液系统引起感染。"
            },
            {
              "termEn": "Lactate",
              "termZh": "乳酸",
              "defZh": "一种组织低灌注和细胞缺氧的指标，在脓毒症等情况下会升高。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": "stage_1"
        },
        {
          "id": "opus_tpn_case_mucositis_01_q2",
          "itemType": "multiple_choice",
          "category": "Pharmacological and Parenteral Therapies",
          "topic": "Parenteral Nutrition",
          "ngnSkill": "generate_solutions",
          "stem": {
            "en": "At Stage 1, the patient's blood glucose is 324 mg/dL and rising despite sliding-scale insulin coverage, and the TPN infusion continues at 85 mL/hr. What is the most appropriate nursing action?",
            "zh": "在第1阶段，尽管使用了滑动标尺法胰岛素，患者的血糖仍升至 324 mg/dL 且呈上升趋势，同时TPN继续以 85 mL/hr 的速度输注。最适当的护理措施是什么？"
          },
          "options": [
            {
              "id": "opt_D",
              "en": "Pause the TPN for one hour, administer the sliding-scale insulin, and restart the TPN once the blood glucose drops below 200 mg/dL.",
              "zh": "暂停TPN 1小时，给予滑动标尺法胰岛素，并在血糖降至 200 mg/dL 以下后重新开始TPN输注。"
            },
            {
              "id": "opt_B",
              "en": "Independently stop the TPN infusion immediately to prevent severe hyperglycemia from the continuous dextrose load.",
              "zh": "为防止持续输入葡萄糖负荷导致严重高血糖，立即自行停止TPN输注。"
            },
            {
              "id": "opt_A",
              "en": "Notify the provider of the worsening trend and anticipate an order for a continuous insulin infusion and a possible reduction in the TPN rate.",
              "zh": "向医生报告恶化的血糖趋势，预期医生会开具持续胰岛素静脉泵入医嘱，并可能降低TPN输注速率。"
            },
            {
              "id": "opt_C",
              "en": "Continue monitoring the blood glucose every 6 hours and administer the sliding-scale insulin as ordered.",
              "zh": "继续每6小时监测一次血糖，并遵医嘱给予滑动标尺法胰岛素。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "The nurse should notify the provider that the TPN dextrose load is exceeding the patient's insulin capacity, exacerbated by sepsis-related insulin resistance. The correct approach is rate reduction plus an insulin drip, which requires provider orders. The nurse must not independently stop or adjust the TPN rate.",
              "zh": "护士应通知医生，TPN的葡萄糖负荷超过了患者的胰岛素调节能力，且脓毒症相关的胰岛素抵抗加剧了这一情况。正确的做法是降低输注速率并使用胰岛素泵，这需要医生的医嘱。护士绝对不能自行停止或调整TPN速率。"
            },
            "byChoice": [
              {
                "refId": "opt_D",
                "en": "Pausing TPN without an order risks rebound hypoglycemia and interrupts essential therapy. The nurse must not independently adjust TPN, but should follow institutional protocol and notify the provider for a comprehensive glucose management plan.",
                "zh": "在没有医嘱的情况下暂停TPN会带来反跳性低血糖风险并中断必要的治疗。护士绝不能自行调整TPN，而应遵循机构方案并通知医生制定全面的血糖管理计划。"
              },
              {
                "refId": "opt_A",
                "en": "Continuous dextrose infusions during physiologic stress often require continuous insulin rather than reactive sliding-scale coverage. Anticipating rate reduction and an insulin drip safely addresses both nutrition and glycemic control.",
                "zh": "在生理应激期间持续输注葡萄糖，通常需要持续静脉使用胰岛素，而非反应性的滑动标尺法。预期降低速率和加用胰岛素泵能安全兼顾营养和血糖控制。"
              },
              {
                "refId": "opt_C",
                "en": "Assuming the hyperglycemia is adequately managed by the sliding scale and failing to escalate the upward trend allows worsening hyperglycemia, which impairs immune function and worsens infection outcomes.",
                "zh": "认为滑动标尺法已足以控制高血糖而不去升级处理上升趋势，将导致高血糖进一步恶化，损害免疫功能并使感染后果更为严重。"
              },
              {
                "refId": "opt_B",
                "en": "Abruptly discontinuing TPN carries a risk of rebound hypoglycemia. The nurse should not independently stop or adjust TPN, but rather notify the provider, monitor glucose closely, and follow institutional protocol, which may include holding insulin and providing dextrose-containing IV fluid if ordered.",
                "zh": "突然停用TPN有引起反跳性低血糖的风险。护士绝不应自行停止或调整TPN，而应通知医生，密切监测血糖，并遵循机构方案，可能包括遵医嘱暂停胰岛素和给予含葡萄糖的静脉输液。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "When a prescribed continuous therapy (like TPN) causes adverse effects, do not independently stop or adjust it without an order. Notify the provider, follow institutional protocol, monitor closely, and prepare to adjust concurrent medications (like insulin) or administer prescribed fluids.",
            "zh": "当处方的持续治疗（如TPN）引起不良反应时，不要在无医嘱的情况下自行停止或调整。应通知医生，遵循机构方案，密切监测，并准备调整同期药物（如胰岛素）或遵医嘱给予输液。"
          },
          "glossary": [
            {
              "termEn": "Total parenteral nutrition (TPN)",
              "termZh": "全胃肠外营养",
              "defZh": "通过静脉（通常是中心静脉）直接提供所有每日所需营养素（包括高浓度葡萄糖）的方法。"
            },
            {
              "termEn": "Rebound hypoglycemia",
              "termZh": "反跳性低血糖",
              "defZh": "在突然停止高浓度葡萄糖输注（如TPN）后，由于高胰岛素水平仍在循环中而引起的严重低血糖。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        },
        {
          "id": "opus_tpn_case_mucositis_01_q3",
          "itemType": "ordered_response",
          "category": "Management of Care",
          "topic": "Prioritization & Delegation",
          "ngnSkill": "take_action",
          "stem": {
            "en": "At Stage 2, the nurse receives the preliminary blood culture report indicating the PICC-drawn culture flagged positive before the peripheral culture. This is highly concerning for a catheter-related bloodstream infection, though not definitive until paired cultures grow the same organism with >2-hour differential time to positivity. In what order should the nurse coordinate the subsequent interventions? (Drag the steps into the correct sequence.)",
            "zh": "在第2阶段，护士收到初步血培养报告，提示PICC抽取的培养早于外周培养报阳。这种情况高度怀疑为导管相关血流感染（CRBSI），但在成对培养物生长出相同病原体且报阳时间差大于2小时之前，尚不能确诊。护士应按什么顺序协调后续的干预措施？（拖动步骤以排出正确的顺序）"
          },
          "options": [
            {
              "id": "opt_B",
              "en": "Verify that empiric antibiotic coverage (vancomycin) is actively infusing.",
              "zh": "确认经验性抗生素（万古霉素）正在积极输注。"
            },
            {
              "id": "opt_A",
              "en": "Communicate the early flagging of the PICC culture to the provider.",
              "zh": "向医生报告PICC培养提早报阳的情况。"
            },
            {
              "id": "opt_D",
              "en": "Remove the infected PICC line under provider orders.",
              "zh": "在医生医嘱下拔除受感染的PICC导管。"
            },
            {
              "id": "opt_C",
              "en": "Coordinate with the provider for an alternative central access and glycemic management plan.",
              "zh": "与医生协调替代中心静脉通路及血糖管理方案。"
            }
          ],
          "correct": [
            "opt_A",
            "opt_B",
            "opt_C",
            "opt_D"
          ],
          "rationale": {
            "correct": {
              "en": "The correct sequence ensures safe escalation and source control without compromising essential therapies. First, communicate the differential time to positivity (early flagging of the PICC culture), which strongly suggests CRBSI. Second, ensure that systemic treatment (empiric antibiotics) is actively treating the bacteremia. Third, coordinate alternative central access and a glucose plan, because removing the patient's only central line will abruptly stop the TPN, risking hypoglycemia. Finally, once the replacement plan is secure, remove the infected PICC line.",
              "zh": "正确的顺序确保了安全的病情升级报告和感染源控制，同时不会危及基础治疗。首先，报告培养报阳的时间差（PICC培养早报阳），这强烈提示CRBSI。其次，确保全身性治疗（经验性抗生素）正在积极对抗菌血症。第三，协调替代的中心静脉通路和血糖方案，因为拔除患者唯一的中心静脉导管将突然中止TPN，带来低血糖风险。最后，一旦确立了替代方案，再拔除受感染的PICC导管。"
            },
            "byChoice": [
              {
                "refId": "opt_A",
                "en": "1. Communication of the critical preliminary culture result initiates targeted medical response and supports a presumptive CRBSI diagnosis while final paired-culture confirmation is pending.",
                "zh": "1. 报告关键的初步培养结果能启动针对性的医疗反应，并在等待最终成对培养确诊期间支持CRBSI的推定诊断。"
              },
              {
                "refId": "opt_C",
                "en": "3. A plan for alternative access and glucose management must be coordinated before line removal. Interrupting TPN poses a risk of rebound hypoglycemia, so the nurse should follow protocol, monitor glucose closely, and ensure a clear provider-directed plan is in place.",
                "zh": "3. 在拔管之前，必须协调好替代通路和血糖管理的方案。中断TPN会带来反跳性低血糖风险，因此护士应遵循方案，密切监测血糖，并确保有明确的医生指导方案。"
              },
              {
                "refId": "opt_B",
                "en": "2. Verifying that the prescribed empiric antibiotics are infusing ensures the patient is receiving immediate treatment for the active infection.",
                "zh": "2. 确认处方的经验性抗生素正在输注，确保患者正在接受针对活动性感染的紧急治疗。"
              },
              {
                "refId": "opt_D",
                "en": "4. Source control (line removal) is the final step, executed only after treatment is initiated and the patient is protected from the consequences of losing central access.",
                "zh": "4. 感染源控制（拔管）是最后一步，必须在启动治疗并保护患者免受失去中心静脉通路后果影响之后执行。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Use the nursing process and safety principles: Assess/notify (communicate lab result), intervene medically for the acute threat (verify antibiotics), plan for safety consequences (alternative access for TPN), and then perform the invasive procedure (remove line).",
            "zh": "运用护理程序和安全原则：评估/报告（沟通化验结果），针对急性威胁进行医疗干预（确认抗生素），制定防范安全后果的计划（准备TPN的替代通路），然后再执行侵入性操作（拔管）。"
          },
          "glossary": [
            {
              "termEn": "Differential time to positivity",
              "termZh": "报阳时间差",
              "defZh": "从导管抽取的血培养中病原体的生长比同时抽取的外周血培养提早至少2小时；结合临床表现，这支持CRBSI的诊断。"
            }
          ],
          "difficulty": "hard"
        },
        {
          "id": "opus_tpn_case_mucositis_01_q4",
          "itemType": "multiple_choice",
          "category": "Basic Care and Comfort",
          "topic": "Nutritional & Fluid Support",
          "ngnSkill": "generate_solutions",
          "stem": {
            "en": "At Stage 2, the patient has not performed mouth rinses in over 6 hours due to severe pain from confluent mucositis with bleeding, and she refuses further oral care attempts. What is the priority nursing intervention?",
            "zh": "在第2阶段，由于融合性黏膜炎伴出血引起的剧烈疼痛，患者已超过6小时未进行漱口，并拒绝进一步的口腔护理尝试。首要的护理干预措施是什么？"
          },
          "options": [
            {
              "id": "opt_B",
              "en": "Use a standard soft-bristle toothbrush to thoroughly clean the oral cavity, as skipping oral care increases the risk of secondary infection.",
              "zh": "使用标准软毛牙刷彻底清洁口腔，因为跳过口腔护理会增加继发感染的风险。"
            },
            {
              "id": "opt_A",
              "en": "Coordinate analgesia (PCA bolus or topical analgesic) 15 to 20 minutes before assisting the patient with atraumatic sodium bicarbonate rinses.",
              "zh": "在协助患者使用无创性碳酸氢钠漱口前15至20分钟，先协调使用镇痛药（PCA单次推注或局部镇痛药）。"
            },
            {
              "id": "opt_D",
              "en": "Forcefully swab the oral cavity with a lemon-glycerin swab to ensure mucosal integrity is maintained despite the patient's refusal.",
              "zh": "不顾患者拒绝，强行使用柠檬甘油棉签擦拭口腔，以确保维持黏膜完整性。"
            },
            {
              "id": "opt_C",
              "en": "Defer all oral care until the patient's pain is completely resolved to avoid causing mucosal trauma against her will.",
              "zh": "推迟所有口腔护理，直到患者疼痛完全缓解，以避免违背其意愿造成黏膜损伤。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "Oral care is a critical intervention to reduce secondary infection risk, but it must be facilitated through adequate pain management, not forced. The nurse should coordinate analgesia before care and use atraumatic technique (gentle rinses or ultra-soft/sponge swabs) given the severe thrombocytopenia and bleeding risk.",
              "zh": "口腔护理是降低继发感染风险的关键干预措施，但必须通过充分的疼痛管理来促成，而不能强迫进行。考虑到严重的血小板减少症和出血风险，护士应在护理前协调镇痛，并使用无创性技术（轻柔漱口或超软/海绵棉签）。"
            },
            "byChoice": [
              {
                "refId": "opt_A",
                "en": "Coordinating analgesia before oral care encourages compliance without forcing interventions, and atraumatic rinses maintain mucosal defense without causing hemorrhage in a profoundly thrombocytopenic patient.",
                "zh": "在口腔护理前协调使用镇痛药能鼓励患者配合而不必强迫干预，而在严重血小板减少的患者中，无创性漱口能在维持黏膜防御的同时不引起出血。"
              },
              {
                "refId": "opt_B",
                "en": "With platelets at 18 ×10³/µL, mechanical trauma from a standard toothbrush can cause significant oral hemorrhage. Only ultra-soft brushes or sponge swabs should be used.",
                "zh": "当血小板为 18 ×10³/µL 时，标准牙刷造成的机械性损伤会引起严重的口腔出血。只应使用超软毛牙刷或海绵棉签。"
              },
              {
                "refId": "opt_D",
                "en": "Lemon-glycerin swabs are drying and irritating to compromised mucosa and are contraindicated in mucositis. Furthermore, care should never be forced.",
                "zh": "柠檬甘油棉签会使受损黏膜干燥并受到刺激，在黏膜炎中属禁忌使用。此外，绝不应强迫进行护理。"
              },
              {
                "refId": "opt_C",
                "en": "Abandoning oral care entirely worsens the risk of bacterial and fungal superinfection of the ulcerated mucosa. The disrupted barrier is a primary portal of entry for systemic infection in neutropenic patients.",
                "zh": "完全放弃口腔护理会增加溃疡黏膜发生细菌和真菌二重感染的风险。受损的黏膜屏障是中性粒细胞减少患者全身感染的主要侵入门户。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "In pain management scenarios involving essential care, choose the option that proactively addresses the pain (analgesia beforehand) to allow the necessary intervention to proceed safely.",
            "zh": "在涉及必要护理的疼痛管理情境中，选择能主动处理疼痛（事先镇痛）以使必要干预能安全进行的选项。"
          },
          "glossary": [
            {
              "termEn": "Thrombocytopenia",
              "termZh": "血小板减少症",
              "defZh": "血液中血小板计数异常降低，显著增加出血风险。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        },
        {
          "id": "opus_tpn_case_mucositis_01_q5",
          "itemType": "matrix",
          "category": "Physiological Adaptation",
          "topic": "Sepsis & Septic Shock",
          "ngnSkill": "evaluate_outcomes",
          "stem": {
            "en": "At Stage 3, the nurse evaluates the patient's clinical response to the interventions. For each clinical finding, indicate whether it demonstrates \"Clinical Improvement\" or requires \"Ongoing Monitoring/Intervention\".",
            "zh": "在第3阶段，护士评估患者对干预措施的临床反应。对于每一项临床表现，请指出其表明“临床改善（Clinical Improvement）”还是需要“持续监测/干预（Ongoing Monitoring/Intervention）”。"
          },
          "correct": [
            {
              "rowId": "row_A",
              "columnIds": [
                "col_1"
              ]
            },
            {
              "rowId": "row_B",
              "columnIds": [
                "col_1"
              ]
            },
            {
              "rowId": "row_C",
              "columnIds": [
                "col_2"
              ]
            },
            {
              "rowId": "row_D",
              "columnIds": [
                "col_2"
              ]
            },
            {
              "rowId": "row_E",
              "columnIds": [
                "col_1"
              ]
            }
          ],
          "rationale": {
            "correct": {
              "en": "A decreasing lactate, stabilizing blood glucose, and downtrending temperature all indicate a positive response to sepsis treatment and glycemic management. However, elevated triglycerides related to TPN and a persistently abnormal creatinine require ongoing monitoring and potential future intervention.",
              "zh": "乳酸下降、血糖稳定和体温呈下降趋势均表明对脓毒症治疗和血糖管理有积极反应。然而，与TPN相关的甘油三酯升高和持续异常的肌酐需要持续监测及未来潜在的干预。"
            },
            "byChoice": [
              {
                "refId": "row_A",
                "en": "Lactate clearance (decreasing from 3.6 to 1.9) is a highly sensitive marker of improving tissue perfusion and clinical improvement in sepsis.",
                "zh": "乳酸清除（从 3.6 降至 1.9）是组织灌注改善和脓毒症临床好转的高度敏感标志。"
              },
              {
                "refId": "row_B",
                "en": "Stabilization of blood glucose on an insulin drip represents clinical improvement from the previously rising trend of 324 mg/dL.",
                "zh": "在胰岛素滴注下血糖趋于稳定，代表与之前 324 mg/dL 上升趋势相比的临床改善。"
              },
              {
                "refId": "row_C",
                "en": "Triglycerides at 280 mg/dL remain elevated (normal < 150 mg/dL). Sustained hypertriglyceridemia from lipid-containing TPN risks complications like pancreatitis and requires ongoing monitoring.",
                "zh": "甘油三酯 280 mg/dL 仍然偏高（正常 < 150 mg/dL）。含脂质TPN引起的持续高甘油三酯血症有导致胰腺炎等并发症的风险，需要持续监测。"
              },
              {
                "refId": "row_D",
                "en": "While creatinine is no longer rising rapidly, a plateau of 1.7 mg/dL is still elevated from the baseline of 1.3 mg/dL, indicating ongoing renal impairment that requires monitoring.",
                "zh": "虽然肌酐不再快速上升，但 1.7 mg/dL 的平台期仍高于 1.3 mg/dL 的基线水平，表明存在持续的肾损害，需要监测。"
              },
              {
                "refId": "row_E",
                "en": "A downtrending temperature after appropriate antibiotics and source control indicates an improving infectious picture.",
                "zh": "使用适当抗生素并控制感染源后体温下降趋势，表明感染情况正在改善。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Evaluate trends, not just absolute values. Returning toward baseline (fever, lactate, glucose) is an improvement; values that remain abnormally elevated (triglycerides, creatinine) demand continued vigilance.",
            "zh": "要评估趋势，而不仅仅是绝对数值。向基线恢复（发热、乳酸、血糖）属于改善；仍处于异常升高的指标（甘油三酯、肌酐）则要求持续警惕。"
          },
          "glossary": [],
          "difficulty": "hard",
          "matrix": {
            "rows": [
              {
                "id": "row_A",
                "en": "Lactate decreasing from 3.6 to 1.9 mmol/L",
                "zh": "乳酸从 3.6 mmol/L 降至 1.9 mmol/L"
              },
              {
                "id": "row_B",
                "en": "Blood glucose stabilizing at 180–200 mg/dL on the insulin drip",
                "zh": "在胰岛素滴注下血糖稳定在 180–200 mg/dL"
              },
              {
                "id": "row_C",
                "en": "Triglycerides 280 mg/dL",
                "zh": "甘油三酯 280 mg/dL"
              },
              {
                "id": "row_D",
                "en": "Creatinine plateaued at 1.7 mg/dL",
                "zh": "肌酐停滞在 1.7 mg/dL"
              },
              {
                "id": "row_E",
                "en": "Temperature trending down from 102.9 °F (39.4 °C) to 100.6 °F (38.1 °C)",
                "zh": "体温从 102.9 °F (39.4 °C) 呈下降趋势降至 100.6 °F (38.1 °C)"
              }
            ],
            "columns": [
              {
                "id": "col_2",
                "en": "Ongoing Monitoring/Intervention",
                "zh": "持续监测/干预"
              },
              {
                "id": "col_1",
                "en": "Clinical Improvement",
                "zh": "临床改善"
              }
            ],
            "selectionMode": "single_per_row"
          },
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        },
        {
          "id": "opus_tpn_case_mucositis_01_q6",
          "itemType": "multiple_choice",
          "category": "Basic Care and Comfort",
          "topic": "Nutritional & Fluid Support",
          "ngnSkill": "prioritize_hypotheses",
          "stem": {
            "en": "The patient can tolerate gentle mouth rinses with coaching but still cannot swallow liquids. Does rinse tolerance alone justify discontinuing TPN and resuming oral nutrition?",
            "zh": "患者在指导下能耐受温和的漱口，但仍无法吞咽液体。仅凭耐受漱口，是否足以停用 TPN 并恢复经口营养？"
          },
          "options": [
            {
              "id": "opt_C",
              "en": "No, because a newly placed PICC line must be used for TPN for at least 72 hours to ensure catheter patency before any enteral trials can begin.",
              "zh": "不合适，因为新放置的PICC导管必须至少用于TPN输注72小时以确保导管通畅，之后才能开始肠内营养试验。"
            },
            {
              "id": "opt_A",
              "en": "No, because the patient has grade IV mucositis with severe systemic inflammation, and tolerating mouth rinses is not equivalent to tolerating nutritional intake.",
              "zh": "不合适，因为患者患有IV级黏膜炎伴重度全身炎症，能耐受漱口不等于能耐受营养摄入。"
            },
            {
              "id": "opt_B",
              "en": "Yes, because the patient's ability to tolerate sodium bicarbonate rinses indicates sufficient mucosal recovery to safely swallow clear liquids.",
              "zh": "合适，因为患者能耐受碳酸氢钠漱口表明黏膜已充分恢复，可以安全吞咽清流质。"
            },
            {
              "id": "opt_D",
              "en": "Yes, because prolonged TPN dependence significantly increases the risk of another central line infection, making enteral nutrition the safer immediate option.",
              "zh": "合适，因为长期依赖TPN会显著增加再次发生中心静脉导管感染的风险，使肠内营养成为当前更安全的直接选择。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "Rinse tolerance alone does not justify stopping parenteral nutrition or restarting oral nutrition. Swishing and spitting small amounts is different from swallowing nutritional volumes through an ulcerated esophagus. Continue the prescribed nutrition support while the team reassesses safe routes and adequate intake.",
              "zh": "仅能耐受漱口不足以支持停用肠外营养或恢复经口营养。少量含漱后吐出，与经有溃疡的食管吞咽足量营养不同。应继续医嘱营养支持，同时由团队重新评估安全途径及足够摄入。"
            },
            "byChoice": [
              {
                "refId": "opt_B",
                "en": "Interpreting rinse tolerance as readiness for oral intake is an error. Swishing and spitting is fundamentally different from the mechanics of swallowing.",
                "zh": "将耐受漱口解读为已准备好经口进食是错误的。含漱后吐出在机制上与吞咽有着根本的不同。"
              },
              {
                "refId": "opt_A",
                "en": "Premature discontinuation of TPN in a patient with confluent esophageal ulcerations (grade IV mucositis) results in loss of nutritional support and worsens malnutrition, immunocompromise, and healing.",
                "zh": "对于有融合性食管溃疡（IV级黏膜炎）的患者，过早停用TPN会导致营养支持丧失，并加重营养不良、免疫功能低下及伤口愈合不良。"
              },
              {
                "refId": "opt_D",
                "en": "TPN infection risk warrants review, but inability to swallow persists. Tube feeding is a separate team assessment: platelets of 18,000/µL, active mucosal bleeding and esophageal ulceration require careful route and procedure evaluation; rinse tolerance does not settle that decision.",
                "zh": "TPN 的感染风险需要复核，但患者仍无法吞咽。管饲属于另一项团队评估：血小板 18,000/µL、活动性黏膜出血及食管溃疡，均要求谨慎评估途径与操作；耐受漱口不能决定这一问题。"
              },
              {
                "refId": "opt_C",
                "en": "There is no standard requirement to use a PICC line for 72 hours solely to prove patency before discontinuing TPN. The barrier is the patient's mucosal integrity, not line patency.",
                "zh": "并没有任何标准要求单纯为了证明导管通畅，必须使用PICC导管72小时后才能停用TPN。主要障碍在于患者的黏膜完整性，而非导管通畅度。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Distinguish swish-and-spit tolerance from safe swallowing and adequate nutritional intake; reassess the nutrition route with the care team.",
            "zh": "区分含漱后吐出的耐受性、安全吞咽及足够营养摄入；与照护团队重新评估营养途径。"
          },
          "glossary": [],
          "difficulty": "hard",
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        }
      ]
    },
    "after": {
      "title": {
        "en": "Severe chemotherapy-induced mucositis with total parenteral nutrition dependence and central line complications",
        "zh": "严重的化疗诱发黏膜炎合并全胃肠外营养依赖及中心静脉导管并发症"
      },
      "summary": {
        "en": "A 58-year-old woman with acute myeloid leukemia (AML) is on day 12 of induction chemotherapy (cytarabine and daunorubicin, \"7+3\" regimen) on an inpatient oncology unit. She has a triple-lumen peripherally inserted central catheter (PICC) in her right basilic vein placed on admission. Her medical history includes well-controlled type 2 diabetes (metformin, held during admission; sliding-scale insulin in use), mild chronic kidney disease (baseline creatinine 1.3 mg/dL), and a 30-pack-year smoking history. She is profoundly neutropenic (absolute neutrophil count less than 100/µL) and has been on neutropenic precautions. Five days ago she developed progressive oral and esophageal pain, was unable to swallow liquids, and was started on total parenteral nutrition (TPN) via her PICC line at 85 mL/hr, a dedicated lumen. Current orders include TPN with standard amino acids, dextrose, lipids, electrolytes, and multivitamins; morphine patient-controlled analgesia (PCA) for mucositis pain; fluconazole 400 mg IV daily for antifungal prophylaxis; cefepime 2 g IV every 8 hours for febrile neutropenia coverage; ice chips for comfort as tolerated; chlorhexidine-free sodium bicarbonate mouth rinses every 4 hours; strict intake and output; daily weights; and capillary blood glucose monitoring every 6 hours with sliding-scale insulin coverage.\n\nAt the start of the night shift the nurse receives handoff that the patient has been increasingly miserable over the past 24 hours. She is rating her mouth and throat pain 9 out of 10 despite PCA use, is refusing all oral care attempts, drooling into a basin, and has not voided in the past 5 hours. The day nurse reports the TPN bag was changed 2 hours ago and that the patient \"spiked a temp\" at the end of day shift but the provider was not yet notified. The patient appears flushed and is curled on her side.",
        "zh": "一名58岁急性髓系白血病（AML）女性患者，在肿瘤内科住院部接受诱导化疗（阿糖胞苷和柔红霉素，“7+3”方案）第12天。入院时在其右侧贵要静脉留置了三腔经外周静脉穿刺中心静脉导管（PICC）。既往病史包括控制良好的2型糖尿病（二甲双胍，入院期间停用；使用滑动标尺法胰岛素）、轻度慢性肾脏病（基线肌酐 1.3 mg/dL），以及30包年的吸烟史。患者处于重度中性粒细胞减少状态（绝对中性粒细胞计数低于100/µL），并已采取中性粒细胞减少保护性隔离措施。5天前她出现进行性口腔和食管疼痛，无法吞咽液体，开始通过PICC导管专用腔以 85 mL/hr 的速度输注全胃肠外营养（TPN）。目前的医嘱包括：含有标准氨基酸、葡萄糖、脂肪乳、电解质和多种维生素的TPN；用于缓解黏膜炎疼痛的吗啡患者自控镇痛（PCA）；氟康唑 400 mg 静脉注射 每日一次，预防真菌感染；头孢吡肟 2 g 静脉注射 每8小时一次，覆盖中性粒细胞减少伴发热；根据耐受情况提供碎冰块以缓解不适；每4小时使用不含氯己定的碳酸氢钠漱口水漱口；严格记录出入量；每日称重；以及每6小时监测一次末梢血糖，并根据滑动标尺法给予胰岛素。\n\n夜班开始时，护士接班得知患者在过去24小时内越来越痛苦。尽管使用了PCA，她对口腔和咽喉疼痛的评分仍为9分（满分10分），拒绝所有口腔护理尝试，口水流入口杯中，并且在过去5小时内没有排尿。白班护士报告说，TPN输液袋在2小时前已更换，患者在白班结束时“体温飙升”，但尚未通知医生。患者面色潮红，蜷缩侧卧。"
      },
      "exhibits": [
        {
          "id": "exhibit_baseline",
          "title": {
            "en": "Assessment & Baseline Labs (Start of Shift)",
            "zh": "评估与基线实验室检查（接班时）"
          },
          "content": {
            "en": "Baseline assessment at start of night shift: Temperature 102.0 °F (38.9 °C) orally (elevated from 99 °F (37.2 °C) twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air. Weight is 64.2 kg, up 1.8 kg from admission weight of 62.4 kg. The patient is alert but appears fatigued and in significant distress from pain. Oral examination reveals confluent, deep ulcerations across the buccal mucosa, tongue, and soft palate with white-yellow pseudomembranes and areas of bleeding — consistent with World Health Organization grade IV mucositis. Lips are cracked and bleeding. Thick, ropy saliva pools in the oropharynx. The patient gags and winces when attempting to open her mouth fully. Skin is warm, flushed, and dry. The right upper arm PICC dressing is intact but the insertion site shows new erythema extending approximately 2 cm from the insertion point, with mild tenderness on palpation; no purulent drainage is visible, but the area was not erythematous at the previous dressing assessment 48 hours ago. Abdomen is soft, mildly distended, with hypoactive bowel sounds. No stool in 3 days. Peripheral edema is trace bilateral in the lower extremities. Urine output has been 120 mL over the last 8 hours (approximately 15 mL/hr), decreased from 40–50 mL/hr the day prior.\n\nBaseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 ×10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18 ×10³/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated). Blood cultures were drawn from the PICC and peripherally at the time of the temperature spike but results are pending.",
            "zh": "夜班接班时的基线评估：口腔体温 102.0 °F (38.9 °C)（较12小时前的99 °F (37.2 °C)升高），心率 112 次/分且规律，血压 96/58 mmHg（较白天的118/72 mmHg下降），呼吸频率 22 次/分，室内空气下 SpO₂ 95%。体重 64.2 kg，较入院体重的 62.4 kg 增加了 1.8 kg。患者神志清醒，但显得疲乏且因疼痛而极其痛苦。口腔检查显示颊黏膜、舌和软腭有融合的深部溃疡，伴有黄白色假膜和出血区域——符合世界卫生组织（WHO）IV级黏膜炎的标准。嘴唇干裂出血。浓稠的绳状唾液在口咽部积聚。当尝试完全张口时，患者会恶心并退缩。皮肤温暖、潮红且干燥。右上臂PICC敷料完整，但穿刺部位周围出现向外延伸约 2 cm 的新发红斑，触诊有轻微压痛；未见脓性引流物，但在48小时前评估敷料时该区域并无红斑。腹部软，轻度膨隆，肠鸣音减弱。3天未排便。双下肢有极轻度的外周水肿。过去8小时尿量为 120 mL（约 15 mL/hr），较前一天的 40–50 mL/hr 减少。\n\n护士接班前6小时抽取的基线实验室检查结果：白细胞（WBC） 0.3 ×10³/µL（ANC 低于 100/µL），血红蛋白 7.8 g/dL，血小板 18 ×10³/µL，血尿素氮（BUN） 32 mg/dL，肌酐 1.6 mg/dL（较基线 1.3 升高），钠 138 mEq/L，钾 3.2 mEq/L（偏低），氯 101 mEq/L，碳酸氢盐 22 mEq/L，镁 1.4 mg/dL（偏低），磷 2.8 mg/dL，钙 8.0 mg/dL，白蛋白 2.1 g/dL（偏低），前白蛋白 8 mg/dL（偏低，提示营养风险及伴随CRP升高的炎症状态），血糖 268 mg/dL（升高；4小时前为 312 mg/dL），AST 42 U/L，ALT 38 U/L，总胆红素 1.0 mg/dL，甘油三酯 310 mg/dL（升高），乳酸 2.8 mmol/L（轻度升高），C反应蛋白（CRP） 14.2 mg/dL（升高）。在体温飙升时已从PICC和外周抽取血培养，结果待回报。"
          },
          "structuredMeasurements": {
            "panels": [
              {
                "kind": "vitals",
                "columns": [
                  {
                    "id": "current",
                    "label": {
                      "en": "Current",
                      "zh": "当前"
                    }
                  }
                ],
                "rows": [
                  {
                    "key": "temp",
                    "label": {
                      "en": "Temperature",
                      "zh": "体温"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "38.9",
                        "unit": "°C"
                      }
                    ]
                  },
                  {
                    "key": "hr",
                    "label": {
                      "en": "Heart rate",
                      "zh": "心率"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "112",
                        "unit": "bpm"
                      }
                    ]
                  },
                  {
                    "key": "sbp",
                    "label": {
                      "en": "Systolic BP",
                      "zh": "收缩压"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "96",
                        "unit": "mmHg"
                      }
                    ]
                  },
                  {
                    "key": "dbp",
                    "label": {
                      "en": "Diastolic BP",
                      "zh": "舒张压"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "58",
                        "unit": "mmHg"
                      }
                    ]
                  },
                  {
                    "key": "rr",
                    "label": {
                      "en": "Respiratory rate",
                      "zh": "呼吸频率"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "22",
                        "unit": "/min"
                      }
                    ]
                  },
                  {
                    "key": "spo2",
                    "label": {
                      "en": "SpO2",
                      "zh": "脉搏血氧饱和度"
                    },
                    "values": [
                      {
                        "columnId": "current",
                        "value": "95",
                        "unit": "%"
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "labs",
                "columns": [
                  {
                    "id": "labs_6h_prior",
                    "label": {
                      "en": "6 h prior",
                      "zh": "6 小时前"
                    }
                  }
                ],
                "rows": [
                  {
                    "key": "wbc",
                    "label": {
                      "en": "WBC",
                      "zh": "白细胞"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "0.3",
                        "unit": "×10³/µL"
                      }
                    ]
                  },
                  {
                    "key": "hemoglobin",
                    "label": {
                      "en": "Hemoglobin",
                      "zh": "血红蛋白"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "7.8",
                        "unit": "g/dL"
                      }
                    ]
                  },
                  {
                    "key": "platelets",
                    "label": {
                      "en": "Platelets",
                      "zh": "血小板"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "18,000",
                        "unit": "/µL"
                      }
                    ]
                  },
                  {
                    "key": "bun",
                    "label": {
                      "en": "BUN",
                      "zh": "尿素氮"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "32",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "creatinine",
                    "label": {
                      "en": "Creatinine",
                      "zh": "肌酐"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "1.6",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "sodium",
                    "label": {
                      "en": "Sodium",
                      "zh": "血钠"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "138",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "potassium",
                    "label": {
                      "en": "Potassium",
                      "zh": "血钾"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "3.2",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "chloride",
                    "label": {
                      "en": "Chloride",
                      "zh": "血氯"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "101",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "bicarbonate",
                    "label": {
                      "en": "Bicarbonate",
                      "zh": "碳酸氢盐"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "22",
                        "unit": "mEq/L"
                      }
                    ]
                  },
                  {
                    "key": "magnesium",
                    "label": {
                      "en": "Magnesium",
                      "zh": "血镁"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "1.4",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "phosphate",
                    "label": {
                      "en": "Phosphate",
                      "zh": "血磷"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "2.8",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "calcium",
                    "label": {
                      "en": "Calcium",
                      "zh": "总钙"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "8.0",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "glucose",
                    "label": {
                      "en": "Glucose",
                      "zh": "血糖"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "268",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "ast",
                    "label": {
                      "en": "AST",
                      "zh": "谷草转氨酶"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "42",
                        "unit": "U/L"
                      }
                    ]
                  },
                  {
                    "key": "alt",
                    "label": {
                      "en": "ALT",
                      "zh": "谷丙转氨酶"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "38",
                        "unit": "U/L"
                      }
                    ]
                  },
                  {
                    "key": "total_bilirubin",
                    "label": {
                      "en": "Total bilirubin",
                      "zh": "总胆红素"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "1.0",
                        "unit": "mg/dL"
                      }
                    ]
                  },
                  {
                    "key": "lactate",
                    "label": {
                      "en": "Lactate",
                      "zh": "乳酸"
                    },
                    "values": [
                      {
                        "columnId": "labs_6h_prior",
                        "value": "2.8",
                        "unit": "mmol/L"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ],
      "stages": [
        {
          "id": "stage_1",
          "exhibits": [
            {
              "id": "exhibit_stage1",
              "title": {
                "en": "Clinical Update: Stage 1",
                "zh": "临床更新：第1阶段"
              },
              "content": {
                "en": "The nurse notifies the provider of the new fever (102 °F (38.9 °C)), hypotension (96/58), tachycardia (112), oliguria, the PICC site erythema, and the lab abnormalities. The provider orders a 500 mL normal saline bolus (given cautiously given the patient's fluid retention), repeat blood cultures from the PICC and a peripheral site, a stat basic metabolic panel, lactate, and blood glucose. The provider also orders potassium chloride 40 mEq IV over 4 hours and magnesium sulfate 2 g IV over 2 hours to correct electrolyte deficits before rechecking levels. The nurse administers the fluid bolus and electrolyte replacements. Two hours later, repeat vitals show temperature 102.6 °F (39.2 °C), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air. Urine output is only 30 mL over the 2 hours following the bolus. The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising). The nurse notes the TPN infusion rate has not been adjusted and the blood glucose trend is upward. The patient is now shivering with rigors. The PICC site erythema has not changed. The nurse recognizes the clinical picture is worsening and urgently re-contacts the provider.",
                "zh": "护士向医生报告了新发的发热（102 °F (38.9 °C)）、低血压（96/58 mmHg）、心动过速（112 次/分）、少尿、PICC部位红斑以及异常的实验室结果。医生下达医嘱给予 500 mL 生理盐水推注（考虑到患者有体液潴留，推注需谨慎），从PICC和外周重新抽血培养，急查基础代谢指标、乳酸和血糖。医生还医嘱在4小时内静脉输注氯化钾 40 mEq，并在2小时内静脉输注硫酸镁 2 g，以纠正电解质紊乱后复查水平。护士执行了液体推注和电解质补充。2小时后，复查生命体征显示：体温 102.6 °F (39.2 °C)，心率 118 次/分，血压 92/54 mmHg（尽管推注了液体仍在恶化），呼吸频率 24 次/分，室内空气下 SpO₂ 94%。推注后2小时内的尿量仅为 30 mL。急查实验室结果回报：钾 3.0 mEq/L（尽管进行了补充仍偏低），镁 1.3 mg/dL（无变化），肌酐 1.9 mg/dL（升高），血糖 324 mg/dL（升高；TPN的葡萄糖负荷超过了滑动标尺法胰岛素的覆盖范围），乳酸 3.6 mmol/L（升高）。护士注意到TPN输注速率未作调整，且血糖呈上升趋势。患者现在出现寒战。PICC部位的红斑没有变化。护士意识到临床情况正在恶化，紧急再次联系医生。"
              },
              "structuredMeasurements": {
                "panels": [
                  {
                    "kind": "vitals",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "temp",
                        "label": {
                          "en": "Temperature",
                          "zh": "体温"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "39.2",
                            "unit": "°C"
                          }
                        ]
                      },
                      {
                        "key": "hr",
                        "label": {
                          "en": "Heart rate",
                          "zh": "心率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "118",
                            "unit": "bpm",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "sbp",
                        "label": {
                          "en": "Systolic BP",
                          "zh": "收缩压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "92",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "dbp",
                        "label": {
                          "en": "Diastolic BP",
                          "zh": "舒张压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "54",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "rr",
                        "label": {
                          "en": "Respiratory rate",
                          "zh": "呼吸频率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "24",
                            "unit": "/min"
                          }
                        ]
                      },
                      {
                        "key": "spo2",
                        "label": {
                          "en": "SpO2",
                          "zh": "脉搏血氧饱和度"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "94",
                            "unit": "%"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "labs",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "potassium",
                        "label": {
                          "en": "Potassium",
                          "zh": "血钾"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "3.0",
                            "unit": "mEq/L",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "magnesium",
                        "label": {
                          "en": "Magnesium",
                          "zh": "血镁"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.3",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "creatinine",
                        "label": {
                          "en": "Creatinine",
                          "zh": "肌酐"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.9",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "glucose",
                        "label": {
                          "en": "Glucose",
                          "zh": "血糖"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "324",
                            "unit": "mg/dL"
                          }
                        ]
                      },
                      {
                        "key": "lactate",
                        "label": {
                          "en": "Lactate",
                          "zh": "乳酸"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "3.6",
                            "unit": "mmol/L",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "title": {
            "en": "Stage 1 Update",
            "zh": "第1阶段更新"
          }
        },
        {
          "id": "stage_2",
          "exhibits": [
            {
              "id": "exhibit_stage2",
              "title": {
                "en": "Clinical Update: Stage 2",
                "zh": "临床更新：第2阶段"
              },
              "content": {
                "en": "The provider orders transfer to a step-down unit for closer hemodynamic monitoring. A second 500 mL normal saline bolus is ordered, along with a continuous insulin infusion at 2 units/hr with hourly blood glucose checks per hospital protocol, given that the blood glucose is now persistently above 300 mg/dL and sliding scale is inadequate. The TPN rate is reduced to 60 mL/hr to decrease the dextrose load. The provider adds vancomycin 1 g IV (for empiric gram-positive coverage given the PICC site change and concern for catheter-related bloodstream infection, or CRBSI). The microbiology lab calls with a preliminary blood culture report: the PICC-drawn culture is flagging positive for gram-positive cocci in clusters at 8 hours of incubation; the peripheral culture drawn simultaneously has not yet flagged. The early flagging of the PICC culture before the peripheral culture is highly concerning for CRBSI, though not definitive until paired cultures grow the same organism with a differential time to positivity of at least 2 hours. Repeat vitals after interventions: temperature 102.9 °F (39.4 °C), heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen). Blood glucose is 245 mg/dL on the insulin drip (trending down). Urine output improves slightly to 25 mL/hr. Oral assessment is unchanged — the mucositis is confluent and the patient has not performed mouth rinses in over 6 hours because of pain; the PCA morphine demand history shows she has been pressing the button at maximum frequency. The nurse faces critical decisions about line management, glycemic control monitoring, oral care facilitation, and pain reassessment.",
                "zh": "医生医嘱将患者转至过渡病房进行更密切的血流动力学监测。医嘱给予第二次 500 mL 生理盐水推注，鉴于血糖现持续高于 300 mg/dL 且滑动标尺法胰岛素不足以控制，同时医嘱按医院方案以 2 单位/小时 的速度持续静脉泵入胰岛素，并每小时监测血糖。TPN速率降至 60 mL/hr 以减少葡萄糖负荷。医生加用万古霉素 1 g 静脉滴注（考虑到PICC部位的变化及怀疑导管相关血流感染（CRBSI），用于经验性覆盖革兰氏阳性菌）。微生物实验室打来电话报告初步血培养结果：培养8小时时，从PICC抽取的培养瓶提示簇状革兰氏阳性球菌阳性；同时抽取的周围血培养尚未报阳。PICC培养早于外周培养报阳的情况高度怀疑为CRBSI，但在成对培养物生长出相同病原体且报阳时间差至少2小时之前，尚不能确诊。干预后的复查生命体征：体温 102.9 °F (39.4 °C)，心率 122 次/分，血压 100/62 mmHg（第二次推注后略有改善），呼吸频率 22 次/分，通过 2 L 鼻导管吸氧下 SpO₂ 95%（现需补充氧气）。在胰岛素滴注下血糖为 245 mg/dL（呈下降趋势）。尿量略微改善至 25 mL/hr。口腔评估未见改变——黏膜炎呈融合状，因疼痛患者已超过6小时未进行漱口；PCA吗啡的按压记录显示她一直以最大频率按压按钮。护士面临关于导管管理、血糖控制监测、口腔护理协助和疼痛重新评估的关键决策。"
              },
              "structuredMeasurements": {
                "panels": [
                  {
                    "kind": "vitals",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "temp",
                        "label": {
                          "en": "Temperature",
                          "zh": "体温"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "39.4",
                            "unit": "°C",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "hr",
                        "label": {
                          "en": "Heart rate",
                          "zh": "心率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "122",
                            "unit": "bpm",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "sbp",
                        "label": {
                          "en": "Systolic BP",
                          "zh": "收缩压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "100",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "dbp",
                        "label": {
                          "en": "Diastolic BP",
                          "zh": "舒张压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "62",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "rr",
                        "label": {
                          "en": "Respiratory rate",
                          "zh": "呼吸频率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "22",
                            "unit": "/min",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "spo2",
                        "label": {
                          "en": "SpO2",
                          "zh": "脉搏血氧饱和度"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "95",
                            "unit": "%",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "labs",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "glucose",
                        "label": {
                          "en": "Glucose",
                          "zh": "血糖"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "245",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "title": {
            "en": "Stage 2 Update",
            "zh": "第2阶段更新"
          }
        },
        {
          "id": "stage_3",
          "exhibits": [
            {
              "id": "exhibit_stage3",
              "title": {
                "en": "Clinical Update: Stage 3",
                "zh": "临床更新：第3阶段"
              },
              "content": {
                "en": "The PICC-drawn blood culture is confirmed as coagulase-negative Staphylococcus (later speciated as Staphylococcus epidermidis), with the PICC culture turning positive at least 2 hours before the peripheral culture, confirming CRBSI. The provider orders PICC removal. Because urgent central access is required to continue TPN and maintain glycemic stability, a new triple-lumen PICC is placed at a new site in the left arm under ID guidance with repeat cultures planned, and TPN is resumed at 60 mL/hr through the new line. Vancomycin is continued; cefepime is continued for neutropenic fever coverage. After 8 hours on the insulin drip, blood glucose has stabilized at 180–200 mg/dL. Repeat labs: potassium 3.8 mEq/L (improving after aggressive replacement), magnesium 1.8 mg/dL (improving), creatinine 1.7 mg/dL (plateau, slight improvement), lactate 1.9 mmol/L (trending down), triglycerides 280 mg/dL (still elevated but decreasing with the reduced TPN rate). Temperature is 100.6 °F (38.1 °C) (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned). Urine output has improved to 35–40 mL/hr. The patient reports mouth pain is now 6 out of 10 after the PCA dose was optimized and a scheduled IV acetaminophen was added; she is able to tolerate gentle sodium bicarbonate rinses again with coaching. The new PICC site is clean, dry, and without erythema. The nurse evaluates these trends and determines whether the patient is improving, identifies ongoing monitoring priorities, and plans for nutritional reassessment as the mucositis trajectory changes.",
                "zh": "PICC抽取的血培养确认为凝固酶阴性葡萄球菌（后经鉴定为表皮葡萄球菌），且PICC培养报阳时间比外周培养早至少2小时，证实为CRBSI。医生医嘱拔除PICC。由于继续TPN和维持血糖稳定急需中心静脉通路，在感染科指导下于左臂新部位放置了新的三腔PICC，并计划复查培养。TPN以 60 mL/hr 的速度通过新导管恢复输注。继续使用万古霉素；继续使用头孢吡肟覆盖中性粒细胞减少伴发热。胰岛素滴注8小时后，血糖稳定在 180–200 mg/dL。复查实验室结果：钾 3.8 mEq/L（在积极补充后改善），镁 1.8 mg/dL（改善），肌酐 1.7 mg/dL（进入平台期，轻微改善），乳酸 1.9 mmol/L（呈下降趋势），甘油三酯 280 mg/dL（仍偏高，但随着TPN速率降低而下降）。体温 100.6 °F (38.1 °C)（较最高值呈下降趋势），心率 98 次/分，血压 110/68 mmHg，呼吸频率 18 次/分，室内空气下 SpO₂ 97%（已撤除补充氧气）。尿量改善至 35–40 mL/hr。在优化PCA剂量并加入定时静脉注射对乙酰氨基酚后，患者报告口腔疼痛现为6分（满分10分）；在指导下，她能够再次耐受温和的碳酸氢钠漱口。新PICC穿刺部位清洁、干燥，无红斑。护士评估这些趋势并判断患者病情是否改善，确定持续监测的重点，并随着黏膜炎病程的变化计划重新进行营养评估。"
              },
              "structuredMeasurements": {
                "panels": [
                  {
                    "kind": "vitals",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "temp",
                        "label": {
                          "en": "Temperature",
                          "zh": "体温"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "38.1",
                            "unit": "°C",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "hr",
                        "label": {
                          "en": "Heart rate",
                          "zh": "心率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "98",
                            "unit": "bpm",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "sbp",
                        "label": {
                          "en": "Systolic BP",
                          "zh": "收缩压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "110",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "dbp",
                        "label": {
                          "en": "Diastolic BP",
                          "zh": "舒张压"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "68",
                            "unit": "mmHg",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "rr",
                        "label": {
                          "en": "Respiratory rate",
                          "zh": "呼吸频率"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "18",
                            "unit": "/min",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "spo2",
                        "label": {
                          "en": "SpO2",
                          "zh": "脉搏血氧饱和度"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "97",
                            "unit": "%",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "labs",
                    "columns": [
                      {
                        "id": "current",
                        "label": {
                          "en": "Current",
                          "zh": "当前"
                        }
                      }
                    ],
                    "rows": [
                      {
                        "key": "potassium",
                        "label": {
                          "en": "Potassium",
                          "zh": "血钾"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "3.8",
                            "unit": "mEq/L",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "magnesium",
                        "label": {
                          "en": "Magnesium",
                          "zh": "血镁"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.8",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "creatinine",
                        "label": {
                          "en": "Creatinine",
                          "zh": "肌酐"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.7",
                            "unit": "mg/dL",
                            "context": "post_intervention"
                          }
                        ]
                      },
                      {
                        "key": "lactate",
                        "label": {
                          "en": "Lactate",
                          "zh": "乳酸"
                        },
                        "values": [
                          {
                            "columnId": "current",
                            "value": "1.9",
                            "unit": "mmol/L",
                            "context": "post_intervention"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "title": {
            "en": "Stage 3 Update",
            "zh": "第3阶段更新"
          }
        }
      ],
      "questions": [
        {
          "id": "opus_tpn_case_mucositis_01_q1",
          "itemType": "multiple_choice",
          "category": "Physiological Adaptation",
          "topic": "Sepsis & Septic Shock",
          "ngnSkill": "analyze_cues",
          "stem": {
            "en": "At Stage 1, after the fluid bolus and electrolyte replacements, the patient's condition continues to worsen. Based on the new clinical findings, what is the most likely emerging complication, and which cue is the highest priority to communicate to the provider?",
            "zh": "在第1阶段，给予液体推注和电解质补充后，患者病情继续恶化。基于新的临床表现，最可能出现的新发并发症是什么？沟通时优先级最高的临床线索是哪个？"
          },
          "options": [
            {
              "id": "opt_C",
              "en": "Localized PICC insertion site infection; new erythema extending 2 cm without purulent drainage.",
              "zh": "局部PICC穿刺部位感染；新发延伸 2 cm 的红斑，无脓性引流物。"
            },
            {
              "id": "opt_B",
              "en": "Hypovolemic shock resulting from severe mucositis-associated dehydration; oliguria of 30 mL over 2 hours.",
              "zh": "重度黏膜炎脱水导致的低血容量性休克；2小时内尿量仅为 30 mL。"
            },
            {
              "id": "opt_A",
              "en": "Sepsis likely originating from a catheter-related bloodstream infection; worsening hypotension despite the fluid bolus.",
              "zh": "可能源自导管相关血流感染的脓毒症；尽管推注液体血压仍持续恶化。"
            },
            {
              "id": "opt_D",
              "en": "Medication-induced anaphylaxis; the onset of shivering with rigors after antibiotic and electrolyte administration.",
              "zh": "药物引起的过敏反应；在给予抗生素和电解质后出现寒战。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "The nurse should recognize that the constellation of findings—fever in a neutropenic patient, hemodynamic instability unresponsive to fluids, rising lactate, and new PICC insertion site erythema—is most consistent with sepsis, likely from a catheter-related bloodstream infection (CRBSI). The single most critical cue to emphasize is the persistent hemodynamic deterioration despite the fluid bolus, as it signals progression toward septic shock.",
              "zh": "护士应意识到，这一系列临床表现（中性粒细胞减少患者发热、对液体复苏无反应的血流动力学不稳定、乳酸升高以及新发PICC穿刺部位红斑）最符合脓毒症，很可能源于导管相关血流感染（CRBSI）。最需强调的关键线索是尽管推注了液体但血流动力学仍持续恶化，因为这预示着正向脓毒性休克进展。"
            },
            "byChoice": [
              {
                "refId": "opt_D",
                "en": "While rigors can occur with adverse reactions, in the context of persistent fever, rising lactate, and an indwelling central line with site changes, sepsis is the most likely and most dangerous hypothesis that must be addressed first.",
                "zh": "虽然寒战也可见于不良反应，但在持续发热、乳酸升高和留置中心静脉导管伴局部变化的背景下，脓毒症是最可能也是最危险的假设，必须首先予以处理。"
              },
              {
                "refId": "opt_C",
                "en": "Failing to recognize systemic involvement because there is no purulent drainage is an error. Neutropenic patients lack adequate neutrophils to mount a purulent response, so subtle erythema with fever and hypotension suggests a systemic bloodstream infection, not just a localized one.",
                "zh": "因为没有脓性引流物而未意识到全身性受累是错误的。中性粒细胞减少的患者缺乏足够的中性粒细胞来产生化脓反应，因此伴有发热和低血压的轻微红斑提示全身性血流感染，而不仅仅是局部感染。"
              },
              {
                "refId": "opt_B",
                "en": "Poor intake and dehydration may contribute to hypotension and lactate elevation. Here, fever, profound neutropenia, new PICC-site erythema, rigors and deterioration despite a fluid challenge make sepsis the urgent working hypothesis; dehydration alone does not account adequately for the full pattern.",
                "zh": "摄入不足及脱水可促成低血压和乳酸升高。但本病例的发热、重度中性粒细胞减少、新发 PICC 处红斑、寒战及补液后仍恶化，使脓毒症成为需要紧急处理的工作假设；单纯脱水不能充分解释全部表现。"
              },
              {
                "refId": "opt_A",
                "en": "In profound neutropenia, the patient lacks an adequate inflammatory response, making even subtle signs of infection highly significant. Persistent hypotension after a fluid challenge with rising lactate indicates systemic inflammatory response and early sepsis.",
                "zh": "在重度中性粒细胞减少的情况下，患者缺乏足够的炎症反应，使得即使是细微的感染迹象也具有极高的意义。补液后持续低血压伴乳酸升高提示全身炎症反应和早期脓毒症。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Prioritize systemic, life-threatening hypotheses (sepsis) over localized (site infection) or less acutely critical (dehydration) explanations when signs of shock (hypotension unresponsive to fluids, rising lactate) are present.",
            "zh": "当出现休克体征（对补液无反应的低血压、乳酸升高）时，应优先考虑全身性、危及生命的假设（脓毒症），而不是局部的（部位感染）或急性危险较低的（脱水）解释。"
          },
          "glossary": [
            {
              "termEn": "Catheter-related bloodstream infection (CRBSI)",
              "termZh": "导管相关血流感染",
              "defZh": "一种严重的并发症，指病原微生物从中心静脉导管侵入血液系统引起感染。"
            },
            {
              "termEn": "Lactate",
              "termZh": "乳酸",
              "defZh": "一种组织低灌注和细胞缺氧的指标，在脓毒症等情况下会升高。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": "stage_1"
        },
        {
          "id": "opus_tpn_case_mucositis_01_q2",
          "itemType": "multiple_choice",
          "category": "Pharmacological and Parenteral Therapies",
          "topic": "Parenteral Nutrition",
          "ngnSkill": "generate_solutions",
          "stem": {
            "en": "At Stage 1, the patient's blood glucose is 324 mg/dL and rising despite sliding-scale insulin coverage, and the TPN infusion continues at 85 mL/hr. What is the most appropriate nursing action?",
            "zh": "在第1阶段，尽管使用了滑动标尺法胰岛素，患者的血糖仍升至 324 mg/dL 且呈上升趋势，同时TPN继续以 85 mL/hr 的速度输注。最适当的护理措施是什么？"
          },
          "options": [
            {
              "id": "opt_D",
              "en": "Pause the TPN for one hour, administer the sliding-scale insulin, and restart the TPN once the blood glucose drops below 200 mg/dL.",
              "zh": "暂停TPN 1小时，给予滑动标尺法胰岛素，并在血糖降至 200 mg/dL 以下后重新开始TPN输注。"
            },
            {
              "id": "opt_B",
              "en": "Independently stop the TPN infusion immediately to prevent severe hyperglycemia from the continuous dextrose load.",
              "zh": "为防止持续输入葡萄糖负荷导致严重高血糖，立即自行停止TPN输注。"
            },
            {
              "id": "opt_A",
              "en": "Notify the provider of the worsening trend and anticipate an order for a continuous insulin infusion and a possible reduction in the TPN rate.",
              "zh": "向医生报告恶化的血糖趋势，预期医生会开具持续胰岛素静脉泵入医嘱，并可能降低TPN输注速率。"
            },
            {
              "id": "opt_C",
              "en": "Continue monitoring the blood glucose every 6 hours and administer the sliding-scale insulin as ordered.",
              "zh": "继续每6小时监测一次血糖，并遵医嘱给予滑动标尺法胰岛素。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "The nurse should notify the provider that the TPN dextrose load is exceeding the patient's insulin capacity, exacerbated by sepsis-related insulin resistance. The correct approach is rate reduction plus an insulin drip, which requires provider orders. The nurse must not independently stop or adjust the TPN rate.",
              "zh": "护士应通知医生，TPN的葡萄糖负荷超过了患者的胰岛素调节能力，且脓毒症相关的胰岛素抵抗加剧了这一情况。正确的做法是降低输注速率并使用胰岛素泵，这需要医生的医嘱。护士绝对不能自行停止或调整TPN速率。"
            },
            "byChoice": [
              {
                "refId": "opt_D",
                "en": "Pausing TPN without an order risks rebound hypoglycemia and interrupts essential therapy. The nurse must not independently adjust TPN, but should follow institutional protocol and notify the provider for a comprehensive glucose management plan.",
                "zh": "在没有医嘱的情况下暂停TPN会带来反跳性低血糖风险并中断必要的治疗。护士绝不能自行调整TPN，而应遵循机构方案并通知医生制定全面的血糖管理计划。"
              },
              {
                "refId": "opt_A",
                "en": "Continuous dextrose infusions during physiologic stress often require continuous insulin rather than reactive sliding-scale coverage. Anticipating rate reduction and an insulin drip safely addresses both nutrition and glycemic control.",
                "zh": "在生理应激期间持续输注葡萄糖，通常需要持续静脉使用胰岛素，而非反应性的滑动标尺法。预期降低速率和加用胰岛素泵能安全兼顾营养和血糖控制。"
              },
              {
                "refId": "opt_C",
                "en": "Assuming the hyperglycemia is adequately managed by the sliding scale and failing to escalate the upward trend allows worsening hyperglycemia, which impairs immune function and worsens infection outcomes.",
                "zh": "认为滑动标尺法已足以控制高血糖而不去升级处理上升趋势，将导致高血糖进一步恶化，损害免疫功能并使感染后果更为严重。"
              },
              {
                "refId": "opt_B",
                "en": "Abruptly discontinuing TPN carries a risk of rebound hypoglycemia. The nurse should not independently stop or adjust TPN, but rather notify the provider, monitor glucose closely, and follow institutional protocol, which may include holding insulin and providing dextrose-containing IV fluid if ordered.",
                "zh": "突然停用TPN有引起反跳性低血糖的风险。护士绝不应自行停止或调整TPN，而应通知医生，密切监测血糖，并遵循机构方案，可能包括遵医嘱暂停胰岛素和给予含葡萄糖的静脉输液。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "When a prescribed continuous therapy (like TPN) causes adverse effects, do not independently stop or adjust it without an order. Notify the provider, follow institutional protocol, monitor closely, and prepare to adjust concurrent medications (like insulin) or administer prescribed fluids.",
            "zh": "当处方的持续治疗（如TPN）引起不良反应时，不要在无医嘱的情况下自行停止或调整。应通知医生，遵循机构方案，密切监测，并准备调整同期药物（如胰岛素）或遵医嘱给予输液。"
          },
          "glossary": [
            {
              "termEn": "Total parenteral nutrition (TPN)",
              "termZh": "全胃肠外营养",
              "defZh": "通过静脉（通常是中心静脉）直接提供所有每日所需营养素（包括高浓度葡萄糖）的方法。"
            },
            {
              "termEn": "Rebound hypoglycemia",
              "termZh": "反跳性低血糖",
              "defZh": "在突然停止高浓度葡萄糖输注（如TPN）后，由于高胰岛素水平仍在循环中而引起的严重低血糖。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        },
        {
          "id": "opus_tpn_case_mucositis_01_q3",
          "itemType": "select_all",
          "category": "Management of Care",
          "topic": "Prioritization & Delegation",
          "ngnSkill": "take_action",
          "stem": {
            "en": "At Stage 2, the PICC culture has flagged positive before the simultaneously drawn peripheral culture. Which actions should the nurse coordinate while paired-culture confirmation is pending? Select all that apply.",
            "zh": "在第 2 阶段，PICC 血培养早于同时抽取的外周血培养报阳。在等待配对培养确认时，护士应协调哪些措施？选择所有适用项。"
          },
          "options": [
            {
              "id": "opt_B",
              "en": "Verify that empiric antibiotic coverage (vancomycin) is actively infusing.",
              "zh": "确认经验性抗生素（万古霉素）正在积极输注。"
            },
            {
              "id": "opt_A",
              "en": "Communicate the early flagging of the PICC culture to the provider.",
              "zh": "向医生报告PICC培养提早报阳的情况。"
            },
            {
              "id": "opt_D",
              "en": "Remove the infected PICC line under provider orders.",
              "zh": "在医生医嘱下拔除受感染的PICC导管。"
            },
            {
              "id": "opt_C",
              "en": "Coordinate with the provider for an alternative central access and glycemic management plan.",
              "zh": "与医生协调替代中心静脉通路及血糖管理方案。"
            },
            {
              "id": "opt_E",
              "en": "Delay prescribed antimicrobial treatment until the organism and source are definitively confirmed.",
              "zh": "推迟医嘱抗菌治疗，直到病原体和感染源被最终确认。"
            },
            {
              "id": "opt_F",
              "en": "Require a replacement central catheter to be inserted before any source-control removal can occur.",
              "zh": "要求必须先置入替代中心静脉导管，才可实施任何感染源控制性拔管。"
            }
          ],
          "correct": [
            "opt_A",
            "opt_B",
            "opt_C",
            "opt_D"
          ],
          "rationale": {
            "correct": {
              "en": "Report the concerning culture result, ensure prompt prescribed antimicrobial therapy, coordinate necessary access and glucose support, and implement source-control orders. These tasks require coordination rather than a fixed four-step sequence. A new central line is not a universal prerequisite for source control. Paired cultures growing the same organism with the catheter sample positive at least two hours earlier support CRBSI.",
              "zh": "应报告令人担忧的培养结果，确保及时按医嘱抗菌治疗，协调必要通路及血糖支持，并执行感染源控制医嘱。这些任务需要协调，而非固定四步顺序。新中心静脉导管并非感染源控制的普遍前提。同一病原体的配对培养中，导管血样至少提前两小时报阳支持 CRBSI。"
            },
            "byChoice": [
              {
                "refId": "opt_A",
                "en": "Prompt communication supports reassessment of antimicrobial and source-control plans.",
                "zh": "及时报告支持重新评估抗菌及感染源控制方案。"
              },
              {
                "refId": "opt_B",
                "en": "The prescribed empiric antimicrobial should not wait for final paired-culture confirmation.",
                "zh": "医嘱经验性抗菌治疗不应等待最终配对培养确认。"
              },
              {
                "refId": "opt_C",
                "en": "Coordinate access, PN interruption management and glucose monitoring with the team while source control is arranged.",
                "zh": "安排感染源控制的同时，与团队协调通路、PN 中断管理及血糖监测。"
              },
              {
                "refId": "opt_D",
                "en": "Carry out removal when ordered; coordinate ongoing treatment according to clinical urgency and the team’s plan.",
                "zh": "按医嘱执行拔管；根据临床紧迫性及团队计划协调持续治疗。"
              },
              {
                "refId": "opt_E",
                "en": "Waiting for definitive microbiology may dangerously delay treatment.",
                "zh": "等待最终微生物结果可能造成危险的治疗延误。"
              },
              {
                "refId": "opt_F",
                "en": "Alternative access planning is important, but the timing of removal and new access is an individualized source-control decision.",
                "zh": "替代通路规划很重要，但拔管与新通路的时机属于个体化感染源控制决策。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Coordinate urgent treatment, source control and continued supportive care; distinguish actual prerequisites from tasks that may proceed together.",
            "zh": "协调紧急治疗、感染源控制和持续支持照护；区分真正的前提条件和可以并行的任务。"
          },
          "glossary": [
            {
              "termEn": "Differential time to positivity",
              "termZh": "报阳时间差",
              "defZh": "从导管抽取的血培养中病原体的生长比同时抽取的外周血培养提早至少2小时；结合临床表现，这支持CRBSI的诊断。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": "stage_2"
        },
        {
          "id": "opus_tpn_case_mucositis_01_q4",
          "itemType": "multiple_choice",
          "category": "Basic Care and Comfort",
          "topic": "Nutritional & Fluid Support",
          "ngnSkill": "generate_solutions",
          "stem": {
            "en": "At Stage 2, the patient has not performed mouth rinses in over 6 hours due to severe pain from confluent mucositis with bleeding, and she refuses further oral care attempts. What is the priority nursing intervention?",
            "zh": "在第2阶段，由于融合性黏膜炎伴出血引起的剧烈疼痛，患者已超过6小时未进行漱口，并拒绝进一步的口腔护理尝试。首要的护理干预措施是什么？"
          },
          "options": [
            {
              "id": "opt_B",
              "en": "Use a standard soft-bristle toothbrush to thoroughly clean the oral cavity, as skipping oral care increases the risk of secondary infection.",
              "zh": "使用标准软毛牙刷彻底清洁口腔，因为跳过口腔护理会增加继发感染的风险。"
            },
            {
              "id": "opt_A",
              "en": "Coordinate analgesia (PCA bolus or topical analgesic) 15 to 20 minutes before assisting the patient with atraumatic sodium bicarbonate rinses.",
              "zh": "在协助患者使用无创性碳酸氢钠漱口前15至20分钟，先协调使用镇痛药（PCA单次推注或局部镇痛药）。"
            },
            {
              "id": "opt_D",
              "en": "Forcefully swab the oral cavity with a lemon-glycerin swab to ensure mucosal integrity is maintained despite the patient's refusal.",
              "zh": "不顾患者拒绝，强行使用柠檬甘油棉签擦拭口腔，以确保维持黏膜完整性。"
            },
            {
              "id": "opt_C",
              "en": "Defer all oral care until the patient's pain is completely resolved to avoid causing mucosal trauma against her will.",
              "zh": "推迟所有口腔护理，直到患者疼痛完全缓解，以避免违背其意愿造成黏膜损伤。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "Oral care is a critical intervention to reduce secondary infection risk, but it must be facilitated through adequate pain management, not forced. The nurse should coordinate analgesia before care and use atraumatic technique (gentle rinses or ultra-soft/sponge swabs) given the severe thrombocytopenia and bleeding risk.",
              "zh": "口腔护理是降低继发感染风险的关键干预措施，但必须通过充分的疼痛管理来促成，而不能强迫进行。考虑到严重的血小板减少症和出血风险，护士应在护理前协调镇痛，并使用无创性技术（轻柔漱口或超软/海绵棉签）。"
            },
            "byChoice": [
              {
                "refId": "opt_A",
                "en": "Coordinating analgesia before oral care encourages compliance without forcing interventions, and atraumatic rinses maintain mucosal defense without causing hemorrhage in a profoundly thrombocytopenic patient.",
                "zh": "在口腔护理前协调使用镇痛药能鼓励患者配合而不必强迫干预，而在严重血小板减少的患者中，无创性漱口能在维持黏膜防御的同时不引起出血。"
              },
              {
                "refId": "opt_B",
                "en": "With platelets at 18 ×10³/µL, mechanical trauma from a standard toothbrush can cause significant oral hemorrhage. Only ultra-soft brushes or sponge swabs should be used.",
                "zh": "当血小板为 18 ×10³/µL 时，标准牙刷造成的机械性损伤会引起严重的口腔出血。只应使用超软毛牙刷或海绵棉签。"
              },
              {
                "refId": "opt_D",
                "en": "Lemon-glycerin swabs are drying and irritating to compromised mucosa and are contraindicated in mucositis. Furthermore, care should never be forced.",
                "zh": "柠檬甘油棉签会使受损黏膜干燥并受到刺激，在黏膜炎中属禁忌使用。此外，绝不应强迫进行护理。"
              },
              {
                "refId": "opt_C",
                "en": "Abandoning oral care entirely worsens the risk of bacterial and fungal superinfection of the ulcerated mucosa. The disrupted barrier is a primary portal of entry for systemic infection in neutropenic patients.",
                "zh": "完全放弃口腔护理会增加溃疡黏膜发生细菌和真菌二重感染的风险。受损的黏膜屏障是中性粒细胞减少患者全身感染的主要侵入门户。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "In pain management scenarios involving essential care, choose the option that proactively addresses the pain (analgesia beforehand) to allow the necessary intervention to proceed safely.",
            "zh": "在涉及必要护理的疼痛管理情境中，选择能主动处理疼痛（事先镇痛）以使必要干预能安全进行的选项。"
          },
          "glossary": [
            {
              "termEn": "Thrombocytopenia",
              "termZh": "血小板减少症",
              "defZh": "血液中血小板计数异常降低，显著增加出血风险。"
            }
          ],
          "difficulty": "hard",
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        },
        {
          "id": "opus_tpn_case_mucositis_01_q5",
          "itemType": "matrix",
          "category": "Physiological Adaptation",
          "topic": "Sepsis & Septic Shock",
          "ngnSkill": "evaluate_outcomes",
          "stem": {
            "en": "At Stage 3, the nurse evaluates the patient's clinical response to the interventions. For each clinical finding, indicate whether it demonstrates \"Clinical Improvement\" or requires \"Ongoing Monitoring/Intervention\".",
            "zh": "在第3阶段，护士评估患者对干预措施的临床反应。对于每一项临床表现，请指出其表明“临床改善（Clinical Improvement）”还是需要“持续监测/干预（Ongoing Monitoring/Intervention）”。"
          },
          "correct": [
            {
              "rowId": "row_A",
              "columnIds": [
                "col_1"
              ]
            },
            {
              "rowId": "row_B",
              "columnIds": [
                "col_1"
              ]
            },
            {
              "rowId": "row_C",
              "columnIds": [
                "col_2"
              ]
            },
            {
              "rowId": "row_D",
              "columnIds": [
                "col_2"
              ]
            },
            {
              "rowId": "row_E",
              "columnIds": [
                "col_1"
              ]
            }
          ],
          "rationale": {
            "correct": {
              "en": "A decreasing lactate, stabilizing blood glucose, and downtrending temperature all indicate a positive response to sepsis treatment and glycemic management. However, elevated triglycerides related to TPN and a persistently abnormal creatinine require ongoing monitoring and potential future intervention.",
              "zh": "乳酸下降、血糖稳定和体温呈下降趋势均表明对脓毒症治疗和血糖管理有积极反应。然而，与TPN相关的甘油三酯升高和持续异常的肌酐需要持续监测及未来潜在的干预。"
            },
            "byChoice": [
              {
                "refId": "row_A",
                "en": "Lactate clearance (decreasing from 3.6 to 1.9) is a highly sensitive marker of improving tissue perfusion and clinical improvement in sepsis.",
                "zh": "乳酸清除（从 3.6 降至 1.9）是组织灌注改善和脓毒症临床好转的高度敏感标志。"
              },
              {
                "refId": "row_B",
                "en": "Stabilization of blood glucose on an insulin drip represents clinical improvement from the previously rising trend of 324 mg/dL.",
                "zh": "在胰岛素滴注下血糖趋于稳定，代表与之前 324 mg/dL 上升趋势相比的临床改善。"
              },
              {
                "refId": "row_C",
                "en": "Triglycerides at 280 mg/dL remain elevated (normal < 150 mg/dL). Sustained hypertriglyceridemia from lipid-containing TPN risks complications like pancreatitis and requires ongoing monitoring.",
                "zh": "甘油三酯 280 mg/dL 仍然偏高（正常 < 150 mg/dL）。含脂质TPN引起的持续高甘油三酯血症有导致胰腺炎等并发症的风险，需要持续监测。"
              },
              {
                "refId": "row_D",
                "en": "While creatinine is no longer rising rapidly, a plateau of 1.7 mg/dL is still elevated from the baseline of 1.3 mg/dL, indicating ongoing renal impairment that requires monitoring.",
                "zh": "虽然肌酐不再快速上升，但 1.7 mg/dL 的平台期仍高于 1.3 mg/dL 的基线水平，表明存在持续的肾损害，需要监测。"
              },
              {
                "refId": "row_E",
                "en": "A downtrending temperature after appropriate antibiotics and source control indicates an improving infectious picture.",
                "zh": "使用适当抗生素并控制感染源后体温下降趋势，表明感染情况正在改善。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Evaluate trends, not just absolute values. Returning toward baseline (fever, lactate, glucose) is an improvement; values that remain abnormally elevated (triglycerides, creatinine) demand continued vigilance.",
            "zh": "要评估趋势，而不仅仅是绝对数值。向基线恢复（发热、乳酸、血糖）属于改善；仍处于异常升高的指标（甘油三酯、肌酐）则要求持续警惕。"
          },
          "glossary": [],
          "difficulty": "hard",
          "matrix": {
            "rows": [
              {
                "id": "row_A",
                "en": "Lactate decreasing from 3.6 to 1.9 mmol/L",
                "zh": "乳酸从 3.6 mmol/L 降至 1.9 mmol/L"
              },
              {
                "id": "row_B",
                "en": "Blood glucose stabilizing at 180–200 mg/dL on the insulin drip",
                "zh": "在胰岛素滴注下血糖稳定在 180–200 mg/dL"
              },
              {
                "id": "row_C",
                "en": "Triglycerides 280 mg/dL",
                "zh": "甘油三酯 280 mg/dL"
              },
              {
                "id": "row_D",
                "en": "Creatinine plateaued at 1.7 mg/dL",
                "zh": "肌酐停滞在 1.7 mg/dL"
              },
              {
                "id": "row_E",
                "en": "Temperature trending down from 102.9 °F (39.4 °C) to 100.6 °F (38.1 °C)",
                "zh": "体温从 102.9 °F (39.4 °C) 呈下降趋势降至 100.6 °F (38.1 °C)"
              }
            ],
            "columns": [
              {
                "id": "col_2",
                "en": "Ongoing Monitoring/Intervention",
                "zh": "持续监测/干预"
              },
              {
                "id": "col_1",
                "en": "Clinical Improvement",
                "zh": "临床改善"
              }
            ],
            "selectionMode": "single_per_row"
          },
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        },
        {
          "id": "opus_tpn_case_mucositis_01_q6",
          "itemType": "multiple_choice",
          "category": "Basic Care and Comfort",
          "topic": "Nutritional & Fluid Support",
          "ngnSkill": "prioritize_hypotheses",
          "stem": {
            "en": "The patient can tolerate gentle mouth rinses with coaching but still cannot swallow liquids. Does rinse tolerance alone justify discontinuing TPN and resuming oral nutrition?",
            "zh": "患者在指导下能耐受温和的漱口，但仍无法吞咽液体。仅凭耐受漱口，是否足以停用 TPN 并恢复经口营养？"
          },
          "options": [
            {
              "id": "opt_C",
              "en": "No, because a newly placed PICC line must be used for TPN for at least 72 hours to ensure catheter patency before any enteral trials can begin.",
              "zh": "不合适，因为新放置的PICC导管必须至少用于TPN输注72小时以确保导管通畅，之后才能开始肠内营养试验。"
            },
            {
              "id": "opt_A",
              "en": "No, because the patient has grade IV mucositis with severe systemic inflammation, and tolerating mouth rinses is not equivalent to tolerating nutritional intake.",
              "zh": "不合适，因为患者患有IV级黏膜炎伴重度全身炎症，能耐受漱口不等于能耐受营养摄入。"
            },
            {
              "id": "opt_B",
              "en": "Yes, because the patient's ability to tolerate sodium bicarbonate rinses indicates sufficient mucosal recovery to safely swallow clear liquids.",
              "zh": "合适，因为患者能耐受碳酸氢钠漱口表明黏膜已充分恢复，可以安全吞咽清流质。"
            },
            {
              "id": "opt_D",
              "en": "Yes, because prolonged TPN dependence significantly increases the risk of another central line infection, making enteral nutrition the safer immediate option.",
              "zh": "合适，因为长期依赖TPN会显著增加再次发生中心静脉导管感染的风险，使肠内营养成为当前更安全的直接选择。"
            }
          ],
          "correct": [
            "opt_A"
          ],
          "rationale": {
            "correct": {
              "en": "Rinse tolerance alone does not justify stopping parenteral nutrition or restarting oral nutrition. Swishing and spitting small amounts is different from swallowing nutritional volumes through an ulcerated esophagus. Continue the prescribed nutrition support while the team reassesses safe routes and adequate intake.",
              "zh": "仅能耐受漱口不足以支持停用肠外营养或恢复经口营养。少量含漱后吐出，与经有溃疡的食管吞咽足量营养不同。应继续医嘱营养支持，同时由团队重新评估安全途径及足够摄入。"
            },
            "byChoice": [
              {
                "refId": "opt_B",
                "en": "Interpreting rinse tolerance as readiness for oral intake is an error. Swishing and spitting is fundamentally different from the mechanics of swallowing.",
                "zh": "将耐受漱口解读为已准备好经口进食是错误的。含漱后吐出在机制上与吞咽有着根本的不同。"
              },
              {
                "refId": "opt_A",
                "en": "Premature discontinuation of TPN in a patient with confluent esophageal ulcerations (grade IV mucositis) results in loss of nutritional support and worsens malnutrition, immunocompromise, and healing.",
                "zh": "对于有融合性食管溃疡（IV级黏膜炎）的患者，过早停用TPN会导致营养支持丧失，并加重营养不良、免疫功能低下及伤口愈合不良。"
              },
              {
                "refId": "opt_D",
                "en": "TPN infection risk warrants review, but inability to swallow persists. Tube feeding is a separate team assessment: platelets of 18,000/µL, active mucosal bleeding and esophageal ulceration require careful route and procedure evaluation; rinse tolerance does not settle that decision.",
                "zh": "TPN 的感染风险需要复核，但患者仍无法吞咽。管饲属于另一项团队评估：血小板 18,000/µL、活动性黏膜出血及食管溃疡，均要求谨慎评估途径与操作；耐受漱口不能决定这一问题。"
              },
              {
                "refId": "opt_C",
                "en": "There is no standard requirement to use a PICC line for 72 hours solely to prove patency before discontinuing TPN. The barrier is the patient's mucosal integrity, not line patency.",
                "zh": "并没有任何标准要求单纯为了证明导管通畅，必须使用PICC导管72小时后才能停用TPN。主要障碍在于患者的黏膜完整性，而非导管通畅度。"
              }
            ]
          },
          "testTakingStrategy": {
            "en": "Distinguish swish-and-spit tolerance from safe swallowing and adequate nutritional intake; reassess the nutrition route with the care team.",
            "zh": "区分含漱后吐出的耐受性、安全吞咽及足够营养摄入；与照护团队重新评估营养途径。"
          },
          "glossary": [],
          "difficulty": "hard",
          "answerableAfterStageId": {
            "kind": "baseline"
          }
        }
      ]
    },
    "note": "Overnight C17 A/B follow-through replacement (raw/hard-cases-c17-mucositis-replacement.json), independently reviewed 2026-09-13: q3 converted from a rigid ordered_response sequence to select_all with genuine unsafe distractors; differential-time-to-positivity language corrected to 'at least 2 hours' matching IDSA/CLABSI diagnostic criteria. q1/q2/q4-q6 content already matches the applied Campaign 17 content repair; only q3 and two stage-narrative sentences change."
  },
  {
    "kind": "replaceText",
    "id": "case_sepsis_pneumonia_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "triage"
      },
      "content",
      "en"
    ],
    "before": "39.2 C",
    "after": "102.6 °F (39.2 °C)",
    "note": "Temperature counterpart R1 TC-13-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "cs_copd_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "vitals"
      },
      "content",
      "en"
    ],
    "before": "101.2 F (38.4 C)",
    "after": "101.2 °F (38.4 °C)",
    "note": "Temperature counterpart R1 TC-14-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "cs_copd_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "vitals"
      },
      "content",
      "zh"
    ],
    "before": "101.1 °F (38.4 °C)",
    "after": "101.2 °F (38.4 °C)",
    "note": "Temperature counterpart R1 TC-14-zh: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "gpt_case_gbs_respiratory_compromise_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "ex_initial_assessment"
      },
      "content",
      "en"
    ],
    "before": "36.8 C",
    "after": "98.2 °F (36.8 °C)",
    "note": "Temperature counterpart R1 TC-15-en: independently reviewed display normalization."
  },
  {
    "kind": "replaceText",
    "id": "opus1_case_discharge_med_rec_anticoag_01",
    "path": [
      "caseStudy",
      "exhibits",
      {
        "id": "baseline_record"
      },
      "content",
      "en"
    ],
    "before": "36.8 C",
    "after": "98.2 °F (36.8 °C)",
    "note": "Temperature counterpart R1 TC-16-en: independently reviewed display normalization."
  }
]);
