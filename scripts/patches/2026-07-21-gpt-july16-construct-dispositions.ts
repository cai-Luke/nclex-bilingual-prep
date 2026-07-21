import { removeQuestion, runPatch } from "../patch-raw";
import { QUARANTINE_FIX_IDS, RETIRE_IDS } from "./2026-07-21-gpt-july16-construct-disposition-manifest";

runPatch([
  ...RETIRE_IDS.map((id) => removeQuestion({
    id,
    reason: "Owner-accepted July 16 outer-ring construct audit retirement; exact payload preserved in Archive/gpt-july16-construct-dispositions-2026-07-21/retired-items.json.",
  })),
  ...QUARANTINE_FIX_IDS.map((id) => removeQuestion({
    id,
    reason: "Owner-accepted July 16 outer-ring construct audit FIX quarantine; exact repairable payload preserved in Archive/gpt-july16-construct-dispositions-2026-07-21/quarantined-fix-items.json.",
  })),
]);
