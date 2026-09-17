// Independent-review probe (Claude Code / Opus 5). Written by the checker; imports no producer test code.
// Usage: PLAYWRIGHT_MODULE=... node --import tsx <this> --label base|candidate --url URL --out FILE [--decisive-only]
import { writeFileSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { questionFingerprint } from "../../../../src/completedMemory.ts";
import { getCorrectAnswer } from "../../../../src/grading.ts";

const argv = process.argv;
const opt = (k) => argv[argv.indexOf(k) + 1];
const label = opt("--label");
const url = opt("--url");
const outFile = opt("--out");
const decisiveOnly = argv.includes("--decisive-only");
const desktopOnly = argv.includes("--desktop-only");
if (!label || !url || !outFile || !process.env.PLAYWRIGHT_MODULE) throw new Error("args");
if (existsSync(outFile)) throw new Error("refusing to overwrite " + outFile);

const byId = new Map();
for (const f of readdirSync("banks").filter((f) => f.endsWith(".json")).sort())
  for (const q of JSON.parse(readFileSync(join("banks", f))).questions) byId.set(q.id, { q, bank: f });
const need = (id) => {
  const e = byId.get(id);
  if (!e) throw new Error("missing fixture " + id);
  return e.q;
};
const MI = need("claude_a_mc_acute_mi_01");
const DABI = need("claude_a_mc_dabigatran_teaching_03");
const CASE = need("opus_psi_caregiver_2026_06_10_01");

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const out = { label, url, browser: browser.version(), playwright: process.env.PLAYWRIGHT_MODULE, scenarios: [], failures: [] };
const save = () => writeFileSync(outFile, JSON.stringify(out, null, 2) + "\n");
const fail = (scenario, msg, data) => {
  out.failures.push({ scenario, msg, data });
  save();
};

async function session(questions, { width, height, text = "default", theme = "light", answers = {} }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, hasTouch: true });
  const page = await context.newPage();
  const diagnostics = [];
  page.on("console", (m) => ["error", "warning"].includes(m.type()) && diagnostics.push(m.text()));
  page.on("pageerror", (e) => diagnostics.push("pageerror " + e.message));
  await page.goto(url);
  await page.waitForSelector(".app-shell");
  await page.waitForFunction(() => new Promise((r) => { const q = indexedDB.open("nclex-bilingual-prep"); q.onsuccess = () => { const ok = q.result.objectStoreNames.contains("activeSession"); q.result.close(); r(ok); }; q.onerror = () => r(false); }));
  // Replace the live app with an inert document of the same origin before writing storage.
  await page.route(url, (r) => r.fulfill({ contentType: "text/html", body: "<!doctype html><title>inert</title>" }));
  await page.goto(url);
  const now = new Date().toISOString();
  const snap = {
    id: `probe-${Date.now()}`, mode: "study", questionIds: questions.map((q) => q.id), poolIds: questions.map((q) => q.id),
    index: 0, answers, results: {}, scores: {}, attempts: {}, skippedQuestionIds: [], phase: "questions",
    languageMode: "on-tap", title: "Independent probe", startedAt: now, updatedAt: now, launchIntent: "ordinary",
    returnView: "home", requestedCount: questions.length,
    fingerprints: Object.fromEntries(questions.map((q) => [q.id, questionFingerprint(q)])),
  };
  await page.evaluate(async ({ snap, text, theme }) => {
    localStorage.setItem("completed-memory-notice", "dismissed");
    localStorage.setItem("nclex-settings", JSON.stringify({ languageMode: "on-tap", themeMode: theme, textSizeMode: text, revisitMissed: true, voiceEnabled: false }));
    const db = await new Promise((r, j) => { const q = indexedDB.open("nclex-bilingual-prep"); q.onsuccess = () => r(q.result); q.onerror = () => j(q.error); });
    const tx = db.transaction(["activeSession", "answerEvents"], "readwrite");
    tx.objectStore("activeSession").clear();
    tx.objectStore("answerEvents").clear();
    tx.objectStore("activeSession").put(snap);
    await new Promise((r, j) => { tx.oncomplete = r; tx.onerror = () => j(tx.error); });
    db.close();
  }, { snap, text, theme });
  await page.unroute(url);
  await page.goto(url);
  await page.getByRole("button", { name: "Continue set / 继续练习", exact: true }).click();
  await page.waitForSelector(".session-shell .question-card");
  const ident = await page.evaluate(() => ({
    stem: document.querySelector(".question-card")?.innerText ?? "",
    theme: document.documentElement.dataset.theme, text: document.documentElement.dataset.textSize,
    vw: innerWidth, vh: innerHeight,
  }));
  if (!ident.stem.includes(questions[0].stem.en) || ident.theme !== theme || ident.text !== text || ident.vw !== width || ident.vh !== height)
    throw new Error("IDENTITY " + JSON.stringify({ ...ident, stem: ident.stem.slice(0, 80) }));
  return { context, page, diagnostics };
}

const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

// Self-contained geometry: rectangles, intersection, centre + 4px-inset corner hits, scrollY bracketing.
async function probe(page, selector, name) {
  return page.evaluate(({ selector, name }) => {
    const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; };
    const y0 = window.scrollY;
    const target = [...document.querySelectorAll(selector)].find((e) => e.getClientRects().length) ?? null;
    const panelEl = document.querySelector(".exam-calculator");
    const T = rect(target), P = rect(panelEl);
    const iw = T && P ? Math.max(0, Math.min(P.r, T.r) - Math.max(P.l, T.l)) : 0;
    const ih = T && P ? Math.max(0, Math.min(P.b, T.b) - Math.max(P.t, T.t)) : 0;
    const pts = T ? [["center", T.l + T.w / 2, T.t + T.h / 2], ["tl", T.l + 4, T.t + 4], ["tr", T.r - 4, T.t + 4], ["bl", T.l + 4, T.b - 4], ["br", T.r - 4, T.b - 4]] : [];
    const hits = pts.map(([k, x, y]) => { const h = document.elementFromPoint(x, y); return { k, x, y, inTarget: !!h && target.contains(h), inCalculator: !!h && !!panelEl?.contains(h), hit: h ? `${h.tagName}.${h.className}`.slice(0, 60) : null }; });
    const shell = document.querySelector(".session-shell");
    const vars = shell ? Object.fromEntries(["--calculator-actions-height", "--calculator-topbar-height", "--calculator-submit-height", "--calculator-sheet-height"].map((k) => [k, shell.style.getPropertyValue(k)])) : null;
    return {
      name, selector, targetText: target?.textContent?.trim().slice(0, 40) ?? null, disabled: target?.disabled ?? null,
      viewport: { w: innerWidth, h: innerHeight }, panel: P, target: T, intersection: { w: iw, h: ih },
      positiveOverlap: iw > 1 && ih > 1, hits, allHitsInTarget: hits.length === 5 && hits.every((h) => h.inTarget),
      inViewport: !!T && T.w > 0 && T.h > 0 && T.t >= -1 && T.b <= innerHeight + 1 && T.l >= -1 && T.r <= innerWidth + 1,
      topbar: rect(document.querySelector(".session-topbar")), actions: rect(document.querySelector(".session-actions")),
      submit: rect(document.querySelector(".submit-button")), submitCount: document.querySelectorAll(".submit-button").length,
      inlineVars: vars, scrollBefore: y0, scrollAfter: window.scrollY,
    };
  }, { selector, name });
}
const clear = (m) => m.inViewport && !m.positiveOverlap && m.allHitsInTarget && m.scrollBefore === m.scrollAfter;

async function unforcedClick(page, selector) {
  const y = await page.evaluate(() => { window.__probeDownY = null; addEventListener("pointerdown", () => (window.__probeDownY = scrollY), { once: true, capture: true }); return scrollY; });
  await page.locator(selector).filter({ visible: true }).first().click({ timeout: 1500 });
  const downY = await page.evaluate(() => window.__probeDownY);
  return { scrollBeforeClick: y, scrollAtPointerDown: downY, autoScrolled: downY !== y };
}

// ---- Scenario 1: decisive original witness, 390x844 light Default, ready Submit ----
if (!desktopOnly) {
  const s = { name: "decisive-390x844-ready-submit" };
  const { context, page, diagnostics } = await session([MI, DABI], { width: 390, height: 844 });
  await page.locator(".option-row").first().click(); // readiness setup, calculator closed (R3 §5 step 1)
  await frames(page);
  s.readyBeforeOpen = await page.locator(".submit-button").isEnabled();
  await page.getByRole("button", { name: "Open calculator", exact: true }).click();
  await frames(page);
  s.measurement = await probe(page, ".submit-button", "ready-submit");
  s.clear = clear(s.measurement);
  if (s.clear) {
    s.click = await unforcedClick(page, ".submit-button");
    await page.waitForSelector(".answer-banner", { timeout: 3000 });
    s.submittedBanner = true;
    s.calculatorStillOpen = (await page.locator(".exam-calculator").count()) === 1;
  } else s.click = "not attempted: geometry/hit gate failed";
  s.diagnostics = diagnostics;
  out.scenarios.push(s);
  save();
  await context.close();
}

if (!decisiveOnly && !desktopOnly) {
  // ---- Scenario 2: adversarial — measured custom properties must track the CURRENT DOM ----
  const s = { name: "adversarial-case-measure-tracking-320x740", steps: [] };
  const answers = { [CASE.id]: getCorrectAnswer(CASE) };
  const { context, page, diagnostics } = await session([CASE], { width: 390, height: 844, answers });
  const snapshot = async (step) => {
    await frames(page);
    const m = await page.evaluate(() => {
      const h = (sel) => { const e = document.querySelector(sel); return e ? e.getBoundingClientRect().height : 0; };
      const shell = document.querySelector(".session-shell");
      const v = (k) => parseFloat(shell.style.getPropertyValue(k) || "NaN");
      const r = (sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; };
      const P = r(".exam-calculator"), A = r(".session-actions"), S = r(".submit-button"), TB = r(".session-topbar");
      const inter = (x, y) => (x && y ? Math.max(0, Math.min(x.r, y.r) - Math.max(x.l, y.l)) * Math.max(0, Math.min(x.b, y.b) - Math.max(x.t, y.t)) : 0);
      return {
        vw: innerWidth, vh: innerHeight, open: !!P,
        inline: shell.style.cssText,
        measured: { actions: v("--calculator-actions-height"), topbar: v("--calculator-topbar-height"), submit: v("--calculator-submit-height"), sheet: v("--calculator-sheet-height") },
        actual: { actions: h(".session-actions"), topbar: h(".session-topbar"), submit: h(".submit-button"), sheet: h(".exam-calculator") },
        rects: { panel: P, actions: A, submit: S, topbar: TB },
        overlapArea: { panelActions: inter(P, A), panelSubmit: inter(P, S), actionsSubmit: inter(A, S), panelTopbar: inter(P, TB) },
        submitText: document.querySelector(".submit-button")?.textContent?.trim() ?? null,
        submitDisabled: document.querySelector(".submit-button")?.disabled ?? null,
      };
    });
    const eq = (a, b) => Math.abs(a - b) <= 0.5;
    m.step = step;
    if (m.open) {
      m.trackingOk = eq(m.measured.actions, m.actual.actions) && eq(m.measured.topbar, m.actual.topbar) && eq(m.measured.submit, m.actual.submit) && eq(m.measured.sheet, m.actual.sheet);
      m.separationOk = Object.values(m.overlapArea).every((a) => a <= 1) && m.rects.panel.b <= Math.min(m.rects.actions.t, m.rects.submit?.t ?? Infinity) + 0.5;
    } else m.cleanupOk = !/--calculator-/.test(m.inline);
    s.steps.push(m);
    save();
    return m;
  };
  await page.getByRole("button", { name: "Open calculator", exact: true }).click();
  await snapshot("open-390");
  await page.setViewportSize({ width: 320, height: 740 });
  await snapshot("resized-320 (Submit column narrows, label may wrap)");
  await page.locator(".session-topbar").getByRole("button", { name: "EN/ZH", exact: true }).click({ timeout: 1500 });
  await snapshot("language-changed (topbar/actions text may re-wrap)");
  await page.setViewportSize({ width: 800, height: 740 });
  await snapshot("crossover-800 (desktop: expect no inline offsets)");
  await page.setViewportSize({ width: 320, height: 740 });
  await snapshot("back-to-320");
  // Decisive gate + unforced Submit all parts, then prove the reservation retracts to the new DOM.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await frames(page);
  s.submitAllMeasurement = await probe(page, ".case-submit-button", "case-submit-all");
  s.submitAllClear = clear(s.submitAllMeasurement);
  if (s.submitAllClear) {
    s.submitAllClick = await unforcedClick(page, ".case-submit-button");
    await page.waitForSelector(".answer-banner", { timeout: 3000 });
    const after = await snapshot("post-submit-all (Submit removed; expect submit=0 and full-width actions)");
    s.postSubmitSubmitHeightZero = after.measured.submit === 0 && after.actual.submit === 0;
    s.postSubmitActionsFullWidth = Math.abs(after.rects.actions.r - after.vw) <= 1;
    s.postSubmitNext = await probe(page, ".session-actions .primary-action", "post-submit-finish");
    s.postSubmitNextClear = clear(s.postSubmitNext);
  }
  await page.getByRole("button", { name: "Minimize calculator", exact: true }).click();
  await snapshot("minimized (expect cleanup)");
  s.diagnostics = diagnostics;
  out.scenarios.push(s);
  save();
  await context.close();

}
if (!decisiveOnly) {
  // ---- Scenario 3: desktop body-wrapper side effect — open panel geometry at 1440x900 ----
  {
    const d = { name: "desktop-1440-panel-geometry" };
    const { context: c2, page: p2 } = await session([MI, DABI], { width: 1440, height: 900 });
    await p2.getByRole("button", { name: "Open calculator", exact: true }).click();
    await frames(p2);
    d.geometry = await p2.evaluate(() => {
      const r = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, w: b.width, h: b.height }; };
      const panel = document.querySelector(".exam-calculator");
      return { panel: r(panel), display: r(panel.querySelector("output")), keypad: r(panel.querySelector(".exam-calculator-keypad")), equals: r(panel.querySelector('[aria-label="Equals"]')), inline: document.querySelector(".session-shell").style.cssText, qcPaddingRight: getComputedStyle(document.querySelector(".question-card")).paddingRight };
    });
    out.scenarios.push(d);
    save();
    await c2.close();
  }
}
await browser.close();
save();
console.log(JSON.stringify({ label, failures: out.failures.length, scenarios: out.scenarios.map((x) => x.name) }));
