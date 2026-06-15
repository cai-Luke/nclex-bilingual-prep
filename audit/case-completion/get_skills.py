import json

def get_skills(file_path, case_id):
    with open(file_path, "r") as f:
        data = json.load(f)
    for q in data["questions"]:
        if q.get("id") == case_id:
            for i, qt in enumerate(q.get("caseStudy", {}).get("questions", [])):
                print("Q" + str(i+1) + ": skill=" + str(qt.get("ngnSkill")) + " id=" + str(qt.get("id")))

get_skills("banks/hard-cases-canonical.json", "opus_car_t_crs_2026_06_11_case_01")
print("---")
get_skills("banks/claude-canonical.json", "opus2_case_code_status_01")
