function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));

// Function to find unique values from an array
function findUniqueValues(arr) {
  const uniqueValues = new Set(arr);
  return [...uniqueValues];
}

// Function to count duplicate values in an array
function countDuplicates(arr) {
  const duplicateCount = {};
  const values = new Set();

  for (const value of arr) {
    if (values.has(value)) {
      duplicateCount[value] = (duplicateCount[value] || 1) + 1;
    } else {
      values.add(value);
    }
  }

  return duplicateCount;
}
const arr = [1, 2, 2, 3, 4, 4, 4, 5];

// Get unique values
const uniqueValues = findUniqueValues(arr);

// Get duplicate counts
const duplicateCount = countDuplicates(arr);

console.log("Unique Values=", uniqueValues);
console.log("Duplicate Count=", duplicateCount);
