function initialize() {
  const calculator = document.getElementById("calculator");
  calculator.operation = {
    "+": (a, b) => a + b,
    "–": (a, b) => a - b,
    X: (a, b) => a * b,
    "÷": (a, b) => a / b,
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

  document
    .getElementById("ac-button")
    .addEventListener("mousedown", clearEntry);
  document
    .getElementById("back-button")
    .addEventListener("mousedown", backEntry);
  document
    .getElementById("decimal-button")
    .addEventListener("mousedown", enterDecimal);
  document
    .getElementById("equal-button")
    .addEventListener("mousedown", evaluate);
}

function operate(a, b, operator) {
  const calculator = document.getElementById("calculator");
  return calculator.operation[operator](a, b);
}

function evaluate() {
  const entry = document.getElementById("entry");
  const history = document.getElementById("history");

  if (hasEndOperator(history.textContent)) {
    const [a, operator] = parseExpression(history.textContent);
    const b = entry.textContent;

    const result = operate(+a, +b, operator).toString();
    history.textContent = history.textContent + " " + entry.textContent + " =";
    entry.textContent = result;
  }
}

function enterNumber(numChar) {
  const entry = document.getElementById("entry");
  if (hasEndOperator(entry.textContent)) {
    entryToHistory();
  } else {
    clearIfComplete();
  }

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
  const entry = document.getElementById("entry");

  if (hasEndOperator(entry.textContent)) {
    enterNumber("0");
  } else {
    clearIfComplete();
  }

  let text = entry.textContent;
  const max = text.at(0) === "-" ? 13 : 12;

  if (text.includes(".")) {
    return;
  } else if (text.length >= max) {
    return;
  }

  entry.textContent = text.concat(".");
}

function enterOperator(oprChar) {
  const history = document.getElementById("history");
  if (hasEndOperator(history.textContent)) {
    evaluate();
  }

  const entry = document.getElementById("entry");
  let text = entry.textContent;
  if (hasEndOperator(text)) {
    text = text.slice(0, -1);
  }
  if (hasEndOperator) entry.textContent = text.concat(oprChar);
}

function entryToHistory() {
  const entry = document.getElementById("entry");
  const history = document.getElementById("history");
  const [variable, operand] = parseExpression(entry.textContent);

  const newHistory = variable + " " + operand;
  history.textContent = newHistory;
  entry.textContent = "";
}

function historyToEntry() {
  const entry = document.getElementById("entry");
  const history = document.getElementById("history");
  const [variable, operand] = parseExpression(history.textContent);

  const newEntry = variable + operand;
  entry.textContent = newEntry;
  history.textContent = "";
}

function clearEntry() {
  const entry = document.getElementById("entry");
  const history = document.getElementById("history");

  if ((entry.textContent === "0")) {
    history.textContent = "";
  } else {
    entry.textContent = "0";
  }
}

function backEntry() {
  const entry = document.getElementById("entry");
  const history = document.getElementById("history");

  if (!hasEndOperator(entry.textContent)) {
    clearIfComplete();
  }

  entry.textContent = entry.textContent.slice(0, -1);
  if (entry.textContent === "") {
    if (history.textContent !== "") {
      historyToEntry();
    } else {
      entry.textContent = "0";
    }
  }
}

// Parses a string containing the first variable and operand for an expression
// Returns [variable, operand]
function parseExpression(expression) {
  if (expression.at(-2) === " ") {
    return [expression.slice(0, -2), expression.slice(-1)];
  } else {
    return [expression.slice(0, -1), expression.slice(-1)];
  }
}

// Clears the screen if the history shows a complete expression
function clearIfComplete() {
  const history = document.getElementById("history");
  if (history.textContent.at(-1) === "=") {
    history.textContent = "";
    entry.textContent = "0";
  }
}

// Checks if a string has an operator at the end
function hasEndOperator(str) {
  if (str.length === 0) {
    return false;
  }
  const char = str.at(-1);
  return (char < "0" || char > "9") && char !== "." && char !== "=";
}

function numButtonPressed(event) {
  enterNumber(event.target.textContent);
}

function oprButtonPressed(event) {
  enterOperator(event.target.textContent);
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

initialize();
