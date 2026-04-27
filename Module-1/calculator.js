// calculator.js

function validateNumbers(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Inputs must be numbers');
  }
}

function add(a, b) {
    validateNumbers(a, b);
  return a + b;
}

function subtract(a, b) {
    validateNumbers(a, b);
  return a - b;
}

function multiply(a, b) {
    validateNumbers(a, b);
  return a * b;
}

function divide(a, b) {
    validateNumbers(a, b);
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// Example usage:
const num1 = 10;
const num2 = 0;

const operations = ['Addition', 'Subtraction', 'Multiplication', 'Division'];

operations.forEach(operation => {
    try {
        switch(operation) {
            case 'Addition':
                console.log(`Addition: ${num1} + ${num2} = ${add(num1, num2)}`);
                break;
            case 'Subtraction':
                console.log(`Subtraction: ${num1} - ${num2} = ${subtract(num1, num2)}`);
                break;
            case 'Multiplication':
                console.log(`Multiplication: ${num1} * ${num2} = ${multiply(num1, num2)}`);
                break;
            case 'Division':
                console.log(`Division: ${num1} / ${num2} = ${divide(num1, num2)}`);
                break;
        }
    } catch (error) {
        console.error(`${operation} Error: ${error.message}`);
    }
});