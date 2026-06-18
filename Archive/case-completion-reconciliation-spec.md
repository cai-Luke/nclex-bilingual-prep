# CASE-COMPLETION-RECONCILIATION-SPEC

**Status:** Layer A, the forward compile-manifest gate, and capped Gemini Layer B alignment completed 2026-06-15. Claude final adjudication remains pending. The architecture handoff is `audit/case-completion/FINAL-ARCHITECTURE-REPORT.md`. The implementation realizes the "deterministic skeleton→compile faithfulness check + compiler omission notes" recommendation from the smoke-test reviews.

**Touches:** a sweep script (`scripts/`, Codex/Gemini-run), a capped Gemini alignment pass, `src/schema.ts`/`scripts/promote.ts` (the gate, Codex), `opus-case-skeleton-prompt.md`/`.txt`, both compiler prompts, `DECISIONS.md`, `PROJECT-HISTORY.md`, `case-skeleton-pipeline-spec.md`.

---

## 0. Settled decisions

- **Forward target = 6 embedded items per `case_study`** — one per NCJMM step (recognize cues → analyze cues → prioritize hypotheses → generate solutions → take action → evaluate outcomes), for real-exam unfolding-case fidelity.
- **Retroactive tolerance = 4–6.** A legacy case with 4–5 embedded items is tolerated and not retro-fixed *on absolute count alone*; `<4` is below the retroactive floor.
- **6 is a target, not a padding quota.** A genuinely underspecified DP is omitted *with a logged reason*, never padded into a weak sixth item (DECISIONS principle 7, precision over volume). The gate flags shortfall; "justified logged omission" is a valid resolution.

**Exact target, to remove ambiguity (the bowtie is a sibling, not one of the six):**

```
caseStudy.questions.length === 6
AND a sibling top-level bowtie is present whenever skeletonHasBowtie === true
```

"Target = 6" always means six *embedded* items. The bowtie is a separate top-level question and is never counted toward the six.

---

## 1. The core comparison (shared by Phase 1 and Phase 2)

For one case, compute the tuple:

```
(skeleton_dp_count, skeleton_has_bowtie)   vs   (emitted_item_count, emitted_bowtie)
shortfall      = skeleton_dp_count - emitted_item_count
bowtie_dropped = skeleton_has_bowtie and not emitted_bowtie
```

Three distinct conditions — keep them separate (conflating them is exactly what made the first flat "<6" sweep uninformative):

- **under-compiled** ⇔ `shortfall > 0 or bowtie_dropped` — the compiler dropped content the skeleton authored. **Cheaply completable** (source exists). This is the high-yield set.
- **under-authored** ⇔ `skeleton_dp_count < 6` — the skeleton itself didn't author six DPs. Not a compile defect; remediation is re-authoring, not re-compile.
- **under-target** ⇔ `emitted_item_count < 6` — absolute shortfall regardless of skeleton. The forward gate's concern.

A case with no recoverable skeleton can only be evaluated on **under-target**; you cannot tell under-compiled from under-authored without the source.

**Join trust gates the classification.** Computing `shortfall`/`bowtie_dropped` against the *wrong* skeleton produces a bogus shortfall — a worse failure than no match, because it can drive a "completion" that adds wrong content. So only a **high-confidence join** (exact id, or a confirmed filename/title match) may place a case in the under-compiled (re-compile) path. A low-confidence or fuzzy join is treated as **no usable skeleton** — the case routes to regenerate or tolerated, never to re-compile, unless a human or Layer B confirms the match first. Given that few skeletons survive and they are poorly named (per Luke), most joins will be low-confidence, so most cases fall to the regenerate/tolerated side and the cheap re-compile set is a minority.

---

## 2. Phase 1 — retroactive reconciliation sweep

### 2.1 Population and bucketing (fixes the prior sweep)

The prior sweep walked all of `banks/` and reported a flat `<6` count. Redo it bucketed:

- **Separate the populations:** `banks/*.json` (canonical) vs `banks/banks-raw/` (un-promoted) vs `banks/Pending cases/**` (not bundled per PROJECT-HISTORY). Tag each case with its population — never blend them in the headline number.
- **Tag each case** with: source lane (`gpt-` / `gemini-` / opus-skeleton / legacy-direct), `schemaVersion`, and ledger vintage where available.
- **Report a count distribution** (2 / 3 / 4 / 5 / 6 / 7+), not a single `<6` total, split by population and lane.

### 2.2 Layer A — deterministic (a script; principle 3)

For every **JSON case**:
- `emitted_item_count = len(question.caseStudy.questions)`.
- `emitted_bowtie` = a top-level `bowtie` exists tied to this case. Match by **id prefix first** (`<case_id>_bowtie` — reliable for retrofit-era output); fall back to topic-slug only as `bowtie_match_confidence: "weak"`, requiring inspection, because a shared topic ("sepsis", "postpartum preeclampsia") false-positives. The standalone bowtie is a sibling top-level item, never embedded. *(Forward, an explicit `parentCaseId` on the bowtie would make this exact — kept optional here rather than bumping schema mid-task, since the compile manifest already records `emittedBowtie` per case forward.)*

For every **recoverable skeleton** (markdown):
- `skeleton_dp_count` = number of numbered entries under the `KEY DECISION POINTS` heading (regex over the fixed section — **deterministic, not a model call**).
- `skeleton_has_bowtie` = presence of a `BOW-TIE SYNTHESIS` section.

**Join** skeleton ↔ case and record a **`join_confidence`** ∈ `exact_id` / `filename_slug` / `title_slug` / `topic_slug` / `fuzzy` / `none`. Only `exact_id` and confirmed `filename_slug`/`title_slug` count as **high-confidence** (eligible for the re-compile path, §1). For any non-exact match, emit **all candidate skeletons** rather than silently picking one, and require human or Layer-B confirmation before the case enters a `recompile` bucket. A wrongly matched skeleton is the dangerous failure (bogus shortfall → wrong completion), so the default for ambiguity is to *not* re-compile.

**Cause tag for thin cases** (drives which fix applies; do *not* assume "token limit"):
- `truncated` — malformed/cut-off JSON, OR `meta.count`/top-level mismatch, OR a `caseStudy.questions` array that ends mid-structure. (This is what an actual output-limit hit looks like.)
- `clean-small` — valid, internally consistent JSON that simply declared and delivered a small count (a scoping/curation choice, e.g. smoke2's clean `count:1`). Not a truncation.

**Emit buckets** (each carries a `completion_mode` ∈ `recompile` / `regenerate` / `none`). Evaluate in order; only a high-confidence join may reach the `recompile` buckets:

- **needs-layer-b-dp-parse** — skeleton matched but `KEY DECISION POINTS` didn't parse (`dpc == null`). Cannot classify until Layer B supplies the count. Mode TBD.
- **P1 — recompile, urgent:** high-confidence skeleton, `dpc > emitted_item_count`, `emitted_item_count < 4`. Below the floor *and* the compiler dropped authored DPs → cheap re-compile. `recompile`.
- **P2 — recompile, high-yield:** high-confidence skeleton, `(shortfall > 0 or bowtie_dropped)`, `4 ≤ emitted_item_count ≤ 5` — or `emitted_item_count == 6` with `bowtie_dropped` (restore the sibling bowtie). `recompile`.
- **R1 — regenerate, urgent:** `emitted_item_count < 4` *and* no usable skeleton (none, low-confidence join, or a faithful skeleton that itself authored < 4). Below the floor with no source to re-compile from → regenerate from extracted topic (§3 Mode B). `regenerate`.
- **Tolerated:** `emitted_item_count ≥ 4` and either faithful to its skeleton or no skeleton — within the 4–6 retroactive bar, no cheap fix warranted. `none`.
- **Full:** `emitted_item_count ≥ 6` (+ sibling bowtie if authored). `none`.

Note the corrected P1 condition: a `<4` case whose skeleton *also* authored only 3 DPs is **not** P1 — it's under-authored, re-compile can't help, so it routes to **R1 (regenerate)**. (This is the false-positive the bucketing exists to avoid; the prior flat sweep would have mislabeled it.)

### 2.3 Layer B — Gemini residual (capped)

Run Gemini **only** for:
1. Skeletons whose `KEY DECISION POINTS` block doesn't parse deterministically (irregular/legacy format) — fuzzy DP count.
2. **DP→item alignment for flagged P1/P2 cases only** — for each, list the skeleton DPs that have *no* corresponding emitted item, and confirm the bowtie source is a clean 1/2/2. This is the genuine semantic residual and what tells completion *what to add*.

Do not run Layer B over the whole corpus — it's capped to the unparseable and the flagged.

**Gemini Layer B classifies and identifies only — it must never mutate.** It may count DPs, align DPs to emitted items, name missing DPs, and confirm a join, but it must **not** rewrite canonical JSON, edit source skeletons, or "polish" anything. (This is exactly the smoke2 failure mode, where a "lint-polish" pass slid into source editing.) Its output is a worklist annotation, never an edited artifact.

### 2.4 Deliverable — the completion worklist

One row per flagged case:

```
{ case_id, file, population, lane, schemaVersion,
  emitted_item_count, skeleton_dp_count, shortfall, bowtie_dropped,
  join_confidence, bowtie_match_confidence, skeleton_path,
  candidate_skeletons: [...],                          // when join not exact
  missing_dps: [ {dp_index, dp_skill, dp_summary} ],   // Layer B, recompile cases only
  cause_tag, completion_mode, priority }               // priority ∈ {P1,P2,R1}; mode ∈ {recompile,regenerate,none}
```

Order P1 → P2 → R1. The `recompile` set (P1/P2) is the cheap, high-yield work and — given skeleton scarcity — will be the minority. The `regenerate` set (R1) is the larger, heavier path; size it honestly so the effort estimate isn't dominated by the cheap-looking cases.

A reference Layer-A script is in Appendix A.

---

## 3. Completion workflow

Two modes, set by the worklist's `completion_mode`. Neither hand-edits canonical JSON.

### Mode A — re-compile (P1/P2; high-confidence skeleton, under-compiled)

1. Re-compile the `missing_dps` (and restore the bowtie if `bowtie_dropped`) **from the existing skeleton**, through the normal review → compile → Claude-review path. The skeleton is the source of truth; author no new medicine.
2. Generate the additions as a **raw fragment**, validate, then merge into the canonical case via the deterministic path (load/mutate/serialize, or `patch-raw`) — **never a free-form hand-edit** of canonical JSON (the opus12/opus3 quote-damage lesson; a serializer makes that bug class impossible).
3. Adding items changes counts → re-run `promote` (shuffle the new items; the all-A clustering applies to fresh items too), re-`audit`, census recount, **ledger update**.
4. **`meta.count` is bank-level, not fragment-level.** A raw completion fragment containing one patched case plus a restored bowtie has fragment `meta.count: 2`. When merged into a canonical bank, the destination bank's `meta.count` becomes its previous top-level count **+1** per added top-level item (the restored bowtie is one such item; embedded items added to an existing case do not change top-level count). Update it at merge, not by copying the fragment's 2.

### Mode B — regenerate from scratch (R1; no usable skeleton)

Per Luke: most skeletons are unrecoverable or poorly named, so this is the dominant path. The original source is gone, so completion means re-authoring the case, not patching it:

1. **Extract the topic** from the compiled case — read its title, summary, and surviving items, and infer the clinical scenario into a premise (the same kind of premise handed to Opus for the smoke cases). This is a light LLM task (Gemini or Claude may draft it; it edits nothing — it only describes). Confirm the extracted premise reflects the case before regenerating.
2. Run the **full pipeline** on that premise: Opus authors a fresh 6-DP skeleton → fact-check → compile → Claude review → promote. This is the existing pipeline; nothing new except the extraction step.
3. The regenerated case **supersedes** the old one. **ID policy (decision for Luke):** reuse the original top-level `case_id` so app state (progress, flags, history keyed by `question.id`) is not orphaned, accepting that the embedded `_qN` ids and content change; *or* mint a new id and accept that per-case progress resets. Reuse is cleaner while the bank is still in content-build; flag explicitly in the ledger that the case was regenerated (old content superseded), not merely reviewed.

Mode B is expensive (a full Opus authoring cycle per case) — size the R1 set realistically against available capacity rather than treating it as cleanup.

---

## 4. Phase 2 — forward guardrails

### 4.1 Compile manifest (audit-only sidecar)

The compiler emits, alongside the JSON, an audit-only `_compileManifest` — stripped before canonical exactly like the visual audit `meta` block, never learner-facing:

```jsonc
{ "skeletonDpCount": 6, "skeletonHasBowtie": true,
  "emittedItemCount": 6, "emittedBowtie": true,
  "omittedDps": [ { "dp": 4, "reason": "underspecified: no unambiguous keyed action" } ] }
```

This forces the compiler to **account for every DP** — each is either emitted or omitted-with-reason — which makes a silent drop impossible and closes the observability gap from the smoke reviews (a correctly-dropped malformed bowtie and a wrongly-dropped clean one currently look identical).

**Lifecycle — raw-only, mirroring the visual audit-meta handling:**
- **Allowed** in raw compiler output (`banks/banks-raw/`).
- **Consumed** by `check-case-completeness` / the promote-time gate (§4.2).
- **Stripped** at the canonical merge.
- **Rejected** if found in a top-level bundled/canonical bank — `validate-bank` in canonical mode fails on its presence, so the internal field can never leak into shipped banks or be accepted by imported user banks. Do **not** add `_compileManifest` to the normal learner-facing schema; the completeness check runs in a raw/staging validation mode, keeping canonical schema strict.

### 4.2 Deterministic faithfulness gate (the durable mechanism)

At `validate-bank` / `promote`, for any skeleton-compiled case carrying a manifest, assert (fail loud, principle 3):

- `emittedItemCount + len(omittedDps) == skeletonDpCount` — every authored DP is accounted for.
- `emittedItemCount >= 6` **or** every unit of shortfall is covered by a logged `omittedDps` entry — no unexplained under-target.
- `emittedBowtie == skeletonHasBowtie` **or** a logged omission explains the drop.

This is the **same comparison as §1** — retroactively it runs as the one-shot sweep over saved skeletons; forward it runs as a gate fed by the manifest. One mechanism, two entry points.

### 4.3 Prompt edits (target = 6, not a quota)

- **Opus skeleton prompt** (`.md` + `.txt`): author **six** decision points, one per NCJMM step. (Authoring isn't the failure mode — both smoke skeletons authored 6 — but locking the count makes the compiler's target unambiguous.)
- **Both compiler prompts:** "Compile **one embedded item per usable decision point**; the target is **6**. Omit an item only if its DP is genuinely underspecified, and when you do, record `{dp, reason}` in `_compileManifest.omittedDps`. **Do not pad to six with weak items** (precision over volume)." Update the SELF-CHECK to emit and self-verify the manifest.
- **Resolve the spec-text drift:** the pipeline spec and compiler prompts currently say "4–6 / 2–6 embedded." Change to "6 (target); fewer only via logged omission." (The schema floor stays 2 — that's a structural minimum, not the content target.)

### 4.4 Codify

- **DECISIONS.md:** target = 6 forward (exam fidelity); 4–6 tolerated for legacy; **under-compilation (emitted < authored, unexplained) is a build failure** via the manifest gate; completion runs through the pipeline, never hand-edited into canonical.
- **PROJECT-HISTORY.md:** milestone after the sweep + gate land (draft at execution against the live file).

---

## 5. Caveats (carry the epistemics forward)

- **Don't conflate populations or cause.** Bucket by canonical/raw/pending and by lane; tag truncated vs clean-small. The headline number is meaningless without these splits.
- **Two-pass generation is conditional.** Only for cases the sweep tags `truncated` (genuine output-limit hits). It is *not* the fix for `clean-small` (curation/prompt) cases — smoke2 was clean, so two-pass wouldn't have helped it. Two-pass also reopens a multi-pass consistency surface (stale-zh, edit corruption); pay that cost only where the cause warrants.
- **6 is a target, not a quota** (§0). Logged omission beats a padded sixth item.
- **Verify the `car_t_crs` ledger-vs-actual mismatch** before trusting either count — confirm the script and the ledger count the same thing (top-level vs embedded). Treat as a separate data-integrity item.
- **The skeleton join is best-effort.** "Most" skeletons are saved, so some cases will be unreconcilable; report them honestly rather than assuming under-authoring.

---

## 6. Hand-off / touch-points

1. **Layer A sweep script** (Appendix A) — Codex or Gemini runs it in-repo (the canonical banks are too large to pull through the MCP connector and count in-container).
2. **Layer B Gemini prompt** — DP→item alignment for flagged cases (capped).
3. **Manifest + gate** — `src/schema.ts` / `scripts/promote.ts` (or a new `scripts/check-case-completeness.ts`); Codex owns the code.
4. **Prompt edits** — Opus prompt (`.md` + `.txt`) and both compiler prompts (§4.3).
5. **Doc edits** — DECISIONS, PROJECT-HISTORY, pipeline-spec text fix.

**Routing:** Codex implements Layer A + the manifest/gate; Gemini runs Layer B alignment on flagged cases only (and never mutates); Opus authors Mode B regenerations; Claude reviews the worklist, the regenerated cases, and any re-compiled fragments before promotion.

## 7. Out of scope

- Running the sweep, executing any completion, or building the gate in this window (this is the spec).
- The two-pass compiler (conditional, separate; only if the `truncated` cause tag warrants it — not the default fix).

(Note: regeneration of skeleton-unavailable cases is **in** scope as Mode B, §3 — it's the dominant remediation given skeleton scarcity, not a separate effort.)

---

## Appendix A — Layer A sweep (reference, extends the prior Node sweep)

```js
const fs = require('fs'), path = require('path');

function walk(d){let r=[];for(const f of fs.readdirSync(d)){const p=path.join(d,f);
  if(fs.statSync(p).isDirectory())r=r.concat(walk(p));
  else if(p.endsWith('.json'))r.push(p);}return r;}

function pop(p){return p.includes('banks-raw')?'raw':p.includes('Pending')?'pending':'canonical';}
function lane(id,file){const s=(id+' '+file).toLowerCase();
  for(const k of ['gpt','gemini','opus','hard','cs_ngn'])if(s.includes(k))return k;return 'legacy';}
const slug=s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');

// 1. index JSON cases (+ bowties) across all populations
const cases=[], bowties=[];
for(const file of walk('banks')){let j;try{j=JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){continue;}
  for(const q of (j.questions||[])){
    if(q.itemType==='case_study'&&q.caseStudy?.questions)
      cases.push({file,pop:pop(file),lane:lane(q.id,file),id:q.id,
        items:q.caseStudy.questions.length, slug:slug(q.topic||q.id)});
    if(q.itemType==='bowtie')bowties.push({id:q.id,slug:slug(q.topic||q.id)});
  }}

// 2. index skeletons (deterministic DP count under the fixed heading)
const SKEL_DIR='skeletons'; // <-- point at where the saved Opus source lives
const skels={};
if(fs.existsSync(SKEL_DIR))for(const file of walk(SKEL_DIR).concat(
    fs.readdirSync(SKEL_DIR).filter(f=>f.endsWith('.md')).map(f=>path.join(SKEL_DIR,f)))){
  let t;try{t=fs.readFileSync(file,'utf8');}catch(e){continue;}
  const m=t.match(/KEY DECISION POINTS([\s\S]*?)(?:\*\*COMMON NURSING ERRORS|\*\*EXPECTED LEARNING|\*\*BOW-TIE|$)/i);
  const dp=m?(m[1].match(/^\s*\d+\.\s/gm)||[]).length:null; // null = didn't parse -> Layer B
  const titleM=t.match(/CASE TITLE\**\s*\n?(.+)/i);
  skels[slug(titleM?titleM[1]:path.basename(file,'.md'))]={file,dp,bowtie:/BOW-TIE SYNTHESIS/i.test(t)};
}

const slugBowtie=c=>bowties.find(b=>b.id.startsWith(c.id));        // strict: id-prefix
const weakBowtie=c=>bowties.find(b=>b.slug===c.slug);             // weak: topic-slug (flag)

// 3. join + bucket
const dist={}; const rows=[];
for(const c of cases){dist[c.items]=(dist[c.items]||0)+1;
  const sk=skels[c.slug];                                         // topic/title-slug join only
  // join confidence: this script can reach title_slug/topic_slug at best (skeletons carry no case id).
  // Treat non-exact as NOT high-confidence -> not eligible for recompile without confirmation.
  const join_confidence = sk ? 'title_slug' : 'none';
  const high = false;   // bare slug match is never high-confidence; confirm to promote to recompile
  const strictB=slugBowtie(c), weakB=!strictB&&weakBowtie(c);
  const eb=!!strictB||!!weakB;
  const bowtie_match_confidence = strictB?'strong':weakB?'weak':'none';
  const dpc=sk&&sk.dp!=null?sk.dp:null;
  const shortfall=dpc!=null?dpc-c.items:null;
  const drop=sk?!!sk.bowtie&&!eb:false;
  const underCompiled=(shortfall>0)||drop;

  let pri,mode;
  if(sk&&sk.dp==null){pri='needs-layer-b-dp-parse';mode='tbd';}
  else if(high&&underCompiled&&c.items<4){pri='P1';mode='recompile';}
  else if(high&&underCompiled&&(c.items<=5||drop)){pri='P2';mode='recompile';}
  else if(sk&&underCompiled){pri='P2-unconfirmed';mode='confirm-join';}  // candidate; needs join confirm
  else if(c.items<4){pri='R1';mode='regenerate';}                       // <4, no usable/under-authored
  else if(c.items>=6){pri='full';mode='none';}
  else {pri='tolerated';mode='none';}                                   // 4-5, faithful or no skeleton

  rows.push({...c,emitted_bowtie:eb,bowtie_match_confidence,join_confidence,
    skeleton_dp_count:dpc,shortfall,bowtie_dropped:drop,
    skeleton:sk?sk.file:null,priority:pri,completion_mode:mode});}

console.log('count distribution:',dist);
for(const p of ['canonical','raw','pending'])
  console.log(p,'cases:',rows.filter(r=>r.pop===p).length);
const show=(label,pred)=>{console.log('\n'+label+':');rows.filter(pred).forEach(r=>console.log(' ',
  r.items,r.id,'dp='+r.skeleton_dp_count,'shortfall='+r.shortfall,r.bowtie_dropped?'BOWTIE-DROPPED':''));};
show('P1 (recompile, <4, confirmed skeleton)', r=>r.priority==='P1');
show('P2 (recompile, 4-5 / bowtie, confirmed skeleton)', r=>r.priority==='P2');
show('P2-unconfirmed (candidate join -> confirm before recompile)', r=>r.priority==='P2-unconfirmed');
show('R1 (regenerate from extracted topic)', r=>r.priority==='R1');
show('needs-layer-b-dp-parse', r=>r.priority==='needs-layer-b-dp-parse');
console.log('\ntolerated:',rows.filter(r=>r.priority==='tolerated').length,
            '| full:',rows.filter(r=>r.priority==='full').length);
fs.writeFileSync('case-completion-worklist.json',JSON.stringify(rows,null,2));
```

Notes: point `SKEL_DIR` at the saved Opus source; the `KEY DECISION POINTS` regex returns `null` for skeletons that don't follow the section format → route those to Layer B. The `cause_tag` (truncated vs clean-small) and the `missing_dps` alignment are added in a second pass (Layer B / a JSON-validity check); the script above produces the bucketed counts and the join skeleton needs no model.
```
