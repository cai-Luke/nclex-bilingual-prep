from edit import *
q=load(17);p=part(q,'q3');bi(q['caseStudy']['title'],'Postpartum readmission for headache and elevated blood pressure','产后因头痛和血压升高再次入院')
p['dropdowns']=[d for d in p['dropdowns'] if d['id']!='dx'];p['rationale']['byChoice']=[d for d in p['rationale']['byChoice'] if d['refId']!='dx']
rep(p['clozeStem'],'en','The priority working diagnosis is {{dx}}. ','');rep(p['clozeStem'],'zh','优先工作诊断是 {{dx}}。','');anchor(p,'stage2');save(q)
q=load(19);bi(q['caseStudy']['title'],'Clozapine initiation with an acute change during titration','氯氮平起始治疗与滴定期间的急性变化');anchor(part(q,'q2'),'stage_2');p=part(q,'q6')
bi(obj(p['options'],'A'),'The client has relative hemodynamic stability, but the toxicities have not resolved: troponin and CRP are still rising and ANC remains low.','患者血流动力学相对稳定，但毒性尚未消退：肌钙蛋白和 CRP 仍在上升，ANC 仍低。');bi(obj(p['rationale']['byChoice'],'A','refId'),'Relative stability and small improvements in vital signs coexist with persistent neutropenia and rising cardiac injury/inflammation markers; continued close monitoring is necessary.','相对稳定及生命体征的小幅改善，与持续中性粒细胞减少和心肌损伤/炎症标志物上升同时存在；仍需密切监测。');anchor(p,'stage_3');save(q)
q=load(20);p=part(q,'q4');bi(obj(p['options'],'q4_d'),'Stop further sharing of the identifiable photo, secure the image and device pending Privacy Officer or security direction, and report the event immediately with the instructor involved.','停止进一步分享可识别照片，在等待隐私官或信息安全人员指示时妥善保护图像和设备，并立即上报事件，让指导老师参与处理。');bi(obj(p['rationale']['byChoice'],'q4_d','refId'),'Contain exposure and report promptly so the Privacy Officer or security team can direct evidence preservation, investigate cloud syncing, and determine the appropriate disposition of the image.','应控制暴露并及时上报，由隐私官或信息安全团队指导证据保全、调查云端同步情况，并决定如何处置图像。')
c=content(q,1);rep(c,'en','RN Jordan has the student delete it immediately, including recently deleted storage, with the instructor present, and reports the event for Privacy Officer review of possible cloud syncing.','RN Jordan stops further sharing, secures the image and device pending Privacy Officer or security direction, and immediately reports the event with the instructor involved for review of possible cloud syncing.');rep(c,'zh','Jordan护士在指导老师在场时让护生立即删除照片，包括最近删除存储，并上报由隐私官评估可能的云端同步。','Jordan护士停止进一步分享，妥善保护图像和设备以等待隐私官或信息安全人员指示，并在指导老师参与下立即上报，由相关人员评估可能的云端同步。');anchor(p,'stage_1');save(q)
q=load(22);c=content(q,1);rep(c,'en',' Marcus verifies that SBP > 180 crosses the call threshold.','');rep(c,'zh','Marcus 确认 SBP > 180 已达到通知阈值。','');rep(c,'en','sinus tachycardia at 92','normal sinus rhythm at 92');rep(c,'zh','窦性心动过速 92 次/分','正常窦性心律 92 次/分')
for s in ['q3','q4','q5']:anchor(part(q,s),'stage_2')
save(q)
q=load(12);p=part(q,'q4')
for c in p['rationale']['byChoice']:
 c['en']=c['en'].replace(' No new vomiting episode needs to be assumed.','');c['zh']=c['zh'].replace('无需假定新发生了呕吐。','')
save(q)
