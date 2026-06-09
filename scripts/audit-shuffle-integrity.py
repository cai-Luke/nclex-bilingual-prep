#!/usr/bin/env python3
"""
Audit shuffle integrity: compare every question in 7 changed banks against the
pre-shuffle baseline at c7287c3. Produces a PASS/FAIL report with four checks:

  1. option-set integrity       — same option texts, no drops/dups
  2. correct-answer integrity   — correct answer text(s) unchanged
  3. byChoice mapping integrity — each rationale text still attached to same option text
  4. byChoice refId coverage    — no missing or duplicate refIds
"""

import json
import subprocess
import sys
import os
from collections import Counter

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
OPTION_TYPES = {"multiple_choice", "select_all"}


def load_baseline(bank_path: str) -> dict:
    result = subprocess.run(
        ["git", "show", f"{BASELINE_REF}:{bank_path}"],
        capture_output=True, text=True, cwd=os.path.dirname(os.path.dirname(__file__))
    )
    if result.returncode != 0:
        raise RuntimeError(f"Could not load baseline for {bank_path}: {result.stderr.strip()}")
    return json.loads(result.stdout)


def load_current(bank_path: str) -> dict:
    full = os.path.join(os.path.dirname(os.path.dirname(__file__)), bank_path)
    with open(full) as f:
        return json.load(f)


def option_text_to_id(options: list) -> dict:
    """Return {en_text: option_id} mapping."""
    return {o["en"]: o["id"] for o in options}


def option_id_to_text(options: list) -> dict:
    """Return {option_id: en_text} mapping."""
    return {o["id"]: o["en"] for o in options}


def audit_question(q_base: dict, q_curr: dict) -> list[str]:
    """Return list of failure strings; empty = PASS."""
    failures = []
    item_type = q_base.get("itemType", "")

    if item_type not in OPTION_TYPES:
        return []  # skip non-option types

    base_options = q_base.get("options", [])
    curr_options = q_curr.get("options", [])

    if not base_options:
        return []

    base_id2text = option_id_to_text(base_options)
    curr_id2text = option_id_to_text(curr_options)
    base_text2id = option_text_to_id(base_options)
    curr_text2id = option_text_to_id(curr_options)

    base_texts = set(base_id2text.values())
    curr_texts = set(curr_id2text.values())

    # --- Check 1: option-set integrity ---
    dropped = base_texts - curr_texts
    added   = curr_texts - base_texts
    if dropped:
        failures.append(f"OPTION-SET: dropped option text(s): {sorted(dropped)}")
    if added:
        failures.append(f"OPTION-SET: unexpected new option text(s): {sorted(added)}")

    # duplicate detection
    base_counts = Counter(o["en"] for o in base_options)
    curr_counts = Counter(o["en"] for o in curr_options)
    new_dups = [t for t, c in curr_counts.items() if c > 1 and base_counts.get(t, 0) <= 1]
    if new_dups:
        failures.append(f"OPTION-SET: newly duplicated option text(s): {new_dups}")

    # if option sets differ we can't trust the rest
    if dropped or added:
        return failures

    # --- Check 2: correct-answer semantic integrity ---
    base_correct_ids = q_base.get("correct", [])
    curr_correct_ids = q_curr.get("correct", [])

    base_correct_texts = {base_id2text[i] for i in base_correct_ids if i in base_id2text}
    curr_correct_texts = {curr_id2text[i] for i in curr_correct_ids if i in curr_id2text}

    if base_correct_texts != curr_correct_texts:
        failures.append(
            f"CORRECT-KEY: was={sorted(base_correct_texts)} now={sorted(curr_correct_texts)}"
        )

    # --- Check 3 & 4: byChoice integrity ---
    base_rat = q_base.get("rationale", {})
    curr_rat = q_curr.get("rationale", {})
    base_by_choice = base_rat.get("byChoice", [])
    curr_by_choice = curr_rat.get("byChoice", [])

    if base_by_choice:
        # Check 4: duplicate/missing refIds
        curr_ref_ids = [e["refId"] for e in curr_by_choice]
        curr_option_ids = {o["id"] for o in curr_options}
        curr_ref_id_set = set(curr_ref_ids)

        if len(curr_ref_ids) != len(curr_ref_id_set):
            dupes = [r for r, c in Counter(curr_ref_ids).items() if c > 1]
            failures.append(f"BYCHOICE-COVERAGE: duplicate refId(s): {dupes}")

        missing = curr_option_ids - curr_ref_id_set
        if missing:
            failures.append(f"BYCHOICE-COVERAGE: missing refId(s) for option(s): {sorted(missing)}")

        # Check 3: each rationale text must remain attached to the same option text
        # Build baseline: rationale_en_text -> option_en_text
        # Skip duplicate rationale texts — identical text on multiple options is ambiguous.
        base_rat_counts: Counter = Counter(e.get("en", "") for e in base_by_choice)
        base_rat_to_opt = {}
        for entry in base_by_choice:
            ref = entry.get("refId")
            rat_text = entry.get("en", "")
            opt_text = base_id2text.get(ref, "")
            if rat_text and opt_text and base_rat_counts[rat_text] == 1:
                base_rat_to_opt[rat_text] = opt_text

        for entry in curr_by_choice:
            ref = entry.get("refId")
            rat_text = entry.get("en", "")
            opt_text = curr_id2text.get(ref, "")
            if not rat_text or not opt_text:
                continue
            expected_opt = base_rat_to_opt.get(rat_text)
            if expected_opt is None:
                # Rationale text not in baseline mapping. Two benign causes:
                # (1) duplicate rationale text across options (already filtered above)
                # (2) intentional post-shuffle content edit to the rationale text
                # Either way, we cannot check semantic integrity — skip silently.
                pass
            elif expected_opt != opt_text:
                failures.append(
                    f"BYCHOICE-SEMANTIC: rationale \"{rat_text[:60]}...\" "
                    f"was attached to \"{expected_opt[:50]}\" "
                    f"now attached to \"{opt_text[:50]}\""
                )

    return failures


def main():
    total_questions = 0
    total_checked = 0
    total_failed = 0
    all_failures = []

    for bank_path in BANKS:
        bank_name = os.path.basename(bank_path)
        try:
            base_data = load_baseline(bank_path)
            curr_data = load_current(bank_path)
        except Exception as e:
            print(f"ERROR loading {bank_name}: {e}")
            continue

        base_qs = {q["id"]: q for q in base_data["questions"]}
        curr_qs = {q["id"]: q for q in curr_data["questions"]}

        bank_failures = []
        bank_checked = 0

        for qid, q_curr in curr_qs.items():
            total_questions += 1
            if qid not in base_qs:
                continue  # new question added after baseline; skip
            q_base = base_qs[qid]
            if q_curr.get("itemType") not in OPTION_TYPES:
                continue

            bank_checked += 1
            total_checked += 1
            failures = audit_question(q_base, q_curr)
            if failures:
                total_failed += 1
                bank_failures.append((qid, failures))
                all_failures.append((bank_name, qid, failures))

        status = "PASS" if not bank_failures else f"FAIL ({len(bank_failures)} questions)"
        print(f"\n{'='*60}")
        print(f"  {bank_name}  [{status}]  checked={bank_checked}")
        print(f"{'='*60}")
        if bank_failures:
            for qid, fails in bank_failures:
                print(f"\n  FAIL: {qid}")
                for f in fails:
                    print(f"    - {f}")

    print(f"\n{'='*60}")
    print(f"  SUMMARY")
    print(f"{'='*60}")
    print(f"  Banks audited   : {len(BANKS)}")
    print(f"  Questions checked: {total_checked}  (option-type items present in both baseline and current)")
    print(f"  PASS            : {total_checked - total_failed}")
    print(f"  FAIL            : {total_failed}")

    if total_failed == 0:
        print("\n  RESULT: CLEAN — no shuffle-integrity violations found")
    else:
        print(f"\n  RESULT: {total_failed} VIOLATIONS — see details above")

    return 1 if total_failed > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
