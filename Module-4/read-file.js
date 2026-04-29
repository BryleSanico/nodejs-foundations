// read-file.js

const fs = require('fs/promises');

async function readFile() {
  try {
    const data = await fs.readFile('sample.txt', 'utf-8');
    console.log('File Contents:\n', data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

readFile();