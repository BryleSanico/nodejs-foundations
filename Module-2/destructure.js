// destructure.js

const product = { name: 'Laptop', price: 1200, brand: 'Dell', inStock: true };

/*
• Use destructuring to extract name and price into individual variables in one line
• Print them

Then given this array:
  const colors = ['red', 'green', 'blue'];

• Use destructuring to extract the first two colors into variables called primary and secondary
• Print them

*/

const { name, price } = product;
console.log(name); // Laptop
console.log(price); // 1200

const colors = ['red', 'green', 'blue'];
const [primary, secondary] = colors;
console.log(primary); // red
console.log(secondary); // green