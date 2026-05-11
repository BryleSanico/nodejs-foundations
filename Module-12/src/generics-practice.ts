// --- Reading Generics ---

// 1. Promise<User>
// An async operation that will eventually return a User object.

// 2. Array<string>
// An array containing only strings. (Exactly the same as writing string[]).

// 3. Map<string, number>
// A key-value store where the keys are strings and the values are numbers.
// Example: map.set("score", 42)

// 4. Request<{ id: string }, {}, CreateTaskBody>
// Types an Express request using its specific generic slots:
//   - Slot 1: req.params (tells TS that req.params.id is a string also known as type annotation)
//   - Slot 2: res.body (ignored here)
//   - Slot 3: req.body (tells TS that req.body matches the CreateTaskBody type)

// 5. (items: T[]) => T | undefined
// T is a dynamic placeholder.
// This says: "Take an array of [type], and return one item of that exact same [type], or undefined."
// Pass it an array of numbers, it returns a number. Pass it strings, it returns a string.
// --- Generic Function ---

function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

// TypeScript infers T = number from the argument
const firstNumber = firstItem([10, 20, 30]);
console.log("firstNumber:", firstNumber); // 10

// TypeScript infers T = string from the argument
const firstString = firstItem(["apple", "banana", "cherry"]);
console.log("firstString:", firstString); // apple

// Empty array — TypeScript infers T = never, result is undefined
const fromEmpty = firstItem([]);
console.log("fromEmpty:", fromEmpty); // undefined
