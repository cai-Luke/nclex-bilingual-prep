// R3 geometry + five-point oracle. Use system Chrome and a disposable profile.
// PLAYWRIGHT_MODULE=/absolute/playwright/index.mjs node --import tsx scripts/tests/mobile-calculator-clearance.mjs --url URL --output NEW_DIRECTORY
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { questionFingerprint } from "../../src/completedMemory.ts";
import { getCorrectAnswer } from "../../src/grading.ts";
import { runDesktopPreview } from "./mobile-calculator-desktop.mjs";
const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
assert(
  process.argv.includes("--url") &&
    process.argv.includes("--output") &&
    process.env.PLAYWRIGHT_MODULE,
);
const url = new URL(arg("--url")).href;
const out = resolve(arg("--output"));
assert(
  !existsSync(join(out, "results.json")),
  "Evidence must use a fresh directory",
);
mkdirSync(join(out, "screenshots"), { recursive: true });
const sha = (s) => createHash("sha256").update(s).digest("hex");
const entries = readdirSync("banks")
  .filter((f) => f.endsWith(".json"))
  .sort()
  .flatMap((file) => {
    const bytes = readFileSync(join("banks", file));
    return JSON.parse(bytes).questions.map((q) => ({
      q,
      bank: `banks/${file}`,
      bankSha256: sha(bytes),
    }));
  });
const fixtureIds = {
  ordinary: "claude_a_mc_acute_mi_01",
  second: "claude_a_mc_dabigatran_teaching_03",
  cloze: "gpt_format15_vasa_previa_management_dropdown",
  case: "opus_psi_caregiver_2026_06_10_01",
};
const fixtures = Object.fromEntries(
  Object.entries(fixtureIds).map(([k, id]) => [
    k,
    entries.find((e) => e.q.id === id),
  ]),
);
fixtures.matrix = entries
  .filter((e) => e.q.itemType === "matrix" && !e.q.visual)
  .sort((a, b) => a.q.id.localeCompare(b.q.id))[0];
for (const e of Object.values(fixtures)) assert(e);
writeFileSync(
  join(out, "fixture-manifest.json"),
  JSON.stringify(
    Object.fromEntries(
      Object.entries(fixtures).map(([k, e]) => [
        k,
        {
          bank: e.bank,
          bankSha256: e.bankSha256,
          id: e.q.id,
          sha256: sha(JSON.stringify(e.q)),
          fingerprint: questionFingerprint(e.q),
          parts: e.q.caseStudy?.questions.map((q) => ({
            id: q.id,
            itemType: q.itemType,
            sha256: sha(JSON.stringify(q)),
            fingerprint: questionFingerprint(q),
          })),
        },
      ]),
    ),
    null,
    2,
  ) + "\n",
);
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
const profile = mkdtempSync(join(tmpdir(), "shrimp-calculator-"));
const context = await chromium.launchPersistentContext(profile, {
  channel: "chrome",
  headless: true,
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  ignoreDefaultArgs: ["--disable-web-security"],
});
let page = context.pages()[0];
const report = {
  url,
  runnerSha256: sha(readFileSync(new URL(import.meta.url))),
  desktopHelperSha256: sha(
    readFileSync(new URL("./mobile-calculator-desktop.mjs", import.meta.url)),
  ),
  browser: context.browser()?.version(),
  emulated: "CSS viewport, DPR 1, touch capability; not a physical device",
  checks: [],
  console: [],
  status: "RUNNING",
};
function observe() {
  page.setDefaultTimeout(5000);
  page.on("pageerror", (e) =>
    report.console.push({ type: "pageerror", message: e.message }),
  );
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()))
      report.console.push({
        type: m.type(),
        message: m.text(),
        location: m.location(),
      });
  });
}
observe();
const button = (name) => page.getByRole("button", { name, exact: true });
const tick = () =>
  page.evaluate(
    () =>
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
const save = () =>
  writeFileSync(
    join(out, "results.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
const record = (name, details = {}) => {
  report.checks.push({ name, ...details });
  save();
};
const shot = (name) =>
  page.screenshot({ path: join(out, "screenshots", `${name}.png`) });
const rawStore = (name) =>
  page.evaluate(async (name) => {
    const db = await new Promise((r, j) => {
      const q = indexedDB.open("nclex-bilingual-prep");
      q.onsuccess = () => r(q.result);
      q.onerror = () => j(q.error);
    });
    const rows = await new Promise((r, j) => {
      const q = db.transaction(name).objectStore(name).getAll();
      q.onsuccess = () => r(q.result);
      q.onerror = () => j(q.error);
    });
    db.close();
    return rows;
  }, name);
let currentQuestions;
let currentPart = null;
async function identity() {
  const s = (await rawStore("activeSession"))[0];
  const q = currentQuestions[s.index];
  assert.equal(s.questionIds[s.index], q.id);
  assert.equal(s.fingerprints[q.id], questionFingerprint(q));
  assert(
    (await page.locator(".question-card").innerText()).includes(q.stem.en),
  );
  if (currentPart && q.itemType === "case_study")
    assert(
      (await page.locator(".case-active-part:visible").innerText()).includes(
        currentPart.stem.en,
      ),
      `Active part identity mismatch ${currentPart.id}`,
    );
  return q;
}
async function seed(
  name = "ordinary",
  {
    width = 390,
    height = 844,
    text = "default",
    theme = "light",
    inset = 0,
    answers = {},
  } = {},
) {
  await page.setViewportSize({ width, height });
  // Destroy the live application before writing fixture state; no persistence race.
  await page.close();
  page = await context.newPage();
  await page.setViewportSize({ width, height });
  observe();
  await page.route(url, (r) =>
    r.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>Calculator fixture seed</title>",
    }),
  );
  await page.goto(url);
  currentQuestions =
    name === "ordinary"
      ? [fixtures.ordinary.q, fixtures.second.q]
      : [fixtures[name].q];
  currentPart = name === "case" ? fixtures.case.q.caseStudy.questions[0] : null;
  const snapshot = {
    id: `calculator-${name}`,
    mode: "study",
    questionIds: currentQuestions.map((q) => q.id),
    poolIds: currentQuestions.map((q) => q.id),
    index: 0,
    answers,
    results: {},
    scores: {},
    attempts: {},
    fingerprints: Object.fromEntries(
      currentQuestions.map((q) => [q.id, questionFingerprint(q)]),
    ),
    skippedQuestionIds: [],
    phase: "questions",
    languageMode: "on-tap",
    title: "Calculator clearance set",
    startedAt: "2026-09-16T12:00:00.000Z",
    updatedAt: "2026-09-16T12:00:00.000Z",
    launchIntent: "ordinary",
    returnView: "home",
    requestedCount: currentQuestions.length,
  };
  await page.evaluate(
    async ({ snapshot, text, theme }) => {
      localStorage.setItem("completed-memory-notice", "dismissed");
      localStorage.setItem(
        "nclex-settings",
        JSON.stringify({
          languageMode: "on-tap",
          themeMode: theme,
          textSizeMode: text,
          revisitMissed: true,
          voiceEnabled: false,
        }),
      );
      const db = await new Promise((r, j) => {
        const q = indexedDB.open("nclex-bilingual-prep");
        q.onsuccess = () => r(q.result);
        q.onerror = () => j(q.error);
      });
      const names = [
        "activeSession",
        "answerEvents",
        "progress",
        "completedSets",
      ];
      const tx = db.transaction(names, "readwrite");
      names.forEach((n) => tx.objectStore(n).clear());
      tx.objectStore("activeSession").put(snapshot);
      await new Promise((r, j) => {
        tx.oncomplete = r;
        tx.onerror = () => j(tx.error);
      });
      db.close();
    },
    { snapshot, text, theme },
  );
  await page.unroute(url);
  await page.reload();
  await button("Continue set / 继续练习").click();
  await page.locator(".session-shell").waitFor();
  await tick();
  assert.equal(await page.locator("html").getAttribute("data-theme"), theme);
  assert.equal(await page.locator("html").getAttribute("data-text-size"), text);
  await identity();
  assert.deepEqual(
    await page.evaluate(() => ({ width: innerWidth, height: innerHeight })),
    { width, height },
    "VIEWPORT_IDENTITY",
  );
  if (inset) {
    await page.addStyleTag({
      content: `.session-shell { --calculator-safe-bottom: ${inset}px; }`,
    });
    await tick();
  }
  record("seed", {
    name,
    width,
    height,
    text,
    theme,
    inset: inset
      ? { kind: "simulated", px: inset }
      : { kind: "actual computed browser env (usually zero)" },
  });
}
async function explicitScroll(y, label) {
  const before = await page.evaluate(() => scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await tick();
  record("explicit-scroll", {
    label,
    before,
    requested: y,
    after: await page.evaluate(() => scrollY),
  });
}
async function measure(target, label) {
  await identity();
  const before = await page.evaluate(() => scrollY);
  const m = await target.evaluate((el) => {
    const box = (e) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    };
    const panel =
      document.querySelector(".exam-calculator") ??
      document.querySelector(".exam-calculator-launcher");
    const p = box(panel),
      t = box(el),
      topbar = box(document.querySelector(".session-topbar"));
    const points = [
      [t.left + t.width / 2, t.top + t.height / 2],
      [t.left + 4, t.top + 4],
      [t.right - 4, t.top + 4],
      [t.left + 4, t.bottom - 4],
      [t.right - 4, t.bottom - 4],
    ];
    const describe = (e) =>
      e
        ? `${e.tagName}.${String(e.className)} ${e.textContent?.trim().slice(0, 90)}`
        : null;
    const hits = points.map(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      return {
        x,
        y,
        hit: describe(hit),
        inside: !!hit && (el === hit || el.contains(hit)),
      };
    });
    const shell = document.querySelector(".session-shell");
    const css = getComputedStyle(shell);
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;height:env(safe-area-inset-bottom, 0px);width:0;pointer-events:none";
    document.body.append(probe);
    const actualSafeBottom = probe.getBoundingClientRect().height;
    probe.remove();
    const actions = document.querySelector(".session-actions");
    return {
      target: t,
      calculatorDescendant: panel?.contains(el) ?? false,
      targetLabel: describe(el),
      disabled: el.disabled ?? false,
      panel: p,
      open: !!document.querySelector(".exam-calculator"),
      topbar,
      band: p && topbar ? p.top - topbar.bottom : null,
      intersection: p
        ? {
            width: Math.max(
              0,
              Math.min(p.right, t.right) - Math.max(p.left, t.left),
            ),
            height: Math.max(
              0,
              Math.min(p.bottom, t.bottom) - Math.max(p.top, t.top),
            ),
          }
        : null,
      hits,
      scrollY,
      viewport: { width: innerWidth, height: innerHeight },
      visualViewport: visualViewport
        ? {
            width: visualViewport.width,
            height: visualViewport.height,
            offsetTop: visualViewport.offsetTop,
            offsetLeft: visualViewport.offsetLeft,
          }
        : null,
      theme: document.documentElement.dataset.theme,
      text: document.documentElement.dataset.textSize,
      rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize),
      actualSafeBottom,
      actionsPaddingBottom: getComputedStyle(actions).paddingBottom,
      actionsRect: box(actions),
      offsets: Object.fromEntries(
        [
          "--calculator-safe-bottom",
          "--calculator-actions-height",
          "--calculator-topbar-height",
          "--calculator-submit-height",
          "--calculator-sheet-height",
        ].map((k) => [k, css.getPropertyValue(k)]),
      ),
      rootWidth: {
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      },
      bodyOverflow: getComputedStyle(document.body).overflow,
    };
  });
  const after = await page.evaluate(() => scrollY);
  m.parentId = (await rawStore("activeSession"))[0].questionIds[
    (await rawStore("activeSession"))[0].index
  ];
  m.activePartId = currentPart?.id ?? null;
  m.label = label;
  m.scrollBefore = before;
  m.scrollAfter = after;
  record("geometry", m);
  return m;
}
function assertClear(m, { disabled = false } = {}) {
  const t = m.target;
  assert(t.width > 0 && t.height > 0, "MISSING_TARGET");
  assert(
    t.top >= -1 &&
      t.bottom <= m.viewport.height + 1 &&
      t.left >= -1 &&
      t.right <= m.viewport.width + 1,
    "OFFSCREEN_TARGET",
  );
  assert.equal(m.scrollBefore, m.scrollAfter, "AUTO_SCROLL_INVALID");
  if (
    (!m.calculatorDescendant &&
      m.intersection?.width > 1 &&
      m.intersection?.height > 1) ||
    m.hits.some((h) => !h.inside)
  ) {
    const e = new Error(`OVERLAP: ${m.label}`);
    e.code = "OVERLAP";
    throw e;
  }
  if (!disabled) assert(!m.disabled, "DISABLED_TARGET");
}
async function checkedClick(target, label, options = {}) {
  const m = await measure(target, label);
  assertClear(m, options);
  const y = await page.evaluate(() => {
    window.__calculatorPointerY = null;
    document.addEventListener(
      "pointerdown",
      () => {
        window.__calculatorPointerY = scrollY;
      },
      { once: true, capture: true },
    );
    return scrollY;
  });
  await target.click({ timeout: 1800 });
  const pointerY = await page.evaluate(() => window.__calculatorPointerY);
  assert.equal(pointerY, y, "AUTO_SCROLL_BEFORE_POINTER");
  const after = await page.evaluate(() => scrollY);
  record("ordinary-click", {
    label,
    before: y,
    pointerY,
    after,
    expectedNavigation: !!options.navigation,
  });
  if (!options.navigation) assert.equal(after, y, "AUTO_SCROLL_INVALID click");
  await tick();
}
async function open() {
  const launcher = button("Open calculator");
  const r = await launcher.boundingBox();
  const barBottom = await page
    .locator(".session-topbar")
    .evaluate((el) => el.getBoundingClientRect().bottom);
  if (r.y < barBottom || r.y + r.height > (await page.viewportSize()).height) {
    await explicitScroll(
      await launcher.evaluate(
        (el) => scrollY + el.getBoundingClientRect().top - 140,
      ),
      "reach-launcher",
    );
  }
  await checkedClick(launcher, "open-calculator", { navigation: true });
  await tick();
  assert(
    await page
      .locator(".exam-calculator")
      .evaluate((el) => el === document.activeElement),
  );
}
async function baselineAndWitness() {
  await seed();
  await page.locator(".option-row").first().click();
  assert(await button("Submit answer").isEnabled());
  await open();
  await shot("ordinary-ready-open");
  const m = await measure(
    button("Submit answer"),
    "ordinary-ready-open-submit",
  );
  assertClear(m);
  await checkedClick(button("Submit answer"), "ordinary-submit", {
    navigation: true,
  });
  await page.locator(".answer-banner").waitFor();
}
async function baselineHeight() {
  await seed("ordinary", { width: 667, height: 375 });
  await open();
  record(
    "reduced-height-pre-repair",
    await page.locator(".exam-calculator").evaluate((el) => {
      const b = (e) => {
        const r = e.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, height: r.height };
      };
      return {
        panel: b(el),
        overflow: getComputedStyle(el).overflow,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        display: b(el.querySelector("output")),
        lastKey: b(el.querySelector('[aria-label="Equals"]')),
      };
    }),
  );
  await shot("reduced-height-baseline");
}
async function calculatorState() {
  return {
    display: await page.locator(".exam-calculator-display").innerText(),
    pending: await page.locator(".exam-calculator .sr-only").innerText(),
  };
}
async function layout(label, { reduced = false } = {}) {
  const m = await measure(page.locator(".session-topbar > button"), label);
  assertClear(m);
  assert(m.rootWidth.scroll <= m.rootWidth.client + 1, "ROOT_OVERFLOW");
  assert(!["hidden", "clip"].includes(m.bodyOverflow), "BODY_SCROLL_LOCK");
  if (m.open) {
    if (!reduced)
      assert(
        m.text === "large" ? m.band > 0 : m.band >= 6 * m.rootFont,
        `BAND_THRESHOLD ${m.band}`,
      );
    else assert(m.band >= 0, "NEGATIVE_BAND");
    const body = await page
      .locator(".exam-calculator-body")
      .evaluate((el) => ({ client: el.clientHeight, scroll: el.scrollHeight }));
    if (!reduced)
      assert(
        body.scroll <= body.client + 1,
        `KEYPAD_SCROLL_NORMAL ${body.scroll}/${body.client}`,
      );
    assert(
      Math.abs(
        parseFloat(m.actionsPaddingBottom) -
          10.4 -
          parseFloat(m.offsets["--calculator-safe-bottom"]),
      ) < 0.1,
      "SAFE_AREA_PATH",
    );
    const keyBounds = await page
      .locator(".exam-calculator-keypad button")
      .evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          const b = el.closest(".exam-calculator-body").getBoundingClientRect();
          return {
            height: r.height,
            top: r.top,
            bottom: r.bottom,
            bodyTop: b.top,
            bodyBottom: b.bottom,
          };
        }),
      );
    assert(
      keyBounds.every((k) => k.height >= 44),
      "KEY_TARGET_SHRUNK",
    );
    if (!reduced)
      assert(
        keyBounds.every(
          (k) => k.top >= k.bodyTop - 1 && k.bottom <= k.bodyBottom + 1,
        ),
        "NORMAL_KEYPAD_CLIPPED",
      );
    record("tier", {
      keyBounds,
      label,
      band: m.band,
      body,
      actualSafeBottom: m.actualSafeBottom,
      appliedSafeBottom: m.offsets["--calculator-safe-bottom"],
    });
  }
  for (const target of await page
    .locator(".session-topbar button, .session-actions button")
    .all())
    assertClear(await measure(target, `${label}-bar`), { disabled: true });
  if (await page.locator(".submit-button").count())
    assertClear(
      await measure(page.locator(".submit-button"), `${label}-submit`),
      { disabled: true },
    );
}
async function minimize() {
  const before = await calculatorState();
  await checkedClick(button("Minimize calculator"), "minimize", {
    navigation: true,
  });
  assert(
    await button("Open calculator").evaluate(
      (el) => el === document.activeElement,
    ),
  );
  assert.equal(
    await page.locator(".session-shell").evaluate((el) => el.style.length),
    0,
    "STALE_OFFSETS_CLOSE",
  );
  return before;
}
async function reach(target, label, { answer = false, reduced = false } = {}) {
  let reopen = null;
  if (await page.locator(".exam-calculator").count()) {
    const dims = await target.evaluate((el) => ({
      height: el.getBoundingClientRect().height,
      band:
        document.querySelector(".exam-calculator").getBoundingClientRect().top -
        document.querySelector(".session-topbar").getBoundingClientRect()
          .bottom,
      text: document.documentElement.dataset.textSize,
    }));
    if (
      answer &&
      (reduced || (dims.text === "large" && dims.height > dims.band))
    ) {
      reopen = await minimize();
      record("answer-minimize-fallback", {
        label,
        ...dims,
        reduced,
        state: reopen,
      });
    } else if (answer)
      assert(
        dims.height <= dims.band + 1,
        `ANSWER_CANNOT_FIT ${label}: ${dims.height} > ${dims.band}`,
      );
  }
  // Existing matrix overflow is an intentional local horizontal scroller.
  const horizontal = await target.evaluate((el) => {
    const w = el.closest(".matrix-wrap");
    if (!w) return null;
    const b = el.getBoundingClientRect(),
      r = w.getBoundingClientRect();
    const before = w.scrollLeft;
    w.scrollLeft += b.left + b.width / 2 - r.left - r.width / 2;
    return { before, after: w.scrollLeft };
  });
  if (horizontal) record("explicit-matrix-scroll", { label, ...horizontal });
  const dest = await target.evaluate((el) => {
    const t = el.getBoundingClientRect(),
      bar = document.querySelector(".session-topbar").getBoundingClientRect(),
      panel = document.querySelector(".exam-calculator");
    const floor = panel ? panel.getBoundingClientRect().top : innerHeight - 150;
    return (
      scrollY +
      t.top -
      (bar.bottom + Math.max(0, (floor - bar.bottom - t.height) / 2))
    );
  });
  await explicitScroll(dest, label);
  assertClear(await measure(target, label), { disabled: true });
  return reopen;
}
async function reopenState(before) {
  await open();
  assert.deepEqual(await calculatorState(), before, "CALCULATION_LOST");
}
async function activateAnswers(surface, q, label, { reduced = false } = {}) {
  const targets = surface.locator(
    ".option-row, .matrix-table td button, .cloze-select, .blank-input-row input, .order-buttons button",
  );
  assert((await targets.count()) > 0, `No activation elements ${q.id}`);
  for (let i = 0; i < (await targets.count()); i++) {
    const t = targets.nth(i);
    const fallback = await reach(t, `${label}-answer-${i}`, {
      answer: true,
      reduced,
    });
    const disabled = await t.evaluate(
      (el) => el.disabled || el.getAttribute("aria-disabled") === "true",
    );
    if (!disabled) {
      const tag = await t.evaluate((el) => el.tagName);
      if (tag === "SELECT") {
        await checkedClick(t, `${label}-native-open-${i}`);
        await page.keyboard.press("Escape");
        const before = await page.evaluate(() => scrollY);
        const opt = await t.locator("option").nth(1).getAttribute("value");
        await t.selectOption(opt, { timeout: 1800 });
        assert.equal(
          await page.evaluate(() => scrollY),
          before,
          "AUTO_SCROLL_INVALID select",
        );
        await t.focus();
        await t.press("Tab");
        record("native-select-activation", {
          label,
          i,
          value: await t.inputValue(),
        });
      } else if (tag === "INPUT") {
        await t.fill("1");
      } else await checkedClick(t, `${label}-activate-${i}`);
    }
    if (fallback) await reopenState(fallback);
  }
}
async function arithmetic() {
  await page.locator(".exam-calculator").focus();
  await page.keyboard.press("Delete");
  await page.keyboard.type("2+3");
  await page.keyboard.press("Enter");
  assert.equal((await calculatorState()).display, "5");
  assert.equal(
    await page.locator(".answer-banner").count(),
    0,
    "ENTER_SUBMITTED",
  );
  await page.keyboard.type("+");
  assert.equal((await calculatorState()).pending, "Pending operator: +");
  record("keyboard-arithmetic", {
    state: await calculatorState(),
    submitted: false,
  });
}
async function keysReachable(label) {
  const keys = page.locator(".exam-calculator-keypad button");
  for (let i = 0; i < (await keys.count()); i++) {
    const t = keys.nth(i);
    const move = await t.evaluate((el) => {
      const body = el.closest(".exam-calculator-body"),
        b = body.getBoundingClientRect(),
        r = el.getBoundingClientRect(),
        before = body.scrollTop;
      body.scrollTop += r.top + r.height / 2 - b.top - b.height / 2;
      return { before, after: body.scrollTop };
    });
    record("explicit-keypad-scroll", { label, i, ...move });
    await tick();
    await checkedClick(t, `${label}-key-${i}`);
  }
  await page
    .locator(".exam-calculator-body")
    .evaluate((el) => (el.scrollTop = 0));
  await tick();
}
async function core(condition, label) {
  await seed("ordinary", condition);
  await explicitScroll(0, `${label}-closed-top`);
  assertClear(
    await measure(button("Open calculator"), `${label}-closed-launcher`),
  );
  await open();
  assert(await button("Submit answer").isDisabled());
  await layout(`${label}-disabled`, condition);
  await arithmetic();
  await activateAnswers(
    page.locator(".question-card"),
    fixtures.ordinary.q,
    label,
    condition,
  );
  assert(await button("Submit answer").isEnabled());
  await layout(`${label}-ready`, condition);
  await shot(`${label}-ready`);
  const state = await minimize();
  await reopenState(state);
  await checkedClick(button("Submit answer"), `${label}-submit`, {
    navigation: true,
  });
  await page.locator(".answer-banner").waitFor();
  await layout(`${label}-post-submit`, condition);
  await checkedClick(
    page
      .locator(".session-actions")
      .getByRole("button", { name: "Next", exact: true }),
    `${label}-next`,
    { navigation: true },
  );
  await identity();
  assert.equal((await rawStore("activeSession"))[0].index, 1);
  assert.equal(await page.locator(".exam-calculator").count(), 0);
  await open();
  assert.deepEqual(await calculatorState(), {
    display: "0",
    pending: "Pending operator: none",
  });
  await activateAnswers(
    page.locator(".question-card"),
    fixtures.second.q,
    `${label}-second`,
    condition,
  );
  await checkedClick(button("Submit answer"), `${label}-second-submit`, {
    navigation: true,
  });
  await page.locator(".answer-banner").waitFor();
  await layout(`${label}-finish`, condition);
  await checkedClick(
    page
      .locator(".session-actions")
      .getByRole("button", { name: "Finish", exact: true }),
    `${label}-finish`,
    { navigation: true },
  );
  assert.equal(await page.locator(".session-shell").count(), 0);
  record("ordinary-lifetime-complete", { label });
}
async function reduced(condition, label) {
  await seed("ordinary", condition);
  await open();
  await layout(label, { reduced: true });
  await keysReachable(label);
  await arithmetic();
  const state = await minimize();
  await activateAnswers(
    page.locator(".question-card"),
    fixtures.ordinary.q,
    label,
  );
  await reopenState(state);
  await layout(`${label}-reopened`, { reduced: true });
  await shot(label);
  await checkedClick(button("Submit answer"), `${label}-submit`, {
    navigation: true,
  });
  await page.locator(".answer-banner").waitFor();
  await layout(`${label}-post-submit`, { reduced: true });
}
async function content(name, condition, label) {
  await seed(name, condition);
  await open();
  await arithmetic();
  const q = fixtures[name].q;
  await activateAnswers(page.locator(".question-card"), q, label, condition);
  for (const [pos, y] of [
    ["top", 0],
    [
      "middle",
      await page.evaluate(() => document.documentElement.scrollHeight / 2),
    ],
    ["end", 1e7],
  ]) {
    await explicitScroll(y, `${label}-${pos}`);
    await layout(`${label}-${pos}`, condition);
  }
  await shot(label);
  assert(await button("Submit answer").isEnabled());
  await checkedClick(button("Submit answer"), `${label}-submit`, {
    navigation: true,
  });
  await page.locator(".answer-banner").waitFor();
  await layout(`${label}-submitted`, condition);
}
async function caseRun(
  condition = { width: 320, height: 740, text: "large" },
  label = "case",
) {
  const q = fixtures.case.q;
  const correct = getCorrectAnswer(q);
  await seed("case", { ...condition, answers: { [q.id]: correct } });
  await open();
  await arithmetic();
  for (let i = 0; i < q.caseStudy.questions.length; i++) {
    const chip = page.locator(".case-part-chip").nth(i);
    await reach(chip, `case-part-${i}`);
    await checkedClick(chip, `case-part-${i}`, { navigation: true });
    currentPart = q.caseStudy.questions[i];
    assert(
      (await page.locator(".case-active-part:visible").innerText()).includes(
        q.caseStudy.questions[i].stem.en,
      ),
    );
    assert.equal((await calculatorState()).display, "5");
    assert.equal((await calculatorState()).pending, "Pending operator: +");
    for (const nav of await page
      .locator(".case-part-nav-controls button, .case-part-chip")
      .all()) {
      await reach(nav, `case-nav-${i}`);
      assertClear(await measure(nav, `case-nav-${i}`), { disabled: true });
    }
    await activateAnswers(
      page.locator(".case-active-part:visible"),
      q.caseStudy.questions[i],
      `${label}-leaf-${i}`,
      condition,
    );
  }
  for (const [pos, y] of [
    ["top", 0],
    [
      "middle",
      await page.evaluate(() => document.documentElement.scrollHeight / 2),
    ],
    ["end", 1e7],
  ]) {
    await explicitScroll(y, `case-${pos}`);
    await layout(`${label}-${pos}`, condition);
  }
  assert(await button("Submit all parts").isEnabled());
  await checkedClick(button("Submit all parts"), "case-submit-all", {
    navigation: true,
  });
  await page.locator(".answer-banner").first().waitFor();
  assert(Object.hasOwn((await rawStore("activeSession"))[0].results, q.id));
  await layout(`${label}-post-submit`, condition);
  const chip = page.locator(".case-part-chip").first();
  await reach(chip, "case-post-nav");
  await checkedClick(chip, "case-post-nav", { navigation: true });
  currentPart = q.caseStudy.questions[0];
  await shot(`${label}-post-submit`);
  await checkedClick(
    page
      .locator(".session-actions")
      .getByRole("button", { name: "Finish", exact: true }),
    "case-finish",
    { navigation: true },
  );
  record("complete-case-submission", {
    parent: q.id,
    parts: q.caseStudy.questions.map((p) => p.id),
    setup:
      "Canonical complete draft; real matrix/cloze activations, same-parent navigation, ordinary Submit all parts",
  });
}
async function persistence() {
  await seed();
  await open();
  await arithmetic();
  await page.keyboard.press("Escape");
  await tick();
  assert(
    await button("Open calculator").evaluate(
      (el) => el === document.activeElement,
    ),
  );
  assert.equal(await page.locator(".session-shell").count(), 1);
  await reach(page.locator(".option-row").first(), "draft-select", {
    answer: true,
  });
  await checkedClick(page.locator(".option-row").first(), "draft-select");
  const saved = (await rawStore("activeSession"))[0];
  await page.reload();
  await button("Continue set / 继续练习").click();
  await identity();
  assert.deepEqual((await rawStore("activeSession"))[0].answers, saved.answers);
  assert.deepEqual((await rawStore("activeSession"))[0].results, {});
  assert.equal((await rawStore("answerEvents")).length, 0);
  record("draft-reload-and-escape", { answers: saved.answers });
  await open();
  await checkedClick(button("EN"), "topbar-language-en");
  await checkedClick(button("Tap ZH"), "topbar-language-tap");
  await checkedClick(page.locator(".session-topbar > button"), "exit-study", {
    navigation: true,
  });
  await page.locator(".study-workspace").waitFor();
  assert.equal(
    await page.locator('.exam-calculator, [style*="--calculator-"]').count(),
    0,
  );
  record("exit-cleans-reservation");
  await seed();
  await open();
  await checkedClick(button("Skip for now"), "skip-open", { navigation: true });
  await identity();
  assert.equal((await rawStore("activeSession"))[0].index, 1);
  await open();
  await checkedClick(button("End set"), "end-open", { navigation: true });
  assert.equal(await page.locator(".session-shell").count(), 0);
  record("skip-end-path");
}

async function consoleProof() {
  const manifestUrl = new URL("manifest.webmanifest", url).href;
  let corsCount = 0;
  let pairedCount = 0;
  for (const e of report.console) {
    // Only the inherited file manifest CORS diagnostic and its URL-attributed pair.
    const inheritedCors =
      new URL(url).protocol === "file:" &&
      e.type === "error" &&
      e.message.startsWith(`Access to manifest at '${manifestUrl}'`) &&
      e.message.includes("from origin 'null' has been blocked by CORS policy");
    const inheritedPair =
      new URL(url).protocol === "file:" &&
      e.type === "error" &&
      e.message === "Failed to load resource: net::ERR_FAILED" &&
      e.location?.url === manifestUrl;
    if (inheritedCors) corsCount++;
    if (inheritedPair) pairedCount++;
    e.allowedInheritedManifest = inheritedCors || inheritedPair;
    assert(
      e.allowedInheritedManifest,
      `Unexpected browser diagnostic: ${JSON.stringify(e)}`,
    );
  }
  assert.equal(
    corsCount,
    pairedCount,
    "Manifest CORS diagnostics must have URL-attributed ERR_FAILED pairs",
  );
}

try {
  await page.goto(url);
  await page.locator(".study-workspace").waitFor();
  await page.waitForFunction(
    () => !document.querySelector(".test-start")?.disabled,
  );
  report.userAgent = await page.evaluate(() => navigator.userAgent);
  if (process.argv.includes("--baseline-height")) {
    await baselineHeight();
    report.status = "OBSERVED";
  } else {
    await baselineAndWitness();
    if (!process.argv.includes("--witness-only")) {
      if (new URL(url).protocol === "file:") {
        await core({ width: 390, height: 844 }, "file-normal");
      } else {
        for (const [width, height] of [
          [390, 844],
          [320, 740],
        ])
          for (const text of ["default", "large"])
            await core({ width, height, text }, `normal-${width}-${text}`);
        await reduced({ width: 390, height: 568 }, "short-portrait");
        await reduced({ width: 667, height: 375 }, "short-landscape");
        await content(
          "matrix",
          { width: 390, height: 844, text: "large", theme: "dark" },
          "matrix-dark-large",
        );
        await content(
          "cloze",
          { width: 320, height: 740, text: "compact" },
          "cloze-compact",
        );
        await caseRun();
        await persistence();
        await caseRun(
          { width: 667, height: 375, reduced: true },
          "case-reduced",
        );
        await core(
          { width: 390, height: 844, inset: 24 },
          "simulated-inset-normal",
        );
        await reduced(
          { width: 390, height: 568, inset: 24 },
          "simulated-inset-reduced",
        );
        await runDesktopPreview({
          getPage: () => page,
          seed,
          tick,
          record,
          shot,
          explicitScroll,
        });
      }
    }
    await consoleProof();
    report.status = "PASS";
  }
} catch (e) {
  report.status = e.code ?? "FAIL";
  report.error = e.stack;
  await shot("failure").catch(() => {});
  process.exitCode = 1;
} finally {
  save();
  await context.close();
  rmSync(profile, { recursive: true, force: true });
}
console.log(
  JSON.stringify({
    status: report.status,
    error: report.error,
    checks: report.checks.length,
  }),
);
