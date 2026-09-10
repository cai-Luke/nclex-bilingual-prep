#!/usr/bin/env python3
"""Harvest complete calibration outputs, validate, control-score, and lock once."""
import glob, json, os, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
found = 0
for raw_path in sorted(glob.glob(os.path.join(ROOT, "raw", "cal-*-attempt-*.cli.json"))):
    stem = os.path.basename(raw_path).removesuffix(".cli.json")
    packet_id, attempt_text = stem.rsplit("-attempt-", 1)
    lock_path = os.path.join(ROOT, "locks", f"{packet_id}-attempt-{attempt_text}.json")
    output_path = os.path.join(ROOT, "outputs", f"{packet_id}-attempt-{attempt_text}.jsonl")
    process_path = os.path.join(ROOT, "raw", f"{packet_id}-attempt-{attempt_text}.process.json")
    if os.path.exists(lock_path) or not (os.path.exists(output_path) and os.path.exists(process_path)):
        continue
    result = subprocess.run(["node", os.path.join(ROOT, "tools", "harvest-calibration.mjs"), "--packet", packet_id, "--attempt", attempt_text], cwd=ROOT, text=True, capture_output=True)
    print(result.stdout.strip())
    if result.returncode:
        print(result.stderr.strip())
    found += 1
if not found:
    print("nothing to harvest")
locks = sorted(glob.glob(os.path.join(ROOT, "locks", "cal-*-attempt-*.json")))
print(json.dumps({"lockedCalibrationAttempts": len(locks), "locks": [os.path.basename(p) for p in locks]}))
