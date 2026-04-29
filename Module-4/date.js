// date.js

const dayjs = require('dayjs');

// Store dates 
const today = dayjs().format('YYYY-MM-DD');
const futureDate = dayjs().add(7, 'day').format('YYYY-MM-DD');
const pastDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');


// Print today's date formatted as 'YYYY-MM-DD'
console.log("Today's date:", today);

// Print the date 7 days from now
console.log("Date 7 days from now:", futureDate);

// Print the date 30 days ago
console.log("Date 30 days ago:", pastDate);


// Print the day of the week for each
console.log("Day of the week for today's date:", dayjs(today).format('dddd'));
console.log("Day of the week for date 7 days from now:", dayjs(futureDate).format('dddd'));
console.log("Day of the week for date 30 days ago:", dayjs(pastDate).format('dddd'));
