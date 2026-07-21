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
  buildLabTrendPresentationModel,
  formatLabTrendLabelWithUnit,
  LAB_TREND_PRESENTATION_LAYOUT,
  renderLabTrendPresentationSvg,
  type LabTrendLegendEntry,
  type NormalizedLabTrendPresentationModel,
} from "./index";
import type { LabTrendSpec } from "./types";
import {
  EMPTY_LAB_TREND_INTERACTION,
  opacityForLabAnalyte,
  resolveActiveLabTimepoint,
  transitionLabTrendInteraction,
  type LabTrendInteractionEvent,
  type LabTrendInteractionState,
} from "./interaction";

type LabTrendInteractiveProps = {
  visual: LabTrendSpec;
  caption?: string;
};

const stopPointerPropagation = (event: PointerEvent<HTMLElement>) => event.stopPropagation();
const stopKeyboardPropagation = (event: KeyboardEvent<HTMLElement>) => event.stopPropagation();
const percent = (value: number, total: number) => `${(value / total) * 100}%`;

const timepointGeometry = (model: NormalizedLabTrendPresentationModel, index: number) => {
  const layout = LAB_TREND_PRESENTATION_LAYOUT;
  const values = model.timepoints.map((timepoint) => timepoint.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
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

function LabTrendGraphic({
  visual,
  caption,
  onActivate,
  interaction,
  dispatch,
}: LabTrendInteractiveProps & {
  onActivate?: () => void;
  interaction: LabTrendInteractionState;
  dispatch: (event: LabTrendInteractionEvent) => void;
}) {
  const model = useMemo(() => buildLabTrendPresentationModel(visual), [visual]);
  const svg = useMemo(() => renderLabTrendPresentationSvg(visual, model), [model, visual]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeTimepoint = resolveActiveLabTimepoint(interaction);
  const activeLegend = interaction.hoveredLegend;
  const readout = activeTimepoint === null ? undefined : model.readoutByTimepoint[activeTimepoint];

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || model.mode !== "normalized") return;
    stage.querySelectorAll<SVGGElement>("[data-analyte]").forEach((group) => {
      const analyte = group.dataset.analyte ?? "";
      group.setAttribute("opacity", String(opacityForLabAnalyte(analyte, activeLegend)));
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

  const handleLegendEnter = (entry: LabTrendLegendEntry) =>
    dispatch({ type: "legend-enter", key: entry.key });
  const handleLegendLeave = (entry: LabTrendLegendEntry) =>
    dispatch({ type: "legend-leave", key: entry.key });

  return (
    <figure className={`rhythm-strip lab-trend-epic-figure ${onActivate ? "visual-enlarge-target" : ""}`}>
      <div className="lab-trend-epic-scroll">
        <div
          className={`lab-trend-epic-stage ${model.mode === "legacy_fallback" ? "lab-trend-legacy-fallback" : ""}`}
          ref={stageRef}
          onClick={onActivate}
          title={onActivate ? "Enlarge visual / 放大图像" : undefined}
        >
          <div
            className={`rhythm-strip-svg vis-lab_trend ${model.mode === "normalized" ? "vis-lab_trend-epic" : ""}`}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          {model.mode === "normalized" && (
            <div className="lab-trend-epic-controls" aria-label="Interactive laboratory trend controls / 交互式实验室趋势控件">
              {model.legend.map((entry, index) => {
                const left = LAB_TREND_PRESENTATION_LAYOUT.legendLeft + index * LAB_TREND_PRESENTATION_LAYOUT.legendCellWidth;
                const top = LAB_TREND_PRESENTATION_LAYOUT.legendTop;
                return (
                  <button
                    className="lab-trend-epic-legend-button"
                    type="button"
                    key={entry.key}
                    aria-label={`Emphasize ${formatLabTrendLabelWithUnit(entry.label, entry.unit)} / 突出显示 ${entry.label}`}
                    style={{
                      left: percent(left, LAB_TREND_PRESENTATION_LAYOUT.width),
                      top: percent(top, LAB_TREND_PRESENTATION_LAYOUT.height),
                      width: percent(LAB_TREND_PRESENTATION_LAYOUT.legendCellWidth, LAB_TREND_PRESENTATION_LAYOUT.width),
                      height: percent(LAB_TREND_PRESENTATION_LAYOUT.legendCellHeight, LAB_TREND_PRESENTATION_LAYOUT.height),
                    }}
                    onPointerEnter={(event) => { event.stopPropagation(); handleLegendEnter(entry); }}
                    onPointerLeave={(event) => { event.stopPropagation(); handleLegendLeave(entry); }}
                    onMouseEnter={(event) => { event.stopPropagation(); handleLegendEnter(entry); }}
                    onMouseLeave={(event) => { event.stopPropagation(); handleLegendLeave(entry); }}
                    onFocus={() => handleLegendEnter(entry)}
                    onBlur={() => handleLegendLeave(entry)}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      stopKeyboardPropagation(event);
                      event.preventDefault();
                    }}
                  />
                );
              })}
              {model.timepoints.map((timepoint) => {
                const geometry = timepointGeometry(model, timepoint.index);
                return (
                  <button
                    className="lab-trend-epic-timepoint-button"
                    type="button"
                    key={timepoint.index}
                    aria-label={`Show laboratory values at ${timepoint.label} / 显示 ${timepoint.label} 的实验室数值`}
                    aria-pressed={interaction.pinnedTimepoint === timepoint.index}
                    style={{
                      left: percent(geometry.left, LAB_TREND_PRESENTATION_LAYOUT.width),
                      top: percent(LAB_TREND_PRESENTATION_LAYOUT.plotTop, LAB_TREND_PRESENTATION_LAYOUT.height),
                      width: percent(geometry.right - geometry.left, LAB_TREND_PRESENTATION_LAYOUT.width),
                      height: percent(
                        LAB_TREND_PRESENTATION_LAYOUT.plotBottom - LAB_TREND_PRESENTATION_LAYOUT.plotTop,
                        LAB_TREND_PRESENTATION_LAYOUT.height,
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
          )}
        </div>
      </div>

      {model.mode === "normalized" && (
        <div className="lab-trend-epic-readout" aria-live="polite">
          {readout ? (
            <>
              <div className="lab-trend-epic-readout-heading">
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
      )}

      <div className="lab-trend-epic-table-scroll">
        <table className="lab-trend-epic-table">
          <caption>Laboratory values / <span lang="zh-Hans">实验室数值</span></caption>
          <thead>
            <tr>
              {model.tableModel.columns.map((column) => <th scope="col" key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {model.tableModel.rows.map((row) => (
              <tr className={activeLegend === row.key ? "is-emphasized" : undefined} key={row.key}>
                <th scope="row">{formatLabTrendLabelWithUnit(row.label, row.unit)}</th>
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

export function LabTrendInteractiveStimulus({ visual, caption }: LabTrendInteractiveProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [interaction, setInteraction] = useState(EMPTY_LAB_TREND_INTERACTION);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const restoreFocusRef = useRef(false);
  const scrollPositionRef = useRef({ x: 0, y: 0 });
  const previousBodyOverflowRef = useRef("");
  const titleId = useId();

  const dispatch = useCallback((event: LabTrendInteractionEvent) => {
    setInteraction((current) => transitionLabTrendInteraction(current, event));
  }, []);

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
      let scrollFrame = 0;
      const focusFrame = window.requestAnimationFrame(() => {
        const { x, y } = scrollPositionRef.current;
        triggerRef.current?.focus({ preventScroll: true });
        scrollFrame = window.requestAnimationFrame(() => window.scrollTo(x, y));
      });
      return () => {
        window.cancelAnimationFrame(focusFrame);
        window.cancelAnimationFrame(scrollFrame);
      };
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
        className="visual-stimulus lab-trend-epic-stimulus"
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
            <LabTrendGraphic
              visual={visual}
              caption={caption}
              interaction={interaction}
              dispatch={dispatch}
              onActivate={openVisual}
            />
          </>
        )}
      </div>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="visual-focus-dialog lab-trend-epic-focus-dialog"
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
              <LabTrendGraphic
                visual={visual}
                caption={caption}
                interaction={interaction}
                dispatch={dispatch}
              />
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
