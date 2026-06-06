import type { LanguageMode, RhythmStripVisual } from "../types";
import { renderRhythmStripSvg } from "./rhythmStrip";

export function RhythmStrip({ visual, languageMode }: { visual: RhythmStripVisual; languageMode: LanguageMode }) {
  const svg = renderRhythmStripSvg(visual);
  const caption =
    visual.caption &&
    (languageMode === "always" && visual.caption.zh
      ? `${visual.caption.en} / ${visual.caption.zh}`
      : visual.caption.en);

  return (
    <figure className="rhythm-strip">
      <div className="rhythm-strip-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
