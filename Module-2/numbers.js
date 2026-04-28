// Array Methods

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map - returns a new array with each element multiplied by 2
console.log(numbers.map(num => num * 2)); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter - returns only even numbers
console.log(numbers.filter(num => num % 2 === 0)); // [2, 4, 6, 8, 10]

// Reduce - sums all numbers in the array
console.log(numbers.reduce((acc, num) => acc + num, 0)); // 55
