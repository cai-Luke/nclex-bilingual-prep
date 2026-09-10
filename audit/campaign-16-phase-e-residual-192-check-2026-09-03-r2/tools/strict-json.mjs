export class StrictJsonError extends Error {
  constructor(kind, message, offset = null, key = null) {
    super(message); this.name = "StrictJsonError"; this.kind = kind; this.offset = offset; this.key = key;
  }
}

export function parseStrictJson(source) {
  if (typeof source !== "string") throw new TypeError("source must be a string");
  let i = 0;
  const fail = (message, offset = i) => { throw new StrictJsonError("MALFORMED_JSON", message, offset); };
  const ws = () => { while (i < source.length && /[\u0009\u000a\u000d\u0020]/u.test(source[i])) i += 1; };
  const string = () => {
    const start = i; if (source[i++] !== '"') fail("expected string", start); let out = "";
    while (i < source.length) {
      const c = source[i++];
      if (c === '"') return out;
      if (c === "\\") {
        if (i >= source.length) fail("unterminated escape");
        const e = source[i++];
        const simple = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
        if (Object.hasOwn(simple, e)) out += simple[e];
        else if (e === "u") { const hex = source.slice(i, i + 4); if (!/^[0-9a-fA-F]{4}$/u.test(hex)) fail("invalid unicode escape", i); out += String.fromCharCode(Number.parseInt(hex, 16)); i += 4; }
        else fail("invalid escape", i - 1);
      } else { if (c.charCodeAt(0) < 0x20) fail("unescaped control character", i - 1); out += c; }
    }
    fail("unterminated string", start);
  };
  const number = () => { const start = i; const m = source.slice(i).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/u); if (!m) fail("invalid number", start); i += m[0].length; const n = Number(m[0]); if (!Number.isFinite(n)) fail("non-finite number", start); return n; };
  const value = () => { ws(); const c = source[i]; if (c === '"') return string(); if (c === "{") return object(); if (c === "[") return array(); if (source.startsWith("true", i)) { i += 4; return true; } if (source.startsWith("false", i)) { i += 5; return false; } if (source.startsWith("null", i)) { i += 4; return null; } if (c === "-" || /[0-9]/u.test(c ?? "")) return number(); fail("expected JSON value"); };
  const array = () => { const out = []; i += 1; ws(); if (source[i] === "]") { i += 1; return out; } while (true) { out.push(value()); ws(); if (source[i] === "]") { i += 1; return out; } if (source[i++] !== ",") fail("expected ',' or ']'", i - 1); } };
  const object = () => { const out = {}; const seen = new Set(); i += 1; ws(); if (source[i] === "}") { i += 1; return out; } while (true) { ws(); const keyOffset = i; if (source[i] !== '"') fail("expected object key", i); const key = string(); if (seen.has(key)) throw new StrictJsonError("DUPLICATE_KEY", `duplicate object key at offset ${keyOffset}`, keyOffset, key); seen.add(key); ws(); if (source[i++] !== ":") fail("expected ':'", i - 1); out[key] = value(); ws(); if (source[i] === "}") { i += 1; return out; } if (source[i++] !== ",") fail("expected ',' or '}'", i - 1); } };
  ws(); const result = value(); ws(); if (i !== source.length) fail("trailing content", i); return result;
}

export function parseStrictJsonl(source) {
  const rows = []; const lines = source.split(/\r?\n/u);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    if (!lines[lineIndex].trim()) continue;
    let value;
    try { value = parseStrictJson(lines[lineIndex]); } catch (error) { if (error instanceof StrictJsonError) error.row = lineIndex + 1; throw error; }
    if (!value || typeof value !== "object" || Array.isArray(value)) { const error = new StrictJsonError("ROW_NOT_OBJECT", `row ${lineIndex + 1} is not an object`, 0); error.row = lineIndex + 1; throw error; }
    rows.push(value);
  }
  return rows;
}
