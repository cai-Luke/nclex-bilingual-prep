import type { ItemType } from "./types";

export const formatItemType = (itemType: ItemType) =>
  itemType === "multiple_choice"
    ? "Single best answer"
    : itemType === "select_all"
      ? "SATA"
      : itemType === "case_study"
        ? "Case study"
        : itemType === "highlight"
          ? "Highlight"
          : itemType === "bowtie"
            ? "Bowtie"
            : itemType.replace(/_/g, " ");
