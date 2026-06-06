import { readFile, writeFile } from "node:fs/promises";
import { parseBankText } from "../src/bankImport.js";
import { validateBankObject } from "../src/schema.js";

const TO_DELETE = new Set([
  "gemini_p1_01",
  "gemini_p2_01",
  "trad_batchC_04",
  "gemini_p2_06",
  "gemini_jun05_b_or_mdi_25",
  "gemini_p5_03",
  "gemini_b10_01",
  "gemini_jun05_b_fib_dosage_07",
  "trad_ppt_18",
  "trad_batchB_19",
  "gemini_jun05_a_sata_maoi_diet_37",
  "trad_batchB_15",
  "gemini_jun05_b_or_foley_27",
  "gemini_b10_03",
  "gemini_p2_03",
  "gemini_c9_04"
]);

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const filePath = "banks/gemini-canonical.json";

  try {
    const rawText = await readFile(filePath, "utf8");
    const data = JSON.parse(rawText);
    const originalQuestions = data.questions || [];
    
    console.log(`Original question count: ${originalQuestions.length}`);

    const remainingQuestions = originalQuestions.filter((q: any) => {
      if (TO_DELETE.has(q.id)) {
        console.log(`Pruning redundant question: [${q.id}] - Topic: "${q.topic}" (${q.itemType})`);
        return false;
      }
      return true;
    });

    console.log(`Remaining question count: ${remainingQuestions.length}`);
    console.log(`Pruned ${originalQuestions.length - remainingQuestions.length} questions.`);

    if (isDryRun) {
      console.log("\n--- DRY RUN: No files were modified ---");
      return;
    }

    data.questions = remainingQuestions;
    // Update count in metadata
    if (data.meta) {
      data.meta.count = remainingQuestions.length;
    }

    const updatedText = JSON.stringify(data, null, 2);
    
    // Schema validate before writing to disk
    const parsedObj = parseBankText(updatedText);
    const validation = validateBankObject(parsedObj);
    if (!validation.ok) {
      console.error("Validation failed for the pruned bank object!");
      validation.reasons.forEach((reason: string) => console.error(`- ${reason}`));
      process.exit(1);
    }

    await writeFile(filePath, updatedText, "utf8");
    console.log("Successfully pruned redundancies and wrote updated file to disk.");
    console.log("Schema validation check: PASS!");

  } catch (err) {
    console.error("Error running prune-redundancies script:", err);
    process.exit(1);
  }
}

main();
