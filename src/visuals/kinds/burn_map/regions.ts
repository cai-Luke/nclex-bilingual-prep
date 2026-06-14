export type BurnPopulation = "adult" | "pediatric";

export type BurnRegionKey =
  | "head_anterior"
  | "head_posterior"
  | "trunk_anterior"
  | "trunk_posterior"
  | "arm_l_anterior"
  | "arm_l_posterior"
  | "arm_r_anterior"
  | "arm_r_posterior"
  | "leg_l_anterior"
  | "leg_l_posterior"
  | "leg_r_anterior"
  | "leg_r_posterior"
  | "genitalia";

// Pediatric values support rendering and arithmetic, but pediatric content
// remains blocked until an authoritative source is recorded in the U8 audit.
export const TBSA_PCT: Record<BurnPopulation, Record<BurnRegionKey, number>> = {
  adult: {
    head_anterior: 4.5,
    head_posterior: 4.5,
    trunk_anterior: 18,
    trunk_posterior: 18,
    arm_l_anterior: 4.5,
    arm_l_posterior: 4.5,
    arm_r_anterior: 4.5,
    arm_r_posterior: 4.5,
    leg_l_anterior: 9,
    leg_l_posterior: 9,
    leg_r_anterior: 9,
    leg_r_posterior: 9,
    genitalia: 1,
  },
  pediatric: {
    head_anterior: 9,
    head_posterior: 9,
    trunk_anterior: 18,
    trunk_posterior: 18,
    arm_l_anterior: 4.5,
    arm_l_posterior: 4.5,
    arm_r_anterior: 4.5,
    arm_r_posterior: 4.5,
    leg_l_anterior: 6.75,
    leg_l_posterior: 6.75,
    leg_r_anterior: 6.75,
    leg_r_posterior: 6.75,
    genitalia: 1,
  },
};

export const BURN_REGION_KEYS = Object.keys(TBSA_PCT.adult) as BurnRegionKey[];

type View = "anterior" | "posterior";

type Geometry = { view: View; d: string };

export const REGION_GEOMETRY: Record<BurnRegionKey, Geometry> = {
  head_anterior: {
    view: "anterior",
    d: "M 120 49 C 134 49 136 60 135 67 C 134 77 131 85 128 90 L 128 100 L 112 100 L 112 90 C 109 85 106 77 105 67 C 104 60 106 49 120 49 Z",
  },
  head_posterior: {
    view: "posterior",
    d: "M 360 49 C 374 49 376 60 375 67 C 374 77 371 85 368 90 L 368 100 L 352 100 L 352 90 C 349 85 346 77 345 67 C 344 60 346 49 360 49 Z",
  },
  trunk_anterior: {
    view: "anterior",
    d: "M 88 109 L 112 100 L 128 100 L 152 109 Q 150 116 147 124 L 143 166 Q 144 176 151 192 Q 153 199 149 206 L 91 206 Q 87 199 89 192 Q 96 176 97 166 L 93 124 Q 90 116 88 109 Z",
  },
  trunk_posterior: {
    view: "posterior",
    d: "M 328 109 L 352 100 L 368 100 L 392 109 Q 390 116 387 124 L 383 166 Q 384 176 391 192 Q 394 200 390 206 C 386 212 379 216 371 216 C 366 216 363 214 360 211 C 357 214 354 216 349 216 C 341 216 334 212 330 206 Q 326 200 329 192 Q 336 176 337 166 L 333 124 Q 330 116 328 109 Z",
  },
  arm_l_anterior: {
    view: "anterior",
    d: "M 88 109 Q 79 110 78 124 L 81 156 L 84 202 Q 83 211 87 215 L 90 221 Q 92 213 91 204 L 89 156 L 90 124 Q 90 116 88 109 Z",
  },
  arm_l_posterior: {
    view: "posterior",
    d: "M 328 109 Q 319 110 318 124 L 321 156 L 324 202 Q 323 211 327 215 L 330 221 Q 332 213 331 204 L 329 156 L 330 124 Q 330 116 328 109 Z",
  },
  arm_r_anterior: {
    view: "anterior",
    d: "M 152 109 Q 161 110 162 124 L 159 156 L 156 202 Q 157 211 153 215 L 150 221 Q 148 213 149 204 L 151 156 L 150 124 Q 150 116 152 109 Z",
  },
  arm_r_posterior: {
    view: "posterior",
    d: "M 392 109 Q 401 110 402 124 L 399 156 L 396 202 Q 397 211 393 215 L 390 221 Q 388 213 389 204 L 391 156 L 390 124 Q 390 116 392 109 Z",
  },
  leg_l_anterior: {
    view: "anterior",
    d: "M 91 205 L 115 205 L 115 216 L 113 260 L 114 304 L 115 309 Q 117 317 114 318 L 111 318 Q 105 318 105 313 Q 104 308 108 304 L 108 302 Q 101 282 103 260 Q 96 242 93 216 Z",
  },
  leg_l_posterior: {
    view: "posterior",
    d: "M 330 205 C 334 212 341 216 349 216 C 354 216 357 214 360 211 L 356 222 L 353 261 L 354 304 L 355 309 Q 357 317 354 318 L 351 318 Q 345 318 345 313 Q 344 308 348 304 L 348 302 Q 341 283 343 261 Q 336 244 333 222 Z",
  },
  leg_r_anterior: {
    view: "anterior",
    d: "M 149 205 L 125 205 L 125 216 L 127 260 L 126 304 L 125 309 Q 123 317 126 318 L 129 318 Q 135 318 135 313 Q 136 308 132 304 L 132 302 Q 139 282 137 260 Q 144 242 147 216 Z",
  },
  leg_r_posterior: {
    view: "posterior",
    d: "M 390 205 C 386 212 379 216 371 216 C 366 216 363 214 360 211 L 364 222 L 367 261 L 366 304 L 365 309 Q 363 317 366 318 L 369 318 Q 375 318 375 313 Q 376 308 372 304 L 372 302 Q 379 283 377 261 Q 384 244 387 222 Z",
  },
  genitalia: {
    view: "anterior",
    d: "M 114 205 L 126 205 L 120 214 Z",
  },
};

export const BODY_INK: Record<View, string> = {
  anterior: '<path d="M 99 110 Q 120 115 141 110"/><path d="M 120 116 L 120 164" opacity="0.55"/><path d="M 98 160 Q 120 156 142 160"/><path d="M 93 200 L 114 206"/><path d="M 147 200 L 126 206"/><path d="M 82 157 L 89 157" opacity="0.6"/><path d="M 103 258 Q 109 261 113 259" opacity="0.6"/><path d="M 158 157 L 151 157" opacity="0.6"/><path d="M 137 258 Q 131 261 127 259" opacity="0.6"/>',
  posterior: '<path d="M 339 110 Q 360 115 381 110"/><path d="M 360 116 L 360 196" opacity="0.55"/><path d="M 338 160 Q 360 156 382 160"/><path d="M 360 204 L 360 211"/><path d="M 360 211 C 355 214 351 216 346 216"/><path d="M 360 211 C 365 214 369 216 374 216"/><path d="M 322 157 L 329 157" opacity="0.6"/><path d="M 343 259 Q 349 262 353 260" opacity="0.6"/><path d="M 398 157 L 391 157" opacity="0.6"/><path d="M 377 259 Q 371 262 367 260" opacity="0.6"/>',
};

export const renderRegionShape = (
  key: BurnRegionKey,
  attributes: string,
): string =>
  `<path data-region="${key}" d="${REGION_GEOMETRY[key].d}" ${attributes}/>`;
