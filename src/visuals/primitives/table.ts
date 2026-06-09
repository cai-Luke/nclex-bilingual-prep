import { fmt } from "./graphPaper";
import { escapeXml } from "./escapeXml";

export interface DocTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  widthFr?: number;
}
export interface DocTableCell {
  text: string;
  styleRole?: string;
  emphasis?: "normal" | "bold" | "flag";
}
export type DocTableCellInput = string | DocTableCell;  // bare string => {text, emphasis: "normal"}
export interface DocTableRow {
  cells: Record<string, DocTableCellInput>;
  rowHeader?: boolean;
}
export interface DocTableInput {
  title?: string;
  columns: DocTableColumn[];
  rows: DocTableRow[];
  width?: number;
  rowHeight?: number;
  headerHeight?: number;
}

const colorForStyleRole = (role?: string): string => {
  switch (role) {
    case "red":    return "#ef4444";
    case "blue":   return "#3b82f6";
    case "green":  return "#10b981";
    case "orange": return "#f97316";
    case "purple": return "#8b5cf6";
    case "slate":  return "#64748b";
    default:       return "#1e293b";
  }
};

export function renderDocTable(input: DocTableInput): string {
  const width = input.width ?? 600;
  const rowHeight = input.rowHeight ?? 28;
  const headerHeight = input.headerHeight ?? 32;
  const TITLE_HEIGHT = 32;
  const CELL_PAD = 8;

  const hasTitleRow = typeof input.title === "string" && input.title.length > 0;

  const totalFr = input.columns.reduce((sum, c) => sum + (c.widthFr ?? 1), 0) || 1;
  const colWidths = input.columns.map(c => ((c.widthFr ?? 1) / totalFr) * width);
  const colXs: number[] = [];
  let xAcc = 0;
  for (const w of colWidths) {
    colXs.push(xAcc);
    xAcc += w;
  }

  const totalHeight =
    (hasTitleRow ? TITLE_HEIGHT : 0) +
    headerHeight +
    input.rows.length * rowHeight;

  const els: string[] = [];

  els.push(`<rect x="0" y="0" width="${fmt(width)}" height="${fmt(totalHeight)}" fill="#ffffff" stroke="#94a3b8" stroke-width="1" rx="2"/>`);

  let yOff = 0;

  if (hasTitleRow) {
    els.push(`<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(TITLE_HEIGHT)}" fill="#e2e8f0" rx="2"/>`);
    els.push(`<text x="${fmt(width / 2)}" y="${fmt(yOff + TITLE_HEIGHT * 0.65)}" font-family="sans-serif" font-size="13" font-weight="600" fill="#1e293b" text-anchor="middle">${escapeXml(input.title!)}</text>`);
    els.push(`<line x1="0" y1="${fmt(yOff + TITLE_HEIGHT)}" x2="${fmt(width)}" y2="${fmt(yOff + TITLE_HEIGHT)}" stroke="#94a3b8" stroke-width="1"/>`);
    yOff += TITLE_HEIGHT;
  }

  // Header row
  els.push(`<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(headerHeight)}" fill="#e2e8f0"/>`);
  input.columns.forEach((col, i) => {
    const x = colXs[i];
    const w = colWidths[i];
    const align = col.align ?? "left";
    const tx = align === "center" ? x + w / 2 : align === "right" ? x + w - CELL_PAD : x + CELL_PAD;
    const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
    els.push(`<text x="${fmt(tx)}" y="${fmt(yOff + headerHeight * 0.65)}" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="${anchor}">${escapeXml(col.label)}</text>`);
  });
  els.push(`<line x1="0" y1="${fmt(yOff + headerHeight)}" x2="${fmt(width)}" y2="${fmt(yOff + headerHeight)}" stroke="#94a3b8" stroke-width="1"/>`);
  yOff += headerHeight;

  // Body rows
  input.rows.forEach((row, rowIdx) => {
    const rowY = yOff + rowIdx * rowHeight;
    const rowFill = row.rowHeader ? "#f1f5f9" : rowIdx % 2 === 0 ? "#ffffff" : "#f8fafc";
    els.push(`<rect x="0" y="${fmt(rowY)}" width="${fmt(width)}" height="${fmt(rowHeight)}" fill="${rowFill}"/>`);
    els.push(`<line x1="0" y1="${fmt(rowY + rowHeight)}" x2="${fmt(width)}" y2="${fmt(rowY + rowHeight)}" stroke="#e2e8f0" stroke-width="1"/>`);

    input.columns.forEach((col, colIdx) => {
      const rawCell = row.cells[col.key];
      if (rawCell === undefined) return;

      const cell: DocTableCell = typeof rawCell === "string"
        ? { text: rawCell, emphasis: "normal" }
        : rawCell;
      if (!cell.text) return;

      const cx = colXs[colIdx];
      const cw = colWidths[colIdx];
      const align = col.align ?? "left";

      if (cell.emphasis === "flag") {
        els.push(`<rect x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(cw - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`);
      }

      const fontWeight = cell.emphasis === "bold" ? "600" : "400";
      const textColor = colorForStyleRole(cell.styleRole);
      const tx = align === "center" ? cx + cw / 2 : align === "right" ? cx + cw - CELL_PAD : cx + CELL_PAD;
      const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";

      els.push(`<text x="${fmt(tx)}" y="${fmt(rowY + rowHeight * 0.65)}" font-family="sans-serif" font-size="12" font-weight="${fontWeight}" fill="${textColor}" text-anchor="${anchor}">${escapeXml(cell.text)}</text>`);
    });
  });

  // Column dividers
  const dividerTop = hasTitleRow ? TITLE_HEIGHT : 0;
  for (let i = 1; i < input.columns.length; i++) {
    els.push(`<line x1="${fmt(colXs[i])}" y1="${fmt(dividerTop)}" x2="${fmt(colXs[i])}" y2="${fmt(totalHeight)}" stroke="#e2e8f0" stroke-width="1"/>`);
  }

  return `<g class="doc-table">\n${els.join("\n")}\n</g>`;
}

// renderFieldPanel — forward-reference for U6 (medication_label) / U9 (device_screen).
// Implement when U6 lands; keep colocated with renderDocTable in this module.
//
// export interface FieldPanelInput {
//   title?: string;
//   fields: { label: string; value: string; emphasis?: "normal" | "bold" | "flag" }[];
//   width?: number;     // default 600
//   rowHeight?: number; // default 28
// }
// export function renderFieldPanel(input: FieldPanelInput): string; // returns <g class="field-panel">…</g>
