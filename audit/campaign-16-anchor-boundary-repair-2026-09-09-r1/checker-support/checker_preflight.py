#!/usr/bin/env python3
"""Checker-owned mechanical preflight. Reads only allowlisted inputs:
frozen inventory, commission manifest, source-packets/, live banks/.
Does not import or execute any producer helper."""
import json, hashlib, os, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT = os.path.dirname(ROOT)  # repo root
C = os.path.join(ROOT, "audit", "campaign-16-anchor-boundary-repair-2026-09-09-r1")
INV = os.path.join(ROOT, "audit", "campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1", "frozen-inventory.jsonl")

def sha(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()

report = {"checks": [], "fail": 0}
def chk(name, cond, detail=""):
    report["checks"].append({"name": name, "pass": bool(cond), "detail": detail})
    if not cond:
        report["fail"] += 1

manifest = json.load(open(os.path.join(C, "commission-manifest.json")))

# --- inventory ---
rows = [json.loads(l) for l in open(INV, encoding="utf-8") if l.strip()]
chk("inventory row count == 451", len(rows) == 451, str(len(rows)))
chk("inventory sha matches manifest pin", sha(INV) == manifest["inventorySha256"])
rowkeys = [r["rowKey"] for r in rows]
chk("rowKeys unique", len(set(rowkeys)) == 451, str(len(set(rowkeys))))
parents = {(r["bankPath"], r["parentCaseId"]) for r in rows}
chk("distinct parents == 93", len(parents) == 93, str(len(parents)))
chk("all rows BOTH_ANCHORS_ABSENT",
    all(r["affectedCondition"] == "BOTH_ANCHORS_ABSENT" for r in rows))
byid = {(r["bankPath"], r["parentCaseId"], r["partId"]) for r in rows}
chk("bank/parent/part identities unique == 451", len(byid) == 451, str(len(byid)))

# --- bank hashes ---
banks = {}
for p, info in manifest["banks"].items():
    fp = os.path.join(ROOT, p)
    h = sha(fp)
    chk("bank hash " + p, h == info["sha256"])
    banks[p] = json.load(open(fp, encoding="utf-8"))

# --- packets ---
pkt_ids = [pk["repairPacketId"] for pk in manifest["packets"]]
chk("packet count == 27", len(pkt_ids) == 27, str(len(pkt_ids)))
inv_by_pkt = collections.defaultdict(list)
for r in rows:
    inv_by_pkt[r["repairPacketId"]].append(r)

seen_rows = set()
seen_parents = set()
for pk in manifest["packets"]:
    pid = pk["repairPacketId"]
    sp_path = os.path.join(C, "source-packets", pid + ".json")
    sp = json.load(open(sp_path, encoding="utf-8"))
    chk(pid + " bankPath agrees", sp["bankPath"] == pk["bankPath"])
    chk(pid + " bank sha agrees", sp["bankSha256"] == manifest["banks"][pk["bankPath"]]["sha256"])
    ir = sp["inventoryRows"]
    chk(pid + " packet rowCount", len(ir) == pk["rowCount"] == len(inv_by_pkt[pid]),
        f"{len(ir)}/{pk['rowCount']}/{len(inv_by_pkt[pid])}")
    chk(pid + " rowKeys equal manifest list", [r["rowKey"] for r in ir] == pk["rowKeys"])
    # frozen inventory rows byte-identical to packet copies
    inv_map = {r["rowKey"]: r for r in inv_by_pkt[pid]}
    chk(pid + " inventory rows deep-equal frozen",
        all(inv_map.get(r["rowKey"]) == r for r in ir))
    for r in ir:
        seen_rows.add(r["rowKey"])
    # bank-pure
    chk(pid + " bank-pure", all(r["bankPath"] == pk["bankPath"] for r in ir))
    # parents whole + deep equal to live
    bank = banks[pk["bankPath"]]
    live = {q["id"]: q for q in bank["questions"]}
    pkt_parent_ids = [p["id"] for p in sp["parents"]]
    chk(pid + " parent ids equal manifest", sorted(pkt_parent_ids) == sorted(pk["parentCaseIds"]))
    for p in sp["parents"]:
        chk(pid + " parent " + p["id"] + " deep-equal live", live.get(p["id"]) == p)
        seen_parents.add((pk["bankPath"], p["id"]))
    # every affected row's parent present, and parent-whole (no split across packets)
    for r in ir:
        chk(pid + " row parent in packet", r["parentCaseId"] in pkt_parent_ids)
    # live pure-omission shape
    for r in ir:
        par = live[r["parentCaseId"]]
        stages = [s["id"] for s in par["caseStudy"]["stages"]]
        chk(pid + " declaredStageIds match live " + r["partId"], stages == r["declaredStageIds"])
        part = next((q for q in par["caseStudy"]["questions"] if q["id"] == r["partId"]), None)
        chk(pid + " part exists " + r["partId"], part is not None)
        if part is not None:
            chk(pid + " pure omission " + r["partId"],
                "answerableAfterStageId" not in part and "stageId" not in part)

chk("all 451 rows covered by packets", len(seen_rows) == 451, str(len(seen_rows)))
chk("all 93 parents covered by packets", len(seen_parents) == 93, str(len(seen_parents)))
chk("packet parents == inventory parents", seen_parents == parents)

# no parent split across packets
p2pkt = collections.defaultdict(set)
for r in rows:
    p2pkt[(r["bankPath"], r["parentCaseId"])].add(r["repairPacketId"])
chk("no parent split across packets", all(len(v) == 1 for v in p2pkt.values()))

print(json.dumps({"failures": report["fail"], "total": len(report["checks"])}))
for c in report["checks"]:
    if not c["pass"]:
        print("FAIL:", c["name"], c["detail"])
json.dump(report, open(os.path.join(C, "checker-support", "checker-preflight.json"), "w"), indent=1)
sys.exit(1 if report["fail"] else 0)
