import {
  type AnswerState,
  getInitialAnswer,
  gradeStandaloneQuestion,
} from "./grading";
import { formatItemType } from "./itemTypes";
import type { SessionState } from "./sessionState";
import type {
  BowtieQuestion,
  CaseStudyQuestion,
  DropdownClozeQuestion,
  FillInBlankQuestion,
  HighlightQuestion,
  MatrixQuestion,
  Option,
  OptionQuestion,
  OrderedResponseQuestion,
  RationaleChoice,
  StandaloneQuestion,
  TextPair,
} from "./types";

type ReviewLeaf = {
  standalone: StandaloneQuestion;
  answer: AnswerState;
  parentCaseId?: string;
  parentCaseTitle?: TextPair;
  parentCaseSummary?: TextPair;
  visualKinds: string[];
};

const PREAMBLE = `你正在帮助一位准备 NCLEX-RN 的中文母语学习者复习她刚做错的题目。

请主要用简体中文解释，但重要的医学、护理、药物、症状、诊断和考试关键词请保留英文原词。目标不是翻译整题，而是帮助她理解临床逻辑，并能开口读出关键英文术语。

请按每道错题这样讲解：

1. 先用中文说明这题在临床上对应什么情况，也就是为什么护士需要关心这个问题。
2. 用中文解释为什么正确答案对；必要时简短解释为什么其他选择不优先或不安全。
3. 把关键英文医学词列出来，给出：
   - English term
   - 简体中文意思
   - 简单发音提示（用普通人能读出来的英文近似音，不需要 IPA）
   - 一个很短的英文例句，帮助她知道临床对话中怎么说
4. 最后用中文问 1 个检查理解的小问题。

语气要鼓励、耐心、具体。不要评价她是否会通过考试，不要使用羞辱、吓人或 pass/fail readiness 语言。`;

const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));

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

const parentVisualKinds = (question: CaseStudyQuestion) => {
  const exhibitKinds = question.caseStudy.exhibits.flatMap((exhibit) => exhibit.visual ? [exhibit.visual.kind] : []);
  const stageKinds = (question.caseStudy.stages ?? []).flatMap((stage) =>
    stage.exhibits.flatMap((exhibit) => exhibit.visual ? [exhibit.visual.kind] : []),
  );
  return uniqueSorted([...exhibitKinds, ...stageKinds]);
};

const directVisualKinds = (question: StandaloneQuestion): string[] => question.visual ? [question.visual.kind] : [];

const flattenMissedLeaves = (session: SessionState): ReviewLeaf[] =>
  session.questions.flatMap<ReviewLeaf>((question): ReviewLeaf[] => {
    if (session.results[question.id] !== false) return [];

    if (question.itemType !== "case_study") {
      return [{
        standalone: question,
        answer: session.answers[question.id] ?? getInitialAnswer(question),
        visualKinds: directVisualKinds(question),
      }];
    }

    const parentKinds = parentVisualKinds(question);
    const caseAnswer = session.answers[question.id];
    return question.caseStudy.questions.flatMap((part) => {
      const partAnswer = caseAnswer?.caseStudy?.[part.id] ?? getInitialAnswer(part);
      if (gradeStandaloneQuestion(part, partAnswer)) return [];
      return [{
        standalone: part,
        answer: partAnswer,
        parentCaseId: question.id,
        parentCaseTitle: question.caseStudy.title,
        parentCaseSummary: question.caseStudy.summary,
        visualKinds: uniqueSorted([...directVisualKinds(part), ...parentKinds]),
      }];
    });
  });

const isVisualLeaf = (leaf: ReviewLeaf) => leaf.visualKinds.length > 0;

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

const describeChoiceBreakdown = ({ standalone, answer }: ReviewLeaf): string => {
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

const renderDetailedLeaf = (leaf: ReviewLeaf, index: number) => {
  const { standalone } = leaf;
  const lines = [
    `### ${index + 1}. ${formatItemType(standalone.itemType)} · ${standalone.category} · ${standalone.topic}${
      leaf.parentCaseTitle ? ` · from case: ${leaf.parentCaseTitle.en}` : ""
    }`,
  ];

  if (leaf.parentCaseSummary) {
    lines.push(`*Case context: ${leaf.parentCaseSummary.en} — ${leaf.parentCaseSummary.zh}*`);
  }

  lines.push(
    `**Question source — EN:** ${standalone.stem.en}`,
    `**题目原文 — ZH:** ${standalone.stem.zh}`,
  );

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

  lines.push(
    `**Answer breakdown / 答题详情:**\n${describeChoiceBreakdown(leaf)}`,
    `**Rationale source — EN:** ${standalone.rationale.correct.en}`,
    `**解析原文 — ZH:** ${standalone.rationale.correct.zh}${glossaryLine(standalone)}`,
  );

  return lines.join("\n\n");
};

const visualPointer = (leaf: ReviewLeaf) =>
  `${formatItemType(leaf.standalone.itemType)} · ${leaf.standalone.topic} · ${leaf.visualKinds.join(", ")}${
    leaf.parentCaseTitle ? ` · from case: ${leaf.parentCaseTitle.en}` : ""
  }`;

export const buildReviewPromptText = ({
  session,
  generatedAt = new Date(),
}: {
  session: SessionState;
  generatedAt?: Date;
}): string => {
  const leaves = flattenMissedLeaves(session);
  const detailedLeaves = leaves.filter((leaf) => !isVisualLeaf(leaf));
  const visualLeaves = leaves.filter(isVisualLeaf);
  const answered = Object.keys(session.results).length;
  const missed = session.questions.filter((question) => session.results[question.id] === false);
  const categories = uniqueSorted(leaves.map((leaf) => leaf.standalone.category));
  const visualLine = visualLeaves.length > 0
    ? `\n- 另有 ${visualLeaves.length} 道题包含图表/心电图等视觉资料，需要在软件内查看，此处未展开：${visualLeaves.map(visualPointer).join("; ")}`
    : "";
  const allVisualLine = detailedLeaves.length === 0 && visualLeaves.length > 0
    ? "\n- **本次做错的题目全部依赖图表/心电图等视觉资料，以上仅列出题号和类别，没有可展开的详细内容 — 请直接在软件内复习这些题目。**"
    : "";
  const detailHeading = `## 错题详情（共 ${detailedLeaves.length} 处${visualLeaves.length > 0 ? `，另 ${visualLeaves.length} 处见上方图表提示` : ""}）`;
  const detailBlocks = detailedLeaves.map(renderDetailedLeaf).join("\n\n---\n\n");

  return [
    PREAMBLE,
    `## 本次练习摘要
- 模式：${session.mode}
- 已作答：${answered} · 做错：${missed.length} 题 · 跳过：${session.skippedQuestionIds.length}
- 错题涉及的类别：${categories.length > 0 ? categories.join(", ") : "none"}
- 生成时间：${generatedAt.toLocaleString()}${visualLine}${allVisualLine}`,
    detailHeading,
    detailBlocks,
  ].filter((section) => section.length > 0).join("\n\n");
};
