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

  document
    .getElementById("ac-button")
    .addEventListener("mousedown", clearEntry);
  document
    .getElementById("back-button")
    .addEventListener("mousedown", backEntry);
  document
    .getElementById("decimal-button")
    .addEventListener("mousedown", enterDecimal);
}

function operate(a, b, operator) {
  const calculator = document.getElementById("calculator");
  return calculator.operation[operator](a, b);
}

function enterNumber(numChar) {
  const entry = document.getElementById("entry");
  let text = entry.textContent;
  if (text.length >= 12) {
    return;
  } else if (text === "0") {
    if (numChar === "0") {
      return;
    }
    text = "";
  }
  entry.textContent = text.concat(numChar);
}

function enterDecimal() {
  const entry = document.getElementById("entry");
  let text = entry.textContent;
  if (text.length >= 12) {
    return;
  } else if (text.includes(".")) {
    return;
  }
  entry.textContent = text.concat(".");
}

function clearEntry() {
  const entry = document.getElementById("entry");
  entry.textContent = "0";
}

function backEntry() {
  const entry = document.getElementById("entry");
  entry.textContent = entry.textContent.slice(0, -1);
  if (entry.textContent === "") {
    entry.textContent = "0";
  }
}

function numButtonPressed(event) {
  enterNumber(event.target.textContent);
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
