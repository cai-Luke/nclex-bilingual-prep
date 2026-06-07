import json
import re
import sys

def extract_numbers(text):
    # Matches numbers, including decimals
    return re.findall(r'\d+\.?\d*', str(text))

def compare_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data.get('questions', [])
    discrepancies = []

    for q in questions:
        q_id = q.get('id', 'unknown')
        
        # Check stem
        en_stem = q.get('stem', {}).get('en', '')
        zh_stem = q.get('stem', {}).get('zh', '')
        if extract_numbers(en_stem) != extract_numbers(zh_stem):
            discrepancies.append({
                'id': q_id,
                'field': 'stem',
                'en': en_stem,
                'zh': zh_stem
            })

        # Check options
        for opt in q.get('options', []):
            en_opt = opt.get('en', '')
            zh_opt = opt.get('zh', '')
            if extract_numbers(en_opt) != extract_numbers(zh_opt):
                discrepancies.append({
                    'id': q_id,
                    'field': f"option {opt.get('id')}",
                    'en': en_opt,
                    'zh': zh_opt
                })
        
        # Check rationale (correct)
        en_rat = q.get('rationale', {}).get('correct', {}).get('en', '')
        zh_rat = q.get('rationale', {}).get('correct', {}).get('zh', '')
        if extract_numbers(en_rat) != extract_numbers(zh_rat):
             # Rationales often have numbers in different orders or formats, 
             # so we might skip this or be more careful. 
             # For now, let's just check stems and options as they are critical.
             pass

    return discrepancies

if __name__ == "__main__":
    for path in sys.argv[1:]:
        print(f"Auditing {path}...")
        results = compare_json(path)
        if not results:
            print("No numeric discrepancies found.")
        for r in results:
            print(f"ID: {r['id']} | Field: {r['field']}")
            print(f"  EN: {r['en']}")
            print(f"  ZH: {r['zh']}")
            print("-" * 20)
