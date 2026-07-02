import type { AnswerState } from "./grading";
import { getVisibleCaseStages } from "./examLayout";
import { formatItemType } from "./itemTypes";
import type {
  BowtieQuestion,
  CaseStudyExhibit,
  CaseStudyQuestion,
  DropdownClozeQuestion,
  FillInBlankQuestion,
  HighlightQuestion,
  MatrixQuestion,
  Option,
  OptionQuestion,
  OrderedResponseQuestion,
  QuestionVisual,
  RationaleChoice,
  StandaloneQuestion,
} from "./types";

type PromptLeaf = {
  standalone: StandaloneQuestion;
  answer: AnswerState;
};

const PREAMBLE = `你正在帮助一位准备 NCLEX-RN 的中文母语学习者复习她刚做错的一道题或一个案例部分。

请主要用简体中文解释，但重要的医学、护理、药物、症状、诊断和考试关键词请保留英文原词。目标不是翻译整题，而是帮助她理解临床逻辑，并能开口读出关键英文术语。

请按这道题这样讲解：

1. 先用中文说明这题在临床上对应什么情况，也就是为什么护士需要关心这个问题。
2. 用中文解释为什么正确答案对；必要时简短解释为什么其他选择不优先或不安全。
3. 把关键英文医学词列出来，给出：
   - English term
   - 简体中文意思
   - 简单发音提示（用普通人能读出来的英文近似音，不需要 IPA）
   - 一个很短的英文例句，帮助她知道临床对话中怎么说
4. 最后用中文问 1 个检查理解的小问题。

语气要鼓励、耐心、具体。不要评价她是否会通过考试，不要羞辱、吓唬或暗示她已经不适合继续学习。`;

const optionLabel = (option: Option) => `${option.en} — ${option.zh}`;

const optionList = (options: Option[]) => options.map(optionLabel).join(", ");

const optionMap = (options: Option[]) => new Map(options.map((option) => [option.id, option]));

const idsToOptionList = (ids: string[], options: Option[], emptyLabel: string) => {
  const byId = optionMap(options);
  const labels = ids.map((id) => byId.get(id)).filter((option): option is Option => Boolean(option)).map(optionLabel);
  return labels.length > 0 ? labels.join(", ") : emptyLabel;
};

const getRationaleMap = (rationales: RationaleChoice[] | undefined) =>
  new Map((rationales ?? []).map((entry) => [entry.refId, entry]));

const formatRationale = (entry: RationaleChoice | undefined) =>
  entry ? `  - Rationale ${entry.refId}: ${entry.en} — ${entry.zh}` : undefined;

const answerIds = (answer: AnswerState) => answer.optionIds ?? [];

const numericAnswerValue = (blank: FillInBlankQuestion["blanks"][number]) =>
  blank.numeric ? `${blank.numeric.value}${blank.numeric.unit ?? ""}` : (blank.acceptable?.[0] ?? "");

const choiceRationalesForOptionQuestion = (question: OptionQuestion, answer: AnswerState) => {
  const selected = new Set(answerIds(answer));
  const correct = new Set(question.correct);
  const rationaleByRef = getRationaleMap(question.rationale.byChoice);
  return question.options
    .filter((option) => correct.has(option.id) || (selected.has(option.id) && !correct.has(option.id)))
    .map((option) => formatRationale(rationaleByRef.get(option.id)))
    .filter((line): line is string => Boolean(line));
};

const allRationales = (question: StandaloneQuestion) =>
  (question.rationale.byChoice ?? [])
    .map(formatRationale)
    .filter((line): line is string => Boolean(line));

const describeOptionQuestion = (question: OptionQuestion, answer: AnswerState) => {
  const selected = new Set(answerIds(answer));
  const correct = new Set(question.correct);
  const choices = question.options.map((option) => {
    const markers = `${correct.has(option.id) ? "[✓]" : ""}${selected.has(option.id) ? "[→]" : ""}`;
    return `- ${markers ? `${markers} ` : ""}${optionLabel(option)}`;
  });
  return [...choices, ...choiceRationalesForOptionQuestion(question, answer)].join("\n");
};

const describeOrderedResponse = (question: OrderedResponseQuestion, answer: AnswerState) => {
  const byId = optionMap(question.options);
  const sequence = (ids: string[]) =>
    ids
      .map((id, index) => {
        const option = byId.get(id);
        return option ? `${index + 1}) ${optionLabel(option)}` : undefined;
      })
      .filter((line): line is string => Boolean(line))
      .join(" ");
  return [
    `Correct order: ${sequence(question.correct)}`,
    `Her order: ${sequence(answerIds(answer)) || "(not answered)"}`,
    ...allRationales(question),
  ].join("\n");
};

const describeFillInBlank = (question: FillInBlankQuestion, answer: AnswerState) =>
  [
    ...question.blanks.map((blank, index) => {
      const submitted = answer.blanks?.[blank.id]?.trim();
      return `Blank ${index + 1} — correct: ${numericAnswerValue(blank)} · she wrote: "${submitted || "(left blank)"}"`;
    }),
    ...allRationales(question),
  ].join("\n");

const describeMatrix = (question: MatrixQuestion, answer: AnswerState) => {
  const correctByRow = new Map(question.correct.map((entry) => [entry.rowId, entry.columnIds]));
  return [
    ...question.matrix.rows.map((row) => {
      const correct = idsToOptionList(correctByRow.get(row.id) ?? [], question.matrix.columns, "(none)");
      const selected = idsToOptionList(answer.matrix?.[row.id] ?? [], question.matrix.columns, "(none)");
      return `${optionLabel(row)} — correct: ${correct} · she selected: ${selected}`;
    }),
    ...allRationales(question),
  ].join("\n");
};

const describeDropdownCloze = (question: DropdownClozeQuestion, answer: AnswerState) =>
  [
    ...question.dropdowns.map((dropdown, index) => {
      const byId = optionMap(dropdown.options);
      const correct = byId.get(dropdown.correct);
      const selected = byId.get(answer.dropdowns?.[dropdown.id] ?? "");
      return `Blank ${index + 1} — correct: ${correct ? optionLabel(correct) : "(unknown)"} · she selected: ${
        selected ? optionLabel(selected) : "(not answered)"
      }`;
    }),
    ...allRationales(question),
  ].join("\n");

const describeHighlight = (question: HighlightQuestion, answer: AnswerState) => {
  const byId = optionMap(question.highlight.segments);
  const labelsFor = (ids: string[], emptyLabel: string) => {
    const labels = ids.map((id) => byId.get(id)).filter((segment): segment is Option => Boolean(segment)).map(optionLabel);
    return labels.length > 0 ? labels.join("; ") : emptyLabel;
  };
  return [
    `Correct: ${labelsFor(question.highlight.correct, "(none)")}`,
    `Her selection: ${labelsFor(answer.segments ?? [], "(none selected)")}`,
    ...allRationales(question),
  ].join("\n");
};

const bowtieZone = (
  label: string,
  zone: BowtieQuestion["bowtie"]["condition"] | BowtieQuestion["bowtie"]["actions"] | BowtieQuestion["bowtie"]["parameters"],
  correctIds: string[],
  selectedIds: string[],
) => [
  `${label} — token pool: ${optionList(zone.tokens)}`,
  `${label} — correct: ${idsToOptionList(correctIds, zone.tokens, "(none)")}`,
  `${label} — she chose: ${idsToOptionList(selectedIds, zone.tokens, "(not answered)")}`,
];

const describeBowtie = (question: BowtieQuestion, answer: AnswerState) => {
  const placed = answer.bowtie ?? {};
  return [
    ...bowtieZone("Condition", question.bowtie.condition, [question.bowtie.condition.correct], placed.condition ?? []),
    ...bowtieZone("Actions", question.bowtie.actions, question.bowtie.actions.correct, placed.actions ?? []),
    ...bowtieZone("Parameters", question.bowtie.parameters, question.bowtie.parameters.correct, placed.parameters ?? []),
    ...allRationales(question),
  ].join("\n");
};

const describeChoiceBreakdown = ({ standalone, answer }: PromptLeaf): string => {
  if (standalone.itemType === "multiple_choice" || standalone.itemType === "select_all") {
    return describeOptionQuestion(standalone, answer);
  }
  if (standalone.itemType === "ordered_response") return describeOrderedResponse(standalone, answer);
  if (standalone.itemType === "fill_in_blank") return describeFillInBlank(standalone, answer);
  if (standalone.itemType === "matrix") return describeMatrix(standalone, answer);
  if (standalone.itemType === "dropdown_cloze") return describeDropdownCloze(standalone, answer);
  if (standalone.itemType === "highlight") return describeHighlight(standalone, answer);
  return describeBowtie(standalone, answer);
};

const glossaryLine = (question: StandaloneQuestion) =>
  question.glossary.length > 0
    ? `\n**English terms to practice:** ${question.glossary.map((term) => `${term.termEn} (${term.termZh} — ${term.defZh})`).join("; ")}`
    : "";

const stripAuditFields = (value: unknown, seen = new WeakSet<object>()): unknown => {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) throw new Error("Cannot serialize circular visual data");
  seen.add(value);
  const stripped = Array.isArray(value)
    ? value.map((entry) => stripAuditFields(entry, seen))
    : Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "selfCheck" && key !== "meta")
        .map(([key, entry]) => [key, stripAuditFields(entry, seen)]),
    );
  seen.delete(value);
  return stripped;
};

const renderVisualData = (visual: QuestionVisual, owner = "这道题") => {
  const framing = `${owner}包含应用内绘制的图形（kind: ${visual.kind}）。以下是生成该图形的结构化数据，请据此理解图形内容：`;
  try {
    return `${framing}\n\`\`\`json\n${JSON.stringify(stripAuditFields(visual), null, 2)}\n\`\`\``;
  } catch {
    return `${framing}\n（无法附上图形数据 — 我会自己描述我看到的内容。）`;
  }
};

const renderExhibit = (exhibit: CaseStudyExhibit, label: string) => [
  `### ${label}: ${exhibit.title.en} / ${exhibit.title.zh}`,
  `**Exhibit content — EN:** ${exhibit.content.en}`,
  `**病例资料 — ZH:** ${exhibit.content.zh}`,
  exhibit.visual ? renderVisualData(exhibit.visual, "这份病例资料") : "",
].filter(Boolean).join("\n\n");

const renderCaseContext = (parentCase: CaseStudyQuestion, part: StandaloneQuestion) => {
  const visibleStages = getVisibleCaseStages(parentCase, part);
  const globalExhibits = parentCase.caseStudy.exhibits.map((exhibit) => renderExhibit(exhibit, "Global exhibit"));
  const stageExhibits = visibleStages.flatMap((stage) =>
    stage.exhibits.map((exhibit) => renderExhibit(exhibit, `Visible stage exhibit (${stage.title.en} / ${stage.title.zh})`)),
  );

  return [
    "## Case context / 案例背景",
    `**Case title — EN:** ${parentCase.caseStudy.title.en}`,
    `**案例标题 — ZH:** ${parentCase.caseStudy.title.zh}`,
    parentCase.caseStudy.summary ? `**Case summary — EN:** ${parentCase.caseStudy.summary.en}` : "",
    parentCase.caseStudy.summary ? `**案例摘要 — ZH:** ${parentCase.caseStudy.summary.zh}` : "",
    [...globalExhibits, ...stageExhibits].join("\n\n"),
  ].filter(Boolean).join("\n\n");
};

const renderDetailedLeaf = (leaf: PromptLeaf, generatedAt: Date, parentCase?: CaseStudyQuestion) => {
  const { standalone } = leaf;
  const lines = [
    `## ${formatItemType(standalone.itemType)} · ${standalone.category} · ${standalone.topic}${
      parentCase ? ` · from case: ${parentCase.caseStudy.title.en}` : ""
    }`,
    `**Question source — EN:** ${standalone.stem.en}`,
    `**题目原文 — ZH:** ${standalone.stem.zh}`,
  ];

  if (standalone.itemType === "dropdown_cloze") {
    lines.push(
      `**Fill-in sentence — EN:** ${standalone.clozeStem.en}`,
      `**填空句 — ZH:** ${standalone.clozeStem.zh}`,
    );
  }

  if (standalone.itemType === "highlight") {
    lines.push(
      `**Passage — EN:** ${standalone.highlight.segments.map((segment) => segment.en).join(" ")}`,
      `**文段 — ZH:** ${standalone.highlight.segments.map((segment) => segment.zh).join(" ")}`,
    );
  }

  if (standalone.visual) {
    lines.push(renderVisualData(standalone.visual));
  }

  lines.push(
    `**Answer breakdown / 答题详情:**\n${describeChoiceBreakdown(leaf)}`,
    `**Rationale source — EN:** ${standalone.rationale.correct.en}`,
    `**解析原文 — ZH:** ${standalone.rationale.correct.zh}${glossaryLine(standalone)}`,
    `**Generated at / 生成时间:** ${generatedAt.toLocaleString()}`,
  );

  return lines.join("\n\n");
};

export const buildQuestionRescuePromptText = ({
  question,
  answer,
  parentCase,
  generatedAt = new Date(),
}: {
  question: StandaloneQuestion;
  answer: AnswerState;
  parentCase?: CaseStudyQuestion;
  generatedAt?: Date;
}): string => [
  PREAMBLE,
  parentCase ? renderCaseContext(parentCase, question) : "",
  renderDetailedLeaf({ standalone: question, answer }, generatedAt, parentCase),
].filter(Boolean).join("\n\n---\n\n");
