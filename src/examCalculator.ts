export type CalculatorOperator = "add" | "subtract" | "multiply" | "divide";

export type CalculatorAction =
  | { type: "digit"; digit: string }
  | { type: "decimal" }
  | { type: "operator"; operator: CalculatorOperator }
  | { type: "equals" }
  | { type: "toggle-sign" }
  | { type: "backspace" }
  | { type: "clear" };

export type CalculatorState = {
  display: string;
  accumulator: number | null;
  pendingOperator: CalculatorOperator | null;
  waitingForOperand: boolean;
  lastOperator: CalculatorOperator | null;
  lastOperand: number | null;
  justEvaluated: boolean;
  error: boolean;
};

export const CALCULATOR_MAX_MANUAL_DIGITS = 12;

export const initialCalculatorState = (): CalculatorState => ({
  display: "0",
  accumulator: null,
  pendingOperator: null,
  waitingForOperand: false,
  lastOperator: null,
  lastOperand: null,
  justEvaluated: false,
  error: false,
});

const errorState = (): CalculatorState => ({
  ...initialCalculatorState(),
  display: "Error",
  error: true,
});

const manualDigitCount = (value: string): number =>
  value.replace("-", "").replace(".", "").length;

const normalizeResult = (value: number): number | null => {
  if (!Number.isFinite(value)) return null;
  const normalized = Number(value.toPrecision(12));
  return Number.isFinite(normalized) ? normalized : null;
};

const formatResult = (value: number): string | null => {
  const normalized = normalizeResult(value);
  if (normalized === null) return null;
  return Object.is(normalized, -0) ? "0" : String(normalized);
};

const calculate = (
  left: number,
  operator: CalculatorOperator,
  right: number,
): number | null => {
  let result: number;
  switch (operator) {
    case "add":
      result = left + right;
      break;
    case "subtract":
      result = left - right;
      break;
    case "multiply":
      result = left * right;
      break;
    case "divide":
      if (right === 0) return null;
      result = left / right;
      break;
  }
  return normalizeResult(result);
};

const freshEntryState = (state: CalculatorState): CalculatorState =>
  state.error || state.justEvaluated ? initialCalculatorState() : state;

const enterDigit = (current: CalculatorState, digit: string): CalculatorState => {
  if (!/^[0-9]$/.test(digit)) return current;
  const state = freshEntryState(current);

  if (state.waitingForOperand) {
    return {
      ...state,
      display: digit,
      waitingForOperand: false,
      justEvaluated: false,
    };
  }

  let display: string;
  if (state.display === "0") {
    display = digit;
  } else if (state.display === "-0") {
    display = digit === "0" ? "-0" : `-${digit}`;
  } else {
    display = `${state.display}${digit}`;
  }

  if (manualDigitCount(display) > CALCULATOR_MAX_MANUAL_DIGITS) return state;
  return { ...state, display };
};

const enterDecimal = (current: CalculatorState): CalculatorState => {
  const state = freshEntryState(current);
  if (state.waitingForOperand) {
    return {
      ...state,
      display: "0.",
      waitingForOperand: false,
      justEvaluated: false,
    };
  }
  if (state.display.includes(".")) return state;
  return { ...state, display: `${state.display}.` };
};

const selectOperator = (
  state: CalculatorState,
  operator: CalculatorOperator,
): CalculatorState => {
  if (state.error) return state;

  if (state.pendingOperator && state.waitingForOperand) {
    return { ...state, pendingOperator: operator };
  }

  const operand = Number(state.display);
  let accumulator = state.accumulator;
  let display = state.display;

  if (state.pendingOperator && accumulator !== null) {
    const result = calculate(accumulator, state.pendingOperator, operand);
    if (result === null) return errorState();
    const formatted = formatResult(result);
    if (formatted === null) return errorState();
    accumulator = result;
    display = formatted;
  } else {
    accumulator = operand;
  }

  return {
    ...state,
    display,
    accumulator,
    pendingOperator: operator,
    waitingForOperand: true,
    justEvaluated: false,
  };
};

const evaluate = (state: CalculatorState): CalculatorState => {
  if (state.error) return state;

  let operator = state.pendingOperator;
  let left = state.accumulator;
  let right: number | null = state.waitingForOperand ? null : Number(state.display);

  if (operator === null) {
    operator = state.lastOperator;
    left = Number(state.display);
    right = state.lastOperand;
  }

  if (operator === null || left === null || right === null) return state;
  const result = calculate(left, operator, right);
  if (result === null) return errorState();
  const display = formatResult(result);
  if (display === null) return errorState();

  return {
    display,
    accumulator: result,
    pendingOperator: null,
    waitingForOperand: true,
    lastOperator: operator,
    lastOperand: right,
    justEvaluated: true,
    error: false,
  };
};

export const reduceCalculator = (
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState => {
  switch (action.type) {
    case "clear":
      return initialCalculatorState();
    case "digit":
      return enterDigit(state, action.digit);
    case "decimal":
      return enterDecimal(state);
    case "operator":
      return selectOperator(state, action.operator);
    case "equals":
      return evaluate(state);
    case "toggle-sign": {
      if (state.error) return state;
      const display = state.display.startsWith("-")
        ? state.display.slice(1)
        : `-${state.display}`;
      const value = Number(display);
      return {
        ...state,
        display,
        accumulator:
          state.waitingForOperand && state.accumulator !== null ? value : state.accumulator,
      };
    }
    case "backspace": {
      if (state.error || state.waitingForOperand || state.justEvaluated) return state;
      const shortened = state.display.slice(0, -1);
      return {
        ...state,
        display: shortened === "" || shortened === "-" ? "0" : shortened,
      };
    }
  }
};
