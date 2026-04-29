// file-reader.js

const fs = require('fs/promises');

// Get the filename from command-line arguments
const filename = process.argv[2];

// Check if a filename was provided
if (!filename) {
  console.log('Usage: node file-reader.js <filename>');
  process.exit(1);
}

// Async function to read the file and display information
async function readFile() {
  try {
    const [data, stats] = await Promise.all([
      fs.readFile(filename, 'utf-8'),
      fs.stat(filename)
    ]);

    // Print the file contents
    console.log('File Contents:\n', data);

    // Print the file size in bytes
    console.log('File Size (bytes):', stats.size);

    // Count the number of lines in the file
    const lineCount = data.trim() ? data.split('\n').length : 0;
    console.log('Number of Lines:', lineCount);
  } catch (error) {
    // Handle errors gracefully
    if (error.code === 'ENOENT') {
      console.error('Error: File not found. Please check the filename and try again.');
    } else {
      console.error('An error occurred:', error.message);
    }
  }
}

// Call the function to read the file
readFile();