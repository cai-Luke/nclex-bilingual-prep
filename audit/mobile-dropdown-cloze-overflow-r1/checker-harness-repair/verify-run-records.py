"""Producer evidence cross-check; reads runs and writes only this new evidence directory."""
import hashlib
import json
from pathlib import Path
import shlex

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
RUNNER = "scripts/tests/mobile-dropdown-cloze-layout.mjs"
SHA = hashlib.sha256((REPO / RUNNER).read_bytes()).hexdigest()
EXPECTED_SHA = "3e661e3cc32f1e40a8a8937205c475e504051cb0cee892e23cbd24c61f320667"
assert SHA == EXPECTED_SHA
FIELDS = ("viewport", "dpr", "theme", "text", "language", "submitted", "transport")
RUNS = ("baseline-http", "candidate-http-1", "candidate-http-2", "candidate-file-1", "candidate-file-2")
profiles = set()
summaries = []
witness_index = []
state_index = {}
reports = {}

def fits(root):
    return root["scrollWidth"] <= root["clientWidth"] + 1

for name in RUNS:
    report = json.loads((HERE / name / "results.json").read_text())
    reports[name] = report
    assert report["runnerSha256"] == SHA
    checks = report["checks"]
    geometry_checks = [check for check in checks if "subjects" in check]
    refs = report["nonClozeWitnesses"]
    comparisons = [comparison for ref in refs for comparison in ref["comparisons"]]
    exceptions = [exception for check in geometry_checks for exception in check["exceptions"]]
    assert len(comparisons) == len(exceptions)
    if name == "baseline-http":
        assert report["status"] == "FAIL"
        assert len(checks) == 1 and not refs
        assert checks[0]["name"] == "witness-320-default-empty"
        assert checks[0]["fixture"] == "gpt_format15_vasa_previa_management_dropdown"
        assert checks[0]["root"] == {"scrollWidth": 1302, "clientWidth": 320}
        assert "root overflow" in checks[0]["failures"]
        assert "CONTAINMENT witness-320-default-empty: root overflow" in report["error"]
        select = next(subject for subject in checks[0]["subjects"] if subject["element"].startswith("select."))
        assert select["rect"]["right"] > 320 and select["ancestors"]
        select_rect = select["rect"]
    else:
        assert report["status"] == "PASS" and "error" not in report
        assert all(not check["failures"] and fits(check["root"]) for check in geometry_checks)
        expected = (160, 86, 18, 720) if "http" in name else (5, 3, 2, 32)
        assert (len(checks), len(geometry_checks), len(refs), len(comparisons)) == expected
        for ref in refs:
            assert ref["admitted"] is True and ref["comparisons"]
            assert ref["fixture"] == "claude_a_mc_ace_inhibitor_11"
            assert ref["bank"] == "banks/claude-canonical.json"
            assert ref["fingerprint"] == "fnv1a64-v1:2411b32c4d3ef6b2"
            for field in FIELDS:
                assert ref["requested"][field] == ref["observed"][field] == ref[field], (name, ref["id"], field)
            assert fits(ref["requested"]["root"]) and fits(ref["observed"]["root"])
            isolation = ref["isolation"]
            assert isolation["bootstrapClosedBeforeSeed"] and isolation["inertSeedDocument"] and isolation["contextClosed"]
            assert isolation["freshProfile"] not in profiles
            assert not Path(isolation["freshProfile"]).exists()
            profiles.add(isolation["freshProfile"])
            for comparison in ref["comparisons"]:
                for field in FIELDS:
                    assert comparison["requested"][field] == comparison["observed"][field] == ref["requested"][field]
                assert fits(comparison["requested"]["root"]) and fits(comparison["observed"]["root"])
                assert comparison["delta"] == comparison["requested"]["ancestorExcess"] - comparison["observed"]["ancestorExcess"] == 0
            witness_index.append({
                "run": name, "id": ref["id"], "fixture": ref["fixture"],
                "requested": ref["requested"], "observed": ref["observed"], "isolation": isolation,
                "uses": len(ref["comparisons"]),
                "ancestors": sorted({entry["ancestor"] for entry in ref["comparisons"]}),
                "excessPairs": sorted({(entry["requested"]["ancestorExcess"], entry["observed"]["ancestorExcess"], entry["delta"]) for entry in ref["comparisons"]}),
                "fullRecord": f"{name}/results.json#/nonClozeWitnesses/{refs.index(ref)}",
            })
        by_id = {ref["id"]: ref for ref in refs}
        for check in geometry_checks:
            for exception in check["exceptions"]:
                ref = by_id[exception["matchedWitness"]]
                assert exception["delta"] == 0 and exception["attribution"]
                assert any(comparison["state"] == check["name"] and comparison["subject"] == exception["subject"] and comparison["ancestor"] == exception["ancestor"] for comparison in ref["comparisons"])
        assert len(report["console"]) == (0 if "http" in name else 12)
    output = str((HERE / name).relative_to(REPO))
    argv = ["node", "--import", "tsx", RUNNER, "--url", report["url"], "--output", output]
    summaries.append({
        "run": name, "command": "PLAYWRIGHT_MODULE=/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs " + shlex.join(argv),
        "exitCode": 1 if name == "baseline-http" else 0,
        "status": report["status"], "runnerSha256": SHA, "browser": report["browser"],
        "firstRoot": checks[0]["root"], "checks": len(checks), "containmentStates": len(geometry_checks),
        "matchedWitnesses": len(refs), "matchedComparisons": len(comparisons),
        "deltas": sorted({entry["delta"] for entry in comparisons}), "consoleDiagnostics": len(report["console"]),
        "resultSha256": hashlib.sha256((HERE / name / "results.json").read_bytes()).hexdigest(),
        **({"offendingSelectRect": select_rect, "failure": "Strict root and cloze containment; no readout or matched-reference call reached"} if name == "baseline-http" else {}),
    })
    state_index[name] = [{key: check[key] for key in ("name", "fixture", *FIELDS, "root", "failures") if key in check} for check in checks]

for transport in ("http", "file"):
    one = reports[f"candidate-{transport}-1"]
    two = reports[f"candidate-{transport}-2"]
    assert state_index[f"candidate-{transport}-1"] == state_index[f"candidate-{transport}-2"]
    assert [ref["requested"] for ref in one["nonClozeWitnesses"]] == [ref["requested"] for ref in two["nonClozeWitnesses"]]
    prior = json.loads((HERE.parent / "post-disposition" / f"candidate-{transport}" / "results.json").read_text())
    assert [check["name"] for check in prior["checks"]] == [check["name"] for check in one["checks"]], "Retain complete original matrix"

assert len(profiles) == 40
for filename, value in (
    ("final-invocations.json", {"sameRunnerBytes": True, "runnerSha256": SHA, "cwd": str(REPO), "runs": summaries}),
    ("matched-witness-index.json", {"status": "PASS", "uniqueFreshProfiles": len(profiles), "allRequestedObservedIdentitiesMatch": True, "allDeltasZero": True, "witnesses": witness_index}),
    ("browser-state-index.json", state_index),
):
    (HERE / filename).write_text(json.dumps(value, indent=2) + "\n")
print(json.dumps({"status": "PASS", "freshProfiles": len(profiles), "comparisons": sum(item["matchedComparisons"] for item in summaries), "candidateRepetitions": 2, "httpChecksPerRun": 160, "fileChecksPerRun": 5}))
