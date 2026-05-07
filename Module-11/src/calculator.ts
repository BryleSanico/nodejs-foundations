// src/calculator.ts

// --- Type alias for operations ---
type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

// --- Arithmetic functions ---
function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function divide(a: number, b: number): number | string {
  if (b === 0) {
    return 'Cannot divide by zero';
  }
  return a / b;
}

// --- Calculate function ---
function calculate(op: Operation, a: number, b: number): number | string {
  switch (op) {
    case 'add':
      return add(a, b);
    case 'subtract':
      return subtract(a, b);
    case 'multiply':
      return multiply(a, b);
    case 'divide':
      return divide(a, b);
  }
}

// --- Example usage ---
const num1 = 10;
const num2 = 0;

const operations: Operation[] = ['add', 'subtract', 'multiply', 'divide'];

operations.forEach(operation => {
  try {
    const result = calculate(operation, num1, num2);
    console.log(`${operation.toUpperCase()}: ${num1} ${operation} ${num2} = ${result}`);
  } catch (error) {
    console.error(`${operation.toUpperCase()} Error: ${(error as Error).message}`);
  }
});