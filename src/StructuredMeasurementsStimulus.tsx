import type { LanguageMode, StructuredMeasurements } from "./types";
import {
  isCompactStructuredMeasurements,
  renderStructuredMeasurementsSvg,
} from "./structuredMeasurements";

export function StructuredMeasurementsStimulus({
  measurements,
  languageMode,
}: {
  measurements?: StructuredMeasurements;
  languageMode: LanguageMode;
}) {
  if (!measurements) return null;
  const svg = renderStructuredMeasurementsSvg(measurements, languageMode);
  const densityClass = isCompactStructuredMeasurements(measurements)
    ? "structured-measurements--compact"
    : "";
  const figureClassName = ["structured-measurements", densityClass]
    .filter(Boolean)
    .join(" ");
  return (
    <figure
      className={figureClassName}
      role="img"
      aria-label="structured clinical measurements"
    >
      <div className="structured-measurements-svg" dangerouslySetInnerHTML={{ __html: svg }} />
    </figure>
  );
}
