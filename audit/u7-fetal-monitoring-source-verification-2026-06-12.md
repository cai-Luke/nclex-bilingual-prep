# U7 Fetal Monitoring Source Verification - 2026-06-12

Scope: renderer terminology and mechanical `selfCheck` thresholds only. No fetal-monitoring questions were generated, reviewed, or promoted in this pass.

## Sources

1. Macones GA, Hankins GDV, Spong CY, Hauth J, Moore T. *The 2008 National Institute of Child Health and Human Development workshop report on electronic fetal monitoring: update on definitions, interpretation, and research guidelines.* Obstet Gynecol. 2008;112(3):661-666. DOI: `10.1097/AOG.0b013e3181841395`. PMID: `18757666`.
   - PubMed: https://pubmed.ncbi.nlm.nih.gov/18757666/
   - Accessible report copy used to inspect the definition tables: https://mnhospitals.org/wp-content/uploads/Portals/Documents/patientsafety/Perinatal/National%20Institute%20of%20Child%20%20Human%20Development%20Workshop%20Report%20on%20Electronic%20Fetal%20Monitoring.pdf
2. AWHONN, *Fetal Heart Monitoring Resources*.
   - https://www.awhonn.org/resources-and-information/nurse-resources/fetal-heart-monitoring-resources/
   - The current resource page states that *Fetal Heart Monitoring Principles and Practices, Sixth Edition* continues to use the 2008 NICHD definitions for fetal heart rate and uterine activity terminology.

## Verified mapping

| Renderer rule | Source result | Implementation |
|---|---|---|
| Variability | Absent undetectable; minimal detectable through 5 bpm; moderate 6-25 bpm; marked >25 bpm | Representative deterministic peak-to-trough amplitudes: 0, 4, 14, 32 bpm |
| Gradual onset | Onset to nadir ≥30 seconds | `GRADUAL_MIN_SEC = 30` |
| Abrupt onset | Onset to nadir <30 seconds | Corrected Window 2 placeholder to `ABRUPT_MAX_SEC = 30` with an exclusive comparison |
| Term acceleration | Abrupt rise; peak ≥15 bpm; duration ≥15 seconds | V1 `selfCheck` enforces 15-by-15 and onset-to-peak <30 seconds |
| Pre-32-week acceleration | 10 bpm for 10 seconds | Out of v1 scope because gestational age is not present on the spec |
| Variable deceleration | Abrupt; decrease ≥15 bpm; duration ≥15 seconds and <2 minutes | Enforced in `decelerationPhaseIsValid` |
| Prolonged deceleration | Decrease ≥15 bpm; duration ≥2 minutes and <10 minutes | Enforced in `decelerationPhaseIsValid`; ≥10 minutes is rejected as a baseline change |
| Early deceleration | Gradual, usually symmetrical; nadir occurs at the same time as contraction peak | Coupled to a contraction; renderer tolerance is ±5 seconds |
| Late deceleration | Gradual, usually symmetrical; nadir occurs after contraction peak | Coupled to a contraction; renderer requires a clearly visible 10-90 second lag |

## Renderer-only tolerances

`EARLY_EPS_SEC = 5`, `LATE_LAG_MIN_SEC = 10`, and `LATE_LAG_MAX_SEC = 90` are not claimed as clinical diagnostic thresholds. NICHD defines the qualitative phase relationship. These constants keep deterministic synthetic fixtures visibly distinguishable and reject ambiguous or implausibly displaced phase declarations.

Similarly, variable decelerations omit `contractionIndex` in the data model because they have no fixed phase relationship to a contraction. This is a structural modeling decision, not a claim that variable decelerations cannot occur with contractions.

## Corrections made during verification

- Changed the abrupt onset-to-nadir boundary from the provisional 15 seconds to the sourced `<30 seconds`.
- Added the sourced ≥15 bpm depth requirement to variable and prolonged decelerations.
- Added the sourced 15-by-15 term-acceleration morphology gate.
- Clarified that early/late numeric phase offsets are renderer disambiguation tolerances rather than NICHD thresholds.

## Residual content-lane requirements

The renderer definition gate is source-verified. Every future item must still receive:

- item-specific source review for clinical interpretation and management;
- visual audit confirming the rendered phase and morphology match the declared spec;
- human review confirming the visual is load-bearing and the stem does not name the answer;
- normal raw → review → promote → ledger handling.
