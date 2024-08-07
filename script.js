function operate(a, b, operator) {
  const calculator = document.getElementById("calculator");
  return calculator.operation[operator](a, b);
}

function operateSingle(a, operator) {
  const calculator = document.getElementById("calculator");
  return calculator.operation[operator](a);
}

function evaluate() {
  const [entry, history] = getDisplay();

  if (hasEndOperator(history.textContent)) {
    const [a, operator] = parseExpression(history.textContent);
    const b = entry.textContent;

    const result = operate(+a, +b, operator);
    history.textContent = history.textContent + " " + entry.textContent + " =";

    if (result === Infinity || result === NaN) {
      entry.textContent = "Error";
    } else {
      entry.textContent = truncate(result);
    }
  }
}

function enterNumber(numChar) {
  entryCheck(true);
  const [entry] = getDisplay();
  let text = entry.textContent;
  const max = text.at(0) === "-" ? 13 : 12;

  if (text === "0") {
    text = "";
  } else if (text.length >= max) {
    return;
  }

  entry.textContent = text + numChar;
}

function enterDecimal() {
  entryCheck(true);
  const [entry] = getDisplay();
  let text = entry.textContent;
  const max = text.at(0) === "-" ? 13 : 12;

  if (text.includes(".")) {
    return;
  } else if (text.length >= max) {
    return;
  }

  entry.textContent = text + ".";
}

function enterOperator(oprChar) {
  clearIfError();
  const [entry, history] = getDisplay();

  if (hasEndOperator(history.textContent)) {
    evaluate();
  }

  let text = entry.textContent;
  if (hasEndOperator(text)) {
    text = text.slice(0, -1);
  }

  entry.textContent = text + oprChar;
}

function enterSingleOperator(oprChar) {
  entryCheck(true);
  const [entry] = getDisplay();

  const [a, operator] = parseExpression(entry.textContent);

  const result = operateSingle(+a, oprChar);
  if (result === Infinity || result === NaN) {
    entry.textContent = "Error";
  } else {
    entry.textContent = truncate(result) + operator;
  }
}

function backEntry() {
  entryCheck();
  const [entry, history] = getDisplay();

  entry.textContent = entry.textContent.slice(0, -1);
  if (entry.textContent === "") {
    if (history.textContent !== "") {
      historyToEntry();
    } else {
      entry.textContent = "0";
    }
  }
}

// Only clears the current entry if the history is an incomplete expression
function clearEntry() {
  entryCheck();
  const [entry, history] = getDisplay();

  if (entry.textContent === "0") {
    history.textContent = "";
  } else {
    entry.textContent = "0";
  }
}

// Reduces the length of a number string if it exceeds the calculator's limit
function truncate(num) {
  // Round floating-point errors
  num = +num.toFixed(10);
  numString = num.toString();

  const max = numString.at(0) === "-" ? 13 : 12;

  if (numString.length > max) {
    let num = +numString;
    numString = num.toPrecision(11);

    // Reduce precision to fit space if scientific notation is used
    if (numString.length > max) {
      numString = num.toPrecision(11 - (numString.length - max));
    }
  }
  return numString;
}

// Parses a string containing the first variable and operator for an expression
// Returns [variable, operator]
function parseExpression(expression) {
  if (!hasEndOperator(expression)) {
    return [expression, ""];
  } else if (expression.at(-2) === " ") {
    return [expression.slice(0, -2), expression.slice(-1)];
  } else {
    return [expression.slice(0, -1), expression.slice(-1)];
  }
}

// Clears the screen if it meets the below cases, can move entry to history for numeric inputs
// Returns true if screen is cleared
function entryCheck(numeric = false) {
  if (clearIfError()) {
    return true;
  }

  const [entry] = getDisplay();
  if (hasEndOperator(entry.textContent)) {
    if (numeric) {
      entryToHistory();
    }
  } else if (clearIfComplete()) {
    return true;
  }
}

// Clears the screen if the history shows a complete expression
function clearIfComplete() {
  const [, history] = getDisplay();
  if (history.textContent.at(-1) === "=") {
    clear();
    return true;
  }
}

// Clears the screen if it has an error message
function clearIfError() {
  const [entry] = getDisplay();
  if (entry.textContent === "Error") {
    clear();
    return true;
  }
}

function clear() {
  const [entry, history] = getDisplay();
  history.textContent = "";
  entry.textContent = "0";
}

function entryToHistory() {
  const [entry, history] = getDisplay();
  const [variable, operator] = parseExpression(entry.textContent);

  const newHistory = variable + " " + operator;
  history.textContent = newHistory;
  entry.textContent = "0";
}

function historyToEntry() {
  const [entry, history] = getDisplay();
  const [variable, operator] = parseExpression(history.textContent);

  const newEntry = variable + operator;
  entry.textContent = newEntry;
  history.textContent = "";
}

function getDisplay() {
  return [document.getElementById("entry"), document.getElementById("history")];
}

function hasEndOperator(str) {
  if (str.length === 0) {
    return false;
  }
  const char = str.at(-1);
  return (char < "0" || char > "9") && char !== "." && char !== "=";
}

// Called when any calculator button is pressed
function buttonPressed(event) {
  event.target.classList.toggle("pressed");
  const body = document.querySelector("body");
  body.addEventListener("mouseup", releaseButton);
}

// Called when the mouse is released after clicking a calculator button
function releaseButton(event) {
  const button = document.querySelector(".pressed");
  button.classList.toggle("pressed");
  event.currentTarget.removeEventListener("mouseup", releaseButton);
}

function numButtonPressed(event) {
  enterNumber(event.target.textContent);
}

function oprButtonPressed(event) {
  enterOperator(event.target.textContent);
}

function singleOprButtonPressed(event) {
  enterSingleOperator(event.target.textContent);
}

function initialize() {
  const calculator = document.getElementById("calculator");
  calculator.operation = {
    "+": (a, b) => a + b,
    "–": (a, b) => a - b,
    X: (a, b) => a * b,
    "÷": (a, b) => a / b,
    "%": (a) => a / 100,
    "±": (a) => 0 - a,
  };

  const buttons = calculator.getElementsByTagName("button");
  for (let button of buttons) {
    button.addEventListener("mousedown", buttonPressed);
  }

  const numButtons = calculator.getElementsByClassName("num-button");
  for (let button of numButtons) {
    button.addEventListener("mousedown", numButtonPressed);
  }

  const oprButtons = calculator.getElementsByClassName("opr-button");
  for (let button of oprButtons) {
    button.addEventListener("mousedown", oprButtonPressed);
  }

  const singleOprButtons = calculator.getElementsByClassName("s-opr-button");
  for (let button of singleOprButtons) {
    button.addEventListener("mousedown", singleOprButtonPressed);
  }

  const acButton = document.getElementById("ac-button");
  acButton.addEventListener("mousedown", clearEntry);
  const backButton = document.getElementById("back-button");
  backButton.addEventListener("mousedown", backEntry);
  const decimalButton = document.getElementById("decimal-button");
  decimalButton.addEventListener("mousedown", enterDecimal);
  const equalButton = document.getElementById("equal-button");
  equalButton.addEventListener("mousedown", evaluate);
}

initialize();
