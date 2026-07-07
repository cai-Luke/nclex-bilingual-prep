import type { LanguageMode, StructuredMeasurements } from "./types";
import { renderStructuredMeasurementsSvg } from "./structuredMeasurements";

export function StructuredMeasurementsStimulus({
  measurements,
  languageMode,
}: {
  measurements?: StructuredMeasurements;
  languageMode: LanguageMode;
}) {
  if (!measurements) return null;
  const svg = renderStructuredMeasurementsSvg(measurements, languageMode);
  return (
    <figure className="structured-measurements" role="img" aria-label="structured clinical measurements">
      <div className="structured-measurements-svg" dangerouslySetInnerHTML={{ __html: svg }} />
    </figure>
  );
}
