import { useLayoutEffect, type RefObject } from "react";

// Presentation only: the Study sheet sits above the actual current action rows.
// Preview has no Study reservation. No geometry survives close or unmount.
export function useCalculatorLayout(
  rootRef: RefObject<HTMLDivElement | null>,
  open: boolean,
  mobile: boolean,
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const shell = root?.closest<HTMLElement>(".session-shell");
    if (!root || !shell || !open || !mobile) return;
    const properties = [
      "--calculator-actions-height",
      "--calculator-topbar-height",
      "--calculator-submit-height",
      "--calculator-sheet-height",
    ];
    const observed = new Set<Element>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const elements = [
        shell.querySelector<HTMLElement>(":scope > .session-actions"),
        shell.querySelector<HTMLElement>(":scope > .session-topbar"),
        shell.querySelector<HTMLElement>(".submit-button"),
        root.querySelector<HTMLElement>(".exam-calculator"),
      ];
      elements.forEach((element, index) => {
        const height = element?.getBoundingClientRect().height ?? 0;
        const value = `${height}px`;
        if (shell.style.getPropertyValue(properties[index]) !== value)
          shell.style.setProperty(properties[index], value);
        if (element && !observed.has(element)) {
          observer.observe(element);
          observed.add(element);
        }
      });
      for (const element of observed)
        if (!elements.includes(element as HTMLElement)) {
          observer.unobserve(element);
          observed.delete(element);
        }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    const mutations = new MutationObserver(schedule);
    mutations.observe(shell, { childList: true, subtree: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      properties.forEach((property) => shell.style.removeProperty(property));
    };
  }, [rootRef, open, mobile]);
}
