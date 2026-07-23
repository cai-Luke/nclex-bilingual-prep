import { removeQuestion, runPatch } from "../patch-raw";
import { RETIRE_IDS } from "./2026-07-22-terminal-sentence-retirement-manifest";

runPatch(
  RETIRE_IDS.map((id) => removeQuestion({
    id,
    reason: "Owner-authorized queue 162 retirement after the pre-authoring source test found no single explicit policy supporting a genuinely unique six-row matrix; exact payload preserved in Archive/terminal-sentence-remediation-2026-07-22/queue-162-retired-item.json.",
  })),
);
