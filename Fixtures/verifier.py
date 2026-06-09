#!/usr/bin/env python3
"""
Shuffle & Rationale-Repair Verifier
Spec: Fixtures/shuffle-verification-spec.md
BEFORE: c7287c3 (parent of b674052, Gemini's shuffle commit)
"""
import json, re, subprocess, sys, unicodedata
from collections import Counter
from scipy.stats import chisquare

REPO = "/Users/holemini/Desktop/Project Shrimp"
BANK_PATHS = [
    "banks/capnography-canonical.json",
    "banks/claude-canonical.json",
    "banks/gemini-canonical.json",
    "banks/gpt-canonical.json",
    "banks/hard-cases-canonical.json",
    "banks/visual-canonical.json",
    "banks/vitals-canonical.json",
]
BEFORE_SHA = "c7287c3"


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def chash(text: str) -> str:
    """Deterministic content hash: NFKC-normalize, strip, collapse ws, casefold."""
    t = unicodedata.normalize("NFKC", text or "").strip()
    return re.sub(r"\s+", " ", t).casefold()


def load_git(sha: str, rel_path: str):
    r = subprocess.run(
        ["git", "-C", REPO, "show", f"{sha}:{rel_path}"],
        capture_output=True, text=True, encoding="utf-8",
    )
    return json.loads(r.stdout) if r.returncode == 0 else None


def load_file(rel_path: str):
    with open(f"{REPO}/{rel_path}", encoding="utf-8") as f:
        return json.load(f)


def extract_items(data) -> list:
    if isinstance(data, list):
        return data
    for k in ("questions", "items", "bank"):
        if k in data:
            return data[k]
    return list(data.values())


def is_standard_mcq(item) -> bool:
    """True only for items with A/B/C/D options and string-list correct key."""
    opts = item.get("options")
    if not opts or not isinstance(opts, list):
        return False
    correct = item.get("correct")
    if not correct or not isinstance(correct, list):
        return False
    if any(not isinstance(c, str) for c in correct):
        return False
    letters = {o.get("id", "") for o in opts}
    return bool(letters & {"A", "B", "C", "D"})


def opt_hashes(item) -> list:
    """List of content-hashes for all options (order-preserved)."""
    return [chash((o.get("en") or "") + " " + (o.get("zh") or ""))
            for o in item.get("options", [])]


def correct_hashes(item) -> frozenset:
    """Content-hashes of the item's correct option(s)."""
    correct_ids = set(item.get("correct", []))
    return frozenset(
        chash((o.get("en") or "") + " " + (o.get("zh") or ""))
        for o in item.get("options", [])
        if o["id"] in correct_ids
    )


def rationale_texts(item) -> list:
    """Collect all rationale text strings (en + zh)."""
    texts = []
    r = item.get("rationale", {})
    if isinstance(r, str):
        return [r]
    if isinstance(r, dict):
        for k, v in r.items():
            if k == "byChoice":
                for entry in (v or []):
                    if entry.get("en"): texts.append(entry["en"])
                    if entry.get("zh"): texts.append(entry["zh"])
            elif isinstance(v, dict):
                texts.extend(x for x in v.values() if x)
            elif isinstance(v, str) and v:
                texts.append(v)
    return texts


# ---------------------------------------------------------------------------
# C5 — letter-claim patterns (English + Simplified Chinese)
# ---------------------------------------------------------------------------
# Matches "option A is correct", "A is the correct answer", "answer is A",
# "the correct answer is A", "A is the best choice", etc.
_C5_EN = re.compile(
    r'\b(?:'
    r'(?:the\s+)?(?:correct|right|best)\s+(?:answer|choice|option)\s+is\s+([A-D])'
    r'|(?:answer|option|choice)\s+([A-D])\s+is\s+(?:the\s+)?(?:correct|right|best|answer)'
    r'|([A-D])\s+is\s+(?:the\s+)?(?:correct|right|best)\s+(?:answer|choice|option|response)?'
    r'|([A-D])\s+is\s+(?:the\s+)?(?:correct|right|best)[,\.\s]'
    r')\b',
    re.IGNORECASE,
)
# 选项A是正确 / 答案是A / A是正确答案
_C5_ZH = re.compile(
    r'(?:选项|答案[是为：:\s]*)([A-D])\s*(?:是正确|是最佳|是答案|是最好|正确)'
    r'|([A-D])\s*(?:是正确|是最佳|是答案|是最好答案)',
    re.IGNORECASE,
)


def extract_letter_claims(text: str) -> list:
    letters = []
    for m in _C5_EN.finditer(text):
        g = next(g for g in m.groups() if g)
        letters.append(g.upper())
    for m in _C5_ZH.finditer(text):
        g = m.group(1) or m.group(2)
        if g:
            letters.append(g.upper())
    return letters


# ---------------------------------------------------------------------------
# C6 — positional-reference patterns
# ---------------------------------------------------------------------------
_C6_EN = re.compile(
    r'\b(?:option\s+[A-D]|answer\s+[A-D]|choice\s+[A-D]'
    r'|[A-D]\s+option|[A-D]\s+choice'
    r'|(?:the\s+)?(?:first|second|third|fourth|last)\s+(?:option|choice|answer)'
    r'|option\s+(?:above|below|preceding)|(?:above|below)\s+option)\b',
    re.IGNORECASE,
)
_C6_ZH = re.compile(
    r'选项\s*[A-D]|[A-D]\s*选项|[A-D]\s*是(?:正确|错误|最佳)'
    r'|第[一二三四]\s*(?:个|项|选项)|最后\s*(?:一个|一项|选项)'
    r'|以上|上述|前述|下述|下列|上面的选项|下面的选项',
)


def has_positional_ref(text: str) -> bool:
    return bool(_C6_EN.search(text) or _C6_ZH.search(text))


# ---------------------------------------------------------------------------
# C7 — byChoice refId cross-check (deterministic structural check)
# ---------------------------------------------------------------------------
# A byChoice entry with refId=X that explains "why correct" but X is NOT in
# item.correct (or "why incorrect" but X IS in correct) is stale.
_CORRECT_LANGUAGE_EN = re.compile(
    r'\b(?:correct|right|best|appropriate|should|must|is\s+the\s+answer)\b',
    re.IGNORECASE,
)
_INCORRECT_LANGUAGE_EN = re.compile(
    r'\b(?:incorrect|wrong|not\s+(?:the\s+)?(?:correct|right|best|appropriate)'
    r'|would\s+(?:not|never)|should\s+not|must\s+not|does\s+not|contraindicated)\b',
    re.IGNORECASE,
)


def check_c7_item(item) -> bool:
    """Return True if this item has a deterministically detectable C7 inconsistency."""
    correct_ids = set(item.get("correct", []))
    r = item.get("rationale", {})
    if not isinstance(r, dict):
        return False
    valid_ids = {o["id"] for o in item.get("options", [])}
    for entry in r.get("byChoice", []) or []:
        ref = (entry.get("refId") or "").upper()
        if not ref:
            continue
        if ref not in valid_ids:
            # refId points to a non-existent option letter — stale structural ref
            return True
        en_text = entry.get("en", "") or ""
        has_correct = bool(_CORRECT_LANGUAGE_EN.search(en_text))
        has_incorrect = bool(_INCORRECT_LANGUAGE_EN.search(en_text))
        if has_correct and not has_incorrect and ref not in correct_ids:
            return True
        if has_incorrect and not has_correct and ref in correct_ids:
            return True
    return False


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main():
    before_all: dict = {}
    after_all: dict = {}

    for path in BANK_PATHS:
        after_data = load_file(path)
        before_data = load_git(BEFORE_SHA, path)

        for item in extract_items(after_data):
            after_all[item["id"]] = item
        if before_data:
            for item in extract_items(before_data):
                before_all[item["id"]] = item
        else:
            print(f"WARNING: could not load BEFORE for {path}", file=sys.stderr)

    # filter to standard MCQ only (skip matrix, case-study, etc.)
    before_all = {k: v for k, v in before_all.items() if is_standard_mcq(v)}
    after_all  = {k: v for k, v in after_all.items()  if is_standard_mcq(v)}

    matched = sorted(set(before_all) & set(after_all))
    only_before = sorted(set(before_all) - set(after_all))
    only_after = sorted(set(after_all) - set(before_all))
    mode = "primary" if before_all else "fallback"

    # C1 — option-set integrity
    c1_fails = [
        iid for iid in matched
        if Counter(opt_hashes(before_all[iid])) != Counter(opt_hashes(after_all[iid]))
    ]

    # C2 — key-content stability
    c2_fails = [
        iid for iid in matched
        if correct_hashes(before_all[iid]) != correct_hashes(after_all[iid])
    ]

    # C3 — movement sanity
    changed = sum(
        1 for iid in matched
        if tuple(opt_hashes(before_all[iid])) != tuple(opt_hashes(after_all[iid]))
    )
    pct_changed = changed / len(matched) * 100 if matched else 0.0
    c3_flag = pct_changed < 50

    # C4 — correct-position uniformity
    pos_counter: Counter = Counter()
    for item in after_all.values():
        for c in item.get("correct", []):
            pos_counter[c.upper()] += 1
    hist = {k: pos_counter.get(k, 0) for k in "ABCD"}
    total = sum(hist.values())
    if total >= 20:
        obs = [hist[k] for k in "ABCD"]
        _, p_val = chisquare(obs)
        maxdev = max(abs(hist[k] / total - 0.25) * 100 for k in "ABCD")
        c4_fail = p_val < 0.01 and maxdev > 8
        c4_status = "FAIL" if c4_fail else "PASS"
    else:
        p_val = maxdev = None
        c4_status = "INSUFFICIENT"

    # C5 — letter-claim stale
    c5_fails = []
    for iid in sorted(after_all):
        item = after_all[iid]
        correct_set = {c.upper() for c in item.get("correct", [])}
        for text in rationale_texts(item):
            for letter in extract_letter_claims(text):
                if letter not in correct_set:
                    c5_fails.append(iid)
                    break
            else:
                continue
            break

    # C6 — positional references
    c6_items = [
        iid for iid in sorted(after_all)
        if any(has_positional_ref(t) for t in rationale_texts(after_all[iid]))
    ]

    # C7 — content-ref inconsistency (deterministic)
    c7_items = [
        iid for iid in sorted(after_all)
        if check_c7_item(after_all[iid])
    ]
    escalated = min(len(c7_items), 20)

    # --- report ---
    print(f"MODE: {mode}")
    print(f"items: matched={len(matched)}  only_before={len(only_before)}  only_after={len(only_after)}")
    if only_before:
        print(f"  only_before (first 5): {only_before[:5]}")
    if only_after:
        print(f"  only_after  (first 5): {only_after[:5]}")
    print(f"C1 option-set integrity:    {'PASS' if not c1_fails else 'FAIL'}  (fails: {c1_fails[:10]})")
    print(f"C2 key-content stability:   {'PASS' if not c2_fails else 'FAIL'}  (fails: {c2_fails[:20]})")
    print(f"C3 movement:                changed={pct_changed:.1f}%  (flag: {'y' if c3_flag else 'n'})")
    if p_val is not None:
        print(f"C4 position uniformity:     {c4_status}  hist={hist}  p={p_val:.4f}  maxdev={maxdev:.1f}pp")
    else:
        print(f"C4 position uniformity:     {c4_status}  hist={hist}")
    print(f"C5 letter-claim stale:      {'PASS' if not c5_fails else 'FAIL'}  (fails: {c5_fails[:20]})")
    print(f"C6 positional refs (hazard): count={len(c6_items)}  (ids: {c6_items[:10]})")
    print(f"C7 content-ref inconsistent: count={len(c7_items)}  escalated={escalated}")
    if c7_items:
        print(f"  C7 item ids (first 10): {c7_items[:10]}")

    overall_fail = bool(c1_fails or c2_fails or c4_status == "FAIL" or c5_fails)
    print(f"OVERALL: {'FAIL' if overall_fail else 'PASS'}")


if __name__ == "__main__":
    main()
