import assert from "node:assert/strict";
import {
  CALCULATOR_MAX_MANUAL_DIGITS,
  initialCalculatorState,
  reduceCalculator,
  type CalculatorAction,
  type CalculatorOperator,
  type CalculatorState,
} from "../../src/examCalculator";

const operators: Record<string, CalculatorOperator> = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
};

const actionsFor = (sequence: string): CalculatorAction[] =>
  sequence
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((token): CalculatorAction[] => {
      if (token in operators) return [{ type: "operator", operator: operators[token] }];
      if (token === "=") return [{ type: "equals" }];
      if (token === ".") return [{ type: "decimal" }];
      if (token === "sign") return [{ type: "toggle-sign" }];
      if (token === "back") return [{ type: "backspace" }];
      if (token === "clear") return [{ type: "clear" }];
      return [...token].map((digit) => ({ type: "digit", digit }));
    });

const run = (sequence: string, start = initialCalculatorState()): CalculatorState =>
  actionsFor(sequence).reduce(reduceCalculator, start);

assert.equal(initialCalculatorState().display, "0");
assert.equal(run("1200 / 100 =").display, "12");
assert.equal(run("4 * 60 * 28 / 2 / 8 =").display, "420");
assert.equal(run("360 + 240 + 500 + 100 - 560 - 60 =").display, "580");
assert.equal(run("6 * 0 . 2 + 0 . 2 =").display, "1.4");
assert.equal(run("250 / 125 * 60 =").display, "120");
assert.equal(run("0 . 1 + 0 . 2 =").display, "0.3");
assert.equal(run("2 + 3 * 4 =").display, "20");

assert.equal(run("1 . . 2").display, "1.2");
assert.equal(run("0 0 0 7").display, "7");
assert.equal(run("12 sign").display, "-12");
assert.equal(run("12 + 3 = sign").display, "-15");
assert.equal(run("123 back").display, "12");
assert.equal(run("7 back").display, "0");
assert.equal(run("8 + * 2 =").display, "16");
assert.equal(run("5 + 2 = = =").display, "11");
assert.equal(run("5 + 2 = 9").display, "9");
assert.equal(run("5 + 2 = * 3 =").display, "21");

const divisionError = run("8 / 0 =");
assert.equal(divisionError.display, "Error");
assert.equal(divisionError.error, true);
assert.equal(run("clear", divisionError).display, "0");
assert.equal(run("4", divisionError).display, "4");

const capped = run("1234567890123");
assert.equal(capped.display, "123456789012");
assert.equal(capped.display.length, CALCULATOR_MAX_MANUAL_DIGITS);
assert.equal(run("0 . 0 0 0 0 0 0 0 0 0 0 0 1").display, "0.00000000000");
assert.equal(run(`9 * 9 = ${"= ".repeat(325)}`).display, "Error");

console.log("Exam calculator regressions passed.");
