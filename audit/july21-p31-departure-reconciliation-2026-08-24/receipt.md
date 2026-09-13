# July 21 P31 departure reconciliation — execution receipt

Terminal: `JULY21_P31_DEPARTURE_RECONCILIATION_COMPLETE`

## Frozen execution boundary

- `RECON_HEAD=511f66b7b7cb830649613793f0264725be25d450`.
- Worktree: `/Users/holemini/Desktop/shrimp-july21-recon`, detached HEAD. The orchestration seat printed RECON_HEAD and created it with `git worktree add --detach` before this evidence task started. The delegated seat independently confirmed HEAD before reading frozen inputs.
- Primary checkout: `/Users/holemini/Desktop/Project Shrimp`. Only its work-order source and read-only status were accessed. **This reconciliation task did not write to, stage, commit, stash, clean, or otherwise mutate the primary checkout.**
- Governing order: `/Users/holemini/Desktop/Project Shrimp/scratch/JULY21-P31-DEPARTURE-RECONCILIATION-CODEX-WORK-ORDER-2026-08-24.md`, Revision 5, SHA-256 `d353b89d868e0abdd4f2c7f2d8bbe8dcfbcd553f42e1787fca14cbb035c82075`. It is an ignored local source and not present in the detached committed snapshot. Owner overnight authorization explicitly froze Revision 5 for this execution; the file itself was not edited. Its closing hash matches its opening hash.
- All frozen audit inputs, current banks, and traced history came from the detached RECON_HEAD. No fetch, pull, checkout, reset, branch movement, installation, recursive delegation, merge, push, or deployment occurred.
- Executing seat: Codex/GPT-6, bounded delegated evidence contribution within the producer/orchestrator tree. This is not producer-independent review. Named cold architect adjudication remains outstanding.
- New local commits: none. The exact order reserves preservation via an owner-chosen durable location or a separate reviewed commit. The detached worktree remains in place; do not tear it down before that preservation.

## Input hashes

Raw-file SHA-256, reread in full and matched on the second derivation. The first five named inputs plus all 23 sorted raw reveal outputs total 28 files. Raw JSON rows were parsed, and only id, populationIndex, checkerModelHarness, checkerClass, and ownerDecisionRequirement were admitted from the raw outputs.

| Path | Opening and closing SHA-256 |
|---|---|
| `audit/scored-format-construct-audit-2026-07-21/population.jsonl` | `182c2bc0017629661154da9a9f0a855af45816dd460795364ea225c32de9cdaf` |
| `audit/scored-format-construct-audit-2026-07-21/primary-adjudication.jsonl` | `122c179477582adc5349d20546f25f627c43a6117cb8edad99f58f2463a6b7b7` |
| `audit/scored-format-construct-audit-2026-07-21/checker-blind-adjudication.jsonl` | `24df3ec898c4e653161e144d12def8f577feac69cb982c68f9061b6f6bbcc47a` |
| `audit/scored-format-construct-audit-2026-07-21/checker-adjudication.jsonl` | `30bda300b2f1ad21c3b6319178741cda4afbd4c9a6d6ec5af10b9b7f424461e1` |
| `audit/scored-format-construct-audit-2026-07-21/report.md` | `fa9623e48bcebedd4d155e36b9b6e445d83a39f957126c534916c4120967b407` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-01.jsonl` | `d853b7e46b7a983c3c734852fc226240b8ef0268894ea9df8e5aac31a360dd38` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-02.jsonl` | `62c5695f364738deb8aa1701bb58bb30f31fe911048db2a808c1c54543485e78` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-03.jsonl` | `ff072fd281c1df6692f9c4883025832b8f9b988b749ea1ecd66a5bab4db89f9c` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-04.jsonl` | `757f4f0668c35e8c15085845f7d7db07f11a87630d3057930d5547e875ec9940` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-05.jsonl` | `efc06b5add36af7323a4b7e805483777d37a5223ae99e302a1bb75df634efb9e` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-06.jsonl` | `903b55fd77aee83df8b5668024667a4f12388192b1d5490a678107453499f220` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-07.jsonl` | `759ec20d0aa06cd5f2d8dfd7fa34813126dccd072e8f4993f6472c898640d894` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-08.jsonl` | `8066b0640dead0d4415b1c2abd840e431c403cb00c3e33b3216d2f740691941a` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-09.jsonl` | `e70a12c2b975c6361cb378d50a02c8db0f20824f825cd9d3e4024ae98a6de29e` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-10.jsonl` | `4c9761e8446298bbcb4e67f3a2e3e04973fe96585235e964a7c7c91d90e2de01` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-11.jsonl` | `f38d3c6c15424cfe8b98744c0debc5a74a5f11806ef18f5df73dbdddc6c88240` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-12.jsonl` | `89c702ef80309edec49af1e111f51a2a70c11d76122f082641fe6815e0908cec` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-13.jsonl` | `8fde45fc3ee1a346a91c4b2b0b6c95b07d9dc602f26842d4da67b1fb5eb4979e` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-14.jsonl` | `348bda24bee03739322e3b871dce14710518bb9bfbe37be67caf0ca9bd8e1368` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-15.jsonl` | `9b97b83e1d528f5dba65c1161ddbeb0a8232279b37268a4b08d69ec075f601d2` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-16.jsonl` | `81fc743df9f0e4482ec692e925e2548604d4bb008ac4d03f85eeb0da957b855f` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-17.jsonl` | `8be02900b86356d50fd5e6021eb03a3ec53187b1de67049a37d37c3f39525483` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-18.jsonl` | `473ee96e29360eb3d79a09f7b83e87a8beff9244b580cea2e8ee0f5c5ec23250` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-19.jsonl` | `6ab63bc8cd191b5bf5f9cb9426db9ead7af404f1d553430dd271fb5013999018` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-20.jsonl` | `ad43015dfd004d7ca372306bbbd5404973d598a16fc0e34b0b69a6ed73f80083` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-21.jsonl` | `7f508c7b46a0bf08f8048b48c64a2b8e4b1e1f05d3bfda547bddb618762a0af1` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-22.jsonl` | `bbfe0d4e309fd4a2a512360f32a1a002285e5e59419557898c2e2c4da941b15f` |
| `audit/scored-format-construct-audit-2026-07-21/checker-batches/final3-output-23.jsonl` | `c0b610315c08f09b45e9954556ff6660482baaa0cf7577e3c644ecaeded97b96` |

## Bundled bank preservation

All thirteen files were read in full with system Python. All thirteen closing raw-file hashes match their opening values; neither bank contents nor metadata were written.

| Path | Opening and closing SHA-256 |
|---|---|
| `banks/burn-canonical.json` | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` |
| `banks/capnography-canonical.json` | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` |
| `banks/claude-canonical.json` | `9777aaad1f40ad7be449a7399e7d3706060a6a8e19d5d54909d121ab8480c69e` |
| `banks/device-canonical.json` | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` |
| `banks/gemini-canonical.json` | `fd98f560f93851c82b6c691aeeb3f3897aee3c2bf7a9268d973a0c7c7fff2901` |
| `banks/gpt-canonical.json` | `2fffca3fd74c38b140d09cf45d88cfc9ee3d88ed3ee2609c5812b1b5eed73fd1` |
| `banks/hard-cases-canonical.json` | `8af1a86256278900b619f83812087dfb0e940ea349a00ceddef9fe2f079ca8e3` |
| `banks/io-canonical.json` | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` |
| `banks/lab-canonical.json` | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` |
| `banks/mar-canonical.json` | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` |
| `banks/medlabel-canonical.json` | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` |
| `banks/visual-canonical.json` | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` |
| `banks/vitals-canonical.json` | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` |

## Changed paths

Starting detached-worktree status, `git status --porcelain=v1 --untracked-files=all`: empty.

Ending detached-worktree changed paths (the only three outputs):

```text
?? audit/july21-p31-departure-reconciliation-2026-08-24/receipt.md
?? audit/july21-p31-departure-reconciliation-2026-08-24/reconciliation.jsonl
?? audit/july21-p31-departure-reconciliation-2026-08-24/reconciliation.md
```

Starting primary-checkout status:

```text
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/adjudication.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/candidate-census.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/evidence-index.md
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/report.md
?? audit/deferred-audit-archaeology-2026-09-12-r1/adjudication.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-r1/candidate-census.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-r1/evidence-index.md
?? audit/deferred-audit-archaeology-2026-09-12-r1/report.md
```

Ending primary-checkout status:

```text
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/adjudication.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/candidate-census.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/evidence-index.md
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/report.md
?? audit/deferred-audit-archaeology-2026-09-12-r1/adjudication.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-r1/candidate-census.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-r1/evidence-index.md
?? audit/deferred-audit-archaeology-2026-09-12-r1/report.md
```

The starting and ending primary statuses match. The pre-existing archaeology outputs were not read as frozen evidence or modified by this task. No concurrent changed-path drift was observed during this lane.

## Verification results

- Full system-Python derivation produced 67 rows / 67 unique checker IDs. Primary/population each 104, blind/reveal each 67, raw reveal 67 across exactly 23 files.
- A second complete run reread the original inputs, re-derived all joins/classes/seat comparisons, reread all current and historical banks, reran every first-parent object history comparison, reread cited artifact lines, and rebound them via `git blame`. Its reconstructed JSONL bytes equal the delivered file exactly.
- Delivered `reconciliation.jsonl` SHA-256: `17131312aad27dce83db78db413db6642a62ce16cf363e5c2bf4e967b43e1160`.
- System Python parsed every produced JSONL row; required fields and the eight Task C trace fields were checked. No JSON parse failure, duplicate output ID, raw identity failure, missing required comparison field, unresolved seat, or unresolved raw harness remains.
- Rehashed all 28 frozen inputs and all 13 top-level banks, with 28/28 and 13/13 exact matches. Governing work-order hash also matched.
- `git rev-parse HEAD` remained RECON_HEAD. First-parent ordinals were derived from `git rev-list --first-parent --reverse RECON_HEAD`, never sorted by dates. Audit ordinal 372; RECON ordinal 463; the sole modifying commit is ordinal 429.
- `git status --porcelain=v1 --untracked-files=all` inside the detached worktree shows no path outside the three-file deliverable directory. No tracked diff or staged diff exists.
- No app type-check, build, census generation, clinical source verification, or dependency installation was performed: this order is a read-only provenance/outcome derivation and explicitly makes application type-checking irrelevant. No medical claim was newly authored or adjudicated.

## Search provenance and bounded unresolved matters

Exact stable-ID lookup over all bundled top-level and embedded objects found all 104 historical IDs present, all 44 checker-adverse IDs live, and 36 of the 44 complete objects equal to their frozen population payloads. The eight divergence rows are all present: seven unchanged and one modified. The modified row has a later explicit owner ruling and separately recorded Claude review; the report binds exact paths, lines, and commits without judging adequacy.

Current tracked evidence search: `git grep -l -F <id> HEAD -- audit Archive BANK-REVIEW-LEDGER.md` for each of the eight IDs. Historical discovery: `git log --format=... --name-only -G '<eight exact identities>' c0101f55..HEAD -- audit Archive BANK-REVIEW-LEDGER.md`. That search found no historical evidence path missing from RECON_HEAD. A report-family reference search checked for a blanket inner-ring disposition. Queue requests, bank snapshots, preservation controls, and same-day records were excluded from completed later adjudication.

No unresolved row classification remains. Raw recorded-harness contradictions are retained for all 12 affected rows and deliberately not resolved. The Sonnet per-row execution date is unrecorded: its later July 23 publication is not used to assert post-July-21 execution. Confirmed later non-Gemini review references exist for 4 traced IDs; no qualifying later record was found for the other 4 within the defined boundary. Later owner adjudication exists for the one exercise-hypoglycemia ID; none was found for the other 7. These are bounded evidence-search outcomes, not clinical acceptance or an architect ruling.

## Reproducible derivation

Run the following system-Python code from the detached worktree. It reads committed evidence and prints the exact 67-row JSONL to stdout; it makes no filesystem writes. The delivered file uses the same UTF-8 serialization. Recorded output enums are compared mechanically, while later artifact bindings are the explicitly inspected provenance references and retain their scope.

```python
import pathlib,json,hashlib,subprocess,collections
ROOT=pathlib.Path(".")
P=ROOT/"audit/scored-format-construct-audit-2026-07-21"
def readjsonl(p): return [json.loads(x) for x in p.read_text().splitlines() if x.strip()]
pop=readjsonl(P/"population.jsonl")
primary=readjsonl(P/"primary-adjudication.jsonl")
blind=readjsonl(P/"checker-blind-adjudication.jsonl")
checker=readjsonl(P/"checker-adjudication.jsonl")
def indexed(a):
 d=collections.defaultdict(list)
 for r in a: d[r["id"]].append(r)
 return d
pm,bm,popm=indexed(primary),indexed(blind),indexed(pop)
raw=collections.defaultdict(list)
for f in sorted((P/"checker-batches").glob("final3-output-*.jsonl")):
 for n,line in enumerate(f.read_text().splitlines(),1):
  if not line.strip():continue
  q=json.loads(line)
  # Only these five raw fields are admitted by the governing order.
  raw[q.get("id")].append({**{k:q.get(k) for k in ["id","populationIndex","checkerModelHarness","checkerClass","ownerDecisionRequirement"]},"path":str(f),"line":n})
concrete={"Google Antigravity / Gemini 3.1 Pro","Google Antigravity / Gemini 3.6 Flash","Gemini CLI / Gemini 3.6 Flash","gemini-2.5-pro"}
generic={"final_checker","independent_final_checker","independent-final-checker","independent_checker","standalone-checker","non_gpt_final_checker","gemini_final_checker","gemini-cli","Gemini-CLI"}
bs={"Claude Code / Anthropic Opus","Google Antigravity / Gemini 3.1 Pro"}
rs={"Google Antigravity / Gemini 3.1 Pro","Gemini CLI / Gemini 3.6 Flash"}
rows=[]
issues=[]
for n,c in enumerate(checker,1):
 id=c["id"]; probs=[]
 p=pm[id][0] if len(pm[id])==1 else {}
 b=bm[id][0] if len(bm[id])==1 else {}
 rr=raw[id]
 r=rr[0] if len(rr)==1 else {}
 if len(pm[id])!=1 or len(bm[id])!=1 or len(popm[id])!=1:probs.append("Nonunique/missing standalone primary, blind, or population join")
 if len(rr)!=1 or r.get("populationIndex")!=c.get("populationIndex"):probs.append("Raw join missing/duplicate or populationIndex mismatch")
 for q in [p,b]:
  if q.get("populationIndex")!=c.get("populationIndex"):probs.append("Frozen identity populationIndex mismatch")
 pv,pc,pd=p.get("verdict"),p.get("primaryClass"),p.get("nextDisposition")
 cv,cc,cd=c.get("checkerVerdict"),c.get("checkerClass"),c.get("checkerDisposition")
 if any(not isinstance(x,str) or not x for x in [pv,pc,pd,cv,cc,cd]):probs.append("Required comparison field absent/invalid")
 cl="UNRESOLVED" if probs else "CANDIDATE_OUTCOME_DETERMINATIVE" if pv!=cv or pd!=cd else "CLASS_ONLY_DIVERGENCE" if pc!=cc else "OUTCOME_CORROBORATIVE"
 blindseat=b.get("checkerModelHarness")
 revealseat=c.get("checkerModelHarness")
 rawh=r.get("checkerModelHarness")
 cons="CONSISTENT" if isinstance(rawh,str) and rawh==revealseat else "CONTRADICTS_RECORDED" if isinstance(rawh,str) and rawh in concrete else "UNINFORMATIVE" if isinstance(rawh,str) and rawh in generic else "UNRESOLVED_RAW_HARNESS"
 out={"id":id,"populationIndex":c["populationIndex"],"primaryVerdict":pv,"primaryClass":pc,"primaryDisposition":pd,"checkerVerdict":cv,"rawCheckerClass":r.get("checkerClass"),"recordedCheckerClass":cc,"classNormalization":"UNCHANGED" if r.get("checkerClass")==cc else "NORMALIZED_FROM_RAW","checkerDisposition":cd,"blindSeat":blindseat if blindseat in bs else "UNRESOLVED_SEAT","revealSeat":revealseat if revealseat in rs else "UNRESOLVED_SEAT","rawCheckerModelHarness":rawh,"seatAttributionConsistency":cons,"class":cl,"provenance":{"primary":{"path":str(P/"primary-adjudication.jsonl"),"line":primary.index(p)+1 if p else None},"blind":{"path":str(P/"checker-blind-adjudication.jsonl"),"line":blind.index(b)+1 if b else None},"recordedChecker":{"path":str(P/"checker-adjudication.jsonl"),"line":n},"raw":{"path":r.get("path"),"line":r.get("line")}},"recordedOwnerDecisionRequirement":c.get("ownerDecisionRequirement"),"rawOwnerDecisionRequirement":r.get("ownerDecisionRequirement")}
 if b.get("phase")!="BLIND_FROZEN_BEFORE_REVEAL":probs.append("Blind phase literal mismatch")
 if probs:out["unresolved"]=probs
 mismatches=[]
 for canonical,embedded,value in [("verdict","primaryVerdict",pv),("primaryClass","primaryClass",pc),("nextDisposition","primaryDisposition",pd)]:
  if c.get(embedded)!=value:mismatches.append({"standaloneField":canonical,"standaloneValue":value,"embeddedField":embedded,"embeddedValue":c.get(embedded)})
 out["embeddedPrimaryCrossCheck"]="MATCH" if not mismatches else mismatches
 # Only after class has been derived, read the circular stored agreement status.
 expected={"OUTCOME_CORROBORATIVE":"AGREE","CLASS_ONLY_DIVERGENCE":"PARTIAL","CANDIDATE_OUTCOME_DETERMINATIVE":"DISAGREE"}.get(cl)
 out["historicalAgreementCrossCheck"]={"derived":expected,"stored":c.get("agreementStatus"),"result":"MATCH" if expected==c.get("agreementStatus") else "MISMATCH"}
 rows.append(out)
def flatten(d,path):
 for q in d["questions"]:
  yield q["id"],{"bankPath":path,"object":q,"parentId":None}
  for child in q.get("caseStudy",{}).get("questions",[]):yield child["id"],{"bankPath":path,"object":child,"parentId":q["id"]}
current={}
for f in sorted((ROOT/"banks").glob("*.json")):
 for id,obj in flatten(json.loads(f.read_bytes()),str(f)):
  if id in current:raise ValueError("Duplicate current id "+id)
  current[id]=obj
auditsha=subprocess.check_output(["git","rev-parse","c0101f55"],text=True).strip()
hist={}
for f in subprocess.check_output(["git","ls-tree","-r","--name-only",auditsha,"banks"],text=True).splitlines():
 if f.startswith("banks/") and f.count("/")==1 and f.endswith(".json"):
  data=json.loads(subprocess.check_output(["git","show",auditsha+":"+f]))
  for id,obj in flatten(data,f):hist[id]=obj
def ser(obj):return json.dumps(obj,ensure_ascii=False,separators=(",",":")).encode("utf8")
for out in rows:
 if out["class"] in ["CANDIDATE_OUTCOME_DETERMINATIVE","CLASS_ONLY_DIVERGENCE"]:
  id=out["id"];live=current.get(id);old=hist.get(id)
  out["presenceAtReconHead"]="PRESENT" if live else "ABSENT"
  out["successorDisposition"]="NOT_APPLICABLE_PRESENT" if live else "UNRESOLVED_SUCCESSOR"
  if live and old:
   out["objectStateSinceAuditHead"]="UNCHANGED" if ser(live["object"])==ser(old["object"]) else "MODIFIED"
   out["serializedObjectComparison"]={"method":"Python json.dumps complete question object, ensure_ascii=False, separators=(',',':'), parsed insertion order retained; exact UTF-8 byte comparison; no field normalization or projection","auditHead":auditsha,"auditSha256":hashlib.sha256(ser(old["object"])).hexdigest(),"reconSha256":hashlib.sha256(ser(live["object"])).hexdigest(),"bankPathAtAudit":old["bankPath"],"bankPathAtRecon":live["bankPath"],"parentIdAtRecon":live["parentId"]}
  elif live:out["objectStateSinceAuditHead"]="UNRESOLVED"
adverse=[c for c in checker if c["checkerVerdict"] in ["FIX","RETIRE","REVIEW"]]
summary={"population":len(pop),"primary":len(primary),"blind":len(blind),"checker":len(checker),"raw":sum(map(len,raw.values())),"classes":dict(collections.Counter(r["class"] for r in rows)),"blindSeats":dict(collections.Counter(r["blindSeat"] for r in rows)),"revealSeats":dict(collections.Counter(r["revealSeat"] for r in rows)),"rawHarnessValues":dict(collections.Counter(r["rawCheckerModelHarness"] for r in rows)),"seatConsistency":dict(collections.Counter(r["seatAttributionConsistency"] for r in rows)),"normalization":dict(collections.Counter(r["classNormalization"] for r in rows)),"tracedPresence":dict(collections.Counter(r["presenceAtReconHead"] for r in rows if "presenceAtReconHead" in r)),"tracedObjectState":dict(collections.Counter(r["objectStateSinceAuditHead"] for r in rows if "objectStateSinceAuditHead" in r)),"populationLive":sum(p["id"] in current for p in pop),"checkerAdverse":len(adverse),"checkerAdverseLive":sum(c["id"] in current for c in adverse),"checkerAdverseFrozenPayloadEqual":sum(c["id"] in current and ser(current[c["id"]]["object"])==ser(popm[c["id"]][0]["completeItem"]) for c in adverse),"agreementMismatches":[r["id"] for r in rows if r["historicalAgreementCrossCheck"]["result"]!="MATCH"],"embeddedPrimaryMismatches":[r["id"] for r in rows if r["embeddedPrimaryCrossCheck"]!="MATCH"]}


import subprocess,json,hashlib
ids=["gpt_fmtgap_2026_07_14_or_toddler_choking_16","gpt_format7b_inpatient_alcohol_withdrawal_pathway","gpt_format7b_circumferential_burn_perfusion","gpt_format7b_home_pn_transition","gpt_format7c_exercise_hypoglycemia_bowtie","gpt_format9b_montevideo_units","gpt_format9b_pn_glucose_infusion_rate","gpt_format11a_acute_mesenteric_ischemia"]
def git(*a):return subprocess.check_output(["git",*a],text=True)
head=git("rev-parse","HEAD").strip()
base=git("rev-parse","c0101f55").strip()
chain=git("rev-list","--first-parent","--reverse",head).splitlines()
ordinal={c:i+1 for i,c in enumerate(chain)}
assert base in ordinal
changes=git("log","--first-parent","--reverse","--format=%H",base+".."+head,"--","banks/gpt-canonical.json").splitlines()
def ser(o):return json.dumps(o,ensure_ascii=False,separators=(",",":")).encode()
def objs(c):return {q["id"]:q for q in json.loads(git("show",c+":banks/gpt-canonical.json"))["questions"] if q["id"] in ids}
prev=objs(base);results={id:[] for id in ids}
def paths(a,b,p=""):
 if type(a)!=type(b):return [p]
 if isinstance(a,dict):
  return [z for k in dict.fromkeys(list(a)+list(b)) for z in (paths(a[k],b[k],p+"."+k) if k in a and k in b else [p+"."+k])]
 if isinstance(a,list):
  if len(a)!=len(b):return [p]
  return [z for i in range(len(a)) for z in paths(a[i],b[i],p+"["+str(i)+"]")]
 return [] if a==b else [p]
for c in changes:
 curr=objs(c)
 for id in ids:
  if ser(curr.get(id))!=ser(prev.get(id)):
   detail=git("show","-s","--format=%H%n%aI%n%cI%n%s",c).splitlines()
   results[id].append({"commit":c,"firstParentOrdinal":ordinal[c],"authorDate":detail[1],"committerDate":detail[2],"subject":detail[3],"change":"REMOVED" if id not in curr else "ADDED" if id not in prev else "MODIFIED","changedFieldPaths":paths(prev.get(id),curr.get(id)),"beforeSerializedSha256":hashlib.sha256(ser(prev.get(id))).hexdigest(),"afterSerializedSha256":hashlib.sha256(ser(curr.get(id))).hexdigest()})
 prev=curr

def reference(path,line,id,seat,date,scope,outcome=None):
 text=pathlib.Path(path).read_text().splitlines()
 assert id in text[line-1],(id,path,line)
 commits=git("log","--follow","--format=%H","--diff-filter=A","--",path).splitlines()
 assert commits
 linecommit=git("blame","--porcelain","-L",str(line)+","+str(line),"HEAD","--",path).splitlines()[0].split()[0]
 return {"path":path,"line":line,"stableId":id,"recordedSeat":seat,"recordedDate":date,"lineLastChangedCommit":linecommit,"scopeAsRecorded":scope,"recordedOutcome":outcome}
pilotroot="audit/terminal-sentence-independent-checker-pilot-2026-07-22/"
for out in rows:
 if out["class"] not in ["CANDIDATE_OUTCOME_DETERMINATIVE","CLASS_ONLY_DIVERGENCE"]:continue
 id=out["id"]
 out["modifyingCommits"]=results[id]
 out["firstParentHistory"]={"auditOrdinal":ordinal[base],"reconOrdinal":ordinal[head],"ordinalBase":"One-based from repository root, git rev-list --first-parent --reverse RECON_HEAD","bankChangingCommitsInspected":changes}
 out["subsequentIndependentReview"]=[]
 out["subsequentOwnerAdjudication"]="NONE_FOUND"
 if id=="gpt_format9b_montevideo_units":
  out["subsequentIndependentReview"]=[
   reference(pilotroot+"claude-opus-4-thinking/pilot-adjudication.jsonl",42,id,"claude-opus-4-thinking","2026-07-22","Independent checker pilot: terminal function", "REVIEW"),
   reference(pilotroot+"gpt-5-6-sol/pilot-adjudication.jsonl",43,id,"gpt-5.6-sol / Codex desktop","2026-07-22","Independent checker pilot: terminal function", "PASS")]
 elif id=="gpt_format9b_pn_glucose_infusion_rate":
  out["subsequentIndependentReview"]=[reference(pilotroot+"claude-opus-4-thinking/pilot-adjudication.jsonl",43,id,"claude-opus-4-thinking","2026-07-22","Independent checker pilot: terminal function", "PASS")]
 elif id=="gpt_format11a_acute_mesenteric_ischemia":
  out["subsequentIndependentReview"]=[reference(pilotroot+"gpt-5-6-sol/pilot-adjudication.jsonl",46,id,"gpt-5.6-sol / Codex desktop","2026-07-22","Independent checker pilot: terminal function", "PASS")]
 elif id=="gpt_format7c_exercise_hypoglycemia_bowtie":
  paths=[
   ("audit/campaign-16-phase-c-check-2026-08-27-r5/check.md","Claude independent checker","2026-08-27","Phase C unpaired bowtie derivation","PASS_STANDALONE (preserved disagreement)"),
   ("audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/review.md","Claude independent checker; semantic model claude-opus-4-7","2026-08-29","Phase D checker; PDRT1-12 frozen after-payload","PASS_STANDALONE"),
   ("BANK-REVIEW-LEDGER.md","Claude independent checker referenced by ledger","2026-08-29","Campaign 16 Phase D reviewed-canonical-correction; twelve-ID roster","reviewed-canonical-correction")]
  for path,seat,date,scope,result in paths:
   lines=pathlib.Path(path).read_text().splitlines()
   n=next(i for i,line in enumerate(lines,1) if id in line and (path!="BANK-REVIEW-LEDGER.md" or i>1570))
   out["subsequentIndependentReview"].append(reference(path,n,id,seat,date,scope,result))
  path="audit/campaign-16-phase-c-closeout-2026-08-28-r6/owner-adjudication.md"
  n=next(i for i,line in enumerate(pathlib.Path(path).read_text().splitlines(),1) if id in line)
  out["subsequentOwnerAdjudication"]=[reference(path,n,id,"Owner disposition (artifact distinguishes owner from producer/executor/checker)","2026-08-28","Phase C exact ID owner adjudication","Accepted producer FAIL_UNSUPPORTED_TOKEN_PREMISE; preserved Claude dissent")]
 if not out["subsequentIndependentReview"]:out["subsequentIndependentReview"]="NONE_FOUND"
 # The same-day Sonnet record is visible but a later commit cannot authenticate a later execution date.
 sonnet=[]
 for f in sorted(pathlib.Path("audit/terminal-sentence-sonnet-review-2026-07-21/batches").glob("*.jsonl")):
  for n,line in enumerate(f.read_text().splitlines(),1):
   q=json.loads(line)
   if q.get("topLevelQuestionId")==id and q.get("embeddedQuestionId") is None:
    sonnet.append(reference(str(f),n,id,"Claude Sonnet 5 / Claude Code","Started 2026-07-21; per-row execution date unrecorded; published 2026-07-23","Terminal-sentence semantic census; post-July-21 execution not established",q.get("verdict")))
 out["relatedReviewExcludedFromPostDateCount"]=sonnet
 out["searchScope"]="Tracked exact-ID matches in RECON_HEAD audit/**, Archive/**, BANK-REVIEW-LEDGER.md; reachable history c0101f55..RECON_HEAD searched by exact-ID -G; recorded queue requirements excluded from completed owner adjudication; stored bank snapshots/control manifests excluded from semantic review."
summary["subsequentReviewPresentTracedIds"]=sum(isinstance(r.get("subsequentIndependentReview"),list) for r in rows)
summary["subsequentOwnerAdjudicationPresentTracedIds"]=sum(isinstance(r.get("subsequentOwnerAdjudication"),list) for r in rows)
summary["primaryOwnerQueueRequirementsTracedIds"]=dict(collections.Counter(r["recordedOwnerDecisionRequirement"] for r in rows if "presenceAtReconHead" in r))
assert len(rows)==67 and len({r["id"] for r in rows})==67
assert len([r for r in rows if "presenceAtReconHead" in r])==8
assert sum(map(len,raw.values()))==67
print("".join(json.dumps(r,ensure_ascii=False,separators=(",",":"))+"\n" for r in rows),end="")
```

`JULY21_P31_DEPARTURE_RECONCILIATION_COMPLETE`
