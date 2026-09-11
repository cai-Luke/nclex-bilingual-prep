#!/usr/bin/env python3
"""Checker-owned final reconciliation. Allowlisted inputs only."""
import json, hashlib, os, sys, collections, glob

ROOT = "/Users/holemini/Desktop/Project Shrimp"
C = os.path.join(ROOT, "audit", "campaign-16-anchor-boundary-repair-2026-09-09-r1")
INV = os.path.join(ROOT, "audit",
                   "campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1",
                   "frozen-inventory.jsonl")
sha = lambda p: hashlib.sha256(open(p, "rb").read()).hexdigest()

fails = []
def chk(name, cond, detail=""):
    if not cond:
        fails.append((name, detail))

manifest = json.load(open(os.path.join(C, "commission-manifest.json")))
inv = {}
for line in open(INV, encoding="utf-8"):
    if line.strip():
        r = json.loads(line); inv[r["rowKey"]] = r
chk("inventory sha pinned", sha(INV) == manifest["inventorySha256"])
chk("inventory 451", len(inv) == 451, str(len(inv)))

# banks and source packets unchanged
for p, info in manifest["banks"].items():
    chk("bank unchanged " + p, sha(os.path.join(ROOT, p)) == info["sha256"])

seen_rows, seen_parents, per_pkt = set(), set(), {}
counts = collections.Counter(); conf = collections.Counter(); biling = collections.Counter()
packets = []
for pk in manifest["packets"]:
    pid = pk["repairPacketId"]
    sp_path = os.path.join(C, "source-packets", pid + ".json")
    sp_sha = sha(sp_path)
    sp = json.load(open(sp_path, encoding="utf-8"))
    # source packet still equals live parents
    bank = json.load(open(os.path.join(ROOT, pk["bankPath"]), encoding="utf-8"))
    live = {q["id"]: q for q in bank["questions"]}
    for par in sp["parents"]:
        chk(pid + " source parent equals live " + par["id"], live.get(par["id"]) == par)

    ck_path = os.path.join(C, "checker", pid + ".json")
    ck_sha = sha(ck_path)
    ck = json.load(open(ck_path, encoding="utf-8"))
    chk(pid + " source binding", ck["sourcePacketSha256"] == sp_sha)
    chk(pid + " bank binding", ck["bankSha256"] == manifest["banks"][pk["bankPath"]]["sha256"])
    chk(pid + " bankPath", ck["bankPath"] == pk["bankPath"])
    chk(pid + " rowCount", ck["rowCount"] == pk["rowCount"] == len(ck["rows"]))
    chk(pid + " rowKey order matches frozen",
        [r["rowKey"] for r in ck["rows"]] == pk["rowKeys"])
    frz = json.load(open(os.path.join(C, "checker-support", "freeze", pid + "-freeze.json")))
    chk(pid + " freeze receipt hash", frz["sha256"] == ck_sha, frz["sha256"])
    chk(pid + " freeze receipt bytes", frz["bytes"] == os.path.getsize(ck_path))

    stages = {p["id"]: [s["id"] for s in (p["caseStudy"].get("stages") or [])]
              for p in sp["parents"]}
    for row in ck["rows"]:
        i = inv[row["rowKey"]]
        for f in ("bankPath", "parentCaseId", "partId", "stage0QueueIndex"):
            chk(f"{pid} {row['rowKey']} {f} verbatim", row[f] == i[f],
                f"{row[f]!r} != {i[f]!r}")
        chk(pid + " row in packet", i["repairPacketId"] == pid)
        chk(pid + " no orStage", "orStage" not in row)
        d, pb = row["disposition"], row["proposedBoundary"]
        if d == "BASELINE":
            chk(pid + " baseline exact", pb == {"kind": "baseline"} and list(pb) == ["kind"])
            chk(pid + " baseline no reason", row["exceptionReason"] is None)
        elif d == "STAGE":
            chk(pid + " stage is exact declared id",
                isinstance(pb, str) and pb in stages[i["parentCaseId"]]
                and pb in i["declaredStageIds"], repr(pb))
            chk(pid + " stage no reason", row["exceptionReason"] is None)
        elif d == "EXCEPTION":
            chk(pid + " exception null", pb is None)
            chk(pid + " exception has reason", bool(row["exceptionReason"]))
        else:
            chk(pid + " valid disposition", False, d)
        chk(pid + " has evidence", len(row["earliestBoundaryEvidence"]) > 100)
        chk(pid + " has leak check", len(row["laterStageLeakCheck"]) > 80)
        chk(pid + " biling valid", row["bilingualRelation"] in
            {"PARALLEL", "NOT_PARALLEL", "UNCERTAIN"})
        counts[d] += 1; conf[row["confidence"]] += 1; biling[row["bilingualRelation"]] += 1
        seen_rows.add(row["rowKey"])
        seen_parents.add((row["bankPath"], row["parentCaseId"]))
    per_pkt[pid] = ck["rowCount"]
    packets.append({"repairPacketId": pid, "path": f"checker/{pid}.json",
                    "bytes": os.path.getsize(ck_path), "sha256": ck_sha,
                    "rowCount": ck["rowCount"], "parentCount": len(ck["parentCaseIds"]),
                    "parentCaseIds": ck["parentCaseIds"], "bankPath": ck["bankPath"],
                    "bankSha256": ck["bankSha256"], "sourcePacketSha256": sp_sha,
                    "counts": ck["counts"],
                    "amended": frz.get("amended", False),
                    "supersedes": frz.get("supersedes", [])})

chk("all 451 rows", len(seen_rows) == 451, str(len(seen_rows)))
chk("all 93 parents", len(seen_parents) == 93, str(len(seen_parents)))
chk("27 packets", len(per_pkt) == 27, str(len(per_pkt)))
chk("row total", sum(per_pkt.values()) == 451, str(sum(per_pkt.values())))
chk("covers inventory exactly", seen_rows == set(inv))

print(json.dumps({"failures": len(fails), "rows": len(seen_rows),
                  "parents": len(seen_parents), "packets": len(per_pkt),
                  "dispositions": dict(counts), "confidence": dict(conf),
                  "bilingual": dict(biling)}, indent=1))
for f in fails[:40]:
    print("FAIL:", f)
json.dump({"packets": packets, "counts": dict(counts), "confidence": dict(conf),
           "bilingual": dict(biling), "failures": len(fails)},
          open(os.path.join(C, "checker-support", "checker-reconciliation.json"), "w"), indent=1)
sys.exit(1 if fails else 0)
