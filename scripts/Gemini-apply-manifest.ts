import * as fs from 'fs';
import * as path from 'path';

interface Row {
  num: number;
  id: string;
  curCat: string;
  curTopic: string;
  sb: string;
  wd: string;
  propCat: string;
  propTopic: string;
  elig: string;
  conf: string;
  action: string;
  ruling: string;
}

// Historical producer-seat applicator. The gate-seat row 34 override is intentionally
// recorded separately and is not reverted because the Gemini manifest marks that row `keep`.
const workspaceRoot = path.resolve(process.cwd());
if (!fs.existsSync(path.join(workspaceRoot, 'package.json'))) {
  throw new Error('Run this script from the repository root.');
}
const manifestPath = path.join(workspaceRoot, 'Gemini-manifest.json');
const manifest: Row[] = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// We need to load the json files:
// - burn-canonical.json
// - gemini-canonical.json
// - gpt-canonical.json
// - hard-cases-canonical.json
const filesToLoad = [
  'burn-canonical.json',
  'gemini-canonical.json',
  'gpt-canonical.json',
  'hard-cases-canonical.json'
];

interface Question {
  id: string;
  itemType: string;
  category: string;
  topic: string;
  caseStudy?: {
    questions: Question[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface BankEnvelope {
  meta?: any;
  questions: Question[];
  [key: string]: any;
}

// Load files
const bankData: Record<string, any> = {};
for (const fileName of filesToLoad) {
  const filePath = path.join(workspaceRoot, 'banks', fileName);
  if (fs.existsSync(filePath)) {
    bankData[fileName] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } else {
    console.error(`Warning: file not found: ${filePath}`);
  }
}

// Helper to update a question recursively
let modifiedCount = 0;
function updateQuestion(q: Question, row: Row): boolean {
  let changed = false;
  if (q.category !== row.propCat) {
    console.log(`Updating category for ${q.id}: ${q.category} -> ${row.propCat}`);
    q.category = row.propCat as any;
    changed = true;
  }
  if (q.topic !== row.propTopic) {
    console.log(`Updating topic for ${q.id}: ${q.topic} -> ${row.propTopic}`);
    q.topic = row.propTopic;
    changed = true;
  }
  return changed;
}

function processQuestions(questionsList: Question[], row: Row): boolean {
  let changed = false;
  for (const q of questionsList) {
    if (q.id === row.id) {
      if (updateQuestion(q, row)) {
        changed = true;
      }
    }
    if (q.itemType === 'case_study' && q.caseStudy && Array.isArray(q.caseStudy.questions)) {
      if (processQuestions(q.caseStudy.questions, row)) {
        changed = true;
      }
    }
  }
  return changed;
}

// Apply changes
const modifiedFiles = new Set<string>();

for (const row of manifest) {
  if (row.action === 'keep' || row.action === 'no change') {
    continue;
  }
  if (row.action.includes('HOLD')) {
    continue; // Row 23 is on HOLD, do not apply changes
  }

  let found = false;
  for (const [fileName, data] of Object.entries(bankData)) {
    let questionsList: Question[] = [];
    if (Array.isArray(data)) {
      questionsList = data;
    } else if (data && Array.isArray(data.questions)) {
      questionsList = data.questions;
    }

    if (processQuestions(questionsList, row)) {
      modifiedFiles.add(fileName);
      found = true;
    }
  }

  if (found) {
    modifiedCount++;
  } else {
    console.warn(`Warning: Could not find question with ID ${row.id} to update`);
  }
}

console.log(`Total questions updated: ${modifiedCount}`);

// Save back to disk
for (const fileName of modifiedFiles) {
  const filePath = path.join(workspaceRoot, 'banks', fileName);
  const originalRaw = fs.readFileSync(filePath, 'utf-8');

  // Format with JSON.stringify, match trailing newlines
  const updatedRaw = JSON.stringify(bankData[fileName], null, 2) + (originalRaw.endsWith('\n') ? '\n' : '');
  fs.writeFileSync(filePath, updatedRaw, 'utf-8');
  console.log(`Saved updated file: ${filePath}`);
}
