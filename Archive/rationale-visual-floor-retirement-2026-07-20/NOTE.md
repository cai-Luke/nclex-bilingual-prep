# Rationale-Visual-Floor Survey Retirement Note

The 2026-07-16 `rationale-visual-floor-survey` census manifest and its generator script have been retired as of 2026-07-20.

They represented a dated, one-off snapshot from the rationale-embedded-visual migration. With subsequent legitimate content growth (from 1,940 to 1,942 top-level records), the byte-equality assertion against the frozen manifest began failing.

Rather than re-baselining this transient census, the live, corpus-independent invariants (the six-location `collectVisualRefs` traversal and pacer `rhythm_strip` schema version 1.7 floor gating) have been preserved and moved to [rationale-visual-schema-floor.ts](../../scripts/tests/rationale-visual-schema-floor.ts).

