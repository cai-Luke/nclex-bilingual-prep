import type { LanguageMode } from "../types";
import { getVisual } from "./registry";
import type { QuestionVisual } from "./types";

/**
 * Single kind-agnostic dispatcher. Replaces the inline `visual?.kind === ...`
 * branches in App.tsx. Looks the kind up in the registry, renders our own
 * deterministic SVG (never user HTML), and preserves the existing rhythm-strip
 * figure/caption DOM so rendered output is unchanged for items that exist today.
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

  return (
    <figure className="rhythm-strip" role="img" aria-label={visual.caption?.en ?? "clinical visual"}>
      <div className={`rhythm-strip-svg vis-${visual.kind}`} dangerouslySetInnerHTML={{ __html: svg }} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
