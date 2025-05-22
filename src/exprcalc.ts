export const subtraction_operator = "‑";

export function calculateExpr(expression: string) {
  expression = expression.replace(/\s/g, "");
  expression = expression.replace(/π/g, Math.PI.toString());
  expression = expression.replace(/𝑒/g, Math.E.toString());
  // Base case: if no parentheses, use calculateSimple
  if (!expression.includes("(")) {
    return calculateSimple(expression);
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
  const innerResult = calculateExpr(innerExpression);

  // Replace the parenthetical expression with its result
  const newExpression =
    expression.substring(0, startIndex) +
    innerResult +
    expression.substring(endIndex + 1);

  // Recursively calculate the new expression
  return calculateExpr(newExpression);
}

// Caclulate without parentheses
function calculateSimple(expr: string) {
  let tokens: string[] = [];
  let curr = "";

  // tokenize
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];

    if (is2OperandOperator(char)) {
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
          evalNumberAndAnySingleDigitOperators(tokens[i - 1]),
          evalNumberAndAnySingleDigitOperators(tokens[i + 1])
        );
        tokens.splice(i - 1, 3, res.toString());
        i -= 2;
      }
    }
  }
  if (tokens.length > 1) {
    throw new Error("Calculation bug - tokens should be of length 1");
  }
  return evalNumberAndAnySingleDigitOperators(tokens[0]);
}

// Syntax:
/**
 * atan: evalNumberAndAnySingleDigitOperators("atan:5")
 * similar for cos
 * sqrt: evalNumberAndAnySingleDigitOperators("sqrt:5")
 *
 * multiple: evalNumberAndAnySingleDigitOperators("cos:atan:sqrt:5")
 */
function evalNumberAndAnySingleDigitOperators(n: string) {
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
        numberPart = Math.atan(numberPart);
        break;
      case "acos":
        numberPart = Math.acos(numberPart);
        break;
      case "asin":
        numberPart = Math.asin(numberPart);
        break;
      case "tanh":
        numberPart = Math.tanh(numberPart);
        break;
      case "cosh":
        numberPart = Math.cosh(numberPart);
        break;
      case "sinh":
        numberPart = Math.sinh(numberPart);
        break;
      case "ln":
        numberPart = Math.log(numberPart);
        break;
      case "log":
        numberPart = logBase(numberPart, parseFloat(base));
        break;
      case "cos":
        numberPart = Math.cos(numberPart);
        break;
      case "sin":
        numberPart = Math.sin(numberPart);
        break;
      case "tan":
        numberPart = Math.tan(numberPart);
        break;
    }
  }
  return numberPart;
}

function is2OperandOperator(c: string) {
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

console.log(calculateExpr("2.5^(log_2.5:5)"));

console.log(calculateExpr("3.169925001442313^2"));
