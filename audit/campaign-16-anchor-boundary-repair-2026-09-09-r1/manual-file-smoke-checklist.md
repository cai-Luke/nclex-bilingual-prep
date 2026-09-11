# R4 final production file smoke — external witness

Open `/Users/holemini/Desktop/Project Shrimp/dist/index.html` directly in Chrome or another external browser. Confirm the address uses `file://`. Do not rebuild or modify the build.

Frozen aggregate build SHA-256: `d0d36ea66c237c02ba8281cfe1e209d4b1410737bff8596e0f75902014f1665c`

Index SHA-256: `db4c65c9309ec2ef77da3adb3ab329b811b8d19e31707c11db29466567cf5463`

1. Confirm the app renders and the bundled Library loads. Open a library question in practice, then return to Library.
2. Open **Settings → Open Preview Lab**. Choose **Case studies** and **Postpartum Depression With Intrusive Thoughts of Infant Harm** (`opus22_case_postpartum_intrusive_thoughts_01`). Keep **Show all stages** off and use **Live** mode.
3. Choose **Part 1** (`..._q1`). Confirm the global title/summary/context remains visible, the diagnostic says **visible stages: 0**, and no **Updates** section is rendered. The primary boundary diagnostic should show `{"kind":"baseline"}`.
4. Choose **Part 3** (`..._q3`). Confirm the diagnostic says **visible stages: 2** and `answerableAfterStageId: stage_2_follow_up`. The Updates section must contain Stage 1 and Stage 2, with Stage 3 absent.
5. Report witness, approximate time, browser/version if known, and PASS/FAIL for the four criteria: app/bundled load; library/practice navigation; baseline global context with zero Updates; stage prefix of exactly two updates. Confirm this was the current frozen production file above, without rebuilding.

This is an external production smoke, not architect conformance review. The implementation seat will recheck the full build-tree digest after the observation. Browser automation was blocked by its file-URL security policy; no alternate automation route was attempted.
