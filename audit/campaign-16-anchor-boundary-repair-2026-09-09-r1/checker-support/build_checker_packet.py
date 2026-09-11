#!/usr/bin/env python3
"""Checker-owned packet writer + per-packet freeze.

Reads a checker decision file (checker-support/decisions/<pid>.json), joins it to
the FROZEN identity fields taken verbatim from the commission source packet, emits
checker/<pid>.json, and writes an append-only freeze receipt hashing the exact
bytes written.

Reads only: source-packets/<pid>.json, commission-manifest.json, decisions file.
Never touches producer/, producer-support/, or producer tooling.
"""
import json, hashlib, os, sys

C = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.join(C, "source-packets")
OUT = os.path.join(C, "checker")
FRZ = os.path.join(C, "checker-support", "freeze")
DEC = os.path.join(C, "checker-support", "decisions")

CHECKER = "Claude Code / Claude Opus 5"
VALID_DISP = {"BASELINE", "STAGE", "EXCEPTION"}
VALID_BILING = {"PARALLEL", "NOT_PARALLEL", "UNCERTAIN"}
VALID_CONF = {"HIGH", "MEDIUM", "LOW"}

def sha_bytes(b): return hashlib.sha256(b).hexdigest()

def build(pid):
    src_path = os.path.join(SP, pid + ".json")
    src_bytes = open(src_path, "rb").read()
    src = json.loads(src_bytes)
    dec = json.load(open(os.path.join(DEC, pid + ".json"), encoding="utf-8"))

    inv = {r["rowKey"]: r for r in src["inventoryRows"]}
    stages_by_parent = {}
    for p in src["parents"]:
        stages_by_parent[p["id"]] = [s["id"] for s in p["caseStudy"].get("stages") or []]

    if set(dec.keys()) != set(inv.keys()):
        missing = set(inv) - set(dec); extra = set(dec) - set(inv)
        raise SystemExit(f"{pid}: decision/rowKey mismatch missing={sorted(missing)} extra={sorted(extra)}")

    rows = []
    for rk in [r["rowKey"] for r in src["inventoryRows"]]:  # frozen order
        d = dec[rk]; i = inv[rk]
        # Guard against evidence text being attached to the wrong frozen row.
        if "partId" in d:
            assert d["partId"] == i["partId"], (
                f"{rk}: decision partId {d['partId']!r} does not match frozen "
                f"inventory partId {i['partId']!r}")
        disp = d["disposition"]
        assert disp in VALID_DISP, f"{rk} bad disposition"
        assert d["bilingualRelation"] in VALID_BILING, f"{rk} bad bilingualRelation"
        assert d["confidence"] in VALID_CONF, f"{rk} bad confidence"

        if disp == "BASELINE":
            pb = {"kind": "baseline"}
            assert d.get("exceptionReason") is None
        elif disp == "STAGE":
            pb = d["stage"]
            assert isinstance(pb, str) and pb, f"{rk} stage must be non-empty string"
            assert pb in stages_by_parent[i["parentCaseId"]], \
                f"{rk} stage {pb!r} not a declared stage of {i['parentCaseId']}"
            assert pb in i["declaredStageIds"], f"{rk} stage not in frozen declaredStageIds"
            assert d.get("exceptionReason") is None
        else:
            pb = None
            assert d.get("exceptionReason"), f"{rk} EXCEPTION needs exceptionReason"
            assert "stage" not in d, f"{rk} EXCEPTION must not carry a stage"

        for f in ("earliestBoundaryEvidence", "laterStageLeakCheck"):
            assert d.get(f) and len(d[f]) > 40, f"{rk} missing/short {f}"

        row = {
            "rowKey": rk,
            "stage0QueueIndex": i["stage0QueueIndex"],   # copied verbatim from frozen inventory
            "bankPath": i["bankPath"],
            "parentCaseId": i["parentCaseId"],
            "partId": i["partId"],
            "proposedBoundary": pb,
            "disposition": disp,
            "earliestBoundaryEvidence": d["earliestBoundaryEvidence"],
            "laterStageLeakCheck": d["laterStageLeakCheck"],
            "bilingualRelation": d["bilingualRelation"],
            "confidence": d["confidence"],
            "exceptionReason": d.get("exceptionReason"),
        }
        assert "orStage" not in row
        rows.append(row)

    packet = {
        "repairPacketId": pid,
        "bankPath": src["bankPath"],
        "bankSha256": src["bankSha256"],
        "sourcePacketSha256": sha_bytes(src_bytes),
        "checker": CHECKER,
        "checkerRole": "independent content checker (R4 Stage 2 blind full reconstruction)",
        "blind": True,
        "representation": {
            "BASELINE": 'proposedBoundary == {"kind":"baseline"}',
            "STAGE": "proposedBoundary == exact declared stage id string",
            "EXCEPTION": "proposedBoundary == null with exceptionReason",
            "forbiddenAlternateField": "orStage (never emitted)",
        },
        "rowCount": len(rows),
        "parentCaseIds": sorted({r["parentCaseId"] for r in rows}),
        "counts": {
            "BASELINE": sum(1 for r in rows if r["disposition"] == "BASELINE"),
            "STAGE": sum(1 for r in rows if r["disposition"] == "STAGE"),
            "EXCEPTION": sum(1 for r in rows if r["disposition"] == "EXCEPTION"),
            "HIGH": sum(1 for r in rows if r["confidence"] == "HIGH"),
        },
        "rows": rows,
    }

    os.makedirs(OUT, exist_ok=True); os.makedirs(FRZ, exist_ok=True)
    out_path = os.path.join(OUT, pid + ".json")
    data = (json.dumps(packet, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    with open(out_path, "wb") as f:
        f.write(data)

    # freeze exact bytes as written (re-read from disk, not the in-memory buffer)
    on_disk = open(out_path, "rb").read()
    receipt = {
        "repairPacketId": pid,
        "path": f"checker/{pid}.json",
        "bytes": len(on_disk),
        "sha256": sha_bytes(on_disk),
        "rowCount": len(rows),
        "parentCount": len(packet["parentCaseIds"]),
        "sourcePacketSha256": packet["sourcePacketSha256"],
        "bankPath": packet["bankPath"],
        "bankSha256": packet["bankSha256"],
        "checker": CHECKER,
        "counts": packet["counts"],
    }
    frz_path = os.path.join(FRZ, pid + "-freeze.json")
    if os.path.exists(frz_path):
        old = json.load(open(frz_path))
        if old.get("sha256") != receipt["sha256"]:
            reason = os.environ.get("CHECKER_AMENDMENT")
            if not reason:
                raise SystemExit(f"{pid}: REFUSING to overwrite existing freeze "
                                 f"({old.get('sha256')} -> {receipt['sha256']}). "
                                 f"Set CHECKER_AMENDMENT to record a disclosed amendment.")
            # Disclosed amendment: keep the superseded receipt in the chain rather
            # than silently replacing it.
            chain = old.get("supersedes", [])
            superseded = {k: old[k] for k in ("sha256", "bytes", "counts") if k in old}
            superseded["amendmentReason"] = reason
            chain = chain + [superseded]
            receipt["supersedes"] = chain
            receipt["amended"] = True
            receipt["amendmentReason"] = reason
        else:
            print(f"{pid}: freeze already present and identical")
            return receipt
    with open(frz_path, "w", encoding="utf-8") as f:
        json.dump(receipt, f, indent=2)
        f.write("\n")
    print(json.dumps(receipt))
    return receipt

for pid in sys.argv[1:]:
    build(pid)
