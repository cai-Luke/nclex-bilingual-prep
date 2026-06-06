
const fs = require('fs');
const path = require('path');

const dir = '/Users/holemini/Desktop/Project Shrimp/banks-raw';
const files = [
  'gemini-bcc-batch1.json', 'gemini-bcc-batch2.json',
  'gemini-sic-batch1.json', 'gemini-sic-batch2.json',
  'gemini-rrp-batch1.json', 'gemini-rrp-batch2.json',
  'gemini-hpm-batch1.json', 'gemini-hpm-batch2.json',
  'gemini-psi-batch1.json', 'gemini-psi-batch2.json'
];

let allQuestions = [];

files.forEach(file => {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(data.questions)) {
    allQuestions = allQuestions.concat(data.questions);
  } else if (Array.isArray(data)) {
    allQuestions = allQuestions.concat(data);
  }
});

const consolidated = {
  meta: {
    schemaVersion: "1.1",
    exam: "NCLEX-RN",
    topic: "Consolidated New Questions",
    category: "mixed",
    difficulty: "mixed",
    count: allQuestions.length
  },
  questions: allQuestions
};

fs.writeFileSync('/Users/holemini/Desktop/Project Shrimp/banks-raw/gemini-100-consolidated.json', JSON.stringify(consolidated, null, 2));
console.log(`Consolidated ${allQuestions.length} questions into gemini-100-consolidated.json`);
