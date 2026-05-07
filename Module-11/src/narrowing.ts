// src/narrowing.ts

function describe(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return `Text with ${value.length} characters`;
  } else if (typeof value === 'number') {
    const parity = value % 2 === 0 ? 'even' : 'odd';
    return `Number: ${value} (${parity})`;
  } else if (typeof value === 'boolean') {
    return `Boolean: ${value}`;
  }
  return 'Unknown type';
}

// --- Example usage ---
console.log(describe('Hello, TypeScript!')); 
console.log(describe(42));
console.log(describe(17));
console.log(describe(true));
console.log(describe(false));               