# Campaign 16 R4 final acceptance

- **Date:** 2026-09-11
- **Disposition:** **ACCEPTED AS PARTIAL REMEDIATION**
- **Frozen accounting:** `451 = 369 + 16 + 66`
- **Retained repairs:** 385 rows (369 repaired baseline + 16 repaired stage)
- **Preserved exceptions:** 66 rows remain unchanged/fail-open and are successor work.

Campaign 16 R4 removed the missing-anchor/fail-open mechanism for the 385 accepted rows and preserved the 66 exceptions unchanged. The four canonical banks received the accepted typed-baseline objects and the corresponding schema 2.1 transitions recorded by the campaign; the live `SchemaVersion` authority includes `2.1` in `src/types.ts` and the validator enforces the typed-baseline floor in `src/schema.ts`.

This acceptance is based on the implementation-conformance conclusion in
[`architect-conformance-review.md`](architect-conformance-review.md) and the producer-independent Claude Code / Claude Opus 5 H.3.5 census receipt, whose verdict is **CONFIRMED**:
[`census-review-claude-opus5-r1/census-confirmation-receipt.md`](census-review-claude-opus5-r1/census-confirmation-receipt.md).

The owner-confirmed production `file://` smoke gate is satisfied, as recorded in
[`production-file-smoke-receipt.json`](production-file-smoke-receipt.json) and the executor verification receipt.

Scope is deliberately narrow: Campaign 16 R4 removes the missing-anchor/fail-open mechanism for the 385 accepted identities; it does not certify complete clinical correctness, bilingual perfection, or freedom from every possible leakage surface. This acceptance does not resolve the 66 exceptions or the separate 75 legacy-primary findings. The 66 exceptions remain bounded successor work.

The queued UX-0A, UX-0B, and UX-0C specifications are outside Campaign 16 and are not included in this closeout.
