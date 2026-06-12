// Clinical graph-paper primitives: mm/s + mm/mV scaling, grid drawing, and a
// fixed-decimal coordinate formatter. Extracted verbatim from the rhythm-strip
// renderer so coordinate output stays byte-identical across platforms.

export const ECG_SCALE = {
  paperSpeedMmPerSec: 25,
  gainMmPerMv: 10,
  smallBoxMm: 1,
  largeBoxMm: 5,
  pxPerMm: 6,
} as const;

export const pxPerSec = ECG_SCALE.pxPerMm * ECG_SCALE.paperSpeedMmPerSec;
export const pxPerMv = ECG_SCALE.pxPerMm * ECG_SCALE.gainMmPerMv;
export const smallBoxSec = ECG_SCALE.smallBoxMm / ECG_SCALE.paperSpeedMmPerSec;
export const largeBoxSec = ECG_SCALE.largeBoxMm / ECG_SCALE.paperSpeedMmPerSec;

export const secondsToPx = (seconds: number) => seconds * pxPerSec;
export const mvToPx = (mv: number) => mv * pxPerMv;

/**
 * Fixed-decimal coordinate formatter. Rounds to 2 places, then trims trailing
 * zeros so float formatting can never drift between platforms. Route EVERY
 * coordinate number through this before embedding it in an SVG string.
 */
export const fmt = (value: number) => {
  const fixed = value.toFixed(2);
  return fixed.endsWith(".00") ? fixed.slice(0, -3) : fixed.replace(/0$/, "");
};

/**
 * Deterministic display formatter for clinical numeric values. Avoids
 * locale-dependent formatting while keeping large counts readable.
 */
export const fmtNum = (value: number) => {
  if (!Number.isFinite(value)) return String(value);

  const raw = Number.isInteger(value)
    ? String(value)
    : value.toFixed(12).replace(/0+$/, "").replace(/\.$/, "");
  const [integer, decimal] = raw.split(".");
  const sign = integer.startsWith("-") ? "-" : "";
  const digits = sign ? integer.slice(1) : integer;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${grouped}${decimal === undefined ? "" : `.${decimal}`}`;
};

/** Standard positive-dose rounding to a declared number of decimal places. */
export const roundTo = (value: number, places: number) => {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const renderGrid = (width: number, height: number) => {
  const minorStep = ECG_SCALE.pxPerMm;
  const lines: string[] = [];
  for (let x = 0; x <= width; x += minorStep) {
    const major = Math.round(x / minorStep) % ECG_SCALE.largeBoxMm === 0;
    lines.push(
      `<line x1="${fmt(x)}" y1="0" x2="${fmt(x)}" y2="${fmt(height)}" stroke="${major ? "#e9a0ad" : "#f7cbd3"}" stroke-width="${major ? "1" : "0.5"}"/>`,
    );
  }
  for (let y = 0; y <= height; y += minorStep) {
    const major = Math.round(y / minorStep) % ECG_SCALE.largeBoxMm === 0;
    lines.push(
      `<line x1="0" y1="${fmt(y)}" x2="${fmt(width)}" y2="${fmt(y)}" stroke="${major ? "#e9a0ad" : "#f7cbd3"}" stroke-width="${major ? "1" : "0.5"}"/>`,
    );
  }
  return lines.join("");
};
