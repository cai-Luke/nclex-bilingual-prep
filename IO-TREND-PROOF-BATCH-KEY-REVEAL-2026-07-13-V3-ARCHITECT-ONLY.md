# U11 `io_trend` — §11 Proof Batch — Key Reveal V3 (ARCHITECT / LUKE ONLY)

**Do not paste this file, or any part of it, into the GPT-5.6 Sol chat before Pass 1 is submitted — and use a completely fresh chat with no repository or PR context for the actual Pass-1 run**, per the second GPT review's explicit note that a review session which has already read this file cannot double as the producer session.

Companion file: `IO-TREND-PROOF-BATCH-BRIEF-2026-07-13-V3-PRODUCER-GPT56SOL.md` (what Sol actually sees).

---

## What changed from V2

Two rounds of GPT review, both independently re-verified by the architect before acting on them:

1. **Leaking headings/notes (round 2).** Every V2 frame heading named its own shape ("accelerating retention," "tapering output," "non-responsive fluid challenge") and Frame 3 carried a note pointing straight at the tested distinction. V3 headings are neutral (just "Frame N"); no shape or verdict language appears anywhere in the producer file.

2. **Unsupported action keys (round 2).** V2 keyed Frames 2–4 to management actions ("hold the dose and notify," "hold further boluses") that the given data can't actually support without unstated information: unspecified dose timing across 4-hour bins can't license a furosemide hold/continue call, and a "failed fluid challenge" call needs hemodynamic reassessment data (BP, perfusion) the stem never supplies. Frame 1's "notify the provider" was also stronger than the evidence supports (notification implies an unstated escalation threshold).

**Fix:** All four frames are reframed from *management action* to *trend interpretation* — what does the data show, not what should the nurse do about it. This sidesteps the missing-threshold problem entirely (interpreting a chart doesn't need an external protocol rule the way a hold/escalate decision does) and makes the collapse test structural: a single final-net number cannot reveal whether output rose, fell, or shifted direction over time.

## Intended answers

- **Frame 1 (final net +400; interval net +20→+40→+120→+220):** Intended `select_all` directions — output decreases across successive intervals; the positive interval balance widens over time; fluid retention accelerates despite unchanged intake; and declining output, rather than increasing intake, drives the worsening balance. **Collapse counterfactual:** "+400 mL over 16 h" establishes the cumulative endpoint but cannot establish declining output, widening interval balances, acceleration, or which series drives the change. No offered interval-shape interpretation is supportable from the final net alone.

- **Frame 2 (final net −300, output tapering from 500→400→250→100):** Intended answer — the fluid balance trend shows a response that is diminishing/tapering across the period (output falling toward intake, net moving back toward positive in the final interval). **Collapse counterfactual:** "−300 mL" alone cannot distinguish a tapering response (Frame 2) from an accelerating one (Frame 4) — both produce the same final number. A learner shown only the net has no principled basis to pick either interpretation confidently. Diverges from (or at minimum cannot confidently reach) the keyed interpretation.

- **Frame 3 (final net +1860, output flat-to-declining — 150→140→130→120 — despite intake escalating 400→600→700→700):** Intended answer — output has remained essentially unchanged despite the escalating fluid volumes, without a clear increase in response to the challenge. **Collapse counterfactual:** "+1860 mL" alone is consistent with ordinary early oliguria during expected fluid resuscitation — a learner shown only the net has no way to tell whether output rose or stayed flat, since a large positive net looks the same either way. Diverges from the keyed interpretation.

- **Frame 4 (final net −300, output accelerating from 150→220→400→480, crossover positive→negative at index 2):** Intended answer — the fluid balance trend shows an ongoing, still-accelerating response with no sign of leveling off through the last interval. **Collapse counterfactual:** identical reasoning to Frame 2, in reverse — "−300 mL" alone can't distinguish this from Frame 2's tapering shape.

**The Frame 2/4 pair:** identical context, options, intake schedule, and final net; the only difference anywhere in the data is whether output is tapering (deceleration) or accelerating (no deceleration). If Sol's Pass 1 reaches the same interpretation for both, or reaches for the context sentence rather than the output shape to distinguish them, report it plainly.

## Approved Pass-2 source packet

Reveal this packet only after Pass 1 is recorded. Sol must copy the applicable source string exactly into `meta.source`; it must not browse for, substitute, or invent a citation.

- **Frames 1 and 3:** `NICE CG174, Intravenous fluid therapy in adults in hospital, recommendations 1.1.3–1.2.4, https://www.nice.org.uk/guidance/cg174/chapter/Recommendations`
- **Frames 2 and 4:** `DailyMed, Furosemide injection prescribing information, Clinical Pharmacology 12.2, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3747bbcd-783d-4baa-bb5b-b6827bf390e3`

The interval volumes and trend shapes are synthetic deterministic proof data. The cited sources support the clinical framing and monitoring context; they are not represented as the source of those exact volumes.

## What "pass" requires

Every frame must individually survive its own collapse test — Sol's Pass 1 counterfactual for that frame must genuinely diverge from the intended answer above, not restate it. "Indeterminate / no offered interpretation is supportable from the final net alone" is an acceptable divergent collapse result; it need not force a different offered option. The matched pair converging on opposite interpretations is corroborating, not sufficient alone. If Sol's independent Pass 1 reasoning disagrees with an intended direction above — not just the collapse counterfactual, but the primary answer itself — that's what Pass 1 exists to surface. Adjudicate with Luke before revealing anything for Pass 2, and be willing to revise rather than defend the intended key by default.
