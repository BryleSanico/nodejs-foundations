// use-math.js
const { square, cube, average, max } = require('./math-utils');

const num = 5;
console.log(`Square of ${num}: ${square(num)}`);
console.log(`Cube of ${num}: ${cube(num)}`);

const numbers = [1, 2, 3, 4, 5];
console.log(`Average of [${numbers}]: ${average(numbers)}`);
console.log(`Max of [${numbers}]: ${max(numbers)}`);