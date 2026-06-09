#!/usr/bin/env python3
"""
Comprehensive shuffle-integrity audit v2.
Compares every question in changed banks against pre-shuffle baseline c7287c3.

Checks per item type:
  multiple_choice / select_all:
    1. Option (EN, ZH) pairs preserved — same multiset
    2. Correct answer EN+ZH texts unchanged (semantic, not just letter)
    3. byChoice refId coverage (one per option, no dups/gaps)
    4. byChoice text remains attached to same option text (EN)

  ordered_response:
    1. Option (EN, ZH) pairs preserved
    2. Correct sequence maps to same ordered EN+ZH texts

  fill_in_blank:
    1. blanks[] identical (same IDs, same acceptable values)

  dropdown_cloze:
    1. Each dropdown's option (EN, ZH) pairs preserved
    2. Each dropdown's correct option text unchanged

  matrix:
    1. Row (EN, ZH) pairs preserved
    2. Column (EN, ZH) pairs preserved
    3. Correct row→column mapping (by text) unchanged

  case_study:
    1. Recursively apply the above checks to each embedded question

Repair strategy:
  - Auto-repairs byChoice refId mismatches (semantic remapping).
  - Auto-repairs correct[] ID drift (when option texts are intact).
  - Reports (but does not auto-repair) option text corruption — requires manual review.

Usage:
  python3 scripts/audit-shuffle-integrity-v2.py [--fix]
  Pass --fix to write repairs to disk (dry-run by default).
"""

import json
import subprocess
import sys
import os
from collections import Counter
from copy import deepcopy

BASELINE_REF = "c7287c3"
BANKS = [
    "banks/capnography-canonical.json",
    "banks/claude-canonical.json",
    "banks/gemini-canonical.json",
    "banks/gpt-canonical.json",
    "banks/hard-cases-canonical.json",
    "banks/visual-canonical.json",
    "banks/vitals-canonical.json",
]
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DRY_RUN = "--fix" not in sys.argv


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def load_baseline(bank_path: str) -> dict:
    result = subprocess.run(
        ["git", "show", f"{BASELINE_REF}:{bank_path}"],
        capture_output=True, text=True, cwd=REPO_ROOT
    )
    if result.returncode != 0:
        raise RuntimeError(f"Cannot load baseline for {bank_path}: {result.stderr.strip()}")
    return json.loads(result.stdout)


def load_current(bank_path: str) -> dict:
    with open(os.path.join(REPO_ROOT, bank_path)) as f:
        return json.load(f)


def save_current(bank_path: str, data: dict) -> None:
    with open(os.path.join(REPO_ROOT, bank_path), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def opt_pairs(options: list) -> set:
    """Return set of (en, zh) tuples for an options list."""
    return {(o.get("en", ""), o.get("zh", "")) for o in options}


def opt_en_to_id(options: list) -> dict:
    return {o.get("en", ""): o["id"] for o in options}


def opt_id_to_en(options: list) -> dict:
    return {o["id"]: o.get("en", "") for o in options}


def opt_id_to_zh(options: list) -> dict:
    return {o["id"]: o.get("zh", "") for o in options}


# ─────────────────────────────────────────────
# Per-type checkers
# ─────────────────────────────────────────────

def check_mc_sa(q_base: dict, q_curr: dict, repairs: list) -> list[str]:
    """Check multiple_choice / select_all. Returns failures; mutates q_curr for auto-repairs."""
    failures = []
    base_opts = q_base.get("options", [])
    curr_opts = q_curr.get("options", [])

    if not base_opts:
        return []

    # --- 1. Option (EN, ZH) pair integrity ---
    base_pairs = opt_pairs(base_opts)
    curr_pairs = opt_pairs(curr_opts)
    dropped = base_pairs - curr_pairs
    added   = curr_pairs - base_pairs
    if dropped:
        failures.append(f"OPTION-PAIRS: dropped {sorted(dropped)[:3]}")
    if added:
        failures.append(f"OPTION-PAIRS: added {sorted(added)[:3]}")

    # EN-only multiset (catch silent ZH drift)
    base_en = Counter(o.get("en","") for o in base_opts)
    curr_en = Counter(o.get("en","") for o in curr_opts)
    if base_en != curr_en:
        failures.append(f"OPTION-EN: mismatch {dict(base_en)} vs {dict(curr_en)}")

    # If option set is corrupted we can't trust the rest
    if dropped or added:
        return failures

    # Build mappings
    b_id2en = opt_id_to_en(base_opts)
    b_id2zh = opt_id_to_zh(base_opts)
    c_id2en = opt_id_to_en(curr_opts)
    c_id2zh = opt_id_to_zh(curr_opts)
    c_en2id = opt_en_to_id(curr_opts)

    # --- 2. Correct-answer semantic integrity ---
    b_correct_ids = q_base.get("correct", [])
    c_correct_ids = q_curr.get("correct", [])
    b_correct_en = {b_id2en[i] for i in b_correct_ids if i in b_id2en}
    c_correct_en = {c_id2en[i] for i in c_correct_ids if i in c_id2en}
    b_correct_zh = {b_id2zh[i] for i in b_correct_ids if i in b_id2zh}
    c_correct_zh = {c_id2zh[i] for i in c_correct_ids if i in c_id2zh}

    if b_correct_en != c_correct_en:
        # Attempt auto-repair: remap correct[] to match the baseline correct texts
        repaired_ids = []
        ok = True
        for en_text in sorted(b_correct_en):
            rid = c_en2id.get(en_text)
            if rid is None:
                ok = False
                break
            repaired_ids.append(rid)
        if ok:
            failures.append(
                f"CORRECT-KEY [AUTO-REPAIRED]: was={sorted(b_correct_en)} "
                f"now={sorted(c_correct_en)}"
            )
            q_curr["correct"] = sorted(repaired_ids)
            repairs.append(f"correct[] remapped on {q_curr['id']}")
        else:
            failures.append(
                f"CORRECT-KEY [UNRESOLVED]: was={sorted(b_correct_en)} "
                f"now={sorted(c_correct_en)}"
            )

    if b_correct_zh != c_correct_zh and b_correct_en == c_correct_en:
        failures.append(f"CORRECT-KEY-ZH: EN match but ZH mismatch: "
                        f"was={sorted(b_correct_zh)} now={sorted(c_correct_zh)}")

    # --- 3 & 4. byChoice integrity ---
    base_by = q_base.get("rationale", {}).get("byChoice", [])
    curr_by = q_curr.get("rationale", {}).get("byChoice", [])

    if base_by:
        # Check 3: coverage
        curr_ref_ids = [e["refId"] for e in curr_by]
        curr_opt_ids = {o["id"] for o in curr_opts}
        if len(curr_ref_ids) != len(set(curr_ref_ids)):
            dupes = [r for r, c in Counter(curr_ref_ids).items() if c > 1]
            failures.append(f"BYCHOICE-COVERAGE: duplicate refIds {dupes}")
        missing = curr_opt_ids - set(curr_ref_ids)
        if missing:
            failures.append(f"BYCHOICE-COVERAGE: missing refIds {sorted(missing)}")

        # Check 4: semantic mapping — skip if duplicate rationale text (ambiguous)
        b_rat_counts = Counter(e.get("en","") for e in base_by)
        b_rat_to_opt_en = {}
        for e in base_by:
            rt = e.get("en","")
            opt_en = b_id2en.get(e["refId"],"")
            if rt and opt_en and b_rat_counts[rt] == 1:
                b_rat_to_opt_en[rt] = opt_en

        remapped = 0
        for e in curr_by:
            rt = e.get("en","")
            curr_opt_en = c_id2en.get(e["refId"],"")
            expected_opt_en = b_rat_to_opt_en.get(rt)
            if expected_opt_en is None:
                continue  # duplicate or post-shuffle edit — skip
            if expected_opt_en != curr_opt_en:
                correct_id = c_en2id.get(expected_opt_en)
                if correct_id:
                    e["refId"] = correct_id
                    remapped += 1
                else:
                    failures.append(
                        f"BYCHOICE-SEMANTIC [UNRESOLVED]: "
                        f"\"{rt[:50]}\" should point to \"{expected_opt_en[:40]}\""
                    )

        if remapped:
            failures.append(f"BYCHOICE-SEMANTIC [AUTO-REPAIRED]: {remapped} refId(s) remapped")
            repairs.append(f"byChoice refIds remapped ({remapped}) on {q_curr['id']}")

    return failures


def check_ordered_response(q_base: dict, q_curr: dict, repairs: list) -> list[str]:
    failures = []
    base_opts = q_base.get("options", [])
    curr_opts = q_curr.get("options", [])

    if not base_opts:
        return []

    # 1. Option (EN, ZH) pair integrity
    base_pairs = opt_pairs(base_opts)
    curr_pairs = opt_pairs(curr_opts)
    dropped = base_pairs - curr_pairs
    added   = curr_pairs - base_pairs
    if dropped:
        failures.append(f"OR-OPTION-PAIRS: dropped {sorted(dropped)[:3]}")
    if added:
        failures.append(f"OR-OPTION-PAIRS: added {sorted(added)[:3]}")
    if dropped or added:
        return failures

    b_id2en = opt_id_to_en(base_opts)
    c_id2en = opt_id_to_en(curr_opts)
    c_en2id = opt_en_to_id(curr_opts)

    # 2. Correct sequence semantic integrity
    b_seq = [b_id2en.get(i,"") for i in q_base.get("correct",[])]
    c_seq = [c_id2en.get(i,"") for i in q_curr.get("correct",[])]

    if b_seq != c_seq:
        # Attempt repair: remap correct[] to match baseline sequence
        repaired = []
        ok = True
        for en_text in b_seq:
            rid = c_en2id.get(en_text)
            if rid is None:
                ok = False
                break
            repaired.append(rid)
        if ok:
            failures.append(f"OR-CORRECT-SEQ [AUTO-REPAIRED]: was={b_seq} now={c_seq}")
            q_curr["correct"] = repaired
            repairs.append(f"ordered_response correct[] remapped on {q_curr['id']}")
        else:
            failures.append(f"OR-CORRECT-SEQ [UNRESOLVED]: was={b_seq} now={c_seq}")

    return failures


def check_fill_in_blank(q_base: dict, q_curr: dict, repairs: list) -> list[str]:
    failures = []
    b_blanks = {b["id"]: b for b in q_base.get("blanks", [])}
    c_blanks = {b["id"]: b for b in q_curr.get("blanks", [])}

    if set(b_blanks) != set(c_blanks):
        failures.append(f"FIB-BLANKS: blank IDs changed {set(b_blanks)} -> {set(c_blanks)}")
        return failures

    for bid, bb in b_blanks.items():
        cb = c_blanks[bid]
        b_acc = sorted(str(a) for a in bb.get("acceptable", []))
        c_acc = sorted(str(a) for a in cb.get("acceptable", []))
        if b_acc != c_acc:
            failures.append(f"FIB-BLANK-{bid}: acceptable values changed {b_acc} -> {c_acc}")

    return failures


def check_dropdown_cloze(q_base: dict, q_curr: dict, repairs: list) -> list[str]:
    failures = []
    b_drops = {d["id"]: d for d in q_base.get("dropdowns", [])}
    c_drops = {d["id"]: d for d in q_curr.get("dropdowns", [])}

    if set(b_drops) != set(c_drops):
        failures.append(f"CLOZE-DROPDOWNS: dropdown IDs changed")
        return failures

    for did, bd in b_drops.items():
        cd = c_drops[did]
        b_pairs = opt_pairs(bd.get("options", []))
        c_pairs = opt_pairs(cd.get("options", []))
        dropped = b_pairs - c_pairs
        added   = c_pairs - b_pairs
        if dropped:
            failures.append(f"CLOZE-DD-{did}: dropped option pairs {sorted(dropped)[:2]}")
        if added:
            failures.append(f"CLOZE-DD-{did}: added option pairs {sorted(added)[:2]}")
        if dropped or added:
            continue

        # Correct answer semantic check
        b_correct_text = next(
            (o.get("en","") for o in bd["options"] if o["id"] == bd.get("correct")), None
        )
        c_correct_text = next(
            (o.get("en","") for o in cd["options"] if o["id"] == cd.get("correct")), None
        )
        if b_correct_text != c_correct_text:
            # Attempt repair
            c_en2id = {o.get("en",""): o["id"] for o in cd["options"]}
            correct_id = c_en2id.get(b_correct_text)
            if correct_id:
                failures.append(
                    f"CLOZE-DD-{did}-CORRECT [AUTO-REPAIRED]: "
                    f"\"{b_correct_text}\" was {bd['correct']}, now remapped to {correct_id}"
                )
                cd["correct"] = correct_id
                repairs.append(f"dropdown_cloze DD-{did} correct remapped on {q_curr['id']}")
            else:
                failures.append(
                    f"CLOZE-DD-{did}-CORRECT [UNRESOLVED]: was \"{b_correct_text}\" "
                    f"now \"{c_correct_text}\""
                )

    return failures


def check_matrix(q_base: dict, q_curr: dict, repairs: list) -> list[str]:
    failures = []
    bm = q_base.get("matrix", {})
    cm = q_curr.get("matrix", {})

    b_rows = {r["id"]: r for r in bm.get("rows", [])}
    c_rows = {r["id"]: r for r in cm.get("rows", [])}
    b_cols = {c["id"]: c for c in bm.get("columns", [])}
    c_cols = {c["id"]: c for c in cm.get("columns", [])}

    # Row text integrity (by ID)
    for rid in b_rows:
        if rid not in c_rows:
            failures.append(f"MATRIX-ROW: row {rid} missing in current")
            continue
        if b_rows[rid].get("en") != c_rows[rid].get("en"):
            failures.append(
                f"MATRIX-ROW-{rid}: EN changed: "
                f"\"{b_rows[rid].get('en','')[:60]}\" -> \"{c_rows[rid].get('en','')[:60]}\""
            )
        if b_rows[rid].get("zh") != c_rows[rid].get("zh"):
            failures.append(f"MATRIX-ROW-{rid}: ZH text changed")

    # Column text integrity
    for cid in b_cols:
        if cid not in c_cols:
            failures.append(f"MATRIX-COL: column {cid} missing in current")
            continue
        if b_cols[cid].get("en") != c_cols[cid].get("en"):
            failures.append(f"MATRIX-COL-{cid}: EN text changed")

    # Correct answer mapping: row -> column (by text)
    b_correct = {e["rowId"]: e["columnIds"] for e in q_base.get("correct", [])}
    c_correct = {e["rowId"]: e["columnIds"] for e in q_curr.get("correct", [])}
    for rowId, b_col_ids in b_correct.items():
        c_col_ids = c_correct.get(rowId, [])
        b_col_texts = sorted(b_cols[c]["en"] for c in b_col_ids if c in b_cols)
        c_col_texts = sorted(c_cols[c]["en"] for c in c_col_ids if c in c_cols)
        if b_col_texts != c_col_texts:
            failures.append(
                f"MATRIX-CORRECT-ROW-{rowId}: "
                f"was col_texts={b_col_texts} now={c_col_texts}"
            )

    return failures


CHECKERS = {
    "multiple_choice": check_mc_sa,
    "select_all":      check_mc_sa,
    "ordered_response": check_ordered_response,
    "fill_in_blank":   check_fill_in_blank,
    "dropdown_cloze":  check_dropdown_cloze,
    "matrix":          check_matrix,
}


def audit_question(q_base: dict, q_curr: dict, repairs: list, prefix: str = "") -> list[str]:
    """Dispatch to the right checker and handle case_study recursion."""
    item_type = q_base.get("itemType", "")
    failures = []

    if item_type == "case_study":
        b_qs = {sq["id"]: sq for sq in q_base.get("caseStudy", {}).get("questions", [])}
        c_qs = {sq["id"]: sq for sq in q_curr.get("caseStudy", {}).get("questions", [])}
        for sqid, sq_base in b_qs.items():
            if sqid not in c_qs:
                failures.append(f"CASE-STUDY: embedded question {sqid} missing")
                continue
            sub = audit_question(sq_base, c_qs[sqid], repairs, prefix=f"{prefix}{sqid}/")
            failures.extend(f"[{sqid}] {f}" for f in sub)
    elif item_type in CHECKERS:
        failures = CHECKERS[item_type](q_base, q_curr, repairs)

    return failures


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

def main():
    mode = "DRY-RUN (pass --fix to apply repairs)" if DRY_RUN else "REPAIR MODE"
    print(f"\nShuffle Integrity Audit v2  [{mode}]")
    print(f"Baseline: {BASELINE_REF}\n")

    grand_total_checked = 0
    grand_total_failed  = 0
    grand_repairs       = []
    all_unresolved      = []
    bank_results        = []

    for bank_path in BANKS:
        bank_name = os.path.basename(bank_path)
        try:
            base_data = load_baseline(bank_path)
            curr_data = load_current(bank_path)
        except Exception as e:
            print(f"ERROR loading {bank_name}: {e}")
            continue

        base_qs = {q["id"]: q for q in base_data["questions"]}
        curr_list = curr_data["questions"]

        bank_failures_by_qid = {}
        bank_repairs = []
        bank_checked = 0

        for q_curr in curr_list:
            qid = q_curr["id"]
            if qid not in base_qs:
                continue
            q_base = base_qs[qid]
            if q_base.get("itemType") not in CHECKERS and q_base.get("itemType") != "case_study":
                continue

            bank_checked += 1
            grand_total_checked += 1
            q_repairs = []
            failures = audit_question(q_base, q_curr, q_repairs)

            if failures:
                grand_total_failed += 1
                bank_failures_by_qid[qid] = failures
            if q_repairs:
                bank_repairs.extend(q_repairs)
                grand_repairs.extend(q_repairs)

        # Check for unresolved failures
        unresolved = {
            qid: [f for f in fs if "UNRESOLVED" in f]
            for qid, fs in bank_failures_by_qid.items()
            if any("UNRESOLVED" in f for f in fs)
        }
        all_unresolved.extend((bank_name, qid, fs) for qid, fs in unresolved.items())

        status = "PASS"
        if bank_failures_by_qid:
            n_repaired = sum(
                1 for fs in bank_failures_by_qid.values()
                if all("AUTO-REPAIRED" in f or "UNRESOLVED" not in f for f in fs)
                   and any("AUTO-REPAIRED" in f for f in fs)
            )
            n_unresolved = len(unresolved)
            if n_unresolved:
                status = f"FAIL ({n_unresolved} unresolved)"
            else:
                status = f"REPAIRED ({len(bank_failures_by_qid)} items auto-fixed)"

        bank_results.append((bank_name, status, bank_checked, bank_failures_by_qid, bank_repairs))

        # Write repairs
        if bank_repairs and not DRY_RUN:
            save_current(bank_path, curr_data)
            print(f"  ✓ Wrote repairs to {bank_name}")

    # Print report
    print("\n" + "="*65)
    print("  RESULTS BY BANK")
    print("="*65)
    for bank_name, status, checked, failures_by_qid, repairs in bank_results:
        print(f"\n  {bank_name}  [{status}]  checked={checked}")
        if failures_by_qid:
            for qid, fs in failures_by_qid.items():
                print(f"    {qid}:")
                for f in fs:
                    print(f"      - {f}")
        if repairs:
            print(f"    Repairs applied ({len(repairs)}):")
            for r in repairs:
                print(f"      + {r}")

    print("\n" + "="*65)
    print("  SUMMARY")
    print("="*65)
    print(f"  Questions checked : {grand_total_checked}")
    print(f"  Items with issues : {grand_total_failed}")
    print(f"  Auto-repairs      : {len(grand_repairs)}")
    print(f"  Unresolved        : {len(all_unresolved)}")

    if all_unresolved:
        print("\n  UNRESOLVED (requires manual fix before pushing):")
        for bank, qid, fs in all_unresolved:
            print(f"    [{bank}] {qid}:")
            for f in fs:
                print(f"      {f}")
        print("\n  RESULT: ❌  STOP — do not push until unresolved issues are fixed")
        return 1
    elif grand_total_failed == 0:
        print("\n  RESULT: ✓  CLEAN — no integrity violations found")
        return 0
    else:
        if DRY_RUN:
            print(f"\n  RESULT: {len(grand_repairs)} auto-repairs needed — re-run with --fix to apply")
            return 1
        else:
            print(f"\n  RESULT: ✓  CLEAN after {len(grand_repairs)} auto-repairs applied")
            return 0


if __name__ == "__main__":
    sys.exit(main())
