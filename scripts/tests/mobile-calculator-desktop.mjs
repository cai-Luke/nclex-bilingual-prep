import assert from "node:assert/strict";

/**
 * Bounded desktop/crossover/Preview contribution to the R3 producer runner.
 * api: { getPage, seed(name, viewportOptions), tick, record, shot, explicitScroll }
 * Page is read after every seed because the fixture runner replaces it. All
 * clicks have their own five-point oracle: calculator descendants are exempt
 * only from intersection with their containing calculator, never hit testing.
 */
export async function runDesktopPreview(api) {
  const { seed, tick, record, shot, explicitScroll } = api;
  const page = () => api.getPage();
  const button = (name) => page().getByRole("button", { name, exact: true });

  async function sample(target, label) {
    const before = await page().evaluate(() => scrollY);
    const details = await target.evaluate((el) => {
      const box = (node) => {
        if (!node) return null;
        const r = node.getBoundingClientRect();
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
      const t = box(el),
        p = box(panel);
      const positions = [
        [t.left + t.width / 2, t.top + t.height / 2],
        [t.left + 4, t.top + 4],
        [t.right - 4, t.top + 4],
        [t.left + 4, t.bottom - 4],
        [t.right - 4, t.bottom - 4],
      ];
      return {
        target: t,
        panel: p,
        calculatorDescendant: panel === el || !!panel?.contains(el),
        disabled: !!el.disabled,
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
        hits: positions.map(([x, y]) => {
          const hit = document.elementFromPoint(x, y);
          return {
            x,
            y,
            hit: hit
              ? `${hit.tagName}.${String(hit.className)} ${hit.textContent?.trim().slice(0, 80)}`
              : null,
            inside: !!hit && (el === hit || el.contains(hit)),
          };
        }),
        viewport: { width: innerWidth, height: innerHeight },
        visualViewport: visualViewport
          ? {
              width: visualViewport.width,
              height: visualViewport.height,
              offsetTop: visualViewport.offsetTop,
            }
          : null,
        theme: document.documentElement.dataset.theme,
        text: document.documentElement.dataset.textSize,
        scrollY,
      };
    });
    details.label = label;
    details.scrollBefore = before;
    details.scrollAfter = await page().evaluate(() => scrollY);
    record("desktop-preview-geometry", details);
    const t = details.target;
    assert(t.width > 0 && t.height > 0, `${label}: MISSING_TARGET`);
    assert(
      t.top >= -1 &&
        t.left >= -1 &&
        t.right <= details.viewport.width + 1 &&
        t.bottom <= details.viewport.height + 1,
      `${label}: OFFSCREEN_TARGET`,
    );
    assert.equal(
      details.scrollBefore,
      details.scrollAfter,
      `${label}: AUTO_SCROLL_INVALID`,
    );
    if (
      (!details.calculatorDescendant &&
        details.intersection?.width > 1 &&
        details.intersection?.height > 1) ||
      details.hits.some((hit) => !hit.inside)
    ) {
      const error = new Error(`OVERLAP: ${label}`);
      error.code = "OVERLAP";
      throw error;
    }
    assert(!details.disabled, `${label}: DISABLED_TARGET`);
    return details;
  }

  async function click(
    target,
    label,
    { navigation = false, reach = false } = {},
  ) {
    if (reach) {
      const requested = await target.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 0 || r.bottom > innerHeight
          ? scrollY + r.top - Math.min(180, innerHeight / 3)
          : null;
      });
      if (requested !== null) await explicitScroll(requested, `${label}-reach`);
    }
    await sample(target, label);
    const before = await page().evaluate(() => {
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
    const pointerY = await page().evaluate(() => window.__calculatorPointerY);
    assert.equal(pointerY, before, `${label}: AUTO_SCROLL_BEFORE_POINTER`);
    const after = await page().evaluate(() => scrollY);
    record("desktop-preview-ordinary-click", {
      label,
      before,
      pointerY,
      after,
      expectedNavigation: navigation,
    });
    if (!navigation)
      assert.equal(before, after, `${label}: AUTO_SCROLL_INVALID click`);
    await tick();
  }

  async function geometry(label, mobile) {
    const result = await page()
      .locator(".exam-calculator")
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        const card = document.querySelector(".session-shell > .question-card");
        const shell = document.querySelector(".session-shell");
        const split = card?.querySelector(".exam-split-layout");
        const chart = card?.querySelector(".exam-split-chart-pane");
        const footer = card?.querySelector(".case-work-footer");
        const style = getComputedStyle(el);
        return {
          panel: {
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
          },
          viewport: { width: innerWidth, height: innerHeight },
          scrollY,
          mobile: matchMedia("(max-width: 780px)").matches,
          narrowCase: matchMedia("(max-width: 820px)").matches,
          splitGridColumns: split
            ? getComputedStyle(split).gridTemplateColumns
            : null,
          caseChartOverflow: chart ? getComputedStyle(chart).overflowY : null,
          caseFooterDisplay: footer ? getComputedStyle(footer).display : null,
          cardReserveSelector: card?.matches(
            ".session-shell:has(> .exam-calculator-root .exam-calculator) > .question-card",
          ),
          cardPaddingRight: card ? getComputedStyle(card).paddingRight : null,
          position: {
            left: style.left,
            right: style.right,
            top: style.top,
            bottom: style.bottom,
            transform: style.transform,
          },
          inlinePanelStyle: el.getAttribute("style"),
          measuredStudyOffsets: shell
            ? Object.fromEntries(
                [
                  "--calculator-actions-height",
                  "--calculator-topbar-height",
                  "--calculator-submit-height",
                  "--calculator-sheet-height",
                ].map((k) => [k, shell.style.getPropertyValue(k)]),
              )
            : null,
          horizontalOverflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        };
      });
    record("desktop-crossover-panel", { label, ...result });
    const p = result.panel;
    assert(p.width > 0 && p.height > 0);
    assert(
      p.left >= -1 &&
        p.right <= result.viewport.width + 1 &&
        p.top >= -1 &&
        p.bottom <= result.viewport.height + 1,
      `${label}: panel outside viewport`,
    );
    assert.equal(result.mobile, mobile);
    if (mobile) {
      assert(
        Math.abs(p.left - 8) <= 1 &&
          Math.abs(p.right - (result.viewport.width - 8)) <= 1,
        `${label}: stale desktop horizontal offset`,
      );
      assert(
        !result.inlinePanelStyle,
        `${label}: desktop inline coordinates must not apply on mobile`,
      );
    } else {
      assert.equal(
        result.cardReserveSelector,
        true,
        `${label}: desktop :has reserve selector no longer matches`,
      );
      assert.equal(
        result.cardPaddingRight,
        "320px",
        `${label}: desktop right reserve changed`,
      );
      assert(
        Object.values(result.measuredStudyOffsets).every(
          (value) => value === "",
        ),
        `${label}: stale mobile measurement`,
      );
    }
    assert(result.horizontalOverflow <= 1, `${label}: horizontal overflow`);
    return result;
  }

  async function drag(toX, toY, label) {
    const header = page().locator(".exam-calculator-header");
    await sample(header, `${label}-header`);
    const r = await header.boundingBox();
    const before = await page().evaluate(() => scrollY);
    await page().mouse.move(r.x + 34, r.y + r.height / 2);
    await page().mouse.down();
    await page().mouse.move(toX, toY, { steps: 8 });
    await page().mouse.up();
    await tick();
    assert.equal(
      await page().evaluate(() => scrollY),
      before,
      `${label}: drag scrolled document`,
    );
    return geometry(label, false);
  }

  await seed("ordinary", { width: 1440, height: 900 });
  await click(button("Open calculator"), "desktop-open", { reach: true });
  assert(
    await page()
      .locator(".exam-calculator")
      .evaluate((el) => document.activeElement === el),
  );
  await geometry("desktop-initial", false);
  const moved = await drag(420, 240, "desktop-drag-interior");
  assert(
    moved.panel.left > 8 && moved.panel.top > 8,
    "desktop drag did not move panel into interior",
  );
  const upper = await drag(-150, -150, "desktop-clamp-top-left");
  assert(
    Math.abs(upper.panel.left - 8) <= 1 && Math.abs(upper.panel.top - 8) <= 1,
  );
  const lower = await drag(1800, 1200, "desktop-clamp-bottom-right");
  assert(
    Math.abs(lower.panel.right - 1432) <= 1 &&
      Math.abs(lower.panel.bottom - 892) <= 1,
  );
  await shot("desktop-drag-clamped");
  await click(button("Minimize calculator"), "desktop-minimize");
  assert.equal(await page().locator(".exam-calculator").count(), 0);
  assert(
    await button("Open calculator").evaluate(
      (el) => document.activeElement === el,
    ),
  );

  // Use the real case fixture so 781–820 checks exercise the narrow case layout
  // concurrently with the desktop calculator breakpoint.
  await seed("case", { width: 1440, height: 900 });
  await click(button("Open calculator"), "case-crossover-open", {
    reach: true,
  });
  await drag(1300, 750, "case-crossover-initial-drag");
  for (const width of [780, 781, 820, 821, 390]) {
    await page().setViewportSize({ width, height: 900 });
    await tick();
    await tick();
    const result = await geometry(`crossover-${width}`, width <= 780);
    assert.equal(result.narrowCase, width <= 820);
    assert(
      result.splitGridColumns,
      "case fixture must render the existing split layout",
    );
    // Accepted cases already use one column at desktop too; the 820/821
    // distinction is chart scrolling and the desktop footer row, not columns.
    assert.equal(
      result.caseChartOverflow,
      width <= 820 ? "visible" : "auto",
      `case chart breakpoint at ${width}`,
    );
    if (width > 820)
      assert.equal(
        result.caseFooterDisplay,
        "flex",
        `case footer breakpoint at ${width}`,
      );
    await sample(
      button("Minimize calculator"),
      `crossover-${width}-minimize-reachable`,
    );
    await shot(`crossover-${width}`);
  }
  await click(button("Minimize calculator"), "crossover-final-minimize");
  const cleaned = await page()
    .locator(".session-shell")
    .evaluate((el) =>
      Object.fromEntries(
        [
          "--calculator-actions-height",
          "--calculator-topbar-height",
          "--calculator-submit-height",
          "--calculator-sheet-height",
        ].map((k) => [k, el.style.getPropertyValue(k)]),
      ),
    );
  assert(Object.values(cleaned).every((value) => value === ""));
  record("crossover-close-cleanup", { measuredStudyOffsets: cleaned });

  // Enable the existing developer entry only in the disposable test profile.
  // No URL qids or production routing changes are needed for Preview Lab.
  await page().evaluate(() => localStorage.setItem("shrimpDevTools", "true"));
  await page().reload();
  await page().locator(".study-workspace").waitFor();
  await page().setViewportSize({ width: 390, height: 844 });
  await tick();
  await explicitScroll(0, "preview-settings-top");
  await click(page().locator(".header-utility"), "preview-settings", {
    navigation: true,
  });
  await click(button("Open Preview Lab"), "preview-entry", {
    navigation: true,
    reach: true,
  });
  await page().locator(".preview-lab-body").waitFor();
  await click(
    page().locator(".preview-calculator-toggle"),
    "preview-enable-calculator",
    { reach: true },
  );
  await click(button("Open calculator"), "preview-open");
  assert.equal(await page().locator(".session-shell").count(), 0);
  const preview = await page()
    .locator(".preview-lab-body")
    .evaluate((el) => {
      const panel = el.querySelector(".exam-calculator");
      const r = panel.getBoundingClientRect();
      const properties = [
        "--calculator-actions-height",
        "--calculator-topbar-height",
        "--calculator-submit-height",
        "--calculator-sheet-height",
      ];
      return {
        panel: { top: r.top, bottom: r.bottom, left: r.left, right: r.right },
        viewport: { width: innerWidth, height: innerHeight },
        bodyPaddingBottom: getComputedStyle(el).paddingBottom,
        bottom: getComputedStyle(panel).bottom,
        inheritedStudyOffsets: Object.fromEntries(
          properties.map((k) => [k, getComputedStyle(el).getPropertyValue(k)]),
        ),
        studyActions: document.querySelectorAll(".session-actions").length,
      };
    });
  assert.equal(preview.studyActions, 0);
  assert(
    Object.values(preview.inheritedStudyOffsets).every((value) => value === ""),
  );
  assert.equal(preview.bottom, "0px");
  assert(Math.abs(preview.panel.bottom - preview.viewport.height) <= 1);
  record("preview-no-study-reservation", preview);
  for (const key of ["2", "+", "3", "Equals"])
    await click(
      page()
        .locator(".exam-calculator-keypad")
        .getByRole("button", { name: key, exact: true }),
      `preview-key-${key}`,
    );
  assert.equal(
    (await page().locator(".exam-calculator-display").innerText()).trim(),
    "5",
  );
  await shot("preview-narrow-arithmetic");
  await click(button("Minimize calculator"), "preview-minimize");
  assert(
    await button("Open calculator").evaluate(
      (el) => document.activeElement === el,
    ),
  );
  record("desktop-preview-result", {
    status: "PASS",
    arithmetic: "2 + 3 = 5",
    focusReturned: true,
    desktopGuarantee:
      "dragging and viewport clamping preserved; deliberate dragged-overlay content clearance is not asserted",
  });
}
