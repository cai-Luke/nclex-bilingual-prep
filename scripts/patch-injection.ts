import fs from 'fs';
import path from 'path';

const filePath = '/Users/holemini/Desktop/Project Shrimp/banks/banks-raw/injection-site-smoke-raw-2026-06-15.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

for (const q of data.questions) {
  if (q.visual) {
    const oldVisual = q.visual;
    const route = oldVisual.route;
    
    let target = "";
    if (oldVisual.selfCheck && oldVisual.selfCheck.expectedTargetLayer) {
        target = oldVisual.selfCheck.expectedTargetLayer;
    } else if (route === "intradermal") {
        target = "dermis";
    } else if (route === "subcutaneous") {
        target = "subcutaneous";
    } else if (route === "intramuscular") {
        target = "muscle";
    } else if (route === "intravenous") {
        target = "vessel";
    }
    
    // Set the question-level meta
    q.meta = {
      visual_justification: "The learner must read the needle's angle and termination depth from the figure to identify the route; the stem does not name it.",
      tier: "strictest",
      source: "Parenteral route angle/depth reference.",
      skill_signature: "inj:identify-route/" + route,
      expected: {
        route: route,
        target: target
      }
    };
    
    // Rewrite visual
    q.visual = {
      kind: "injection_site",
      route: route,
      caption: oldVisual.alt || { en: "Injection site cross-section", zh: "注射部位横断面" }
    };
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log("Patched successfully");
