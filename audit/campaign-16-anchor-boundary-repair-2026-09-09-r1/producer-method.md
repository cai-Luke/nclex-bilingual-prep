# R4 producing-team method and boundary

This local-disk commission is limited to producer reconstruction and a complete producer freeze. Its governing work order is the R4 file and hash recorded in `opening-state.json`; the later stages of that work order are not authorized in this execution turn.

All 27 packet assignments were declared in `commission-manifest.json` before semantic work. The producer is Codex / GPT-6 Astra and the external independent checker is Claude Code / Claude Opus 5 for every packet. Astra descendants contribute implementation or producer evidence only. They cannot satisfy independent review. No recursive delegation is authorized.

The source packets are programmatic copies of entire live parent objects plus their frozen identity rows, with no adjudications. Packet size and membership are unchanged. Each packet is the checkpoint unit; each complete parent case is the semantic review unit.

For each affected part, examine the learner-visible title, summary, global exhibits, its own prompt/options/passages and successive declared updates in both languages. Read the key, rationale and sibling parts to understand authored intent, without treating hidden keys, rationales or another sibling's new scenario as learner-visible facts. Evaluate baseline first and then each cumulative stage prefix as needed. Use the exact earliest legitimate boundary; stage order, part order and sibling anchors do not select it. A single declared stage does not eliminate baseline. Ambiguity, answer-correctness risk, bilingual mismatch or uncertainty, or any need for an out-of-scope edit produces an explicit exception. Existing medical claims are read-only; do not invent thresholds or clinical facts to rescue a boundary.

The live `src/App.tsx` `CaseChartPane` renders stage title, time offset, trigger, narrative and exhibits inside the chosen prefix; these may be source evidence at their declared stage. Post-answer rationales are intent evidence only, not information available to solve the part. Later confirmations/outcomes must not be used to justify an earlier answer or to delay a boundary merely because they confirm it.

No Phase E leak verdicts or calibration adjudications are used as answer keys. The producing team is instructed to avoid those verdict files entirely during reconstruction. The independent checker must reconstruct every row itself.

Each row uses only `proposedBoundary`: exact `{ "kind": "baseline" }`, an exact declared stage string, or JSON null for `EXCEPTION`. All required evidence, bilingual relation, confidence and exception reason fields are explicit per row. `tools/producer_io.py` joins identities and validates shape only; it does not choose boundaries. It writes each producer packet and its SHA-256 receipt exclusively, refusing to overwrite an existing packet. `tools/freeze_producer.py` validates the full artifact graph and current source preservation before creating the complete producer freeze.

Producer artifacts and working notes remain blind to the external checker until every checker packet is independently frozen. No final acceptance mappings, canonical patches, bank metadata edits, census regeneration, ledger/history edits, or Git mutation operations belong to this producer-only execution.
