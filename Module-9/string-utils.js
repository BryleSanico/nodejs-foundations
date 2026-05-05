// string-utils.js

/*

EXERCISE: 9.1 — Test a Utility Module
Create a file called string-utils.js with these functions:
• capitalize(str) — returns the string with the first letter uppercased
• reverse(str) — returns the string reversed
• countWords(str) — returns the number of words in the string
• isEmail(str) — returns true if the string looks like an email (contains @ and .)

Create string-utils.test.js with at least 2 tests per function (one happy, one edge case like empty string or null). Aim for 8+ tests total.

Run: npm test

*/

function capitalize(str) {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1);
}

function reverse(str) {
  if (!str) return '';
  return str.split('').reverse().join('');
}

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
}

function isEmail(str) {
  if (!str) return false;
  return /\S+@\S+\.\S+/.test(str);
}

module.exports = { capitalize, reverse, countWords, isEmail };