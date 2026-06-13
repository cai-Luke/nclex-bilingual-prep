#!/usr/bin/env tsx
/**
 * fix-bank-quotes.ts — deterministic curly-quote recovery for raw bank JSON.
 *
 * Two corruption modes have hit the promotion gate, both from hand-editing JSON:
 *   - structural curly quotes:   “id”, “content”  (U+201C/U+201D used as JSON delimiters)
 *   - downgraded content quotes:  患者说："…"      (in-string Chinese speech marks turned
 *                                                  into bare, unescaped ASCII " — string ends early)
 *
 * This tool resolves both without the gatekeeper re-deriving the rules:
 *   - a file that already parses is left untouched (valid quotes are correct by definition);
 *   - otherwise it runs a single string-state-aware pass, then RE-PARSES the result and only
 *     writes if it parses — so it never emits a file that doesn't parse, and it only ever
 *     substitutes quote characters (verified by a non-quote-byte diff guard);
 *   - the one genuinely ambiguous case (a Chinese close-quote “”” immediately followed by an
 *     ASCII : , } ]) is NOT guessed — the tool refuses and pinpoints the spot for a human.
 *
 * Usage:
 *   tsx scripts/fix-bank-quotes.ts banks/banks-raw/foo.json          # writes foo.fixed.json
 *   tsx scripts/fix-bank-quotes.ts --in-place banks/banks-raw/*.json # overwrites in place
 *
 * Scope: quotes only. It does not strip markdown fences or fix trailing commas — raw banks are
 * pure JSON by contract; other syntax errors are reported, not repaired.
 */

import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const LDQUO = "\u201C"; // “  left double quotation mark
const RDQUO = "\u201D"; // ”  right double quotation mark
const STRUCT_AFTER = new Set([":", ",", "}", "]"]);
const WS = new Set([" ", "\t", "\n", "\r"]);

const nextNonWs = (s: string, from: number): string | null => {
  for (let j = from; j < s.length; j += 1) {
    if (!WS.has(s[j])) return s[j];
  }
  return null;
};

interface FixResult {
  output: string;
  structuralCurly: number; // curly quotes that were JSON delimiters -> ASCII "
  strayAsciiEscaped: number; // bare ASCII " inside a string value -> \"
  contentCurlyKept: number; // legitimate Chinese quotes inside a string -> left alone
}

const normalizeQuotes = (input: string): FixResult => {
  let out = "";
  let inString = false;
  let escaping = false;
  let structuralCurly = 0;
  let strayAsciiEscaped = 0;
  let contentCurlyKept = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];

    if (!inString) {
      // Outside a string, an opener is ASCII " or a corrupted curly opener “.
      if (ch === '"' || ch === LDQUO) {
        if (ch === LDQUO) structuralCurly += 1;
        out += '"';
        inString = true;
        continue;
      }
      // A lone ” outside a string is unexpected — leave it; the re-parse will flag it.
      out += ch;
      continue;
    }

    // Inside a string.
    if (escaping) {
      out += ch;
      escaping = false;
      continue;
    }
    if (ch === "\\") {
      out += ch;
      escaping = true;
      continue;
    }
    if (ch === '"') {
      // Real close iff followed by structural punctuation/EOF; otherwise a stray content quote.
      const nxt = nextNonWs(input, i + 1);
      if (nxt === null || STRUCT_AFTER.has(nxt)) {
        out += '"';
        inString = false;
      } else {
        out += '\\"';
        strayAsciiEscaped += 1;
      }
      continue;
    }
    if (ch === RDQUO) {
      const nxt = nextNonWs(input, i + 1);
      if (nxt === null || STRUCT_AFTER.has(nxt)) {
        out += '"';
        inString = false;
        structuralCurly += 1;
      } else {
        out += RDQUO; // content close-mark — keep
        contentCurlyKept += 1;
      }
      continue;
    }
    if (ch === LDQUO) {
      out += LDQUO; // content open-mark inside a string — keep
      contentCurlyKept += 1;
      continue;
    }
    out += ch;
  }

  return { output: out, structuralCurly, strayAsciiEscaped, contentCurlyKept };
};

const lineCol = (s: string, index: number) => {
  let line = 1;
  let col = 1;
  for (let i = 0; i < index && i < s.length; i += 1) {
    if (s[i] === "\n") {
      line += 1;
      col = 1;
    } else {
      col += 1;
    }
  }
  return { line, col };
};

const positionFromError = (msg: string): number | null => {
  const m = msg.match(/position (\d+)/i);
  return m ? Number(m[1]) : null;
};

const firstCurly = (s: string): number => {
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === LDQUO || s[i] === RDQUO) return i;
  }
  return -1;
};

// Stripping every quote-class char from both sides must leave identical text:
// the fix only ever adds/removes ", “, ”, and escaping backslashes.
const stripQuoteClass = (s: string) => s.replace(/["\u201C\u201D\\]/g, "");

const main = async () => {
  const args = process.argv.slice(2);
  const inPlace = args.includes("--in-place");
  const files = args.filter((a) => !a.startsWith("--"));

  if (files.length === 0) {
    console.error("Usage: tsx scripts/fix-bank-quotes.ts [--in-place] <file.json...>");
    process.exit(1);
  }

  let anyFail = false;

  for (const file of files) {
    let text: string;
    try {
      text = await readFile(file, "utf8");
    } catch (err) {
      anyFail = true;
      console.error(`${basename(file)}: cannot read — ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }

    try {
      JSON.parse(text);
      console.log(`${basename(file)}: OK — already parses, no quote fix needed.`);
      continue;
    } catch {
      /* fall through to repair */
    }

    const { output, structuralCurly, strayAsciiEscaped, contentCurlyKept } = normalizeQuotes(text);

    try {
      JSON.parse(output);
    } catch (err) {
      anyFail = true;
      const msg = err instanceof Error ? err.message : String(err);
      const idx = positionFromError(msg) ?? firstCurly(text);
      console.error(`${basename(file)}: could NOT auto-resolve quotes — manual fix needed.`);
      if (idx >= 0 && idx < text.length) {
        const { line, col } = lineCol(text, idx);
        const cp = "U+" + text.codePointAt(idx)!.toString(16).toUpperCase().padStart(4, "0");
        console.error(`  first suspect: line ${line}, col ${col} (codepoint ${cp}).`);
      }
      console.error(`  re-parse error: ${msg}`);
      console.error(`  likely cause: a Chinese close-quote ” immediately followed by an ASCII : , } ] — disambiguate by hand.`);
      continue;
    }

    if (stripQuoteClass(text) !== stripQuoteClass(output)) {
      anyFail = true;
      console.error(`${basename(file)}: aborted — fix would change non-quote characters; refusing to write.`);
      continue;
    }

    const summary = `normalized ${structuralCurly} structural curly quote(s), escaped ${strayAsciiEscaped} stray ASCII quote(s), kept ${contentCurlyKept} in-string Chinese quote(s)`;

    if (inPlace) {
      await writeFile(file, output, "utf8");
      console.log(`${basename(file)}: FIXED in place — ${summary}.`);
    } else {
      const outPath = file.replace(/\.json$/i, "") + ".fixed.json";
      await writeFile(outPath, output, "utf8");
      console.log(`${basename(file)}: FIXED -> ${basename(outPath)} — ${summary}. Review the diff, then replace the raw file (or rerun with --in-place).`);
    }
  }

  process.exit(anyFail ? 1 : 0);
};

void main();
