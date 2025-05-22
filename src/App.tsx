import { createSignal, onMount } from "solid-js";
import { calculateExpr } from "./exprcalc";
import "baboolastyles/public/plastic.css";
//IMPORTANT NOTE: Subtraction is ‑ not -

// Call on load and resize

function App() {
  const expressionLnChars = createSignal(0);
  const inpLnChars = createSignal(0);

  onMount(() => {
    // Call on load, resize, and when font loads
    window.addEventListener("resize", updateExpressionLnWidth);

    document.fonts.ready.then(() => {
      updateExpressionLnWidth();
    });

    // Backup in case fonts.ready doesn't fire
    if (document.readyState === "complete") {
      updateExpressionLnWidth();
    } else {
      window.addEventListener("load", updateExpressionLnWidth);
    }
  });

  const expr = createSignal("");
  const exprDisplayStart = createSignal(0);
  const inp = createSignal<string>("");
  const inpDisplayStart = createSignal(0);

  const shouldClearExprAndInpOnNextKey = createSignal(false);

  function NumberButton(props: { digit: string }) {
    return (
      <button
        onClick={() => {
          clearExprAndInpIfShould();
          inp[1]((v) => {
            if (props.digit === ".") {
              if (v.length === 0) {
                v += "0";
              }
              if (v.includes(".")) {
                return v;
              }
            }
            v += props.digit;
            return v;
          });
          setInpDispStartToMax();
        }}
      >
        <span>{props.digit}</span>
      </button>
    );
  }

  function OperatorButton(props: {
    displayOperator: string;
    operator: string;
  }) {
    return (
      <button
        onClick={() => {
          const _inp = inp[0]();
          clearExprAndInpIfShould();
          expr[1]((v) => {
            v += _inp;
            v += props.operator;
            inp[1]("");
            inpDisplayStart[1](0);
            return v;
          });
          setExprDispStartToMax();
        }}
      >
        <span>{props.displayOperator}</span>
      </button>
    );
  }

  function ac() {
    shouldClearExprAndInpOnNextKey[1](false);
    expr[1]("");
    exprDisplayStart[1](0);
    inp[1]("");
    inpDisplayStart[1](0);
  }

  function del() {
    if (inp[0]().length === 0) return;
    if (shouldClearExprAndInpOnNextKey[0]()) return;
    inp[1]((v) => {
      return v.slice(0, -1);
    });
    setInpDispStartToMax();
  }

  function AddCharToExprDirectlyAndClearInpButton(props: { char: string }) {
    return (
      <button
        onClick={() => {
          const _inp = inp[0]();
          clearExprAndInpIfShould();
          expr[1]((v) => {
            v += _inp;
            v += props.char;
            inp[1]("");
            return v;
          });
          inpDisplayStart[1](0);
          setExprDispStartToMax();
        }}
      >
        <span>{props.char}</span>
      </button>
    );
  }

  return (
    <>
      <div class="screen">
        <div
          class="screen-inner"
          style={{
            height: "1px",
          }}
        ></div>
        <div class="indicators">
          <div>RAD</div>
        </div>
        <div class="expression">
          {expr[0]().slice(
            exprDisplayStart[0](),
            expressionLnChars[0]() + exprDisplayStart[0]()
          )}
        </div>
        <div class="input-cnt">
          <div class="input">
            {inp[0]()
              .slice(
                inpDisplayStart[0](),
                inpLnChars[0]() + inpDisplayStart[0]() + 1
              )
              .split("e+")
              .join("e") || "0"}
          </div>
        </div>
      </div>
      <div class="scrollbuttons-left">
        <button
          onClick={() => {
            exprDisplayStart[1]((v) => Math.max(--v, 0));
          }}
        >
          <span>◀</span>
        </button>
        <button
          onClick={() => {
            inpDisplayStart[1]((v) => Math.max(--v, 0));
          }}
        >
          <span>◀</span>
        </button>
      </div>
      <div class="scrollbuttons-right">
        <button
          onClick={() => {
            exprDisplayStart[1]((v) =>
              Math.min(++v, expr[0]().length - expressionLnChars[0]())
            );
          }}
        >
          <span>▶</span>
        </button>
        <button
          onClick={() => {
            inpDisplayStart[1]((v) =>
              Math.min(++v, inp[0]().length - inpLnChars[0]())
            );
          }}
        >
          <span>▶</span>
        </button>
      </div>
      <div class="buttons">
        <OperatorButton operator="tanh:" displayOperator="tanh" />
        <OperatorButton operator="sinh:" displayOperator="sinh" />
        <OperatorButton operator="cosh:" displayOperator="cosh" />
        <button
          onClick={() => {
            ac();
          }}
        >
          <span>AC</span>
        </button>
        <button
          onClick={() => {
            del();
          }}
        >
          <span>DEL</span>
        </button>

        <OperatorButton operator="atan:" displayOperator="atan" />
        <OperatorButton operator="ln:" displayOperator="logₑ" />
        <OperatorButton operator="^" displayOperator="xⁿ" />
        <OperatorButton operator="^2" displayOperator="x²" />

        <AddCharToExprDirectlyAndClearInpButton char="π" />
        <OperatorButton operator="tan:" displayOperator="tan" />
        <OperatorButton operator="cos:" displayOperator="cos" />
        <OperatorButton operator="sin:" displayOperator="sin" />
        <OperatorButton operator="sqrt:" displayOperator="√" />
        <OperatorButton operator="√" displayOperator="ⁿ√" />

        <NumberButton digit="7" />
        <NumberButton digit="8" />
        <NumberButton digit="9" />
        <button
          onClick={() => {
            clearExprAndInpIfShould();
            expr[1]((v) => {
              v += "(";
              return v;
            });
            setExprDispStartToMax();
          }}
        >
          <span>(</span>
        </button>
        <AddCharToExprDirectlyAndClearInpButton char=")" />

        <NumberButton digit="4" />
        <NumberButton digit="5" />
        <NumberButton digit="6" />

        <OperatorButton displayOperator="×" operator="*" />
        <OperatorButton displayOperator="÷" operator="/" />
        <NumberButton digit="1" />
        <NumberButton digit="2" />
        <NumberButton digit="3" />

        <OperatorButton displayOperator="+" operator="+" />
        <OperatorButton displayOperator="‑" operator="‑" />

        <NumberButton digit="0" />
        <NumberButton digit="." />
        <button
          onClick={() => {
            inp[1]((v) => {
              if (v[0] === "-") {
                v = v.slice(1, v.length);
              } else {
                v = "-" + v;
              }

              return v;
            });
            setInpDispStartToMax();
          }}
        >
          <span>+/-</span>
        </button>
        <button
          onClick={() => {
            const _inp = inp[0]();
            clearExprAndInpIfShould();
            expr[1]((v) => {
              v += _inp;
              return v;
            });
            setExprDispStartToMax();
            inp[1](calculateExpr(expr[0]()).toString());
            setInpDispStartToMax();
            shouldClearExprAndInpOnNextKey[1](true);
          }}
          class="eq"
        >
          <span>=</span>
        </button>
      </div>
    </>
  );

  function updateExpressionLnWidth() {
    const displayWidth = document.querySelector(".screen-inner")!.clientWidth;

    //Expression
    const expressionCharsAmountTestDiv = document.createElement("div");
    expressionCharsAmountTestDiv.style.font = '0.8rem "ScientificCalculator"';
    expressionCharsAmountTestDiv.textContent = "X";
    document.body.appendChild(expressionCharsAmountTestDiv);
    const expressionCharWidth =
      expressionCharsAmountTestDiv.getBoundingClientRect().width;
    const expressionCharsFittable = Math.floor(
      displayWidth / expressionCharWidth
    );
    document.documentElement.style.setProperty(
      "--expression-char-count",
      expressionCharsFittable.toString()
    );
    expressionLnChars[1](expressionCharsFittable);

    expressionCharsAmountTestDiv.remove();

    //Input
    const inputDisplayWidth = displayWidth - 0;
    const inputCharsAmountTestDiv = document.createElement("div");
    inputCharsAmountTestDiv.style.font = '2.4rem "LCD"';
    inputCharsAmountTestDiv.textContent = "X";
    document.body.appendChild(inputCharsAmountTestDiv);
    const inputCharWidth =
      inputCharsAmountTestDiv.getBoundingClientRect().width;
    const inputCharsFittable = Math.floor(inputDisplayWidth / inputCharWidth);
    document.documentElement.style.setProperty(
      "--input-char-count",
      inputCharsFittable.toString()
    );
    inpLnChars[1](inputCharsFittable);
    inputCharsAmountTestDiv.remove();

    setExprDispStartToMax();
    setInpDispStartToMax();
  }

  function clearExprAndInpIfShould() {
    if (shouldClearExprAndInpOnNextKey[0]()) {
      expr[1]("");
      exprDisplayStart[1](0);
      inp[1]("");
      inpDisplayStart[1](0);
      shouldClearExprAndInpOnNextKey[1](false);
    }
  }

  function setExprDispStartToMax() {
    if (expr[0]().length > expressionLnChars[0]()) {
      exprDisplayStart[1](() => expr[0]().length - expressionLnChars[0]());
    } else {
      exprDisplayStart[1](0);
    }
  }
  function setInpDispStartToMax() {
    if (inp[0]().length > inpLnChars[0]()) {
      inpDisplayStart[1](() => inp[0]().length - inpLnChars[0]());
    } else {
      inpDisplayStart[1](0);
    }
  }
}

export default App;
