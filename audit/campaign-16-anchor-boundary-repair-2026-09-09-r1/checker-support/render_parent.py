#!/usr/bin/env python3
"""Checker-owned parent renderer. Reads ONLY the commission source-packets/
directory (allowlisted). Renders a complete parent case in both learner-facing
languages so the checker can derive the earliest answerability boundary.

Usage: render_parent.py <packetId> [parentIndex]
"""
import json, os, sys

C = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.join(C, "source-packets")

def tp(v, lang):
    if v is None: return ""
    if isinstance(v, str): return v
    if isinstance(v, dict): return v.get(lang, "") or ""
    return str(v)

def both(label, v, ind=""):
    en, zh = tp(v, "en"), tp(v, "zh")
    if not en and not zh: return
    print(f"{ind}{label} [EN]: {en}")
    if zh: print(f"{ind}{label} [ZH]: {zh}")

def exhibit(e, ind):
    print(f"{ind}- exhibit id={e.get('id')} type={e.get('type','-')}")
    both("  title", e.get("title"), ind)
    both("  content", e.get("content"), ind)
    if e.get("visual"):
        print(f"{ind}  visual: kind={e['visual'].get('kind')} "
              f"{json.dumps(e['visual'], ensure_ascii=False)[:1200]}")
    sm = e.get("structuredMeasurements")
    if sm:
        # compact: panels duplicate the narrative text, so summarise key=value
        bits = []
        for panel in sm.get("panels", []):
            cols = {c["id"]: tp(c.get("label"), "en") for c in panel.get("columns", [])}
            for r in panel.get("rows", []):
                for v in r.get("values", []):
                    bits.append(f"{r.get('key')}[{cols.get(v.get('columnId'), '')}]="
                                f"{v.get('value')}{v.get('unit', '')}"
                                + (f"({v['context']})" if v.get("context") else ""))
        print(f"{ind}  structuredMeasurements: " + "; ".join(bits)[:1500])

def render(pkt, parent, affected):
    cs = parent["caseStudy"]
    print("=" * 100)
    print(f"PACKET {pkt['repairPacketId']}  BANK {pkt['bankPath']}")
    print(f"PARENT {parent['id']}   (category={parent.get('category')}, topic={parent.get('topic')}, difficulty={parent.get('difficulty')})")
    print("=" * 100)
    both("CASE TITLE", cs.get("title"))
    if cs.get("summary"): both("CASE SUMMARY", cs.get("summary"))
    if parent.get("stem"): both("PARENT STEM", parent.get("stem"))
    print(f"\n--- BASELINE-VISIBLE GLOBAL EXHIBITS ({len(cs.get('exhibits') or [])}) ---")
    for e in cs.get("exhibits") or []:
        exhibit(e, "")
    stages = cs.get("stages") or []
    print(f"\n--- DECLARED STAGES ({len(stages)}) ---")
    for i, s in enumerate(stages):
        print(f"\n[STAGE {i}] id={s['id']}  timeOffset={s.get('timeOffset','-')}")
        both("  title", s.get("title"))
        both("  trigger", s.get("trigger"))
        both("  narrative", s.get("narrative"))
        for e in s.get("exhibits") or []:
            exhibit(e, "  ")
    print(f"\n--- PARTS ({len(cs['questions'])}) ---")
    only_aff = os.environ.get("AFFECTED_ONLY") == "1"
    for i, q in enumerate(cs["questions"]):
        is_aff = q["id"] in affected
        if only_aff and not is_aff:
            print(f"\n[PART {i}] id={q['id']} (not in frozen population - skipped) "
                  f"itemType={q.get('itemType')} anchors="
                  f"{'aASI' if 'answerableAfterStageId' in q else '-'}/"
                  f"{q.get('stageId','-')}")
            continue
        mark = "***AFFECTED***" if is_aff else "(not in frozen population)"
        print(f"\n[PART {i}] id={q['id']} {mark}")
        print(f"  itemType={q.get('itemType')} ngnSkill={q.get('ngnSkill')} topic={q.get('topic')}")
        print(f"  existing anchors: answerableAfterStageId="
              f"{json.dumps(q.get('answerableAfterStageId'), ensure_ascii=False) if 'answerableAfterStageId' in q else 'ABSENT'}"
              f"  stageId={q.get('stageId','ABSENT')}")
        both("  stem", q.get("stem"), "")
        for o in q.get("options") or []:
            print(f"    opt {o.get('id')}: [EN] {tp(o,'en')}")
            if tp(o, "zh"): print(f"            [ZH] {tp(o,'zh')}")
        KNOWN = {"id","itemType","category","topic","difficulty","ngnSkill","stem",
                 "options","correct","rationale","testTakingStrategy","glossary",
                 "answerableAfterStageId","stageId","source","tags","reference"}
        for k, v in q.items():
            if k in KNOWN:
                continue
            print(f"    {k}: {json.dumps(v, ensure_ascii=False, indent=1)[:6000]}")
        print(f"    CORRECT (answer key, not learner-visible): {json.dumps(q.get('correct'), ensure_ascii=False)}")
        r = q.get("rationale") or {}
        if isinstance(r, dict) and r.get("correct"):
            print(f"    rationale.correct [EN] (design intent, NOT learner-visible): {tp(r['correct'],'en')}")
            zh = tp(r['correct'], 'zh')
            if zh: print(f"    rationale.correct [ZH]: {zh}")

def main():
    pid = sys.argv[1]
    pkt = json.load(open(os.path.join(SP, pid + ".json"), encoding="utf-8"))
    affected = {}
    for r in pkt["inventoryRows"]:
        affected.setdefault(r["parentCaseId"], set()).add(r["partId"])
    parents = pkt["parents"]
    if len(sys.argv) > 2:
        parents = [parents[int(sys.argv[2])]]
    for p in parents:
        render(pkt, p, affected.get(p["id"], set()))

main()
