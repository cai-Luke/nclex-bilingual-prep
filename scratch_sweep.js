const fs = require('fs');
const data = JSON.parse(fs.readFileSync('banks/hard-cases-canonical.json', 'utf8'));

const candidates = [];

for (const q of data.questions) {
  if (q.itemType === 'case_study' && q.caseStudy) {
    const caseId = q.id;
    const title = q.caseStudy.title?.en || '';
    
    // Check if any embedded question has keywords that suggest a visual
    for (const eq of q.caseStudy.questions || []) {
      const rationale = eq.rationale?.correct?.en || '';
      const byChoice = (eq.rationale?.byChoice || []).map(c => c.en).join(' ');
      const stem = eq.stem?.en || '';
      const text = `${stem} ${rationale} ${byChoice}`.toLowerCase();
      
      const hasLab = text.includes('lab ') || text.includes('lactate') || text.includes('potassium') || text.includes('glucose') || text.includes('creatinine');
      const hasVitals = text.includes('vital') || text.includes('blood pressure') || text.includes('heart rate') || text.includes('map');
      const hasRhythm = text.includes('rhythm') || text.includes('ecg') || text.includes('ekg') || text.includes('sinus');
      const hasFetal = text.includes('fetal') || text.includes('tracing') || text.includes('deceleration');
      const hasBurn = text.includes('burn') || text.includes('tbsa') || text.includes('parkland');
      const hasIO = text.includes('urine output') || text.includes('intake') || text.includes('ml');
      const hasMed = text.includes('dose') || text.includes('administer') || text.includes('mg');
      const hasCapno = text.includes('capnography') || text.includes('etco2');

      if (hasLab || hasVitals || hasRhythm || hasFetal || hasBurn || hasIO || hasMed || hasCapno) {
        candidates.push({
          caseId,
          title,
          eqId: eq.id,
          eqType: eq.itemType,
          stem,
          rationale,
          matches: { hasLab, hasVitals, hasRhythm, hasFetal, hasBurn, hasIO, hasMed, hasCapno }
        });
      }
    }
  }
}

fs.writeFileSync('scratch_candidates.json', JSON.stringify(candidates, null, 2));
console.log(`Found ${candidates.length} potential embedded questions to review out of total.`);
