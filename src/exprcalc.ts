export const subtraction_operator = "‑";

interface CalculationOptions {
  hyp?: boolean;
}

export function calculateExpr(
  expression: string,
  options?: CalculationOptions
) {
  expression = expression.replace(/\s/g, "");
  expression = expression.replace(/π/g, Math.PI.toString());
  expression = expression.replace(/𝑒/g, Math.E.toString());
  // Base case: if no parentheses, use calculateSimple
  if (!expression.includes("(")) {
    return calculateSimple(expression, options);
  }

  // Find the innermost parentheses
  let startIndex = -1;
  let endIndex = -1;
  let openCount = 0;

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "(") {
      if (openCount === 0) {
        startIndex = i;
      }
      openCount++;
    } else if (expression[i] === ")") {
      openCount--;
      if (openCount === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex === -1 || endIndex === -1) {
    return NaN;
  }

  // Extract the expression inside the innermost parentheses
  const innerExpression = expression.substring(startIndex + 1, endIndex);

  // Calculate the result of the inner expression
  const innerResult = calculateExpr(innerExpression, options);

  // Replace the parenthetical expression with its result
  const newExpression =
    expression.substring(0, startIndex) +
    innerResult +
    expression.substring(endIndex + 1);

  // Recursively calculate the new expression
  return calculateExpr(newExpression, options);
}

// Caclulate without parentheses
function calculateSimple(expr: string, options?: CalculationOptions) {
  let tokens: string[] = [];
  let curr = "";

  // tokenize
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];

    if (isBinaryOperator(char)) {
      tokens.push(curr);
      tokens.push(char);
      curr = "";
    } else {
      curr += char;
    }
  }

  tokens.push(curr);

  // EMDAS
  passOverTokensAndCalculateTheFollwingOperatorsWithSamePrecedence(["^", "√"]);
  passOverTokensAndCalculateTheFollwingOperatorsWithSamePrecedence(["*", "/"]);
  passOverTokensAndCalculateTheFollwingOperatorsWithSamePrecedence([
    "+",
    subtraction_operator,
  ]);

  function passOverTokensAndCalculateTheFollwingOperatorsWithSamePrecedence(
    operators: string[]
  ) {
    for (let i = 0; i < tokens.length; i++) {
      if (operators.includes(tokens[i])) {
        const res = operate2Operands(
          tokens[i],
          evalNumberAndAnySingleDigitOperatorsAndInclOptions(tokens[i - 1]),
          evalNumberAndAnySingleDigitOperatorsAndInclOptions(tokens[i + 1])
        );
        tokens.splice(i - 1, 3, res.toString());
        i -= 2;
      }
    }
  }
  if (tokens.length > 1) {
    throw new Error("Calculation bug - tokens should be of length 1");
  }
  return evalNumberAndAnySingleDigitOperatorsAndInclOptions(tokens[0]);

  function evalNumberAndAnySingleDigitOperatorsAndInclOptions(n: string) {
    return evalNumberAndAnySingleDigitOperators(n, options);
  }
}

// Syntax:
/**
 * atan: evalNumberAndAnySingleDigitOperators("atan:5")
 * similar for cos
 * sqrt: evalNumberAndAnySingleDigitOperators("sqrt:5")
 *
 * multiple: evalNumberAndAnySingleDigitOperators("cos:atan:sqrt:5")
 */
function evalNumberAndAnySingleDigitOperators(
  n: string,
  options?: CalculationOptions
) {
  //   n = n.replace(/√/g, "sqrt:");

  const splitUp = n.split(":");

  let numberPart = parseFloat(splitUp[splitUp.length - 1]);
  for (let i = splitUp.length - 2; i >= 0; i--) {
    const [oper, base] = splitUp[i].split("_");
    switch (oper) {
      case "sqrt":
        numberPart = Math.sqrt(numberPart);
        break;
      case "atan":
        if (options?.hyp) {
          atanh();
        } else {
          numberPart = Math.atan(numberPart);
        }
        break;
      case "acos":
        if (options?.hyp) {
          acosh();
        } else {
          numberPart = Math.acos(numberPart);
        }
        break;
      case "asin":
        if (options?.hyp) {
          asinh();
        } else {
          numberPart = Math.asin(numberPart);
        }
        break;
      case "tanh":
        tanh();
        break;
      case "cosh":
        cosh();
        break;
      case "sinh":
        sinh();
        break;
      case "ln":
        numberPart = Math.log(numberPart);
        break;
      case "log":
        numberPart = logBase(numberPart, parseFloat(base));
        break;
      case "cos":
        if (options?.hyp) {
          cosh();
        } else {
          numberPart = Math.cos(numberPart);
        }
        break;
      case "sin":
        if (options?.hyp) {
          sinh();
        } else {
          numberPart = Math.sin(numberPart);
        }
        break;
      case "tan":
        if (options?.hyp) {
          tanh();
        } else {
          numberPart = Math.tan(numberPart);
        }
        break;

      case "factorial":
        numberPart = factorial(numberPart);
        break;
    }
  }
  return numberPart;

  function acosh() {
    numberPart = Math.acosh(numberPart);
  }
  function asinh() {
    numberPart = Math.asinh(numberPart);
  }
  function atanh() {
    numberPart = Math.atanh(numberPart);
  }
  function cosh() {
    numberPart = Math.cosh(numberPart);
  }
  function sinh() {
    numberPart = Math.sinh(numberPart);
  }
  function tanh() {
    numberPart = Math.tanh(numberPart);
  }
}

function isBinaryOperator(c: string) {
  return (
    c === "*" ||
    c === "/" ||
    c === subtraction_operator ||
    c === "+" ||
    c === "^" ||
    c === "√"
  );
}

function operate2Operands(operator: string | undefined, a: number, b: number) {
  let _a = a;
  let _b = b;

  if (!operator) {
    _a = _b;
  } else if (operator === "*") {
    _a *= _b;
  } else if (operator === "/") {
    _a /= _b;
  } else if (operator === "+") {
    // _a = add(_a, _b);
    _a += _b;
  } else if (operator === subtraction_operator) {
    _a -= _b;
  } else if (operator === "^") {
    _a = _a ** _b;
  }
  //NTH ROOT! NOT square root
  else if (operator === "√") {
    _a = _b ** (1 / _a);
  }

  return _a;
}

const logBase = (x: number, base: number) => Math.log(x) / Math.log(base);

function factorial(n: number) {
  if (n < 0) {
    return NaN;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function getEvaluableExpression(expression: string): string {
  // Remove spaces for consistent parsing
  expression = expression.replace(/\s/g, "");

  // Strip trailing operators
  while (
    expression.length > 0 &&
    isBinaryOperator(expression[expression.length - 1])
  ) {
    expression = expression.slice(0, -1);
  }

  // If no parentheses, evaluate everything
  if (!expression.includes("(")) {
    return expression;
  }

  // Find the last complete set of parentheses
  let openCount = 0;
  let lastOpenIndex = -1;
  let lastCloseIndex = -1;

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "(") {
      if (openCount === 0) {
        lastOpenIndex = i;
      }
      openCount++;
    } else if (expression[i] === ")") {
      openCount--;
      if (openCount === 0) {
        lastCloseIndex = i;
      }
    }
  }

  // If we have unclosed parentheses, return empty string
  if (openCount !== 0) {
    return "";
  }

  // Return the expression inside the last complete parentheses
  if (lastOpenIndex !== -1 && lastCloseIndex !== -1) {
    return expression.substring(lastOpenIndex + 1, lastCloseIndex);
  }

  return "";
}

console.log(getEvaluableExpression("5+2"));
console.log(getEvaluableExpression("5+(3^4+9)"));

console.log(evalNumberAndAnySingleDigitOperators("2.5^(log_2.5:5)"));

console.log(calculateExpr("2.5^(log_2.5:5)"));

console.log(calculateExpr("3.169925001442313^2"));
