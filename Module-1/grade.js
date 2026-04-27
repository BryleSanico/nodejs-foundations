// grade.js

function getGrade(score) {
  if (score >= 90) {
    return 'A';
  } else if (score >= 80) {
    return 'B';
  } else if (score >= 70) {
    return 'C';
  } else if (score >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}

// Example usage:
const scores = [92, 85, 78, 65, 55];

scores.forEach(score => {
  const grade = getGrade(score);
  console.log(`Score: ${score} - Grade: ${grade}`);
});
