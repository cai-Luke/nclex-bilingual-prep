# Claude Code Handoff: Remaining Early-Bank Semantic Audit

## Objective

Complete the remaining Medium-provenance currency (`OG`) audit that the
OpenAI reviewer cannot perform without violating `producer != checker`.

This is a proposal/review task. Do not edit canonical question content,
`BANK-REVIEW-LEDGER.md`, census artifacts, or execute patches/cuts.

Read these files in order:

1. `AGENTS.md`
2. `NCLEX_Audit_Spec.md`
3. `early-bank-semantic-audit-spec.md`
4. `audit/early-bank-semantic/CAMPAIGN-STATUS.md`
5. `audit/early-bank-semantic/layer-a-summary.json`
6. `audit/early-bank-semantic/layer-a-queue.jsonl`
7. Currency reports/manifests `01` through `06`
8. `BANK-REVIEW-LEDGER.md` and relevant `banks/case_sources/*`

Current deterministic baseline:

- Inventory: 1,645 records
- Queue: 1,301 rows / 1,127 unique queued IDs
- Remaining Medium currency IDs: 68
- GPT-produced: 38
- Mixed-producer hard-case IDs: 30

Layer A is routing only. A queue hit is not a finding.

## Non-Negotiable Rules

- Use Claude Code/Claude as the named reviewer for GPT-produced items.
- Do not audit an item if Claude generated or performed final clinical review
  on it. Record it as `BLOCKED_PRODUCER_CONFLICT`.
- Every `OG` action requires exact bank evidence, a current authoritative live
  source, and an honest Alternative Interpretation.
- No authoritative source means `REVIEW`, never `FIX`.
- Every `FIX` must update English and Chinese together.
- Default remedy is `FIX`, not `CUT`.
- Treat parent case context as part of every embedded item.
- Maximum 50 questions per session.
- Canonical banks remain read-only.

## Phase A: Audit the 38 GPT Items

Use the current queue:

```sh
node <<'NODE'
const fs = require("fs");
const rows = fs.readFileSync(
  "audit/early-bank-semantic/layer-a-queue.jsonl",
  "utf8",
).trim().split(/\n/).map(JSON.parse);
const unique = new Map(
  rows
    .filter((row) =>
      row.track === "currency" &&
      row.provenance_tier === "medium" &&
      row.producer === "gpt"
    )
    .map((row) => [row.id, row]),
);
console.log(JSON.stringify([...unique.values()], null, 2));
NODE
```

### Session 07: Screening and isolation

- `immunization_screening`: 11 IDs
- `isolation_precautions`: 12 IDs
- Total: 23 unique IDs

Source families: CDC/ACIP, USPSTF, current CDC isolation and
Transmission-Based Precautions guidance.

Artifacts:

- `currency/07-medium-gpt-screening-isolation.report.md`
- `currency/07-medium-gpt-screening-isolation.manifest.jsonl`

### Session 08: Medication and resuscitation

- `anticoagulation`: 5 GPT IDs
- `dka_insulin`: 2 GPT IDs
- `sepsis`: 1 GPT ID
- `stroke`: 4 GPT IDs
- `burn_parkland`: 3 GPT IDs
- Total: 15 unique IDs

Source families: FDA labels, ASH/AHA/ACC, 2024 hyperglycemic-crisis
consensus, 2026 Surviving Sepsis Campaign, 2026 AHA/ASA stroke guidance, and
ABA guidance. Preserve Project Shrimp's explicit traditional
Parkland-formula wording rule.

Artifacts:

- `currency/08-medium-gpt-medication-resuscitation.report.md`
- `currency/08-medium-gpt-medication-resuscitation.manifest.jsonl`

## Phase B: Resolve the 30 Mixed Items

Before clinical audit, create:

- `currency/09-mixed-provenance-map.jsonl`

One row per mixed ID:

```json
{
  "id": "question_id",
  "bank": "hard-cases-canonical.json",
  "path": "questions[n]...",
  "source_files": ["BANK-REVIEW-LEDGER.md", "banks/case_sources/example.md"],
  "generator": "openai|claude|gemini|human|unknown",
  "final_reviewer": "openai|claude|gemini|human|unknown",
  "claude_eligible": true,
  "reason": "Exact provenance evidence or unresolved status."
}
```

Rules:

- `claude_eligible=false` if Claude generated or finally reviewed the item.
- Do not infer eligibility from an `opus` prefix.
- Unknown provenance is `BLOCKED_PROVENANCE_UNKNOWN`.
- Parent case and embedded parts share provenance unless evidence says
  otherwise.

Audit only `claude_eligible=true` items in batches of at most 25:

- `currency/09a-medium-mixed-eligible-<scope>.report.md`
- `currency/09a-medium-mixed-eligible-<scope>.manifest.jsonl`
- Continue with `09b`, etc. when needed.

## Finding and Manifest Contract

Reports must follow `NCLEX_Audit_Spec.md`, stay under approximately 3,000
words per 50 items, and include:

- complete Session Header and reviewing model;
- exact audited and no-finding IDs;
- verbatim bank evidence;
- Alternative Interpretation;
- source URLs and current values;
- explicit confirmation that canonical banks were not edited.

Every actioned manifest row must contain:

```json
{
  "id": "question_id",
  "bank": "bank.json",
  "category_code": "OG",
  "verdict": "FIX|REVIEW|CUT",
  "confidence": "HIGH|MEDIUM|LOW",
  "source": [
    {
      "body": "Authority",
      "year": 2026,
      "url": "https://...",
      "current_value": "Current claim and difference from the bank."
    }
  ],
  "fix": [
    {
      "field": "rationale.correct.en",
      "before": "Exact canonical value",
      "after": "Proposed value"
    },
    {
      "field": "rationale.correct.zh",
      "before": "Exact canonical value",
      "after": "Proposed value"
    }
  ]
}
```

Use an empty JSONL file when a session has no actioned rows.

## Claude-Side Adjudication

Before returning a finding:

1. Retrieve the exact item and full parent context.
2. Verify the claim against a current authoritative source.
3. Test the strongest reconciliation.
4. Determine whether the issue changes the key, rationale, or neither.
5. Check English and Chinese independently.
6. Use `FIX` only for a concrete bilingual cure, `REVIEW` for contested or
   incompletely sourced claims, and no finding when reconciliation is
   stronger.
7. Re-read every proposed `after` value for new absolutes or universal
   thresholds.

Do not adjudicate or execute Sessions 01-06. Codex/Luke handle those.

## Required Validation

For every manifest:

- parse every JSONL line;
- verify each ID and field selector;
- verify every `before` value exactly matches canonical JSON;
- verify every `.en` edit has its `.zh` partner;
- reconcile report and manifest counts;
- confirm canonical banks were not changed by the audit.

Run:

```sh
npm run test:early-bank-semantic
npm run validate-bank -- \
  banks/gemini-canonical.json \
  banks/gpt-canonical.json \
  banks/claude-canonical.json \
  banks/hard-cases-canonical.json
git diff --check
```

If banks changed concurrently, regenerate Layer A and recalibrate its focused
test counts. Never revert concurrent bank changes.

For actioned IDs, inspect:

```text
http://localhost:5173/?dev=1&qids=<comma-separated-actioned-ids>
```

Confirm each ID is found and renders Chinese content plus `Correct answer
shown`. Do not apply the proposed patch.

## Return Package Expected by Codex

Create:

- `audit/early-bank-semantic/CLAUDE-RETURN-INDEX.md`

It must contain:

1. Reviewer/model and date.
2. Layer A baseline used.
3. Session table: scope, audited count, FIX/REVIEW/CUT/no-finding counts,
   report, and manifest.
4. Total unique IDs audited.
5. Exact blocked IDs grouped by:
   - `BLOCKED_PRODUCER_CONFLICT`
   - `BLOCKED_PROVENANCE_UNKNOWN`
   - `BLOCKED_SOURCE_UNAVAILABLE`
6. Provenance-map path and counts by generator/final reviewer.
7. Every actioned ID with one-line issue and source authority.
8. Mechanical results: manifest rows, exact edits, EN/ZH failures, `before`
   mismatches, Review Console result, regression, and bank validation.
9. Confirmation that canonical banks, ledger, and census were not edited and
   no patches/cuts were executed.
10. Any changed Layer A baseline caused by concurrent bank additions.

The completed return should contain only:

- session reports and manifests;
- mixed provenance map;
- `CLAUDE-RETURN-INDEX.md`;
- necessary Layer A queue/summary/test recalibration if banks changed;
- `CAMPAIGN-STATUS.md` and `PROJECT-HISTORY.md` updates.

## What Codex Will Do Next

Codex will independently:

1. Reconcile audited IDs against the current queue.
2. Validate selectors, exact `before` values, and EN/ZH pairs.
3. Review every source and clinical claim.
4. Adjudicate each proposal as accept, revise, downgrade, or dismiss.
5. Inspect accepted actioned IDs in the Review Console.
6. Produce a separate approved execution manifest for Luke.

Claude's manifest is not automatically approved and must not be applied.
