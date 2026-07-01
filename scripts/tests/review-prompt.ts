import assert from "node:assert/strict";
import { buildReviewPromptText } from "../../src/reviewPrompt";
import type { AnswerState } from "../../src/grading";
import type { CaseStudyQuestion, QuestionVisual, StandaloneQuestion } from "../../src/types";
import type { SessionState } from "../../src/sessionState";

const pair = (value: string) => ({ en: value, zh: `${value} zh` });

const base = {
  category: "Management of Care" as const,
  topic: "review prompt fixture",
  difficulty: "medium" as const,
  stem: pair("Fixture stem"),
  rationale: { correct: pair("Fixture correct rationale") },
  testTakingStrategy: pair("Fixture strategy"),
  glossary: [],
};

const sessionFor = (
  questions: StandaloneQuestion[] | CaseStudyQuestion[],
  answers: Record<string, AnswerState>,
  results?: Record<string, boolean>,
): SessionState => ({
  id: "review_prompt_session",
  mode: "study",
  questions,
  poolIds: questions.map((question) => question.id),
  index: 0,
  answers,
  results: results ?? Object.fromEntries(questions.map((question) => [question.id, false])),
  scores: {},
  skippedQuestionIds: [],
  phase: "questions",
  languageMode: "always",
  title: "Review prompt test",
  startedAt: "2026-01-02T03:04:05.000Z",
});

const mc: StandaloneQuestion = {
  ...base,
  id: "review_mc",
  itemType: "multiple_choice",
  glossary: [{ termEn: "airway", termZh: "气道", defZh: "呼吸通道" }],
  options: [
    { id: "a", en: "Call the provider", zh: "通知医生" },
    { id: "b", en: "Open the airway", zh: "打开气道" },
    { id: "c", en: "Offer water", zh: "给水" },
  ],
  correct: ["b"],
  rationale: {
    correct: pair("Airway comes first."),
    byChoice: [
      { refId: "a", en: "Provider notification is not first.", zh: "通知医生不是第一步。" },
      { refId: "b", en: "Airway is the priority.", zh: "气道优先。" },
      { refId: "c", en: "Water is unsafe here.", zh: "此时给水不安全。" },
    ],
  },
};

const sata: StandaloneQuestion = {
  ...base,
  id: "review_sata",
  itemType: "select_all",
  options: [
    { id: "a", en: "Assess pain", zh: "评估疼痛" },
    { id: "b", en: "Check allergies", zh: "查看过敏史" },
    { id: "c", en: "Ignore symptoms", zh: "忽略症状" },
  ],
  correct: ["a", "b"],
  rationale: {
    correct: pair("Assessment and allergy checks are needed."),
    byChoice: [
      { refId: "a", en: "Pain assessment is relevant.", zh: "疼痛评估相关。" },
      { refId: "b", en: "Allergies affect safe care.", zh: "过敏史影响安全护理。" },
      { refId: "c", en: "Ignoring symptoms is unsafe.", zh: "忽略症状不安全。" },
    ],
  },
};

const ordered: StandaloneQuestion = {
  ...base,
  id: "review_ordered",
  itemType: "ordered_response",
  options: [
    { id: "a", en: "Assess", zh: "评估" },
    { id: "b", en: "Intervene", zh: "干预" },
    { id: "c", en: "Evaluate", zh: "评价" },
  ],
  correct: ["a", "b", "c"],
};

const blank: StandaloneQuestion = {
  ...base,
  id: "review_blank",
  itemType: "fill_in_blank",
  blanks: [
    { id: "dose", prompt: pair("Dose"), numeric: { value: 12, tolerance: 0.5, unit: "mL" } },
    { id: "term", prompt: pair("Term"), acceptable: ["digoxin"] },
  ],
};

const matrix: StandaloneQuestion = {
  ...base,
  id: "review_matrix",
  itemType: "matrix",
  matrix: {
    rows: [
      { id: "r1", en: "Fever", zh: "发热" },
      { id: "r2", en: "Stable gait", zh: "步态稳定" },
    ],
    columns: [
      { id: "c1", en: "Concerning", zh: "需关注" },
      { id: "c2", en: "Expected", zh: "预期" },
    ],
    selectionMode: "single_per_row",
  },
  correct: [
    { rowId: "r1", columnIds: ["c1"] },
    { rowId: "r2", columnIds: ["c2"] },
  ],
};

const dropdown: StandaloneQuestion = {
  ...base,
  id: "review_dropdown",
  itemType: "dropdown_cloze",
  stem: pair("Complete the sentence."),
  clozeStem: { en: "First {{d1}}, then {{d2}}.", zh: "先 {{d1}}，然后 {{d2}}。" },
  dropdowns: [
    {
      id: "d1",
      options: [
        { id: "a", en: "assess", zh: "评估" },
        { id: "b", en: "delegate", zh: "委派" },
      ],
      correct: "a",
    },
    {
      id: "d2",
      options: [
        { id: "a", en: "document", zh: "记录" },
        { id: "b", en: "ignore", zh: "忽略" },
      ],
      correct: "a",
    },
  ],
};

const highlight: StandaloneQuestion = {
  ...base,
  id: "review_highlight",
  itemType: "highlight",
  stem: pair("Highlight the urgent cue."),
  highlight: {
    segments: [
      { id: "s1", en: "Skin warm.", zh: "皮肤温暖。" },
      { id: "s2", en: "Stridor present.", zh: "出现喘鸣。", selectable: true },
    ],
    correct: ["s2"],
  },
};

const bowtie: StandaloneQuestion = {
  ...base,
  id: "review_bowtie",
  itemType: "bowtie",
  bowtie: {
    condition: {
      tokens: [
        { id: "cond1", en: "Shock", zh: "休克" },
        { id: "cond2", en: "Anxiety", zh: "焦虑" },
      ],
      correct: "cond1",
    },
    actions: {
      tokens: [
        { id: "act1", en: "Give oxygen", zh: "给氧" },
        { id: "act2", en: "Start IV fluids", zh: "开始静脉补液" },
        { id: "act3", en: "Delay care", zh: "延迟护理" },
      ],
      correct: ["act1", "act2"],
    },
    parameters: {
      tokens: [
        { id: "param1", en: "Blood pressure", zh: "血压" },
        { id: "param2", en: "Urine output", zh: "尿量" },
        { id: "param3", en: "Hair color", zh: "发色" },
      ],
      correct: ["param1", "param2"],
    },
  },
};

const allTypesOutput = buildReviewPromptText({
  session: sessionFor(
    [mc, sata, ordered, blank, matrix, dropdown, highlight, bowtie],
    {
      review_mc: { optionIds: ["a"] },
      review_sata: { optionIds: ["a", "c"] },
      review_ordered: { optionIds: ["c", "b", "a"] },
      review_blank: { blanks: { term: "" } },
      review_matrix: { matrix: { r1: ["c2"] } },
      review_dropdown: { dropdowns: { d1: "b" } },
      review_highlight: { segments: [] },
      review_bowtie: { bowtie: { condition: ["cond2"], actions: ["act1"], parameters: [] } },
    },
  ),
  generatedAt: new Date("2026-01-02T03:04:05.000Z"),
});

assert.match(allTypesOutput, /\[✓\] Open the airway/);
assert.match(allTypesOutput, /\[→\] Call the provider/);
assert.match(allTypesOutput, /Rationale b: Airway is the priority/);
assert.match(allTypesOutput, /Rationale a: Provider notification is not first/);
assert.doesNotMatch(allTypesOutput, /Water is unsafe here/);
assert.match(allTypesOutput, /Rationale c: Ignoring symptoms is unsafe/);
assert.match(allTypesOutput, /Correct order: 1\) Assess/);
assert.match(allTypesOutput, /Her order: 1\) Evaluate/);
assert.match(allTypesOutput, /Blank 1 — correct: 12mL · she wrote: "\(left blank\)"/);
assert.match(allTypesOutput, /Blank 2 — correct: digoxin · she wrote: "\(left blank\)"/);
assert.match(allTypesOutput, /Fever — 发热 — correct: Concerning — 需关注 · she selected: Expected — 预期/);
assert.match(allTypesOutput, /\*\*Fill-in sentence — EN:\*\* First \{\{d1\}\}, then \{\{d2\}\}\./);
assert.match(allTypesOutput, /\*\*Passage — EN:\*\* Skin warm\. Stridor present\./);
assert.match(allTypesOutput, /Condition — token pool: Shock — 休克, Anxiety — 焦虑/);
assert.ok(allTypesOutput.includes("airway (气道 — 呼吸通道)"));

const casePart: StandaloneQuestion = {
  ...base,
  id: "review_case_part",
  itemType: "multiple_choice",
  stem: pair("Visual-dependent case part stem"),
  options: [
    { id: "a", en: "Wrong", zh: "错误" },
    { id: "b", en: "Right", zh: "正确" },
  ],
  correct: ["b"],
};

const visualCase: CaseStudyQuestion = {
  ...base,
  id: "review_visual_case",
  itemType: "case_study",
  caseStudy: {
    title: pair("Visual case"),
    exhibits: [],
    stages: [
      {
        id: "stage1",
        title: pair("Stage 1"),
        exhibits: [
          {
            id: "visual_exhibit",
            title: pair("Trend"),
            content: pair("Trend content"),
            visual: { kind: "lab_trend" } as QuestionVisual,
          },
        ],
      },
    ],
    questions: [casePart],
  },
};

const visualOnlyOutput = buildReviewPromptText({
  session: sessionFor(
    [visualCase],
    { review_visual_case: { caseStudy: { review_case_part: { optionIds: ["a"] } } } },
  ),
  generatedAt: new Date("2026-01-02T03:04:05.000Z"),
});

assert.match(visualOnlyOutput, /lab_trend/);
assert.match(visualOnlyOutput, /本次做错的题目全部依赖图表/);
assert.doesNotMatch(visualOnlyOutput, /Visual-dependent case part stem/);

console.log("review-prompt tests passed");
