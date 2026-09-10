# Manual production file smoke — Luke

The build is complete and frozen for this observation. This is a production compatibility check, not implementation acceptance or P2 review.

1. In Finder, press Command–Shift–G and enter `/Users/holemini/Desktop/Project Shrimp/dist/`. Open `index.html` in your browser.
2. Confirm the browser address starts with `file://` and ends in `/dist/index.html`. Do not use localhost or the synthetic fixture.
3. Confirm the app shell renders and bundled question content loads.
4. Perform an ordinary action, such as opening the question library or starting practice and navigating to a question.
5. Report whether any path/module/asset loading problem prevented normal use.

Reply with: witness (Luke), time, browser (version if readily available), action performed, PASS/FAIL for the observations, and confirmation that you opened the current file above for the build identified below, without rebuilding or changing it.

Build identity: `0b2e2bce6a5cd964d23749a74512e429da8418cfc124272dfa9fb9ee62d5b925`

Index SHA-256: `92025bdb98ee2ce4019fa08f7bcd7c041b75780e992f1b22d4df08b3b3b87135`

Build capture (UTC): `2026-09-09T03:47:38.433771+00:00`

The complete tree and final source hash manifest are in `production-file-smoke-build-identity.json`. The producer will recheck those hashes after your observation. A screenshot is optional and does not replace the observations.
