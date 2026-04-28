// user.js

function CreateUser(name, role, yearsOfExperience, favoriteLanguages) {
    this.name = name;
    this.role = role;
    this.yearsOfExperience = yearsOfExperience;
    this.favoriteLanguages = favoriteLanguages;
}

const user = new CreateUser('Bryle', 'Developer', 3, ['JavaScript', 'Python', 'Swift']);

// Print name using dot notation
console.log(user.name); // Bryle

// Print first favorite language using bracket notation
console.log(user['favoriteLanguages'][0]); // JavaScript

// Add new property isLearningNodeJS
user.isLearningNodeJS = true;

// Print the entire object
console.log(user);
