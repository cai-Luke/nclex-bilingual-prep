import type { EpicVitalsLegendEntry } from "./index";

export type VitalsTrendInteractionState = {
  hoveredTimepoint: number | null;
  pinnedTimepoint: number | null;
  hoveredLegend: EpicVitalsLegendEntry["key"] | null;
  pinnedLegend: EpicVitalsLegendEntry["key"] | null;
};

export type VitalsTrendInteractionEvent =
  | { type: "timepoint-enter"; index: number }
  | { type: "timepoint-leave"; index: number }
  | { type: "timepoint-activate"; index: number }
  | { type: "timepoint-clear" }
  | { type: "legend-enter"; key: EpicVitalsLegendEntry["key"] }
  | { type: "legend-leave"; key: EpicVitalsLegendEntry["key"] }
  | { type: "legend-activate"; key: EpicVitalsLegendEntry["key"] }
  | { type: "legend-clear" };

export const EMPTY_VITALS_TREND_INTERACTION: VitalsTrendInteractionState = {
  hoveredTimepoint: null,
  pinnedTimepoint: null,
  hoveredLegend: null,
  pinnedLegend: null,
};

export const transitionVitalsTrendInteraction = (
  state: VitalsTrendInteractionState,
  event: VitalsTrendInteractionEvent,
): VitalsTrendInteractionState => {
  switch (event.type) {
    case "timepoint-enter":
      return { ...state, hoveredTimepoint: event.index };
    case "timepoint-leave":
      return state.hoveredTimepoint === event.index ? { ...state, hoveredTimepoint: null } : state;
    case "timepoint-activate":
      return {
        ...state,
        pinnedTimepoint: state.pinnedTimepoint === event.index ? null : event.index,
      };
    case "timepoint-clear":
      return { ...state, hoveredTimepoint: null, pinnedTimepoint: null };
    case "legend-enter":
      return { ...state, hoveredLegend: event.key };
    case "legend-leave":
      return state.hoveredLegend === event.key ? { ...state, hoveredLegend: null } : state;
    case "legend-activate":
      return {
        ...state,
        pinnedLegend: state.pinnedLegend === event.key ? null : event.key,
      };
    case "legend-clear":
      return { ...state, hoveredLegend: null, pinnedLegend: null };
  }
};

export const resolveActiveTimepoint = (state: VitalsTrendInteractionState): number | null =>
  state.hoveredTimepoint ?? state.pinnedTimepoint;

export const resolveActiveLegend = (
  state: VitalsTrendInteractionState,
): EpicVitalsLegendEntry["key"] | null => state.hoveredLegend ?? state.pinnedLegend;

export const opacityForVital = (
  vital: string,
  activeLegend: EpicVitalsLegendEntry["key"] | null,
  legend: EpicVitalsLegendEntry[],
): number => {
  if (activeLegend === null) return 1;
  const entry = legend.find((candidate) => candidate.key === activeLegend);
  return entry?.vitals.some((candidate) => candidate === vital) ? 1 : 0.18;
};
