import json

def analyze_json(file_path, case_id):
    with open(file_path, "r") as f:
        data = json.load(f)
    print(f"{file_path} type: {type(data)}")
    cases = []
    if isinstance(data, dict):
        if "questions" in data:
            cases = data["questions"]
        elif "items" in data:
            cases = data["items"]
        elif "cases" in data:
            cases = data["cases"]
    elif isinstance(data, list):
        cases = data
        
    case = next((c for c in cases if c.get("id") == case_id), None)
    if not case:
        print(f"Case {case_id} NOT FOUND!")
        return
        
    print(f"\n=== Case: {case_id} ===")
    if case.get("itemType") == "case_study":
        print(f"Case type is {case.get('itemType')}")
        questions = case.get("caseStudy", {}).get("questions", [])
        for i, q in enumerate(questions):
            print(f"Q{i+1}: {q.get('itemType')} ({q.get('id')})")
            if q.get('itemType') == 'bowtie':
                print("  Bowtie actions:", [a.get('id') for a in q.get('options', {}).get('actions', [])])
                print("  Bowtie conditions:", [c.get('id') for c in q.get('options', {}).get('conditions', [])])
                print("  Bowtie parameters:", [p.get('id') for p in q.get('options', {}).get('parameters', [])])
            prompt = q.get("stem", {})
            en_prompt = prompt.get("en", "") if isinstance(prompt, dict) else str(prompt)
            print(f"  Stem: {en_prompt}")
            rationale = q.get("rationale", {}).get("correct", {}).get("en", "")
            print(f"  Rationale: {rationale[:100]}...")
            
analyze_json("banks/hard-cases-canonical.json", "opus_car_t_crs_2026_06_11_case_01")
analyze_json("banks/claude-canonical.json", "opus2_case_code_status_01")
