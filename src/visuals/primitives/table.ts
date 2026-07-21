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
  /** Opt-in: precomputed display lines. When present and containCells is true,
   *  the cell renders each line inside a nested SVG viewport. */
  displayLines?: string[];
}
export type DocTableCellInput = string | DocTableCell;  // bare string => {text, emphasis: "normal"}
export interface DocTableRow {
  cells: Record<string, DocTableCellInput>;
  rowHeader?: boolean;
  /** Opt-in: explicit row height in SVG units. When omitted, falls back to
   *  DocTableInput.rowHeight ?? DOC_TABLE_DEFAULT_ROW_HEIGHT. */
  rowHeight?: number;
}
export interface DocTableInput {
  title?: string;
  columns: DocTableColumn[];
  rows: DocTableRow[];
  width?: number;
  rowHeight?: number;
  headerHeight?: number;
  /** Opt-in: when true, every cell is rendered inside a nested SVG viewport
   *  with overflow="hidden". Non-MAR callers must NOT pass this field; default
   *  false preserves byte-identical legacy output. */
  containCells?: boolean;
  /** Opt-in: parallel to columns[], precomputed display lines for each header
   *  cell. Only consumed when containCells is true. */
  columnHeaderLines?: (string[] | undefined)[];
}

const DOC_TABLE_DEFAULT_ROW_HEIGHT = 28;
const DOC_TABLE_DEFAULT_HEADER_HEIGHT = 32;
const DOC_TABLE_TITLE_HEIGHT = 32;

export function measureDocTable(input: DocTableInput): number {
  const defaultRowHeight = input.rowHeight ?? DOC_TABLE_DEFAULT_ROW_HEIGHT;
  const headerHeight = input.headerHeight ?? DOC_TABLE_DEFAULT_HEADER_HEIGHT;
  const hasTitleRow = typeof input.title === "string" && input.title.length > 0;
  const bodyHeight = input.rows.reduce((sum, r) => sum + (r.rowHeight ?? defaultRowHeight), 0);
  return (hasTitleRow ? DOC_TABLE_TITLE_HEIGHT : 0) + headerHeight + bodyHeight;
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
  const defaultRowHeight = input.rowHeight ?? DOC_TABLE_DEFAULT_ROW_HEIGHT;
  const headerHeight = input.headerHeight ?? DOC_TABLE_DEFAULT_HEADER_HEIGHT;
  const containCells = input.containCells === true;
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

  const totalHeight = measureDocTable(input);

  const els: string[] = [];

  els.push(`<rect x="0" y="0" width="${fmt(width)}" height="${fmt(totalHeight)}" fill="#ffffff" stroke="#94a3b8" stroke-width="1" rx="2"/>`);

  let yOff = 0;

  if (hasTitleRow) {
    els.push(`<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(DOC_TABLE_TITLE_HEIGHT)}" fill="#e2e8f0" rx="2"/>`);
    els.push(`<text x="${fmt(width / 2)}" y="${fmt(yOff + DOC_TABLE_TITLE_HEIGHT * 0.65)}" font-family="sans-serif" font-size="13" font-weight="600" fill="#1e293b" text-anchor="middle">${escapeXml(input.title!)}</text>`);
    els.push(`<line x1="0" y1="${fmt(yOff + DOC_TABLE_TITLE_HEIGHT)}" x2="${fmt(width)}" y2="${fmt(yOff + DOC_TABLE_TITLE_HEIGHT)}" stroke="#94a3b8" stroke-width="1"/>`);
    yOff += DOC_TABLE_TITLE_HEIGHT;
  }

  // Header row
  els.push(`<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(headerHeight)}" fill="#e2e8f0"/>`);
  input.columns.forEach((col, i) => {
    const x = colXs[i];
    const w = colWidths[i];
    const align = col.align ?? "left";
    if (containCells) {
      // Render header cell inside a nested viewport (header line height 13, font 11)
      const lines = input.columnHeaderLines?.[i] ?? [col.label];
      const innerW = Math.max(0, w - 2);
      const innerH = Math.max(0, headerHeight - 2);
      const lineH = 13;
      const totalTextH = lines.length * lineH;
      // vertical-center the stack; first baseline = midpoint of first line
      const stackTopY = (innerH - totalTextH) / 2;
      const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
      const tx = align === "center" ? innerW / 2 : align === "right" ? innerW - CELL_PAD : CELL_PAD;
      const cellEls = lines.map((line, li) =>
        `<text x="${fmt(tx)}" y="${fmt(stackTopY + (li + 1) * lineH - 2)}" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="${anchor}">${escapeXml(line)}</text>`,
      );
      els.push(`<svg x="${fmt(x + 1)}" y="${fmt(yOff + 1)}" width="${fmt(innerW)}" height="${fmt(innerH)}" overflow="hidden" data-table-column="${escapeXml(col.key)}" data-table-header="true" data-source-text="${escapeXml(col.label)}">${cellEls.join("")}</svg>`);
    } else {
      const tx = align === "center" ? x + w / 2 : align === "right" ? x + w - CELL_PAD : x + CELL_PAD;
      const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
      els.push(`<text x="${fmt(tx)}" y="${fmt(yOff + headerHeight * 0.65)}" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="${anchor}">${escapeXml(col.label)}</text>`);
    }
  });
  els.push(`<line x1="0" y1="${fmt(yOff + headerHeight)}" x2="${fmt(width)}" y2="${fmt(yOff + headerHeight)}" stroke="#94a3b8" stroke-width="1"/>`);
  yOff += headerHeight;

  // Body rows
  input.rows.forEach((row, rowIdx) => {
    const rowHeight = row.rowHeight ?? defaultRowHeight;
    const rowY = yOff;
    yOff += rowHeight;

    const rowFill = row.rowHeader ? "#f1f5f9" : rowIdx % 2 === 0 ? "#ffffff" : "#f8fafc";
    els.push(`<rect x="0" y="${fmt(rowY)}" width="${fmt(width)}" height="${fmt(rowHeight)}" fill="${rowFill}"/>`);
    els.push(`<line x1="0" y1="${fmt(rowY + rowHeight)}" x2="${fmt(width)}" y2="${fmt(rowY + rowHeight)}" stroke="#e2e8f0" stroke-width="1"/>`);

    input.columns.forEach((col, colIdx) => {
      const rawCell = row.cells[col.key];
      if (rawCell === undefined && !containCells) return;

      const cell: DocTableCell = rawCell === undefined
        ? { text: "", emphasis: "normal" }
        : typeof rawCell === "string"
        ? { text: rawCell, emphasis: "normal" }
        : rawCell;
      if (!cell.text && !containCells) return;

      const cx = colXs[colIdx];
      const cw = colWidths[colIdx];
      const align = col.align ?? "left";

      if (containCells) {
        // Opt-in path: nested SVG viewport — no cell can paint outside its bounds.
        // Flagged backgrounds fill the entire cell at resolved row height (before viewport).
        if (cell.emphasis === "flag") {
          els.push(`<rect x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(cw - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`);
        }
        const fontWeight = cell.emphasis === "bold" ? "600" : "400";
        const textColor = colorForStyleRole(cell.styleRole);
        const innerW = Math.max(0, cw - 2);
        const innerH = Math.max(0, rowHeight - 2);
        const lines = cell.displayLines && cell.displayLines.length > 0 ? cell.displayLines : [cell.text];
        // Body line height 14, font 12. Vertically center the stack.
        const lineH = 14;
        const totalTextH = lines.length * lineH;
        const stackTopY = (innerH - totalTextH) / 2;
        const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
        const tx = align === "center" ? innerW / 2 : align === "right" ? innerW - CELL_PAD : CELL_PAD;
        const cellEls = lines.map((line, li) =>
          `<text x="${fmt(tx)}" y="${fmt(stackTopY + (li + 1) * lineH - 2)}" font-family="sans-serif" font-size="12" font-weight="${fontWeight}" fill="${textColor}" text-anchor="${anchor}">${escapeXml(line)}</text>`,
        );
        els.push(`<svg x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(innerW)}" height="${fmt(innerH)}" overflow="hidden" data-table-column="${escapeXml(col.key)}" data-table-row="${rowIdx}" data-source-text="${escapeXml(cell.text)}">${cellEls.join("")}</svg>`);
      } else {
        // Legacy path — byte-identical to pre-change output for non-containCells callers.
        if (cell.emphasis === "flag") {
          els.push(`<rect x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(cw - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`);
        }
        const fontWeight = cell.emphasis === "bold" ? "600" : "400";
        const textColor = colorForStyleRole(cell.styleRole);
        const tx = align === "center" ? cx + cw / 2 : align === "right" ? cx + cw - CELL_PAD : cx + CELL_PAD;
        const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
        els.push(`<text x="${fmt(tx)}" y="${fmt(rowY + rowHeight * 0.65)}" font-family="sans-serif" font-size="12" font-weight="${fontWeight}" fill="${textColor}" text-anchor="${anchor}">${escapeXml(cell.text)}</text>`);
      }
    });
  });

  // Column dividers
  const dividerTop = hasTitleRow ? DOC_TABLE_TITLE_HEIGHT : 0;
  for (let i = 1; i < input.columns.length; i++) {
    els.push(`<line x1="${fmt(colXs[i])}" y1="${fmt(dividerTop)}" x2="${fmt(colXs[i])}" y2="${fmt(totalHeight)}" stroke="#e2e8f0" stroke-width="1"/>`);
  }

  return `<g class="doc-table">\n${els.join("\n")}\n</g>`;
}

export interface FieldPanelField {
  label: string;
  value: string;
  emphasis?: "normal" | "bold" | "flag";
}
export interface FieldPanelSection {
  heading?: string;
  fields: FieldPanelField[];
}
export interface FieldPanelInput {
  title?: string;
  sections: FieldPanelSection[];
  variant?: "label" | "screen";
  width?: number;
  rowHeight?: number;
  bannerHeight?: number;
  headingHeight?: number;
}

const fieldPanelMetrics = (input: FieldPanelInput) => ({
  width: input.width ?? 360,
  rowHeight: input.rowHeight ?? 26,
  bannerHeight: input.bannerHeight ?? 34,
  headingHeight: input.headingHeight ?? 24,
});

export function measureFieldPanel(input: FieldPanelInput): number {
  const { rowHeight, bannerHeight, headingHeight } = fieldPanelMetrics(input);
  const hasTitle = typeof input.title === "string" && input.title.length > 0;
  return (hasTitle ? bannerHeight : 0) + input.sections.reduce(
    (height, section) =>
      height +
      (typeof section.heading === "string" && section.heading.length > 0 ? headingHeight : 0) +
      section.fields.length * rowHeight,
    0,
  );
}

export function renderFieldPanel(input: FieldPanelInput): string {
  const { width, rowHeight, bannerHeight, headingHeight } = fieldPanelMetrics(input);
  const variant = input.variant ?? "label";
  const isScreen = variant === "screen";
  const totalHeight = measureFieldPanel(input);
  const pad = 12;
  const els: string[] = [];

  const panelFill = isScreen ? "#0f172a" : "#ffffff";
  const panelStroke = isScreen ? "#1e293b" : "#94a3b8";
  const bannerFill = isScreen ? "#1e293b" : "#e2e8f0";
  const titleFill = isScreen ? "#e2e8f0" : "#1e293b";
  const labelFill = isScreen ? "#94a3b8" : "#475569";
  const valueFill = isScreen ? "#bef264" : "#0f172a";
  const dividerStroke = isScreen ? "#334155" : "#e2e8f0";

  els.push(
    `<rect x="0" y="0" width="${fmt(width)}" height="${fmt(totalHeight)}" fill="${panelFill}" stroke="${panelStroke}" stroke-width="1" rx="4"/>`,
  );

  let yOff = 0;
  if (typeof input.title === "string" && input.title.length > 0) {
    els.push(
      `<rect x="0" y="0" width="${fmt(width)}" height="${fmt(bannerHeight)}" fill="${bannerFill}" rx="4"/>`,
    );
    els.push(
      `<text x="${fmt(pad)}" y="${fmt(bannerHeight * 0.65)}" font-family="sans-serif" font-size="13" font-weight="600" fill="${titleFill}" text-anchor="start">${escapeXml(input.title)}</text>`,
    );
    els.push(
      `<line x1="0" y1="${fmt(bannerHeight)}" x2="${fmt(width)}" y2="${fmt(bannerHeight)}" stroke="${panelStroke}" stroke-width="1"/>`,
    );
    yOff += bannerHeight;
  }

  for (const section of input.sections) {
    if (typeof section.heading === "string" && section.heading.length > 0) {
      els.push(
        `<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(headingHeight)}" fill="${isScreen ? "#172033" : "#f8fafc"}"/>`,
      );
      els.push(
        `<text x="${fmt(pad)}" y="${fmt(yOff + headingHeight * 0.66)}" font-family="sans-serif" font-size="11" font-weight="600" fill="${labelFill}" text-anchor="start">${escapeXml(section.heading)}</text>`,
      );
      yOff += headingHeight;
    }

    for (const field of section.fields) {
      if (field.emphasis === "flag" && !isScreen) {
        els.push(
          `<rect x="1" y="${fmt(yOff + 1)}" width="${fmt(width - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`,
        );
      }
      els.push(
        `<line x1="0" y1="${fmt(yOff + rowHeight)}" x2="${fmt(width)}" y2="${fmt(yOff + rowHeight)}" stroke="${dividerStroke}" stroke-width="1"/>`,
      );
      els.push(
        `<text x="${fmt(pad)}" y="${fmt(yOff + rowHeight * 0.65)}" font-family="sans-serif" font-size="12" font-weight="400" fill="${labelFill}" text-anchor="start">${escapeXml(field.label)}</text>`,
      );
      const fontWeight = field.emphasis === "bold" ? "600" : "400";
      const emphasizedValueFill =
        field.emphasis === "flag" && isScreen ? "#f59e0b" : valueFill;
      const fontFamily = isScreen ? "ui-monospace, monospace" : "sans-serif";
      els.push(
        `<text x="${fmt(width - pad)}" y="${fmt(yOff + rowHeight * 0.65)}" font-family="${fontFamily}" font-size="12" font-weight="${fontWeight}" fill="${emphasizedValueFill}" text-anchor="end">${escapeXml(field.value)}</text>`,
      );
      yOff += rowHeight;
    }
  }

  return `<g class="field-panel">\n${els.join("\n")}\n</g>`;
}
