import { type VisualError, type VisualKindModule, registerVisual } from "../../registry";
import { type MarSpec } from "./types";
import { renderDocTable, type DocTableInput, type DocTableRow } from "../../primitives/table";
import { fmt } from "../../primitives/graphPaper";
import { escapeXml } from "../../primitives/escapeXml";

const MAR_ROUTES = new Set<string>([
  "PO", "IV", "IVPB", "IM", "SubQ", "SL", "PR", "topical", "inhaled", "ophthalmic", "NG",
]);
const MAR_STATUSES = new Set<string>([
  "given", "held", "due", "missed", "late", "not_given",
]);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const nonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

// ---------- validate ----------

export const validateMar = (spec: MarSpec): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (value.kind !== "mar") {
    errs.push({ path: "kind", code: "invalid_kind", message: "must be 'mar'" });
    return errs;
  }

  // timeGrid
  if (!Array.isArray(value.timeGrid) || (value.timeGrid as unknown[]).length === 0) {
    errs.push({ path: "timeGrid", code: "time_grid_empty", message: "must be a non-empty array" });
    return errs;
  }
  const timeGridArr = value.timeGrid as unknown[];
  const timeGridSet = new Set<string>();
  for (let i = 0; i < timeGridArr.length; i++) {
    if (typeof timeGridArr[i] !== "string" || (timeGridArr[i] as string).length === 0) {
      errs.push({ path: `timeGrid[${i}]`, code: "time_grid_empty", message: "must be a non-empty string" });
    } else {
      const t = timeGridArr[i] as string;
      if (timeGridSet.has(t)) {
        errs.push({ path: `timeGrid[${i}]`, code: "time_grid_duplicate", message: `duplicate time slot '${t}'` });
      }
      timeGridSet.add(t);
    }
  }

  // medications
  if (!Array.isArray(value.medications) || (value.medications as unknown[]).length === 0) {
    errs.push({ path: "medications", code: "medications_empty", message: "must have at least one medication" });
    return errs;
  }
  const medsArr = value.medications as unknown[];

  // duplicate medication names (must be checked before per-med loop for keyed_cells safety)
  const seenNames = new Set<string>();
  for (let i = 0; i < medsArr.length; i++) {
    if (!isRecord(medsArr[i])) continue;
    const medName = (medsArr[i] as Record<string, unknown>).name;
    if (typeof medName === "string" && medName.trim().length > 0) {
      if (seenNames.has(medName)) {
        errs.push({ path: `medications[${i}].name`, code: "duplicate_medication_name", message: `duplicate medication name '${medName}'` });
      }
      seenNames.add(medName);
    }
  }

  for (let i = 0; i < medsArr.length; i++) {
    if (!isRecord(medsArr[i])) {
      errs.push({ path: `medications[${i}]`, code: "med_field_missing", message: "must be an object" });
      continue;
    }
    const med = medsArr[i] as Record<string, unknown>;

    if (!nonEmptyString(med.name)) {
      errs.push({ path: `medications[${i}].name`, code: "med_field_missing", message: "must be a non-empty string" });
    }
    if (!nonEmptyString(med.dose)) {
      errs.push({ path: `medications[${i}].dose`, code: "med_field_missing", message: "must be a non-empty string" });
    }
    if (!nonEmptyString(med.frequency)) {
      errs.push({ path: `medications[${i}].frequency`, code: "med_field_missing", message: "must be a non-empty string" });
    }

    if (typeof med.route !== "string" || !MAR_ROUTES.has(med.route)) {
      errs.push({ path: `medications[${i}].route`, code: "invalid_route", message: `'${String(med.route)}' is not a valid MarRoute` });
    }

    if (!Array.isArray(med.administrations)) {
      errs.push({ path: `medications[${i}].administrations`, code: "administrations_invalid", message: "must be an array" });
      continue;
    }

    const seenAdminTimes = new Set<string>();
    const admArr = med.administrations as unknown[];
    for (let j = 0; j < admArr.length; j++) {
      if (!isRecord(admArr[j])) {
        errs.push({ path: `medications[${i}].administrations[${j}]`, code: "administrations_invalid", message: "must be an object" });
        continue;
      }
      const adm = admArr[j] as Record<string, unknown>;

      if (typeof adm.time !== "string" || !timeGridSet.has(adm.time)) {
        errs.push({ path: `medications[${i}].administrations[${j}].time`, code: "admin_time_not_in_grid", message: `'${String(adm.time)}' is not in timeGrid` });
      } else {
        const t = adm.time as string;
        if (seenAdminTimes.has(t)) {
          errs.push({ path: `medications[${i}].administrations[${j}]`, code: "duplicate_administration", message: `duplicate administration at time '${t}'` });
        }
        seenAdminTimes.add(t);
      }

      if (typeof adm.status !== "string" || !MAR_STATUSES.has(adm.status)) {
        errs.push({ path: `medications[${i}].administrations[${j}].status`, code: "invalid_status", message: `'${String(adm.status)}' is not a valid MarStatus` });
      }
    }

    if (med.isHighAlert !== undefined && typeof med.isHighAlert !== "boolean") {
      errs.push({ path: `medications[${i}].isHighAlert`, code: "invalid_high_alert", message: "must be a boolean" });
    }
  }

  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString((value.caption as Record<string, unknown>).en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (
      (value.caption as Record<string, unknown>).zh !== undefined &&
      !nonEmptyString((value.caption as Record<string, unknown>).zh)
    ) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errs;
};

// ---------- selfCheck ----------

export const selfCheckMar = (spec: MarSpec, question: unknown): VisualError[] => {
  const errs: VisualError[] = [];

  const meta = isRecord(question) && isRecord((question as Record<string, unknown>).meta)
    ? (question as Record<string, unknown>).meta as Record<string, unknown>
    : null;

  // 1a. Necessity: visual_justification
  if (meta !== null && !nonEmptyString(meta.visual_justification)) {
    errs.push({ path: "meta.visual_justification", code: "self_check_missing_justification", message: "must be present and non-empty" });
  }

  // 1b. Necessity: at least one keyed_cells entry or a non-null keyed_relationship
  if (meta !== null) {
    const keyedCells = Array.isArray(meta.keyed_cells) ? meta.keyed_cells as unknown[] : [];
    const hasKeyedCells = keyedCells.length > 0;
    const hasKeyedRel = typeof meta.keyed_relationship === "string" && meta.keyed_relationship.trim().length > 0;
    if (!hasKeyedCells && !hasKeyedRel) {
      errs.push({ path: "meta", code: "self_check_no_keyed_cue", message: "must declare at least one keyed_cells entry or a non-null keyed_relationship" });
    }
  }

  // 2. Keyed-cell presence: every keyed_cells entry resolves to a real (medication, time) administration
  if (meta !== null && Array.isArray(meta.keyed_cells)) {
    const gridSet = new Set<string>(Array.isArray(spec.timeGrid) ? spec.timeGrid.filter((t): t is string => typeof t === "string") : []);
    const keyedCells = meta.keyed_cells as unknown[];
    for (let i = 0; i < keyedCells.length; i++) {
      const entry = keyedCells[i];
      if (!isRecord(entry)) continue;
      const medName = entry.medication;
      const time = entry.time;
      if (typeof medName !== "string" || typeof time !== "string") continue;

      if (!gridSet.has(time)) {
        errs.push({ path: `meta.keyed_cells[${i}]`, code: "self_check_keyed_cell_absent", message: `time '${time}' is not in timeGrid` });
        continue;
      }
      const med = Array.isArray(spec.medications)
        ? spec.medications.find(m => m.name === medName)
        : undefined;
      if (!med) {
        errs.push({ path: `meta.keyed_cells[${i}]`, code: "self_check_keyed_cell_absent", message: `medication '${medName}' not found in spec` });
        continue;
      }
      const hasAdmin = Array.isArray(med.administrations) && med.administrations.some(a => a.time === time);
      if (!hasAdmin) {
        errs.push({ path: `meta.keyed_cells[${i}]`, code: "self_check_keyed_cell_absent", message: `no administration for '${medName}' at time '${time}'` });
      }
    }
  }

  // 3. Internal consistency echo
  if (Array.isArray(spec.medications) && Array.isArray(spec.timeGrid)) {
    const gridSet = new Set<string>(spec.timeGrid.filter((t): t is string => typeof t === "string"));
    spec.medications.forEach((med, mi) => {
      if (!Array.isArray(med.administrations)) return;
      med.administrations.forEach((adm, ai) => {
        if (typeof adm.time === "string" && !gridSet.has(adm.time)) {
          errs.push({ path: `medications[${mi}].administrations[${ai}].time`, code: "self_check_admin_time_not_in_grid", message: `'${adm.time}' not in timeGrid` });
        }
        if (typeof adm.status === "string" && !MAR_STATUSES.has(adm.status)) {
          errs.push({ path: `medications[${mi}].administrations[${ai}].status`, code: "self_check_invalid_status", message: `'${adm.status}' is not a valid MarStatus` });
        }
      });
    });
  }

  return errs;
};

// ---------- renderSvg ----------

const STATUS_GLYPHS: Record<string, string> = {
  given:     "✓",
  held:      "H",
  due:       "—",
  missed:    "×",
  late:      "L",
  not_given: "NG",
};

const statusNeedsFlag = (status: string): boolean =>
  status === "held" || status === "missed" || status === "late";

export const renderMarSvg = (spec: MarSpec): string => {
  const timeGrid = Array.isArray(spec.timeGrid) ? spec.timeGrid : [];
  const medications = Array.isArray(spec.medications) ? spec.medications : [];

  const columns: DocTableInput["columns"] = [
    { key: "med",  label: "Medication", widthFr: 2,   align: "left" },
    { key: "dose", label: "Dose",       widthFr: 1.5, align: "left" },
    { key: "rte",  label: "Route",      widthFr: 1,   align: "center" },
    { key: "freq", label: "Freq",       widthFr: 1,   align: "center" },
    ...timeGrid.map(t => ({ key: `t_${t}`, label: t, widthFr: 1, align: "center" as const })),
  ];

  const rows: DocTableRow[] = medications.map(med => {
    const adminByTime: Record<string, string> = {};
    if (Array.isArray(med.administrations)) {
      for (const adm of med.administrations) {
        if (typeof adm.time === "string" && typeof adm.status === "string") {
          adminByTime[adm.time] = adm.status;
        }
      }
    }

    const cells: DocTableRow["cells"] = {
      med:  med.isHighAlert ? { text: med.name, emphasis: "bold" } : med.name,
      dose: med.dose,
      rte:  med.route,
      freq: med.frequency,
    };

    for (const t of timeGrid) {
      const status = adminByTime[t];
      if (status !== undefined) {
        cells[`t_${t}`] = {
          text: STATUS_GLYPHS[status] ?? status,
          emphasis: statusNeedsFlag(status) ? "flag" : "normal",
        };
      }
      // no entry for this slot → blank cell
    }

    return { cells };
  });

  const rowHeight = 28;
  const headerHeight = 32;
  const totalHeight = headerHeight + medications.length * rowHeight;

  const tableG = renderDocTable({ columns, rows, width: 600, rowHeight, headerHeight });

  const ariaLabel = spec.caption?.en
    ? escapeXml(spec.caption.en)
    : "Medication Administration Record";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${fmt(totalHeight)}" role="img" aria-label="${ariaLabel}" data-kind="mar">\n${tableG}\n</svg>`;
};

// ---------- fixtures ----------

const fixtures: VisualKindModule<MarSpec>["fixtures"] = {
  valid: [
    // Four-slot MAR: held enoxaparin dose at 1800 (single keyed cell); isHighAlert med
    {
      kind: "mar",
      timeGrid: ["0600", "1200", "1800", "2400"],
      medications: [
        {
          name: "enoxaparin",
          dose: "40 mg",
          route: "SubQ",
          frequency: "daily",
          administrations: [
            { time: "0600", status: "given" },
            { time: "1800", status: "held" },
          ],
          isHighAlert: true,
        },
        {
          name: "metoprolol",
          dose: "25 mg",
          route: "PO",
          frequency: "BID",
          administrations: [
            { time: "0600", status: "given" },
            { time: "1200", status: "given" },
            { time: "1800", status: "due" },
          ],
        },
      ],
      caption: { en: "Medication Administration Record", zh: "药物给药记录" },
    },
    // Two-row MAR: concurrent rate-lowering agents (timing collision, keyed_relationship)
    {
      kind: "mar",
      timeGrid: ["0800", "1200", "1600", "2000"],
      medications: [
        {
          name: "metoprolol",
          dose: "25 mg",
          route: "PO",
          frequency: "BID",
          administrations: [
            { time: "0800", status: "given" },
            { time: "1200", status: "given" },
            { time: "2000", status: "due" },
          ],
        },
        {
          name: "diltiazem",
          dose: "30 mg",
          route: "PO",
          frequency: "TID",
          administrations: [
            { time: "0800", status: "given" },
            { time: "1200", status: "given" },
            { time: "1600", status: "late" },
          ],
        },
      ],
    },
  ],
  invalid: [
    // medications_empty
    { spec: { kind: "mar", timeGrid: ["0600"], medications: [] }, expectCode: "medications_empty" },
    // duplicate_medication_name
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600", "1200"],
        medications: [
          { name: "heparin", dose: "5000 units", route: "SubQ", frequency: "q8h", administrations: [] },
          { name: "heparin", dose: "10000 units", route: "IV", frequency: "q12h", administrations: [] },
        ],
      },
      expectCode: "duplicate_medication_name",
    },
    // invalid_route
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600"],
        medications: [{ name: "aspirin", dose: "81 mg", route: "oral", frequency: "daily", administrations: [] }],
      },
      expectCode: "invalid_route",
    },
    // admin_time_not_in_grid
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600", "1200"],
        medications: [
          { name: "lisinopril", dose: "10 mg", route: "PO", frequency: "daily", administrations: [{ time: "0800", status: "given" }] },
        ],
      },
      expectCode: "admin_time_not_in_grid",
    },
    // duplicate_administration
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600", "1200"],
        medications: [
          { name: "furosemide", dose: "40 mg", route: "IV", frequency: "BID", administrations: [{ time: "0600", status: "given" }, { time: "0600", status: "given" }] },
        ],
      },
      expectCode: "duplicate_administration",
    },
    // time_grid_duplicate
    { spec: { kind: "mar", timeGrid: ["0600", "0600"], medications: [{ name: "aspirin", dose: "81 mg", route: "PO", frequency: "daily", administrations: [] }] }, expectCode: "time_grid_duplicate" },
    // invalid_status
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600"],
        medications: [
          { name: "warfarin", dose: "5 mg", route: "PO", frequency: "daily", administrations: [{ time: "0600", status: "pending" }] },
        ],
      },
      expectCode: "invalid_status",
    },
  ],
};

export const marModule: VisualKindModule<MarSpec> = {
  kind: "mar",
  validate: validateMar,
  selfCheck: selfCheckMar,
  renderSvg: renderMarSvg,
  fixtures,
};

registerVisual(marModule as VisualKindModule);
