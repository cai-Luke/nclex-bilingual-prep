/**
 * npm run promote
 *
 * Gates the complete sorted raw population before writing, then stages the exact
 * prepared bytes returned by the passing raw gate.
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { DRAFT_DIR, STAGING_DIR } from "../lib/pipeline-paths";
import { renderRawGate, runRawGate } from "./raw-gate";

const files = await readdir(DRAFT_DIR);
const jsonFiles = files.filter((file) => file.endsWith(".json")).sort();

if (jsonFiles.length === 0) {
  console.error(`No JSON files found in ${DRAFT_DIR}`);
  process.exitCode = 1;
} else {
  const result = await runRawGate({
    files: jsonFiles.map((filename) => join(DRAFT_DIR, filename)),
  });
  console.log(renderRawGate(result));

  if (result.exitCode === 1) {
    process.exitCode = 1;
  } else {
    await mkdir(STAGING_DIR, { recursive: true });
    for (const prepared of result.prepared) {
      const promotedPath = join(STAGING_DIR, prepared.sourceFilename);
      await writeFile(promotedPath, prepared.serialized, "utf8");
      console.log(
        `${prepared.sourceFilename}: promoted ${prepared.bank.questions.length} item(s) → ${join(STAGING_DIR, basename(promotedPath))}`,
      );
    }
  }
}
