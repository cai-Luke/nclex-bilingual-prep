# Campaign 16 R4 evidence coverage

Date: 2026-09-11

The campaign audit directory is being preserved as durable repository evidence. Its substantive receipts, freezes, mappings, manifests, verification summaries, source packets, checker/producer decisions, and deterministic support tools are trackable and included in the Campaign 16 closeout commit.

The following evidence is intentionally local-only under the repository's existing ignore rules:

- `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/evidence/*.log` — raw command transcripts; their SHA-256 values remain recorded in the executor manifest and verification artifacts, but `*.log` is ignored.
- `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/tools/__pycache__/` and `*.pyc` — incidental interpreter caches, not evidence.
- Any sealed controls governed by `audit/**/sealed/` — excluded by policy.

No ignored scratch material or build output is added for archival convenience. The executor manifest therefore references some local-only logs by hash; this note does not claim that those ignored transcripts are remotely complete. The committed JSON/Markdown receipts and preserved campaign artifacts are the durable evidence surface. The separately pinned frozen inventory is also preserved at
`audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/frozen-inventory.jsonl`.

The repository-wide staged `git diff --check` reports pre-existing trailing whitespace
inside the preserved hash-bearing `evidence/census-reviewed.diff` and
`external-checker-handoff.md`, plus three lines in the preserved
`tools/freeze_producer.py` support script. Those bytes were not rewritten. A scoped
whitespace check over the modified banks, census, ledger, history, acceptance artifact,
coverage note, and frozen inventory passed.
