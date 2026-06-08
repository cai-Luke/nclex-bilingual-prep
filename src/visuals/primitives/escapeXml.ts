// XML-escape free text before embedding it in an SVG string. Required for any
// text node a kind renders (captions, labels). Numeric params do not need this;
// they go through graphPaper's fmt(). rhythm_strip renders no free text inside
// its SVG today, but future kinds (labels, tables) must call this for safety.

export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
