# burn-map-polish-codex-spec.md

Codex revision spec for the burn_map SVG — **revision 2 (geometry + internal-line fix)**.
The structural redesign from revision 1 is already applied (abducted arms, lightened outline, decoupled tests). This revision corrects three issues found on visual review of the pre-implementation render:

1. **Trapezius bulge** — the shoulder yoke rose too tall/wide and read as trapezius hypertrophy. Fixed by flattening the neck-to-shoulder slope and lowering the shoulder partition to y=120.
2. **Breast-ambiguous anterior contour** — the anterior internal curve read as breast/pectoralis. Removed; the anterior carries no internal line.
3. **Vague buttocks** — the posterior lost the clear glute definition the old contours had. Restored with a spine line, a central gluteal cleft, and two buttock-fold curves.

**All geometry below was raster-verified for proportion before handoff. Drop it in verbatim — do not re-proportion or redraw.** Only two blocks change versus what is now on disk: `REGION_GEOMETRY` (Step 1) and `BODY_INK` (Step 2). Steps 3 and 4 from revision 1 (lighter `#64748b`/1.0 outline; the test decoupling) are already correct and unchanged — leave them.

## Files

- `src/visuals/kinds/burn_map/regions.ts` (both blocks below)

No change this revision to `index.ts`, `scripts/tests/burn-map.ts`, `TBSA_PCT`, `selfCheckBurnMap`, `validateBurnMap`, `regionAttributes`, fixtures, or the registry.

---

## Step 1 — Replace REGION_GEOMETRY (regions.ts)

Replace the entire `export const REGION_GEOMETRY: Record<BurnRegionKey, Geometry> = { ... };` block with exactly this:

```ts
export const REGION_GEOMETRY: Record<BurnRegionKey, Geometry> = {
  head_anterior: {
    view: "anterior",
    d: "M 120 49 C 134 49 137 61 136 69 C 135 80 131 88 128 92 L 128 102 L 112 102 L 112 92 C 109 88 105 80 104 69 C 103 61 106 49 120 49 Z",
  },
  head_posterior: {
    view: "posterior",
    d: "M 360 49 C 374 49 377 61 376 69 C 375 80 371 88 368 92 L 368 102 L 352 102 L 352 92 C 349 88 345 80 344 69 C 343 61 346 49 360 49 Z",
  },
  trunk_anterior: {
    view: "anterior",
    d: "M 112 102 Q 106 104 100 110 Q 95 115 90 120 L 150 120 Q 145 115 140 110 Q 134 104 128 102 Z M 90 120 L 150 120 L 147 134 L 144 172 Q 145 184 150 202 L 148 210 L 92 210 Q 90 202 95 184 L 96 172 L 93 134 Z",
  },
  trunk_posterior: {
    view: "posterior",
    d: "M 352 102 Q 346 104 340 110 Q 335 115 330 120 L 390 120 Q 385 115 380 110 Q 374 104 368 102 Z M 330 120 L 390 120 L 387 134 L 384 172 Q 385 184 390 202 L 388 210 L 332 210 Q 330 202 335 184 L 336 172 L 333 134 Z",
  },
  arm_l_anterior: {
    view: "anterior",
    d: "M 90 120 Q 80 124 76 136 L 68 170 L 61 200 Q 58 208 58 213 Q 58 219 63 219 Q 68 218 69 213 L 71 202 L 80 172 L 88 138 L 93 134 L 90 120 Z",
  },
  arm_l_posterior: {
    view: "posterior",
    d: "M 330 120 Q 320 124 316 136 L 308 170 L 301 200 Q 298 208 298 213 Q 298 219 303 219 Q 308 218 309 213 L 311 202 L 320 172 L 328 138 L 333 134 L 330 120 Z",
  },
  arm_r_anterior: {
    view: "anterior",
    d: "M 150 120 Q 160 124 164 136 L 172 170 L 179 200 Q 182 208 182 213 Q 182 219 177 219 Q 172 218 171 213 L 169 202 L 160 172 L 152 138 L 147 134 L 150 120 Z",
  },
  arm_r_posterior: {
    view: "posterior",
    d: "M 390 120 Q 400 124 404 136 L 412 170 L 419 200 Q 422 208 422 213 Q 422 219 417 219 Q 412 218 411 213 L 409 202 L 400 172 L 392 138 L 387 134 L 390 120 Z",
  },
  leg_l_anterior: {
    view: "anterior",
    d: "M 92 210 L 118 210 L 118 224 Q 117 252 114 270 Q 112 292 114 308 L 116 316 Q 118 321 113 322 L 107 322 Q 102 322 104 316 L 105 308 Q 104 292 102 270 Q 97 242 94 224 Z",
  },
  leg_l_posterior: {
    view: "posterior",
    d: "M 332 210 L 358 210 L 358 224 Q 357 252 354 270 Q 352 292 354 308 L 356 316 Q 358 321 353 322 L 347 322 Q 342 322 344 316 L 345 308 Q 344 292 342 270 Q 337 242 334 224 Z",
  },
  leg_r_anterior: {
    view: "anterior",
    d: "M 148 210 L 122 210 L 122 224 Q 123 252 126 270 Q 128 292 126 308 L 124 316 Q 122 321 127 322 L 133 322 Q 138 322 136 316 L 135 308 Q 136 292 138 270 Q 143 242 146 224 Z",
  },
  leg_r_posterior: {
    view: "posterior",
    d: "M 388 210 L 362 210 L 362 224 Q 363 252 366 270 Q 368 292 366 308 L 364 316 Q 362 321 367 322 L 373 322 Q 378 322 376 316 L 375 308 Q 376 292 378 270 Q 383 242 386 224 Z",
  },
  genitalia: {
    view: "anterior",
    d: "M 118 210 L 122 210 L 120 217 Z",
  },
};
```

Changes vs. on-disk: head base lowered to y=102; trunk shoulder yoke flattened (neck-to-shoulder via gentler `Q` controls, shoulder partition at y=120 instead of 118); arms reattached at the new y=120 shoulder and lengthened ~2px to match. Legs and genitalia unchanged.

---

## Step 2 — Replace BODY_INK (regions.ts)

Replace the entire `export const BODY_INK: Record<View, string> = { ... };` block with:

```ts
export const BODY_INK: Record<View, string> = {
  anterior: "",
  posterior:
    '<path d="M 360 120 L 360 192" opacity="0.45"/>' +
    '<path d="M 360 192 L 360 208" opacity="0.5"/>' +
    '<path d="M 335 194 Q 348 212 360 207" opacity="0.5"/>' +
    '<path d="M 385 194 Q 372 212 360 207" opacity="0.5"/>',
};
```

- Anterior is intentionally empty — any chest contour reads as breast/pectoralis on a front view, which is the ambiguity we are removing. The genitalia notch and the shoulder partition already distinguish the anterior.
- Posterior carries: spine (y120→192), gluteal cleft (y192→208), and two buttock-fold curves meeting at the cleft bottom (x360,y207). All four lines sit above the trunk/leg partition at y210 and are clipped by the existing `burn-posterior-clip` path, so no spill into the legs. Verified: folds curve up toward the hips and do not cross the leg boundary.

The clipped-BODY_INK groups in `index.ts` consume these unchanged; with anterior empty, that group renders nothing on the front, which is correct.

---

## Acceptance

```sh
npm run test-visuals
npm run build
```

Browser check at a `burn_map` fixture. Expected: naturally-sloped shoulders (no trapezius cap), a clean anterior with no chest line, and a posterior clearly readable as a back via spine + central cleft + two rounded buttock folds. Arms abducted, regions cleanly separable, burned regions translucent red, light gray outlines, no numbers/`%` on the body.

> Geometry provenance: revision-2 paths and internal lines raster-verified for proportion and for clip-containment of the buttock folds before handoff. Treat as fixed coordinates; flag a coordinate back rather than redrawing.
