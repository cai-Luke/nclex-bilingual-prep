# Rhythm Strip Smoke Batch Review - 2026-06-06

Source file: `banks/banks-raw/rhythm-smoke-2026-06-06.json`

Promotion target: `banks/rhythm-canonical.json`

## Result

- Reviewed 3 schema v1.2 rhythm-strip items.
- Promoted 3 of 3 into a new top-level canonical rhythm bank.
- Visual specs validated and rendered deterministically through `renderRhythmStripSvg`.
- Answer keys were unchanged.
- One rationale cleanup was applied to the promoted copy.

## Promoted Items

| ID | Item type | Visual rhythm | Decision |
|---|---|---|---|
| `rhy_sinus_brady_001` | `multiple_choice` | `sinus_brady` | Promote |
| `rhy_vtach_001` | `select_all` | `vtach` | Promote with rationale cleanup |
| `rhy_afib_001` | `matrix` | `afib` | Promote |

## Fixes Applied To Promoted Copy

- `rhy_vtach_001`: revised the distractor rationale for synchronized cardioversion. The raw item incorrectly implied that pulseless VT has no R wave to synchronize to. The promoted rationale now teaches the safer distinction: pulseless/apneic status places the client in the cardiac-arrest algorithm, so immediate CPR and unsynchronized defibrillation are indicated; synchronized cardioversion is for selected pulse-present unstable tachycardias.
- `rhy_vtach_001`: softened the adenosine distractor rationale to avoid overbroad wording. It now states that adenosine may be used for selected pulse-present regular tachycardias, especially narrow-complex SVT, but has no role in pulseless cardiac arrest.

## Render Sanity Check

The three promoted visual specs rendered without throwing. Each 6-second strip produced 1,501 sampled waveform points.

| ID | Render hash prefix |
|---|---|
| `rhy_sinus_brady_001` | `c6d7580602c34bf3` |
| `rhy_vtach_001` | `ef4067e5f1f1cc9a` |
| `rhy_afib_001` | `e55cbbf97b8865bc` |

## Source Checks

- Sinus bradycardia item checked against NCBI/StatPearls sinus bradycardia and ECG rhythm interpretation descriptions: sinus rhythm features include regular rhythm with P wave before every QRS; sinus bradycardia is sinus rhythm below 60/min.
- Pulseless VT item checked against the 2025 American Heart Association adult advanced life support guidance and adult cardiac arrest algorithm: VF/pVT is a shockable cardiac-arrest rhythm treated with CPR, early defibrillation, oxygenation/ventilation support, and epinephrine 1 mg IV/IO every 3-5 minutes.
- Atrial fibrillation item checked against Merck Manual Professional: AF has absent organized P waves and an irregularly irregular ventricular rate; pulse deficit and palpitations may occur; clients may present with acute stroke/systemic embolism signs or hemodynamic compromise, especially with rapid ventricular response.

## Sources

- NCBI Bookshelf / StatPearls, "Sinus Bradycardia": https://www.ncbi.nlm.nih.gov/books/NBK493201/
- NCBI Bookshelf / StatPearls, "EKG Rhythm": https://www.ncbi.nlm.nih.gov/books/NBK555952/
- American Heart Association, "2025 Adult Advanced Life Support Guidelines": https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support/
- American Heart Association, "Adult Cardiac Arrest Algorithm (VF/pVT/Asystole/PEA)": https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf
- Merck Manual Professional, "Atrial Fibrillation": https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrial-fibrillation
