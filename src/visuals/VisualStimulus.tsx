import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Maximize2, X } from "lucide-react";
import type { LanguageMode } from "../types";
import { getVisual } from "./registry";
import type { QuestionVisual } from "./types";

type RenderedVisual = {
  visual: QuestionVisual;
  svg: string;
  caption: string | undefined;
};

function VisualGraphic({
  rendered,
  onActivate,
}: {
  rendered: RenderedVisual;
  onActivate?: () => void;
}) {
  const { visual, svg, caption } = rendered;
  const shapeClass =
    visual.kind === "lab_trend" && visual.series.length === 1
      ? "vis-lab_trend-single-series"
      : "";
  const svgClassName = ["rhythm-strip-svg", `vis-${visual.kind}`, shapeClass]
    .filter(Boolean)
    .join(" ");
  return (
    <figure
      className={`rhythm-strip ${onActivate ? "visual-enlarge-target" : ""}`}
      role="img"
      aria-label={visual.caption?.en ?? "clinical visual"}
      onClick={onActivate}
      title={onActivate ? "Enlarge visual / 放大图像" : undefined}
    >
      <div
        className={svgClassName}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/**
 * Single kind-agnostic dispatcher. Replaces the inline `visual?.kind === ...`
 * branches in App.tsx. Looks the kind up in the registry, renders our own
 * deterministic SVG (never user HTML), and adds one shared focus-mode interaction
 * without changing any kind renderer or its output.
 */
export function VisualStimulus({
  visual,
  languageMode,
}: {
  visual?: QuestionVisual;
  languageMode: LanguageMode;
}) {
  if (!visual) return null;
  const mod = getVisual(visual.kind);
  if (!mod) return null; // graceful no-op on unknown kind

  const svg = mod.renderSvg(visual); // our own deterministic SVG, not user HTML
  const caption =
    visual.caption &&
    (languageMode === "always" && visual.caption.zh
      ? `${visual.caption.en} / ${visual.caption.zh}`
      : visual.caption.en);

  return <InteractiveVisualStimulus rendered={{ visual, svg, caption }} />;
}

function InteractiveVisualStimulus({ rendered }: { rendered: RenderedVisual }) {
  const [isOpen, setIsOpen] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const restoreFocusRef = useRef(false);
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const previousBodyOverflowRef = useRef("");
  const titleId = useId();

  const openVisual = useCallback(() => {
    const shell = shellRef.current;
    setPlaceholderHeight(shell ? shell.getBoundingClientRect().height : 0);
    scrollPositionRef.current = { x: window.scrollX, y: window.scrollY };
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleDialogClosed = useCallback(() => {
    restoreFocusRef.current = true;
    setIsOpen(false);
  }, []);

  const handleDialogBackdrop = useCallback((event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  }, [closeDialog]);

  const handleDialogKeyDown = useCallback((event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeDialog();
  }, [closeDialog]);

  useEffect(() => {
    if (!isOpen) {
      if (!restoreFocusRef.current) return;
      restoreFocusRef.current = false;
      const frame = window.requestAnimationFrame(() => {
        const { x, y } = scrollPositionRef.current;
        triggerRef.current?.focus({ preventScroll: true });
        window.scrollTo(x, y);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const dialog = dialogRef.current;
    if (!dialog) return;

    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();

    const closeBeforePrint = () => dialog.close();
    window.addEventListener("beforeprint", closeBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", closeBeforePrint);
      document.body.style.overflow = previousBodyOverflowRef.current;
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={shellRef}
        className="visual-stimulus"
        style={isOpen && placeholderHeight > 0 ? { minHeight: placeholderHeight } : undefined}
      >
        {!isOpen && (
          <>
            <button
              ref={triggerRef}
              className="secondary-action visual-enlarge-button"
              type="button"
              aria-label="Enlarge visual / 放大图像"
              onClick={openVisual}
            >
              <Maximize2 aria-hidden="true" />
              <span>Enlarge visual / <span lang="zh-Hans">放大图像</span></span>
            </button>
            <VisualGraphic rendered={rendered} onActivate={openVisual} />
          </>
        )}
      </div>

      {isOpen && (
        <dialog
          ref={dialogRef}
          className="visual-focus-dialog"
          aria-labelledby={titleId}
          onClick={handleDialogBackdrop}
          onClose={handleDialogClosed}
          onKeyDown={handleDialogKeyDown}
        >
          <div className="visual-focus-panel">
            <header className="visual-focus-header">
              <h2 id={titleId}>Expanded visual / <span lang="zh-Hans">放大图像</span></h2>
              <button className="secondary-action visual-focus-close" type="button" onClick={closeDialog} autoFocus>
                <X aria-hidden="true" />
                <span>Close / <span lang="zh-Hans">关闭</span></span>
              </button>
            </header>
            <div className="visual-focus-body">
              <VisualGraphic rendered={rendered} />
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
