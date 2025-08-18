// Checks if a string is a valid Roman numeral
function _isRoman(str) {
  return /^[IVXLCDM]+$/i.test(str)
}

// Converts Roman numeral to integer
function _romanToInt(roman): string {
  const map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }
  let result = 0
  let prev = 0

  roman = roman.toUpperCase()
  for (let i = roman.length - 1; i >= 0; i--) {
    const curr = map[roman[i]]
    if (curr < prev) {
      result -= curr
    } else {
      result += curr
    }
    prev = curr
  }

  console.log('Converted Roman numeral:', roman, 'to integer:', result)

  return result.toString()
}

// Normalize a value: if Roman numeral, convert to integer
function normalizeRoman(value) {
  try {
    if (typeof value === 'string' && _isRoman(value)) {
      return _romanToInt(value)
    }
  } catch (error) {
    console.error('Error normalizing Roman numeral:', error)
  }
  return value
}

export { normalizeRoman }
