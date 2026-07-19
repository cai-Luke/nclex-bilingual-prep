import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Maximize2, X } from "lucide-react";
import {
  buildEpicModel,
  EPIC_VITALS_LAYOUT,
  renderVitalsTrendSvg,
  type EpicVitalsLegendEntry,
  type EpicVitalsModel,
} from "./index";
import type { VitalsTrendSpec } from "./types";
import {
  EMPTY_VITALS_TREND_INTERACTION,
  opacityForVital,
  resolveActiveLegend,
  resolveActiveTimepoint,
  transitionVitalsTrendInteraction,
  type VitalsTrendInteractionEvent,
} from "./interaction";

type VitalsTrendInteractiveProps = {
  visual: VitalsTrendSpec;
  caption?: string;
};

const stopPointerPropagation = (event: PointerEvent<HTMLElement>) => event.stopPropagation();
const stopKeyboardPropagation = (event: KeyboardEvent<HTMLElement>) => event.stopPropagation();

const percent = (value: number, total: number) => `${(value / total) * 100}%`;

const timepointGeometry = (model: EpicVitalsModel, index: number) => {
  const layout = EPIC_VITALS_LAYOUT;
  const values = model.timepoints.map((timepoint) => timepoint.value);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 1;
  const mapX = (value: number) => max <= min
    ? layout.plotLeft + (layout.plotRight - layout.plotLeft) / 2
    : layout.plotLeft + ((value - min) / (max - min)) * (layout.plotRight - layout.plotLeft);
  const x = mapX(values[index] ?? min);
  const priorX = index > 0 ? mapX(values[index - 1]) : layout.plotLeft;
  const nextX = index < values.length - 1 ? mapX(values[index + 1]) : layout.plotRight;
  return {
    x,
    left: index === 0 ? layout.plotLeft : (priorX + x) / 2,
    right: index === values.length - 1 ? layout.plotRight : (x + nextX) / 2,
  };
};

function EpicVitalsGraphic({
  visual,
  caption,
  onActivate,
}: VitalsTrendInteractiveProps & { onActivate?: () => void }) {
  const model = useMemo(() => buildEpicModel(visual), [visual]);
  const svg = useMemo(() => renderVitalsTrendSvg(visual, { variant: "epic" }), [visual]);
  const [interaction, setInteraction] = useState(EMPTY_VITALS_TREND_INTERACTION);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeTimepoint = resolveActiveTimepoint(interaction);
  const activeLegend = resolveActiveLegend(interaction);
  const readout = activeTimepoint === null ? undefined : model.readoutByTimepoint[activeTimepoint];

  const dispatch = useCallback((event: VitalsTrendInteractionEvent) => {
    setInteraction((current) => transitionVitalsTrendInteraction(current, event));
  }, []);

  // React may recommit the deterministic innerHTML when pin state changes even
  // if the resolved hover/pin target is unchanged, so resync after every commit.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.querySelectorAll<SVGGElement>("[data-vital]").forEach((group) => {
      const vital = group.dataset.vital ?? "";
      group.setAttribute("opacity", String(opacityForVital(vital, activeLegend, model.legend)));
    });
    const guide = stage.querySelector<SVGLineElement>("[data-guide-line='true']");
    if (!guide) return;
    if (activeTimepoint === null) {
      guide.setAttribute("opacity", "0");
      return;
    }
    const { x } = timepointGeometry(model, activeTimepoint);
    guide.setAttribute("x1", String(x));
    guide.setAttribute("x2", String(x));
    guide.setAttribute("opacity", "1");
  });

  const handleLegendEnter = (entry: EpicVitalsLegendEntry) =>
    dispatch({ type: "legend-enter", key: entry.key });
  const handleLegendLeave = (entry: EpicVitalsLegendEntry) =>
    dispatch({ type: "legend-leave", key: entry.key });

  return (
    <figure
      className={`rhythm-strip vitals-epic-figure ${onActivate ? "visual-enlarge-target" : ""}`}
      title={onActivate ? "Enlarge visual / 放大图像" : undefined}
    >
      <div className="vitals-epic-scroll">
        <div className="vitals-epic-stage" ref={stageRef} onClick={onActivate}>
          <div
            className="rhythm-strip-svg vis-vitals_trend vis-vitals_trend-epic"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <div className="vitals-epic-controls" aria-label="Interactive vital trends controls">
          {model.legend.map((entry, index) => {
            const column = index % EPIC_VITALS_LAYOUT.legendColumns;
            const row = Math.floor(index / EPIC_VITALS_LAYOUT.legendColumns);
            const left = EPIC_VITALS_LAYOUT.legendLeft + column * EPIC_VITALS_LAYOUT.legendCellWidth;
            const top = EPIC_VITALS_LAYOUT.legendTop + row * EPIC_VITALS_LAYOUT.legendCellHeight;
            return (
              <button
                className="vitals-epic-legend-button"
                type="button"
                key={entry.key}
                aria-label={`Emphasize ${entry.label} (${entry.unit})`}
                aria-pressed={interaction.pinnedLegend === entry.key}
                style={{
                  left: percent(left, EPIC_VITALS_LAYOUT.width),
                  top: percent(top, EPIC_VITALS_LAYOUT.height),
                  width: percent(EPIC_VITALS_LAYOUT.legendCellWidth, EPIC_VITALS_LAYOUT.width),
                  height: percent(EPIC_VITALS_LAYOUT.legendCellHeight, EPIC_VITALS_LAYOUT.height),
                }}
                onPointerEnter={(event) => { event.stopPropagation(); handleLegendEnter(entry); }}
                onPointerLeave={(event) => { event.stopPropagation(); handleLegendLeave(entry); }}
                onMouseEnter={(event) => { event.stopPropagation(); handleLegendEnter(entry); }}
                onMouseLeave={(event) => { event.stopPropagation(); handleLegendLeave(entry); }}
                onFocus={() => handleLegendEnter(entry)}
                onBlur={() => handleLegendLeave(entry)}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "legend-activate", key: entry.key });
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  stopKeyboardPropagation(event);
                  event.preventDefault();
                  dispatch({ type: "legend-activate", key: entry.key });
                }}
              />
            );
          })}
          {model.timepoints.map((timepoint) => {
            const geometry = timepointGeometry(model, timepoint.index);
            return (
              <button
                className="vitals-epic-timepoint-button"
                type="button"
                key={timepoint.index}
                aria-label={`Show all vital signs at ${timepoint.label}`}
                aria-pressed={interaction.pinnedTimepoint === timepoint.index}
                style={{
                  left: percent(geometry.left, EPIC_VITALS_LAYOUT.width),
                  top: percent(EPIC_VITALS_LAYOUT.plotTop, EPIC_VITALS_LAYOUT.height),
                  width: percent(geometry.right - geometry.left, EPIC_VITALS_LAYOUT.width),
                  height: percent(
                    EPIC_VITALS_LAYOUT.plotBottom - EPIC_VITALS_LAYOUT.plotTop,
                    EPIC_VITALS_LAYOUT.height,
                  ),
                }}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "timepoint-enter", index: timepoint.index });
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "timepoint-leave", index: timepoint.index });
                }}
                onMouseEnter={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "timepoint-enter", index: timepoint.index });
                }}
                onMouseLeave={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "timepoint-leave", index: timepoint.index });
                }}
                onFocus={() => dispatch({ type: "timepoint-enter", index: timepoint.index })}
                onBlur={() => dispatch({ type: "timepoint-leave", index: timepoint.index })}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "timepoint-activate", index: timepoint.index });
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  stopKeyboardPropagation(event);
                  event.preventDefault();
                  dispatch({ type: "timepoint-activate", index: timepoint.index });
                }}
              />
            );
          })}
          </div>
        </div>
      </div>

      <div className="vitals-epic-readout" aria-live="polite">
        {readout ? (
          <>
            <div className="vitals-epic-readout-heading">
              <strong>{readout.timeLabel}</strong>
              <button
                type="button"
                className="secondary-action"
                onPointerDown={stopPointerPropagation}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch({ type: "timepoint-clear" });
                }}
              >
                Clear / <span lang="zh-Hans">清除</span>
              </button>
            </div>
            <dl>
              {readout.rows.map((row) => (
                <div key={row.key}>
                  <dt>{row.label}</dt>
                  <dd>{row.valueText}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p>Hover, focus, or tap a time column to show exact values. / <span lang="zh-Hans">悬停、聚焦或轻触时间列以查看精确数值。</span></p>
        )}
      </div>

      <div className="vitals-epic-table-scroll">
        <table className="vitals-epic-accessible-table">
          <caption>Vital signs values / <span lang="zh-Hans">生命体征数值</span></caption>
          <thead>
            <tr>
              {model.tableModel.columns.map((column) => <th scope="col" key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {model.tableModel.rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => <td key={`${row.key}-${index}`}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function VitalsTrendInteractiveStimulus({ visual, caption }: VitalsTrendInteractiveProps) {
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
  const closeDialog = useCallback(() => dialogRef.current?.close(), []);
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
        className="visual-stimulus vitals-epic-stimulus"
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
            <EpicVitalsGraphic visual={visual} caption={caption} onActivate={openVisual} />
          </>
        )}
      </div>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="visual-focus-dialog vitals-epic-focus-dialog"
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
              <EpicVitalsGraphic visual={visual} caption={caption} />
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
