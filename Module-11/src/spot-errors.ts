// --- 1. Type mismatch: assigning a string to a number variable ---
const count: number = '42'; // The value assigned is not a string and the expected value is a number
const count2: number = 42; // Corrected: assign a number instead of a string

// --- 2. Missing required fields in an object literal ---
interface User {
  name: string;
  email: string;
}
const user: User = { name: 'Ana' }; // The blueprint is expecting two properties but only gave one property
const user2: User = { name: 'Ana', email: 'ana@example.com' }; // Corrected: include the required 'email' field

// Or you can make the email optional in the interface like this:
interface User2 {
  name: string;
  email?: string; // The email is now optional
}
const user3: User2 = { name: 'Ana' }; // This is now valid because email is optional

// --- 3. Union type restriction issue ---
let status: 'loading' | 'success' | 'error';

status = 'done'; // The value assigned is not part of the defined union type
status = 'success'; // Corrected: assign a value that is part of the defined union type

// --- 4. Accessing a property that doesn't exist on a type ---
interface Product {
  id: number;
  name: string;
}
const product: Product = { id: 1, name: 'Laptop' };
console.log(product.price); // The price isnt part of the Product interface
console.log(product.name); // Corrected: access an existing property

// --- 5. Using a variable before it's declared ---
console.log(message); // The message is not yet declared or exists in plain javascript its undefined
let message: string = 'Hello, TypeScript!'; // Corrected: declare the variable before using it
