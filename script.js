function initialize() {
  const calculator = document.getElementById("calculator");
  calculator.operation = {
    "+": (a, b) => a + b,
    "–": (a, b) => a - b,
    X: (a, b) => a * b,
    "÷": (a, b) => a / b,
  };

  const numButtons = document.getElementsByClassName("num-button");
  for (let button of numButtons) {
    button.addEventListener("mousedown", numButtonPressed);
    button.addEventListener("mousedown", buttonPressed);
  }
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
  }
  if (text === "0") {
    if (numChar === "0") {
      return;
    }
    text = "";
  }
  entry.textContent = text.concat(numChar);
}

function numButtonPressed(event) {
  enterNumber(event.target.textContent);
}

function buttonPressed(event) {
  event.target.classList.toggle("pressed");
  const body = document.querySelector("body");
  body.addEventListener("mouseup", releaseButton);
}

function releaseButton(event) {
  const button = document.querySelector(".pressed");
  button.classList.toggle("pressed");
  event.currentTarget.removeEventListener("mouseup", releaseButton);
}

initialize();
