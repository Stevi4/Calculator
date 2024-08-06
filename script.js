const calculator = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "X": (a, b) => a * b,
  "÷": (a, b) => a / b
}

function operate(a, b, operator) {
  return calculator[operator](a, b);
}
