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

function findUniqueAndCountDuplicates(arr) {
  const uniqueValues = new Set();
  const duplicateCount = {};

  for (const value of arr) {
    if (uniqueValues.has(value)) {
      duplicateCount[value] = (duplicateCount[value] || 1) + 1;
    } else {
      uniqueValues.add(value);
    }
  }

  return {
    uniqueValues: [...uniqueValues],
    duplicateCount,
  };
}

const arr = [1, 2, 2, 3, 4, 4, 4, 5];
const result = findUniqueAndCountDuplicates(arr);

console.log("Unique Values=", result.uniqueValues);
console.log("Duplicate Count=", result.duplicateCount);
