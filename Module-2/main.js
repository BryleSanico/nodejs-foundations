// main.js
const { addTask, completeTask, getPendingTasks, getAllTasks } = require('./tasks');

// Adding tasks
addTask('Learn JavaScript');
addTask('Learn Node.js');
addTask('Build the capstone');

// Completing a task
completeTask(1);

// Displaying all tasks
console.log('All Tasks:');
console.log(getAllTasks());

// Displaying pending tasks
console.log('\nPending Tasks:');
console.log(getPendingTasks());
