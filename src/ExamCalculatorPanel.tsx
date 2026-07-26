import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
} from "react";
import { Calculator as CalculatorIcon, Delete, X } from "lucide-react";
import {
  initialCalculatorState,
  reduceCalculator,
  type CalculatorAction,
  type CalculatorOperator,
} from "./examCalculator";

type Position = { x: number; y: number };
type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

const VIEWPORT_MARGIN = 8;
const MOBILE_QUERY = "(max-width: 780px)";

const operatorGlyphs: Record<CalculatorOperator, string> = {
  divide: "÷",
  multiply: "×",
  subtract: "−",
  add: "+",
};

type CalculatorKey =
  | { label: string; action: CalculatorAction; className?: string; ariaLabel?: string }
  | { label: string; action: CalculatorAction; className: "calculator-zero-key"; ariaLabel?: string };

const keys: CalculatorKey[] = [
  { label: "C", action: { type: "clear" }, className: "calculator-function-key", ariaLabel: "Clear calculator" },
  { label: "±", action: { type: "toggle-sign" }, className: "calculator-function-key", ariaLabel: "Toggle sign" },
  { label: "backspace", action: { type: "backspace" }, className: "calculator-function-key", ariaLabel: "Backspace" },
  { label: "÷", action: { type: "operator", operator: "divide" }, className: "calculator-operator-key" },
  { label: "7", action: { type: "digit", digit: "7" } },
  { label: "8", action: { type: "digit", digit: "8" } },
  { label: "9", action: { type: "digit", digit: "9" } },
  { label: "×", action: { type: "operator", operator: "multiply" }, className: "calculator-operator-key" },
  { label: "4", action: { type: "digit", digit: "4" } },
  { label: "5", action: { type: "digit", digit: "5" } },
  { label: "6", action: { type: "digit", digit: "6" } },
  { label: "−", action: { type: "operator", operator: "subtract" }, className: "calculator-operator-key" },
  { label: "1", action: { type: "digit", digit: "1" } },
  { label: "2", action: { type: "digit", digit: "2" } },
  { label: "3", action: { type: "digit", digit: "3" } },
  { label: "+", action: { type: "operator", operator: "add" }, className: "calculator-operator-key" },
  { label: "0", action: { type: "digit", digit: "0" }, className: "calculator-zero-key" },
  { label: ".", action: { type: "decimal" }, ariaLabel: "Decimal point" },
  { label: "=", action: { type: "equals" }, className: "calculator-equals-key", ariaLabel: "Equals" },
];

const useMobileViewport = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
};

export function ExamCalculator() {
  const [calculator, dispatch] = useReducer(reduceCalculator, undefined, initialCalculatorState);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const isMobile = useMobileViewport();

  const clampPosition = useCallback((candidate: Position): Position => {
    const rect = panelRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 288;
    const height = rect?.height ?? 384;
    return {
      x: Math.min(
        Math.max(VIEWPORT_MARGIN, candidate.x),
        Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN),
      ),
      y: Math.min(
        Math.max(VIEWPORT_MARGIN, candidate.y),
        Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN),
      ),
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => panelRef.current?.focus());
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobile) return;
      setPosition((current) => (current ? clampPosition(current) : current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampPosition, isMobile]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      setPosition(
        clampPosition({
          x: event.clientX - drag.offsetX,
          y: event.clientY - drag.offsetY,
        }),
      );
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [clampPosition]);

  const minimize = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let action: CalculatorAction | null = null;
    if (/^[0-9]$/.test(event.key)) action = { type: "digit", digit: event.key };
    else if (event.key === ".") action = { type: "decimal" };
    else if (event.key === "+") action = { type: "operator", operator: "add" };
    else if (event.key === "-") action = { type: "operator", operator: "subtract" };
    else if (event.key === "*") action = { type: "operator", operator: "multiply" };
    else if (event.key === "/") action = { type: "operator", operator: "divide" };
    else if (event.key === "Enter" || event.key === "=") action = { type: "equals" };
    else if (event.key === "Backspace") action = { type: "backspace" };
    else if (event.key === "Delete") action = { type: "clear" };
    else if (event.key === "Escape") {
      event.preventDefault();
      minimize();
      return;
    }

    if (action) {
      event.preventDefault();
      dispatch(action);
    }
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (
      isMobile ||
      event.button !== 0 ||
      !panelRef.current ||
      (event.target as HTMLElement).closest("button")
    ) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setPosition({ x: rect.left, y: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setPosition(
      clampPosition({
        x: event.clientX - drag.offsetX,
        y: event.clientY - drag.offsetY,
      }),
    );
  };

  const startMouseDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (
      isMobile ||
      event.button !== 0 ||
      dragRef.current ||
      !panelRef.current ||
      (event.target as HTMLElement).closest("button")
    ) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = {
      pointerId: -1,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setPosition({ x: rect.left, y: rect.top });
    event.preventDefault();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const panelStyle: CSSProperties | undefined =
    position && !isMobile
      ? { left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" }
      : undefined;

  return (
    <div className={`exam-calculator-root ${open ? "is-open" : ""}`}>
      {!open && (
        <button
          className="exam-calculator-launcher"
          type="button"
          ref={launcherRef}
          aria-label="Open calculator"
          title="Open calculator"
          onClick={() => setOpen(true)}
        >
          <CalculatorIcon aria-hidden="true" />
          <span>Calculator</span>
        </button>
      )}

      {open && (
        <div
          className="exam-calculator"
          role="dialog"
          aria-modal="false"
          aria-label="Calculator"
          tabIndex={-1}
          ref={panelRef}
          style={panelStyle}
          onKeyDown={handleKeyDown}
        >
          <div
            className="exam-calculator-header"
            onMouseDown={startMouseDrag}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div>
              <CalculatorIcon aria-hidden="true" />
              <strong>Calculator</strong>
            </div>
            <button
              className="exam-calculator-close"
              type="button"
              aria-label="Minimize calculator"
              title="Minimize calculator"
              onClick={minimize}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <output className="exam-calculator-display" aria-live="polite">
            {calculator.display}
          </output>

          <div className="exam-calculator-keypad" aria-label="Calculator keypad">
            {keys.map((key, index) => (
              <button
                className={key.className}
                type="button"
                aria-label={key.ariaLabel}
                key={`${key.label}-${index}`}
                onClick={() => dispatch(key.action)}
              >
                {key.label === "backspace" ? <Delete aria-hidden="true" /> : key.label}
              </button>
            ))}
          </div>

          <span className="sr-only">
            Pending operator: {calculator.pendingOperator ? operatorGlyphs[calculator.pendingOperator] : "none"}
          </span>
        </div>
      )}
    </div>
  );
}
