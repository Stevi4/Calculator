function operate(a, b, operator) {
  return document.getElementById("calculator").operation[operator](a, b);
}

function evaluate() {
  const [entry, history] = getDisplay();

  if (hasEndOperator(history.textContent)) {
    const [a, operator] = parseExpression(history.textContent);
    const b = entry.textContent;
    const result = operate(+a, +b, operator);

    history.textContent = history.textContent + " " + entry.textContent + " =";
    if (!Number.isFinite(result)) {
      entry.textContent = "Error";
    } else {
      entry.textContent = truncate(result);
      document.getElementById("calculator").answer = entry.textContent;
    }
  }
}

function enterNumber(numChar) {
  entryCheck(true);
  const [entry] = getDisplay();
  const max = entry.textContent.at(0) === "-" ? 13 : 12;

  if (entry.textContent.length >= max) {
    return;
  } else if (entry.textContent === "0") {
    entry.textContent = numChar;
  } else {
    entry.textContent += numChar;
  }
}

function enterDecimal() {
  entryCheck(true);
  const [entry] = getDisplay();
  const max = entry.textContent.at(0) === "-" ? 13 : 12;

  if (entry.textContent.length >= max || entry.textContent.includes(".")) {
    return;
  }
  entry.textContent += ".";
}

function enterOperator(oprChar) {
  clearIfError();
  const [entry, history] = getDisplay();

  if (hasEndOperator(history.textContent)) {
    evaluate();
  }
  if (hasEndOperator(entry.textContent)) {
    entry.textContent = entry.textContent.slice(0, -1);
  }
  entry.textContent += oprChar;
}

function enterSingleOperator(oprChar) {
  entryCheck(true);
  const [entry] = getDisplay();
  const [a, operator] = parseExpression(entry.textContent);

  const result = operate(+a, null, oprChar);
  if (!Number.isFinite(result)) {
    entry.textContent = "Error";
  } else {
    entry.textContent = truncate(result) + operator;
  }
}

function enterLastAnswer() {
  entryCheck(true);
  const [entry] = getDisplay();

  entry.textContent = document.getElementById("calculator").answer;
}

function backEntry() {
  entryCheck();
  const [entry, history] = getDisplay();

  entry.textContent = entry.textContent.slice(0, -1);
  if (entry.textContent === "" || entry.textContent === "-") {
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
  let numString = num.toString();
  // Round floating-point errors
  if (!numString.includes("e")) {
    num = +num.toFixed(10);
    numString = num.toString();
  }

  const max = numString.at(0) === "-" ? 13 : 12;
  if (numString.length > max) {
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

// Clears the screen if it meets the below cases
// Can move entry to history for numeric inputs
function entryCheck(numeric = false) {
  clearIfError();
  const [entry] = getDisplay();
  if (hasEndOperator(entry.textContent)) {
    if (numeric) {
      entryToHistory();
    }
  } else {
    clearIfComplete();
  }
}

// Clears the screen if the history shows a complete expression
function clearIfComplete() {
  const [, history] = getDisplay();
  if (history.textContent.at(-1) === "=") {
    clear();
  }
}

// Clears the screen if it has an error message
function clearIfError() {
  const [entry] = getDisplay();
  if (entry.textContent === "Error") {
    clear();
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

  history.textContent = variable + " " + operator;
  entry.textContent = "0";
}

function historyToEntry() {
  const [entry, history] = getDisplay();
  const [variable, operator] = parseExpression(history.textContent);

  entry.textContent = variable + operator;
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

function initialize() {
  const calculator = document.getElementById("calculator");
  calculator.operation = {
    "+": (a, b) => a + b,
    "–": (a, b) => a - b,
    X: (a, b) => a * b,
    "÷": (a, b) => a / b,
    "^": (a, b) => a ** b,
    "%": (a) => a / 100,
    "±": (a) => 0 - a,
    "√": (a) => a ** 0.5,
    log: (a) => Math.log10(a),
    ln: (a) => Math.log(a),
    π: () => Math.PI,
    e: () => Math.E,
    rnd: () => Math.random(),
  };
  calculator.answer = "0";

  const body = document.querySelector("body");
  body.themes = {
    default: ["#ffffff", "#5c6b73", "#253237", "#9db4c0", "#f26419"],
    dark: ["#000000", "#ffffff", "#e5e5e5", "#c6ac8f", "#242423"],
    neopolitan: ["#300400", "#b8f2e6", "#aed9e0", "#faf3dd", "#ffa69e"],
  };
  setTheme(body.themes["default"]);
  document.getElementById("Themes").onchange = changeTheme;

  const extension = document.getElementById("extension");
  extension.inAnimation = false;
  extension.onanimationend = animationFlagOff;
  const extensionTab = document.getElementById("extension-tab");
  extensionTab.onmousedown = toggleExtension;
  extensionTab.style.cursor = "pointer";
  document.onkeydown = keyPressed;

  const numButtons = document.getElementsByClassName("num-button");
  const oprButtons = document.getElementsByClassName("opr-button");
  const singleOprButtons = document.getElementsByClassName("s-opr-button");
  for (let button of numButtons) {
    addButtonEvent(button, enterNumber);
  }
  for (let button of oprButtons) {
    addButtonEvent(button, enterOperator);
  }
  for (let button of singleOprButtons) {
    addButtonEvent(button, enterSingleOperator);
  }
  addButtonEvent(document.getElementById("ac-button"), clearEntry);
  addButtonEvent(document.getElementById("back-button"), backEntry);
  addButtonEvent(document.getElementById("decimal-button"), enterDecimal);
  addButtonEvent(document.getElementById("equal-button"), evaluate);
  addButtonEvent(document.getElementById("answer-button"), enterLastAnswer);
}

function toggleExtension() {
  const extension = document.getElementById("extension");
  if (!extension.inAnimation) {
    if (
      extension.classList.contains("hidden") ||
      extension.classList.contains("shown")
    ) {
      extension.classList.toggle("hidden");
      extension.classList.toggle("shown");
    } else {
      extension.classList.toggle("shown");
    }
    extension.inAnimation = true;
  }
}

function animationFlagOff(event) {
  event.target.inAnimation = false;
}

function addButtonEvent(element, func) {
  element.onmousedown = buttonPressed;
  element.style.cursor = "pointer";
  element.func = func;
}

// Called when any calculator button is pressed
function buttonPressed(event) {
  event.target.classList.toggle("pressed");
  const body = document.querySelector("body");
  body.addEventListener("mouseup", releaseButton);

  event.target.func(event.target.textContent);
}

// Called when the mouse is released after clicking a calculator button
function releaseButton(event) {
  const button = document.querySelector(".pressed");
  if (button) {
    button.classList.toggle("pressed");
  }
  event.currentTarget.removeEventListener("mouseup", releaseButton);
}

function changeTheme(event) {
  const theme = document.querySelector("body").themes[event.target.value];
  setTheme(theme);
}

function setTheme(theme) {
  const root = document.querySelector(":root");
  root.style.setProperty("--primary-color", theme[0]);
  root.style.setProperty("--secondary-color", theme[1]);
  root.style.setProperty("--border-color", theme[2]);
  root.style.setProperty("--body-color", theme[3]);
  root.style.setProperty("--extension-color", theme[4]);
}

function keyPressed(event) {
  const key = event.key;
  if (key >= "0" && key <= "9") {
    enterNumber(key);
  } else {
    switch (key) {
      case ".":
        enterDecimal();
        break;
      case "+":
      case "^":
        enterOperator(key);
        break;
      case "-":
        enterOperator("–");
        break;
      case "*":
        enterOperator("X");
        break;
      case "/":
        enterOperator("÷");
        break;
      case "%":
      case "e":
        enterSingleOperator(key);
        break;
      case "!":
        enterSingleOperator("±");
        break;
      case "s":
        enterSingleOperator("√");
        break;
      case "l":
        enterSingleOperator("log");
        break;
      case "p":
        enterSingleOperator("π");
        break;
      case "n":
        enterSingleOperator("ln");
        break;
      case "a":
        enterLastAnswer();
        break;
      case "r":
        enterSingleOperator("rnd");
        break;
      case "=":
      case "Enter":
        event.preventDefault();
        evaluate();
        break;
      case "Backspace":
        backEntry();
        break;
      case "c":
      case "Delete":
        clearEntry();
        break;
      case "Tab":
        event.preventDefault();
        toggleExtension();
        break;
    }
  }
}

initialize();
