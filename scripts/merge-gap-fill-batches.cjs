// One-off consolidation: promote reviewed gap-fill survivors from
// banks-raw/gemini-100-consolidated.json into banks/gemini-canonical.json.
// Drops 21 near-duplicates (13 vs canonical, 8 internal) and applies
// content-review fixes, per the 2026-06-05 review.
const fs = require('fs');

const ROOT = '/Users/holemini/Desktop/Project Shrimp';
const canonPath = `${ROOT}/banks/gemini-canonical.json`;
const newPath = `${ROOT}/banks/banks-raw/gemini-100-consolidated.json`;

// IDs to drop. Reason noted for the ledger.
const DROP = new Set([
  // duplicate existing canonical items
  'gen_bcc_batch2_2',  // dysphagia aspiration ~ gemini_jun05_a_mc_dysphagia_29 (+ internal dup of batch1_8)
  'gen_sic_batch1_01', // meningitis droplet PPE ~ gemini_b4_01
  'gen_sic_batch1_03', // PPE donning order ~ gemini_b10_05
  'gen_sic_batch1_04', // heparin SC 0.5 mL ~ gemini_p5_04 (identical)
  'gen_rrp_batch1_03', // PRBC administration order ~ sa_blood_transfusion_01
  'gen_rrp_batch2_04', // pulse pressure calc ~ gemini_jun05_b_fib_vital_08
  'gen_rrp_batch1_02', // post-cardiac-cath SATA ~ trad_batchD_12
  'gen_rrp_batch2_08', // post-cardiac-cath SATA ~ trad_batchD_12
  'gen_hpm_batch1_8',  // Erikson adolescent ~ gemini_b3_05 (identical)
  'gen_hpm_batch2_2',  // newborn safe sleep ~ sata_newborn_safety_teaching_008
  'gen_hpm_batch2_4',  // infant motor milestones ~ gemini_p9_or_03
  'gen_psi_batch1_5',  // manic-phase interventions ~ trad_batchC_08
  'gen_psi_batch1_10', // panic attack SATA ~ gemini_p10_5
  // duplicate each other within the new set (keep the richer batch1 item)
  'gen_bcc_batch2_1',  // cane/COAL ~ gen_bcc_batch1_1
  'gen_bcc_batch2_3',  // bed bath order ~ gen_bcc_batch1_3
  'gen_bcc_batch2_4',  // oz->mL intake calc ~ gen_bcc_batch1_4
  'gen_bcc_batch2_9',  // bed->chair transfer order ~ gen_bcc_batch1_9
  'gen_sic_batch2_5',  // transmission-precautions matrix ~ gen_sic_batch1_05
  'gen_sic_batch2_7',  // sharps disposal ~ gen_sic_batch1_10
  'gen_hpm_batch2_8',  // mammography annual ~ gen_hpm_batch1_3
  'gen_psi_batch1_9',  // child-abuse mandated report ~ gen_psi_batch2_08
]);

// Content-review fixes applied to survivors.
function applyFixes(q) {
  if (q.id === 'gen_bcc_batch1_8') {
    for (const g of q.glossary) if (g.termZh === '吞吞困难') g.termZh = '吞咽困难';
  }
  if (q.id === 'gen_psi_batch1_1') {
    for (const c of q.rationale.byChoice || [])
      if (c.refId === 'B') c.zh = c.zh.replace('对比兴的直接对抗', '对否认的直接对抗');
  }
  if (q.id === 'gen_sic_batch1_06') {
    q.stem.en = 'A nurse discovers a large spill of an unidentified liquid chemical in the utility room.';
    q.stem.zh = '护士在杂物间发现大量不明液体化学品泄漏。';
  }
  if (q.id === 'gen_hpm_batch1_6') {
    q.stem.en = 'A nurse is counseling a client who wants to quit smoking.';
    q.stem.zh = '护士正在为一名想要戒烟的客户提供咨询。';
  }
  return q;
}

const canon = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const incoming = JSON.parse(fs.readFileSync(newPath, 'utf8')).questions;

const existingIds = new Set(canon.questions.map((q) => q.id));
const survivors = [];
for (const q of incoming) {
  if (DROP.has(q.id)) continue;
  if (existingIds.has(q.id)) { console.error('ID collision:', q.id); process.exit(1); }
  survivors.push(applyFixes(q));
}

console.log(`Incoming: ${incoming.length}, dropped: ${DROP.size}, survivors: ${survivors.length}`);

canon.meta.schemaVersion = '1.1'; // survivors include case_study (1.1) items
canon.questions.push(...survivors);
canon.meta.count = canon.questions.length;

fs.writeFileSync(canonPath, JSON.stringify(canon, null, 2));
console.log(`gemini-canonical.json now has ${canon.questions.length} questions (meta.count=${canon.meta.count}, schemaVersion=${canon.meta.schemaVersion}).`);
