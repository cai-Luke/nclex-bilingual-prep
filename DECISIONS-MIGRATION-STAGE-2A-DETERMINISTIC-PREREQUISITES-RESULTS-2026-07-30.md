# Stage 2a deterministic-prerequisites results

**Date:** 2026-07-30  
**Producer:** Codex, shell-capable local-disk-reading seat  
**Work order:** `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md` rev 2

## Overall disposition

`GREEN`

No governed text was changed. No migration date was selected, inferred, or defaulted. No manifest,
archive, snapshot, parser, script, staging area, commit, push, or pull request was created or changed.

## 1. Execution snapshot

| pin | measured | disposition |
|---|---|---|
| Repository | `Project Shrimp` | PASS |
| Branch | `codex/decisions-migration` | PASS |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | PASS |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` | PASS |
| Baseline `DECISIONS.md` byte length | `76314` | PASS |
| Baseline `DECISIONS.md` SHA-256 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS |

## 2. Repository-state proof

### 2.1 Pre-run `git status --porcelain=v1`, verbatim

```text
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
```

Pre-run state: 24 untracked files; no tracked, staged, or deleted change.

### 2.1 Pre-existing untracked inventory

| path | bytes | SHA-256 |
|---|---:|---|
| DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md | 17201 | 332c4a2489e7fed2570b881cf3da98f3acdbad5907a9e864afdb3181345eb367 |
| DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md | 6376 | 71d7b36bc32c11cacf1849daec5f0c1b972bc33b8d174df80ab368cab8335b39 |
| DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md | 5898 | e37a96fb6a2d1c58ad15160424c6a8a1dea232f011ba10a03f8f84d7df7bbe23 |
| DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md | 252715 | bd31e3d9e89bf3831c4d4ebf18c505dcf43a0fcbfae7b52be4b92602dc6e7b6e |
| DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md | 3466 | 9c811cfc71913e48dbe2248279b83cc246918ca55cf169aa99a9e97ce25e8317 |
| DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md | 27335 | 4da7f904464c9822316ff23aff90c0bdb79ba2527235ae5d259e89234b586e36 |
| DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md | 2336 | cddb6c403e67bd610a130ffa472c341e844d8f36c2b1f45b687bdaa7edb07dbe |
| DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md | 7177 | b43ee3ecb0a429a3cbb8ab75098c3e7acc5cfd6f332e31f11a6d63700d3682f4 |
| DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md | 2475 | 8e5269faf506d1ba2531b660992dd9ca1fb1c253422f05c3dc76081a190b4cfb |
| DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md | 7464 | 2df0bd9f0e382c084a1f3d1a3e5f3548d288e571647fb729d0c943e78930d72b |
| DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md | 2366 | 7cfb5135024c627b9cc3681de41a72ce70441e362aedeaae95d8d17da15ce394 |
| DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md | 15683 | 9bf1aa3c52eb53448e11cd702f390a8b923d197ba9091124e41affe88b5bb5e2 |
| DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md | 13942 | 2d9450d80ee5009dfc79459249c0686eeaba26faf17a0222c48d26ce5d85dd45 |
| DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md | 11421 | 0ac30fe18fac2e35590c09a7cbe45f4736583ec6ee15aedd1bb0378c13bdca33 |
| DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md | 109379 | 6c1dcf6b651cdc3a797d2ed9442a6102327d3a937fb419930aca5374cab788da |
| DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md | 58126 | 180156dc6b52cac90aaffd699f86438f0d15d8566d24f12bbb2e688837a94f0a |
| DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md | 1637 | 957b6e064ead4bc8355d851250bccf7fe3b0f5ee6b2335e5ff4c5349640099f1 |
| DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md | 19170 | 9cc5ec2d48c92269e8f38abd48e68ee170dcd46276a9be342bc3444e2480bbc7 |
| DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md | 25251 | 6b04d90f602501dbe06e09b4732d8a1ebe8abc1fea5df37caf3c47bf26bd1a58 |
| DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md | 4257 | 2b1a58a16e2b28010794baf9a7d04d25f2a1933bce9f33d881ed945b1a6e8da1 |
| DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md | 27292 | f2b43742e834c2112c65b8a30fcfa85c668e0e400a45d741bec1ebbee2408656 |
| DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md | 3411 | a8b5de7d56ef700178294ac7d1a2ae5c8afd0e4749059d228adec2b0ace3a937 |
| DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md | 81742 | 6cc83924710912901556d9053c07f571ccbc41f9a015b141cedc1eded695ca62 |
| DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md | 10738 | 7966243937f3ccc29e55315657baac906feb9dfbccc37b2c78c0bf25e5dbd82e |

### 2.2 Post-run proof

All four required conditions pass:

1. All 23 pre-existing untracked files other than the hash packet remain byte-identical to their pre-run
   lengths and SHA-256 values. The hash packet differs only by the proven appendix in §2.3.
2. `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md` is the only new path.
   The post-run untracked population is exactly the 24 pre-existing paths plus this results path: 25 total.
3. No tracked file is modified, staged, or deleted. Nothing is staged.
4. No unrelated path appears.

**Repository-state disposition: PASS.**

### 2.3 Append-only proof

- Original packet byte length `L`: `6376`
- Original packet SHA-256: `71d7b36bc32c11cacf1849daec5f0c1b972bc33b8d174df80ab368cab8335b39`
- Post-run first-`L`-bytes SHA-256: `71d7b36bc32c11cacf1849daec5f0c1b972bc33b8d174df80ab368cab8335b39`
- Prefix byte-identical: yes
- Suffix byte length: `450`
- Suffix contents: exactly the E038 preservation-slice appendix, and nothing else
- Post-run packet byte length: `6826`
- Post-run packet SHA-256: `f80de0b0cad620e91b6959a8c083cf436ce8d0e82ead9f52ff26744ccee6647b`

**Append-only disposition: PASS.**

## 3. Task 1 — E038 preservation-slice hash

| measurement | result |
|---|---|
| Span | `[52641,53203)` |
| Byte length | `562` |
| Equals expected `562` | yes |
| SHA-256 | `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf` |
| Final byte | `0x0a` |
| Matches expected newline | yes |
| Strict/fatal UTF-8 decode | pass |

Exact first 80 decoded characters:

````text
**Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed 
````

Exact last 80 decoded characters:

````text
ates only this callout, never the principle numbers or their obligations below.

````

**Task 1 disposition: PASS.**

## 4. Task 2 — sentence counts

The real exported `countStatementSentences` function from `lib/decisions-format.ts` was imported and
called directly. No reimplementation or source edit was used. Physical statement lines were trimmed
individually and joined with one U+0020 space.

Pinned extraction yields: Part A `18`; Part B `19`; Part C `28`; total `65`.

Part D §1.2 override assertions: first line PASS; last line PASS; exactly 3 nonblank physical lines PASS.

| block key | count |
|---|---:|
| `P1#0` | 2 |
| `P2#0` | 2 |
| `P2#1` | 2 |
| `P3#0` | 3 |
| `P4#0` | 2 |
| `P5#0` | 2 |
| `P5#1` | 2 |
| `P6#0` | 3 |
| `P7#0` | 2 |
| `P8#0` | 3 |
| `P10#0` | 3 |
| `P11#0` | 3 |
| `P15#0` | 2 |
| `P15#1` | 3 |
| `P16#0` | 2 |
| `P16#1` | 3 |
| `P16#2` | 2 |
| `P17#0` | 3 |
| `P19#0` | 3 |
| `P20#0` | 3 |
| `P21#0` | 3 |
| `P21#1` | 3 |
| `P21#2` | 3 |
| `P23#0` | 3 |
| `P23#1` | 3 |
| `P23#2` | 3 |
| `P24#0` | 3 |
| `P25#0` | 3 |
| `P25#1` | 3 |
| `P25#2` | 3 |
| `P25#3` | 3 |
| `P26#0` | 3 |
| `P27#0` | 3 |
| `P28#0` | 3 |
| `P29#0` | 3 |
| `P30#0` | 3 |
| `P31#0` | 3 |
| `R1#0` | 3 |
| `R2#0` | 3 |
| `R3#0` | 3 |
| `R4#0` | 3 |
| `R5#0` | 3 |
| `R6#0` | 3 |
| Producer assignments are operational state, not constitutional text | 2 |
| Deterministic review routing for promoted opus-prefixed case IDs | 2 |
| Runtime audio carries no client-embedded secret | 2 |
| Bilingual English and Simplified Chinese parity on all displayed text | 1 |
| Topic labels are English-only | 2 |
| JSON quote hygiene is a parse-time gate | 2 |
| Question IDs are globally unique across bundled banks | 1 |
| Raw-draft filename prefix routes to its canonical bank | 2 |
| Canonical merges are deterministic and gated | 1 |
| Runtime stays static, offline, and file-protocol compatible | 2 |
| Schema versions are an ordered token, not semver | 3 |
| Schema changes are rare and deliberate | 1 |
| Shared visual numeric helpers have a single definition | 1 |
| Case-study exhibit IDs share one namespace | 2 |
| Category targets are the current test-plan weights | 2 |
| Bank composition is a floor problem, not a balance problem | 2 |
| Repository-state hygiene is mechanism-specific | 2 |
| Some topics are deliberately shared across categories | 2 |
| Highlight's structural bias gate is schema-level | 2 |
| Translation-friction scoring | 2 |
| Exam-condition test and adaptive modes | 2 |
| Unresolved vital sanity bounds | 3 |

Distribution: count 1 = `5`; count 2 = `25`; count 3 = `35`.

Blocks outside `{1,2,3}`: none.

Control, not a row:

| wording | count |
|---|---:|
| Superseded Part C `Producer assignments…` | 2 |
| Target Part D §1.2 `Producer assignments…` | 2 |

Part B explicitly asserted that five repaired statements remained at three sentences. The authoritative
counter agrees for all five:

| block | count | comparison |
|---|---:|---|
| `P19#0` | 3 | MATCH |
| `P21#0` | 3 | MATCH |
| `P23#1` | 3 | MATCH |
| `P24#0` | 3 | MATCH |
| `P25#0` | 3 | MATCH |

Draft-explicit three-sentence assertions differing from three: none.

**Task 2 disposition: PASS.**

## 5. Task 3 — Evidence and Owner existence/trackedness

Presence was derived only from Part D §10.1. Values were read from Parts A–D, applying Part D's explicit
`R2#0` and E038 corrections.

| block key | field | literal value | disposition |
|---|---|---|---|
| `P1#0` | Owner | `lib/shuffle.ts` | TRACKED |
| `P15#0` | Owner | `scripts/patch-raw.ts` | TRACKED |
| `P15#1` | Owner | `scripts/patch-raw.ts` | TRACKED |
| `P16#1` | Owner | `scripts/audit/non-mcq-bias-lib.ts` | TRACKED |
| `P23#1` | Owner | `src/examLayout.ts` | TRACKED |
| `P25#2` | Evidence | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | TRACKED |
| `P29#0` | Evidence | `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json` | TRACKED |
| `P30#0` | Evidence | `audit/lab-reference-range-verification-2026-07-19.md` | TRACKED |
| `R3#0` | Evidence | `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md` | TRACKED |
| `R3#0` | Owner | `src/measurementAllowlist.ts` | TRACKED |
| `R4#0` | Evidence | `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` | TRACKED |
| Producer assignments are operational state, not constitutional text | Evidence | `Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md` | EXEMPT — Amendment 1 Clause A |
| Deterministic review routing for promoted opus-prefixed case IDs | Owner | `scripts/audit/early-bank-semantic-layer-a.ts` | TRACKED |
| Topic labels are English-only | Owner | `src/schema.ts` | TRACKED |
| JSON quote hygiene is a parse-time gate | Evidence | `docs/AGENTS-RUNBOOK.md` | TRACKED |
| Question IDs are globally unique across bundled banks | Owner | `scripts/audit/audit-ids.ts` | TRACKED |
| Raw-draft filename prefix routes to its canonical bank | Owner | `lib/canonical-routing.ts` | TRACKED |
| Canonical merges are deterministic and gated | Owner | `scripts/consolidate.ts` | TRACKED |
| Shared visual numeric helpers have a single definition | Owner | `src/visuals/primitives/graphPaper.ts` | TRACKED |
| Case-study exhibit IDs share one namespace | Owner | `src/schema.ts` | TRACKED |
| Category targets are the current test-plan weights | Owner | `src/schema.ts` | TRACKED |
| Bank composition is a floor problem, not a balance problem | Owner | `src/sessionSampler.ts` | TRACKED |
| Repository-state hygiene is mechanism-specific | Owner | `AGENTS.md` | TRACKED |
| Some topics are deliberately shared across categories | Owner | `src/topics.ts` | TRACKED |
| Highlight's structural bias gate is schema-level | Owner | `src/schema.ts` | TRACKED |

Path rows: `25`. `TRACKED`: `24`. `EXEMPT`: `1`. `UNTRACKED`: `0`. `MISSING`: `0`.

**Task 3 disposition: PASS.**

## 6. Commands run verbatim

The formal run begins with command 1 below. File mutations were performed through bounded patch
operations on the two authorized paths, not through shell commands.

### Command 1 — failed read-only inventory attempt

This command exited `127` before inventory hashing because `path` is a special zsh variable and replacing
it removed the executable search path. It made no write. Command 2 is the corrected complete pre-run proof.

```zsh
set -eu
printf 'Repository: %s\n' "$(basename "$PWD")"
printf 'Branch: %s\n' "$(git branch --show-current)"
printf 'HEAD: %s\n' "$(git rev-parse HEAD)"
printf 'MIGRATION_BASELINE: %s\n' "$(git rev-parse d499cc1d0916e03830489ec9cd0324cd1a203a73)"
printf 'Baseline bytes: '
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md | wc -c | tr -d ' '
printf 'Baseline SHA-256: '
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md | shasum -a 256 | awk '{print $1}'
printf '%s\n' '--- git status --porcelain=v1 ---'
git status --porcelain=v1
printf '%s\n' '--- pre-existing untracked inventory ---'
while IFS= read -r path; do bytes=$(wc -c < "$path" | tr -d ' '); hash=$(shasum -a 256 "$path" | awk '{print $1}'); printf '%s\t%s\t%s\n' "$path" "$bytes" "$hash"; done < <(git status --porcelain=v1 | sed -n 's/^?? //p')
printf 'Untracked count: %s\n' "$(git status --porcelain=v1 | sed -n 's/^?? //p' | wc -l | tr -d ' ')"
printf 'Tracked worktree clean: '
if git diff --quiet; then printf 'yes\n'; else printf 'no\n'; fi
printf 'Index clean: '
if git diff --cached --quiet; then printf 'yes\n'; else printf 'no\n'; fi
printf 'Hash packet original bytes: '
wc -c < DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md | tr -d ' '
printf 'Hash packet original SHA-256: '
shasum -a 256 DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md | awk '{print $1}'
```

### Command 2 — corrected pre-run proof

```zsh
set -eu
printf 'Repository: %s\n' "$(basename "$PWD")"
printf 'Branch: %s\n' "$(git branch --show-current)"
printf 'HEAD: %s\n' "$(git rev-parse HEAD)"
printf 'MIGRATION_BASELINE: %s\n' "$(git rev-parse d499cc1d0916e03830489ec9cd0324cd1a203a73)"
printf 'Baseline bytes: '
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md | wc -c | tr -d ' '
printf 'Baseline SHA-256: '
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md | shasum -a 256 | awk '{print $1}'
printf '%s\n' '--- git status --porcelain=v1 ---'
git status --porcelain=v1
printf '%s\n' '--- pre-existing untracked inventory ---'
while IFS= read -r file_path; do bytes=$(wc -c < "$file_path" | tr -d ' '); hash=$(shasum -a 256 "$file_path" | awk '{print $1}'); printf '%s\t%s\t%s\n' "$file_path" "$bytes" "$hash"; done < <(git status --porcelain=v1 | sed -n 's/^?? //p')
printf 'Untracked count: %s\n' "$(git status --porcelain=v1 | sed -n 's/^?? //p' | wc -l | tr -d ' ')"
printf 'Tracked worktree clean: '
if git diff --quiet; then printf 'yes\n'; else printf 'no\n'; fi
printf 'Index clean: '
if git diff --cached --quiet; then printf 'yes\n'; else printf 'no\n'; fi
printf 'Hash packet original bytes: '
wc -c < DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md | tr -d ' '
printf 'Hash packet original SHA-256: '
shasum -a 256 DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md | awk '{print $1}'
```

### Command 3 — E038 byte slice

```zsh
node --input-type=module <<'EOF'
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const baseline = "d499cc1d0916e03830489ec9cd0324cd1a203a73";
const source = execFileSync("git", ["show", `${baseline}:DECISIONS.md`], { encoding: "buffer", maxBuffer: 1024 * 1024 });
const slice = source.subarray(52641, 53203);
const decoded = new TextDecoder("utf-8", { fatal: true }).decode(slice);
console.log(`Span: [52641,53203)`);
console.log(`Byte length: ${slice.length}`);
console.log(`Length equals 562: ${slice.length === 562 ? "yes" : "no"}`);
console.log(`SHA-256: ${createHash("sha256").update(slice).digest("hex")}`);
console.log(`Final byte: 0x${slice.at(-1).toString(16).padStart(2, "0")}`);
console.log(`Final byte equals 0x0a: ${slice.at(-1) === 0x0a ? "yes" : "no"}`);
console.log(`Strict UTF-8 decode: pass`);
console.log(`First 80 decoded characters JSON: ${JSON.stringify(Array.from(decoded).slice(0, 80).join(""))}`);
console.log(`Last 80 decoded characters JSON: ${JSON.stringify(Array.from(decoded).slice(-80).join(""))}`);
EOF
```

### Command 4 — statement and trackedness derivation

```zsh
node --import tsx --input-type=module <<'EOF'
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { countStatementSentences } from "./lib/decisions-format.ts";
const read = (file) => fs.readFileSync(file, "utf8");
const sources = [
  ["A", "DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md", "## 1. Candidate body text", "\n## 2."],
  ["B", "DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md", "## 1. Candidate body text", "\n## 2."],
  ["C", "DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md", "## 1. Target §5 — concrete rulings", "\n## 4. Candidate entry-index rows (Part C fragment of target §3)"],
];
const blocks = [];
for (const [part, file, startMarker, endMarker] of sources) {
  const text = read(file);
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Pinned boundary missing for Part ${part}`);
  const lines = text.slice(start + startMarker.length, end).split("\n");
  const ordinals = new Map();
  let yieldCount = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const heading = /^(###|####) (.+)$/.exec(lines[index]);
    if (!heading) continue;
    yieldCount += 1;
    const title = heading[2];
    const idMatch = /^(P\d+|R\d+) — /.exec(title);
    let key;
    if (idMatch) {
      const id = idMatch[1];
      const ordinal = ordinals.get(id) ?? 0;
      key = `${id}#${ordinal}`;
      ordinals.set(id, ordinal + 1);
    } else {
      key = title;
    }
    let cursor = index + 1;
    while (cursor < lines.length && lines[cursor].trim() === "") cursor += 1;
    const statementLines = [];
    while (cursor < lines.length && lines[cursor].trim() !== "") statementLines.push(lines[cursor++].trim());
    const fields = new Map();
    while (cursor < lines.length && !/^(###|####) /.test(lines[cursor])) {
      const field = /^- \*\*([^*]+):\*\*(?: (.*))?$/.exec(lines[cursor]);
      if (field) fields.set(field[1], field[2] ?? "");
      cursor += 1;
    }
    blocks.push({ part, key, title, statement: statementLines.join(" "), fields });
  }
  console.log(`Part ${part} yield: ${yieldCount}`);
}
const partD = read("DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md");
const repairedAnchor = partD.indexOf("**Statement repaired.**");
const fenceStart = partD.indexOf("```markdown\n", repairedAnchor);
const fenceEnd = partD.indexOf("\n```", fenceStart + 12);
if (repairedAnchor < 0 || fenceStart < 0 || fenceEnd < 0) throw new Error("Part D override fence missing");
const overrideLines = partD.slice(fenceStart + 12, fenceEnd).split("\n").filter((line) => line.trim() !== "");
const overrideStatement = overrideLines.map((line) => line.trim()).join(" ");
const overrideKey = "Producer assignments are operational state, not constitutional text";
const overrideBlock = blocks.find((block) => block.key === overrideKey);
if (!overrideBlock) throw new Error("E038 block missing");
const supersededControl = overrideBlock.statement;
console.log(`Override first-line assertion: ${overrideLines[0].startsWith("Current producer assignments are operational state") ? "pass" : "fail"}`);
console.log(`Override last-line assertion: ${overrideLines.at(-1).endsWith("independent-review obligations.") ? "pass" : "fail"}`);
console.log(`Override nonblank line count: ${overrideLines.length}`);
overrideBlock.statement = overrideStatement;
overrideBlock.fields.delete("Owner");
overrideBlock.fields.set("Evidence", "`Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md`");
const r2 = blocks.find((block) => block.key === "R2#0");
if (!r2) throw new Error("R2#0 missing");
r2.fields.delete("Owner");
if (blocks.length !== 65) throw new Error(`Expected 65 blocks, got ${blocks.length}`);
const ledgerStart = partD.indexOf("### 10.1 Per-block optional-field ledger");
const ledgerEnd = partD.indexOf("### 10.2 Candidate-and-reason register", ledgerStart);
const ledgerLines = partD.slice(ledgerStart, ledgerEnd).split("\n");
const ledger = new Map();
for (const line of ledgerLines) {
  const row = /^\|\s*\d+\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|/.exec(line);
  if (!row) continue;
  const key = row[1].replace(/^`|`$/g, "");
  const present = row[2] === "—" ? [] : row[2].split(",").map((value) => value.trim());
  ledger.set(key, present);
}
if (ledger.size !== 65) throw new Error(`Expected 65 ledger rows, got ${ledger.size}`);
for (const block of blocks) if (!ledger.has(block.key)) throw new Error(`Ledger missing ${block.key}`);
const counts = new Map();
const distribution = new Map();
const invalidCounts = [];
console.log("--- target sentence counts ---");
for (const block of blocks) {
  const count = countStatementSentences(block.statement);
  counts.set(block.key, count);
  distribution.set(count, (distribution.get(count) ?? 0) + 1);
  if (count < 1 || count > 3) invalidCounts.push(`${block.key}=${count}`);
  console.log(`${block.key}\t${count}`);
}
console.log("--- sentence summary ---");
console.log(`Target population: ${blocks.length}`);
console.log(`Distribution: 1=${distribution.get(1) ?? 0}, 2=${distribution.get(2) ?? 0}, 3=${distribution.get(3) ?? 0}`);
console.log(`Outside {1,2,3}: ${invalidCounts.length === 0 ? "none" : invalidCounts.join(", ")}`);
console.log(`Control — superseded Part C E038: ${countStatementSentences(supersededControl)}`);
console.log(`Target — Part D §1.2 E038: ${countStatementSentences(overrideStatement)}`);
const assertedThree = ["P19#0", "P21#0", "P23#1", "P24#0", "P25#0"];
console.log("Draft-explicit three-sentence assertions:");
for (const key of assertedThree) console.log(`${key}\t${counts.get(key)}\t${counts.get(key) === 3 ? "MATCH" : "DIFFERS"}`);
console.log("--- Evidence/Owner dispositions from §10.1 presence ledger ---");
let pathRows = 0;
let badPaths = 0;
for (const block of blocks) {
  const present = ledger.get(block.key);
  for (const field of ["Evidence", "Owner"]) {
    if (!present.includes(field)) continue;
    pathRows += 1;
    const rawValue = block.fields.get(field);
    if (!rawValue) throw new Error(`${block.key} ledger requires ${field}, but no value was found`);
    const match = /^`([^`]+)`$/.exec(rawValue);
    if (!match) throw new Error(`${block.key} ${field} is not one backticked path: ${rawValue}`);
    const repositoryPath = match[1];
    let disposition;
    if (block.key === overrideKey && field === "Evidence" && repositoryPath === "Archive/DECISIONS-ARCHIVE-<MIGRATION_DATE>.md") {
      disposition = "EXEMPT — Amendment 1 Clause A";
    } else if (!fs.existsSync(repositoryPath)) {
      disposition = "MISSING";
      badPaths += 1;
    } else {
      try {
        execFileSync("git", ["ls-files", "--error-unmatch", "--", repositoryPath], { stdio: "ignore" });
        disposition = "TRACKED";
      } catch {
        disposition = "UNTRACKED";
        badPaths += 1;
      }
    }
    console.log(`${block.key}\t${field}\t${repositoryPath}\t${disposition}`);
  }
}
console.log(`Path rows: ${pathRows}`);
console.log(`UNTRACKED/MISSING rows: ${badPaths}`);
if (invalidCounts.length > 0 || badPaths > 0) process.exitCode = 2;
EOF
```

### Command 5 — failed first post-run proof

This command failed closed because its expected suffix incorrectly included one leading LF before the
append boundary. The original packet already ended in LF, so the first appended byte is `-` from `---`.
The failure made no write.

```zsh
node --input-type=module <<'EOF'
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const resultsPath = "DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md";
const packetPath = "DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md";
const results = fs.readFileSync(resultsPath, "utf8");
const expected = new Map();
for (const line of results.split("\n")) {
  const row = /^\| ([^|]+\.md) \| (\d+) \| ([0-9a-f]{64}) \|$/.exec(line);
  if (row) expected.set(row[1], { bytes: Number(row[2]), hash: row[3] });
}
if (expected.size !== 24) throw new Error(`Expected 24 pre-run inventory rows, got ${expected.size}`);
const statusText = execFileSync("git", ["status", "--porcelain=v1"], { encoding: "utf8" });
const statusLines = statusText.trimEnd().split("\n").filter(Boolean);
if (statusLines.some((line) => !line.startsWith("?? "))) throw new Error(`Tracked/staged status present: ${statusText}`);
const actualUntracked = new Set(statusLines.map((line) => line.slice(3)));
const expectedUntracked = new Set([...expected.keys(), resultsPath]);
if (actualUntracked.size !== expectedUntracked.size || [...actualUntracked].some((file) => !expectedUntracked.has(file))) {
  throw new Error(`Unexpected untracked set: ${JSON.stringify([...actualUntracked])}`);
}
for (const [file, identity] of expected) {
  if (file === packetPath) continue;
  const bytes = fs.readFileSync(file);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== identity.bytes || hash !== identity.hash) throw new Error(`Pre-existing file changed: ${file}`);
}
const packetIdentity = expected.get(packetPath);
const packet = fs.readFileSync(packetPath);
const prefix = packet.subarray(0, packetIdentity.bytes);
const suffix = packet.subarray(packetIdentity.bytes);
const prefixHash = createHash("sha256").update(prefix).digest("hex");
const expectedSuffix = "\n---\n\n## E038 preservation slice\n\n- Span: `[52641,53203)`\n- Byte length: `562`\n- SHA-256: `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf`\n- Final byte is `0x0a`: yes\n- Exact first 80 decoded characters:\n\n````text\n**Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed \n````\n\n- Exact last 80 decoded characters:\n\n````text\nates only this callout, never the principle numbers or their obligations below.\n\n````\n";
if (prefixHash !== packetIdentity.hash) throw new Error(`Packet prefix hash mismatch: ${prefixHash}`);
if (!suffix.equals(Buffer.from(expectedSuffix, "utf8"))) throw new Error("Packet suffix is not exactly the E038 appendix");
if (spawnSync("git", ["diff", "--quiet"]).status !== 0) throw new Error("Tracked worktree is not clean");
if (spawnSync("git", ["diff", "--cached", "--quiet"]).status !== 0) throw new Error("Index is not clean");
console.log(`Current untracked count: ${actualUntracked.size}`);
console.log(`Only new path: ${resultsPath}`);
console.log(`No tracked/staged/deleted change: yes`);
console.log(`All 23 non-packet pre-existing files byte-identical: yes`);
console.log(`Packet original length L: ${packetIdentity.bytes}`);
console.log(`Packet original SHA-256: ${packetIdentity.hash}`);
console.log(`Post-run first-L SHA-256: ${prefixHash}`);
console.log(`Packet prefix byte-identical: yes`);
console.log(`Packet suffix byte length: ${suffix.length}`);
console.log(`Packet suffix exactly E038 appendix: yes`);
console.log(`Packet total byte length: ${packet.length}`);
console.log(`Packet total SHA-256: ${createHash("sha256").update(packet).digest("hex")}`);
console.log("POST-RUN PROOF: PASS");
EOF
```

### Command 6 — direct suffix diagnosis

```zsh
node --input-type=module <<'EOF'
import fs from "node:fs";
const packet = fs.readFileSync("DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md");
const suffix = packet.subarray(6376);
console.log(`Suffix bytes: ${suffix.length}`);
console.log(JSON.stringify(suffix.toString("utf8")));
EOF
```

### Commands 7, 8, and 9 — corrected post-run proof and final repetitions

The following exact command is run three times: once to obtain the post-run values inserted above, once
after sealing those values, and once after correcting this command-log wording to verify the finished
state.

```zsh
node --input-type=module <<'EOF'
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const resultsPath = "DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md";
const packetPath = "DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md";
const results = fs.readFileSync(resultsPath, "utf8");
const expected = new Map();
for (const line of results.split("\n")) {
  const row = /^\| ([^|]+\.md) \| (\d+) \| ([0-9a-f]{64}) \|$/.exec(line);
  if (row) expected.set(row[1], { bytes: Number(row[2]), hash: row[3] });
}
if (expected.size !== 24) throw new Error(`Expected 24 pre-run inventory rows, got ${expected.size}`);
const statusText = execFileSync("git", ["status", "--porcelain=v1"], { encoding: "utf8" });
const statusLines = statusText.trimEnd().split("\n").filter(Boolean);
if (statusLines.some((line) => !line.startsWith("?? "))) throw new Error(`Tracked/staged status present: ${statusText}`);
const actualUntracked = new Set(statusLines.map((line) => line.slice(3)));
const expectedUntracked = new Set([...expected.keys(), resultsPath]);
if (actualUntracked.size !== expectedUntracked.size || [...actualUntracked].some((file) => !expectedUntracked.has(file))) {
  throw new Error(`Unexpected untracked set: ${JSON.stringify([...actualUntracked])}`);
}
for (const [file, identity] of expected) {
  if (file === packetPath) continue;
  const bytes = fs.readFileSync(file);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== identity.bytes || hash !== identity.hash) throw new Error(`Pre-existing file changed: ${file}`);
}
const packetIdentity = expected.get(packetPath);
const packet = fs.readFileSync(packetPath);
const prefix = packet.subarray(0, packetIdentity.bytes);
const suffix = packet.subarray(packetIdentity.bytes);
const prefixHash = createHash("sha256").update(prefix).digest("hex");
const expectedSuffix = "---\n\n## E038 preservation slice\n\n- Span: `[52641,53203)`\n- Byte length: `562`\n- SHA-256: `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf`\n- Final byte is `0x0a`: yes\n- Exact first 80 decoded characters:\n\n````text\n**Current producer assignment (verify against `PROJECT-HISTORY.md`, not assumed \n````\n\n- Exact last 80 decoded characters:\n\n````text\nates only this callout, never the principle numbers or their obligations below.\n\n````\n";
if (prefixHash !== packetIdentity.hash) throw new Error(`Packet prefix hash mismatch: ${prefixHash}`);
if (!suffix.equals(Buffer.from(expectedSuffix, "utf8"))) throw new Error("Packet suffix is not exactly the E038 appendix");
if (spawnSync("git", ["diff", "--quiet"]).status !== 0) throw new Error("Tracked worktree is not clean");
if (spawnSync("git", ["diff", "--cached", "--quiet"]).status !== 0) throw new Error("Index is not clean");
console.log(`Current untracked count: ${actualUntracked.size}`);
console.log(`Only new path: ${resultsPath}`);
console.log(`No tracked/staged/deleted change: yes`);
console.log(`All 23 non-packet pre-existing files byte-identical: yes`);
console.log(`Packet original length L: ${packetIdentity.bytes}`);
console.log(`Packet original SHA-256: ${packetIdentity.hash}`);
console.log(`Post-run first-L SHA-256: ${prefixHash}`);
console.log(`Packet prefix byte-identical: yes`);
console.log(`Packet suffix byte length: ${suffix.length}`);
console.log(`Packet suffix exactly E038 appendix: yes`);
console.log(`Packet total byte length: ${packet.length}`);
console.log(`Packet total SHA-256: ${createHash("sha256").update(packet).digest("hex")}`);
console.log("POST-RUN PROOF: PASS");
EOF
```
