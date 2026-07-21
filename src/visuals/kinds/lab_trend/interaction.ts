import type { LabTrendLegendEntry } from "./index";

export type LabTrendInteractionState = {
  hoveredTimepoint: number | null;
  pinnedTimepoint: number | null;
  hoveredLegend: LabTrendLegendEntry["key"] | null;
};

export type LabTrendInteractionEvent =
  | { type: "timepoint-enter"; index: number }
  | { type: "timepoint-leave"; index: number }
  | { type: "timepoint-activate"; index: number }
  | { type: "timepoint-clear" }
  | { type: "legend-enter"; key: LabTrendLegendEntry["key"] }
  | { type: "legend-leave"; key: LabTrendLegendEntry["key"] };

export const EMPTY_LAB_TREND_INTERACTION: LabTrendInteractionState = {
  hoveredTimepoint: null,
  pinnedTimepoint: null,
  hoveredLegend: null,
};

export const transitionLabTrendInteraction = (
  state: LabTrendInteractionState,
  event: LabTrendInteractionEvent,
): LabTrendInteractionState => {
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
  }
};

export const resolveActiveLabTimepoint = (state: LabTrendInteractionState): number | null =>
  state.hoveredTimepoint ?? state.pinnedTimepoint;

export const opacityForLabAnalyte = (
  analyte: string,
  activeLegend: LabTrendLegendEntry["key"] | null,
): number => activeLegend === null || activeLegend === analyte ? 1 : 0.18;
