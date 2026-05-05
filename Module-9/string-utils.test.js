// string-utils.test.js

const { capitalize, reverse, countWords, isEmail } = require('./string-utils');

describe('capitalize', () => {
  test('capitalizes the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('reverse', () => {
  test('reverses the string', () => {
    expect(reverse('hello')).toBe('olleh');
  });

  test('returns empty string for empty input', () => {
    expect(reverse('')).toBe('');
  });
});

describe('countWords', () => {
  test('counts the number of words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  test('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });
});    

describe('isEmail', () => {
  test('returns true for valid email', () => {
    expect(isEmail('test@example.com')).toBe(true);
  });

  test('returns false for invalid email', () => {
    expect(isEmail('not-an-email')).toBe(false);
  });
});