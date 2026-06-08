const fs = require('fs');
const path = require('path');

const dir = '/Users/holemini/Desktop/Project Shrimp/banks/banks-raw';
const files = [
  'ekg-batch1.json',
  'ekg-batch2.json',
  'ekg-batch3.json',
  'ekg-batch4.json',
  'ekg-batch5.json'
];

let allQuestions = [];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(data.questions)) {
    allQuestions = allQuestions.concat(data.questions);
  } else if (Array.isArray(data)) {
    allQuestions = allQuestions.concat(data);
  }
});

const consolidated = {
  meta: {
    schemaVersion: "1.2",
    exam: "NCLEX-RN",
    topic: "EKG / Cardiac Rhythm Practice",
    category: "mixed",
    difficulty: "mixed",
    count: allQuestions.length
  },
  questions: allQuestions
};

const outputPath = path.join(dir, 'ekg-simulation-50.json');
fs.writeFileSync(outputPath, JSON.stringify(consolidated, null, 2));
console.log(`Consolidated ${allQuestions.length} questions into ${outputPath}`);
