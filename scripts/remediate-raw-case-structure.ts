import { readFileSync, writeFileSync } from "node:fs";

type JsonRecord = Record<string, unknown>;
type TextPair = { en: string; zh: string };

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: tsx scripts/remediate-raw-case-structure.ts banks/banks-raw/*.json");
  process.exit(1);
}

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isTextPair = (value: unknown): value is TextPair =>
  isRecord(value) && typeof value.en === "string" && value.en.trim() !== "" && typeof value.zh === "string" && value.zh.trim() !== "";

const defaultCaseStem = {
  en: "Review the client record and answer the case-study items.",
  zh: "请查看患者病历，并回答本病例题组。",
};

const stageExhibitId = (stage: JsonRecord, suffix: string) =>
  `${String(stage.id ?? "stage").replace(/[^A-Za-z0-9_]+/g, "_")}_${suffix}`;

const normalizeGlossary = (value: unknown) => {
  if (!Array.isArray(value)) return value;
  return value.map((term) => {
    if (!isRecord(term)) return term;
    if (typeof term.termEn === "string" && typeof term.termZh === "string" && typeof term.defZh === "string") {
      return term;
    }
    const pair = term.term;
    const definition = term.definition;
    if (isTextPair(pair) && isTextPair(definition)) {
      return {
        termEn: pair.en,
        termZh: pair.zh,
        defZh: definition.zh,
      };
    }
    return term;
  });
};

const normalizeByChoice = (rationale: unknown) => {
  if (!isRecord(rationale) || !Array.isArray(rationale.byChoice)) return;
  rationale.byChoice = rationale.byChoice.map((choice) => {
    if (!isRecord(choice)) return choice;
    if (typeof choice.en === "string" && typeof choice.zh === "string") return choice;
    if (isTextPair(choice.text)) {
      return {
        refId: choice.refId,
        en: choice.text.en,
        zh: choice.text.zh,
      };
    }
    return choice;
  });
};

const normalizeOptions = (question: JsonRecord) => {
  if (!Array.isArray(question.options)) return;
  question.options = question.options.map((option) => {
    if (!isRecord(option)) return option;
    if (typeof option.en === "string" && typeof option.zh === "string") return option;
    if (isTextPair(option.text)) {
      return {
        id: option.id,
        en: option.text.en,
        zh: option.text.zh,
      };
    }
    return option;
  });
};

const flattenTextItems = (items: unknown) => {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    if (!isRecord(item)) return item;
    if (typeof item.en === "string" && typeof item.zh === "string") return item;
    if (isTextPair(item.text)) {
      const { text: _text, ...rest } = item;
      return {
        ...rest,
        en: item.text.en,
        zh: item.text.zh,
      };
    }
    return item;
  });
};

const normalizeHighlight = (question: JsonRecord) => {
  if (question.itemType !== "highlight" || !isRecord(question.highlight)) return;
  question.highlight.segments = flattenTextItems(question.highlight.segments);
};

const normalizeDropdownCloze = (question: JsonRecord) => {
  if (question.itemType !== "dropdown_cloze") return;
  if (!isTextPair(question.clozeStem) && isRecord(question.dropdownCloze) && isTextPair(question.dropdownCloze.template)) {
    question.clozeStem = question.dropdownCloze.template;
  }
  if (!Array.isArray(question.dropdowns) && isRecord(question.dropdownCloze) && Array.isArray(question.dropdownCloze.dropdowns)) {
    question.dropdowns = question.dropdownCloze.dropdowns;
  }
  if (Array.isArray(question.dropdowns)) {
    question.dropdowns = question.dropdowns.map((dropdown) => {
      if (!isRecord(dropdown)) return dropdown;
      return {
        ...dropdown,
        options: flattenTextItems(dropdown.options),
      };
    });
  }
  delete question.dropdownCloze;
};

const normalizeMatrix = (question: JsonRecord) => {
  if (question.itemType !== "matrix" || !isRecord(question.matrix)) return;
  question.matrix.rows = flattenTextItems(question.matrix.rows);
  question.matrix.columns = flattenTextItems(question.matrix.columns);
  if (question.matrix.selectionMode === undefined) question.matrix.selectionMode = "single_per_row";
  if (!Array.isArray(question.correct) && isRecord(question.matrix.correct)) {
    question.correct = Object.entries(question.matrix.correct)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .map(([rowId, columnId]) => ({ rowId, columnIds: [columnId] }));
  }
};

const normalizeBowtieTokens = (question: JsonRecord) => {
  if (question.itemType !== "bowtie" || !isRecord(question.bowtie)) return;
  for (const zoneName of ["condition", "actions", "parameters"]) {
    const zone = question.bowtie[zoneName];
    if (!isRecord(zone) || !Array.isArray(zone.tokens)) continue;
    zone.tokens = zone.tokens.map((token) => {
      if (!isRecord(token)) return token;
      if (typeof token.en === "string" && typeof token.zh === "string") return token;
      if (isTextPair(token.text)) {
        return {
          id: token.id,
          en: token.text.en,
          zh: token.text.zh,
        };
      }
      return token;
    });
  }
};

const pruneSelectAll = (question: JsonRecord) => {
  if (question.itemType !== "select_all" || !Array.isArray(question.options) || question.options.length <= 6) return;
  const correct = new Set(Array.isArray(question.correct) ? question.correct : []);
  const removed = new Set<string>();
  const kept = [...question.options];

  for (let index = kept.length - 1; index >= 0 && kept.length > 6; index--) {
    const option = kept[index];
    if (!isRecord(option) || typeof option.id !== "string" || correct.has(option.id)) continue;
    removed.add(option.id);
    kept.splice(index, 1);
  }

  while (kept.length > 6) {
    const option = kept.pop();
    if (isRecord(option) && typeof option.id === "string") removed.add(option.id);
  }

  question.options = kept;
  if (isRecord(question.rationale) && Array.isArray(question.rationale.byChoice)) {
    question.rationale.byChoice = question.rationale.byChoice.filter(
      (choice) => !(isRecord(choice) && typeof choice.refId === "string" && removed.has(choice.refId)),
    );
  }
};

const normalizeQuestion = (question: unknown, inheritedDifficulty?: string) => {
  if (!isRecord(question)) return;
  if (question.difficulty === "high") question.difficulty = "hard";
  if (question.difficulty === undefined && inheritedDifficulty) question.difficulty = inheritedDifficulty;

  normalizeOptions(question);
  normalizeByChoice(question.rationale);
  question.glossary = normalizeGlossary(question.glossary);
  normalizeHighlight(question);
  normalizeDropdownCloze(question);
  normalizeMatrix(question);

  if (question.itemType === "multiple_choice" && typeof question.correct === "string") {
    question.correct = [question.correct];
  }

  if (question.itemType === "bowtie" && !isRecord(question.bowtie) && isRecord(question.condition) && isRecord(question.actions) && isRecord(question.parameters)) {
    question.bowtie = {
      condition: question.condition,
      actions: question.actions,
      parameters: question.parameters,
    };
    delete question.condition;
    delete question.actions;
    delete question.parameters;
  }

  normalizeBowtieTokens(question);
  pruneSelectAll(question);
};

const normalizeStage = (stage: unknown, baseExhibits: Map<string, unknown>) => {
  if (!isRecord(stage)) return stage;
  const normalized: JsonRecord = {
    id: stage.id,
    title: stage.title,
  };

  if (Array.isArray(stage.exhibits) && stage.exhibits.length > 0) {
    normalized.exhibits = stage.exhibits;
    return normalized;
  }

  const availableIds = Array.isArray(stage.availableExhibitIds)
    ? stage.availableExhibitIds
    : Array.isArray(stage.availableExhibits)
      ? stage.availableExhibits
      : [];
  const referenced = availableIds
    .filter((id): id is string => typeof id === "string")
    .map((id) => baseExhibits.get(id))
    .filter((exhibit): exhibit is unknown => exhibit !== undefined);

  if (referenced.length > 0 && !isTextPair(stage.content) && !isTextPair(stage.narrative)) {
    normalized.exhibits = referenced;
    return normalized;
  }

  const content = isTextPair(stage.content) ? stage.content : isTextPair(stage.narrative) ? stage.narrative : undefined;
  normalized.exhibits = [
    {
      id: stageExhibitId(stage, "update"),
      title: stage.title,
      content: content ?? {
        en: `Available exhibits: ${availableIds.join(", ") || "case record"}.`,
        zh: `可用资料：${availableIds.join(", ") || "病例记录"}。`,
      },
    },
  ];
  return normalized;
};

const normalizeCaseStudy = (question: JsonRecord) => {
  if (question.itemType !== "case_study" || !isRecord(question.caseStudy)) return;
  if (!isTextPair(question.stem)) question.stem = defaultCaseStem;

  const caseStudy = question.caseStudy;
  const baseExhibits = new Map<string, unknown>();
  if (Array.isArray(caseStudy.exhibits)) {
    caseStudy.exhibits.forEach((exhibit) => {
      if (isRecord(exhibit) && typeof exhibit.id === "string") baseExhibits.set(exhibit.id, exhibit);
    });
  }

  if (Array.isArray(caseStudy.stages)) {
    caseStudy.stages = caseStudy.stages.map((stage) => normalizeStage(stage, baseExhibits));
  }

  const inheritedDifficulty = typeof question.difficulty === "string" ? question.difficulty : undefined;
  const inheritedCategory = typeof question.category === "string" ? question.category : undefined;
  const inheritedTopic = typeof question.topic === "string" ? question.topic : undefined;
  if (Array.isArray(caseStudy.questions)) {
    caseStudy.questions.forEach((embedded) => {
      if (isRecord(embedded)) {
        if (embedded.category === undefined && inheritedCategory) embedded.category = inheritedCategory;
        if (embedded.topic === undefined && inheritedTopic) embedded.topic = inheritedTopic;
      }
      normalizeQuestion(embedded, inheritedDifficulty);
    });
  }
};

for (const file of files) {
  const raw = JSON.parse(readFileSync(file, "utf8")) as JsonRecord;
  if (isRecord(raw.meta) && raw.meta.difficulty === "high") raw.meta.difficulty = "hard";
  if (Array.isArray(raw.questions)) {
    raw.questions.forEach((question) => {
      normalizeQuestion(question);
      if (isRecord(question)) normalizeCaseStudy(question);
    });
  }
  writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`remediated ${file}`);
}
