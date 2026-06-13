import json
import os

gpt_items = [
    "gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2",
    "gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1",
    "gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1",
    "gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2",
    "gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09",
    "gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10",
    "gpt_2026_06_13_case_delirium_uti_01_q1",
    "gpt_2026_06_13_case_delirium_uti_01_q4"
]

gemini_items = ["fhr_gemini_smoke_2026_06_13_06"]
io_items = ["io_matrix_prerenal_aki_recheck_04"]

def swap_c1_c2(question):
    swapped = 0
    if "correct" in question and isinstance(question["correct"], list):
        for ans in question["correct"]:
            if "columnIds" in ans:
                new_col_ids = []
                for cid in ans["columnIds"]:
                    if cid == "c1":
                        new_col_ids.append("c2")
                    elif cid == "c2":
                        new_col_ids.append("c1")
                    else:
                        new_col_ids.append(cid)
                if ans["columnIds"] != new_col_ids:
                    ans["columnIds"] = new_col_ids
                    swapped += 1
    return swapped

def patch_bank(bank_path, target_ids):
    if not os.path.exists(bank_path):
        print(f"File not found: {bank_path}")
        return

    with open(bank_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_swapped = 0
    for item in data.get("questions", []):
        if item.get("itemType") == "case_study":
            for q in item.get("caseStudy", {}).get("questions", []):
                if q.get("id") in target_ids:
                    total_swapped += swap_c1_c2(q)
        else:
            if item.get("id") in target_ids:
                total_swapped += swap_c1_c2(item)

    if total_swapped > 0:
        with open(bank_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Patched {bank_path} (swapped {total_swapped} entries)")
    else:
        print(f"No targets found or no changes needed in {bank_path}")

base_dir = "/Users/holemini/Desktop/Project Shrimp/banks"
patch_bank(os.path.join(base_dir, "gpt-canonical.json"), gpt_items)
patch_bank(os.path.join(base_dir, "gemini-canonical.json"), gemini_items)
patch_bank(os.path.join(base_dir, "io-canonical.json"), io_items)
