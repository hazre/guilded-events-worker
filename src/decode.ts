const MIN_UTF32_VALUE = 0;
const MAX_UTF32_VALUE = 1114111;
const MIN_SURROGATE_VALUE = 55296;
const MAX_SURROGATE_VALUE = 57343;

// Bitmask for the first character.
const NUM1_MASK = 32767;
// Number of bits to shift for the second character.
const NUM2_SHIFT = 15;

// Define input variables
const date_string = '2023-03-30T03:30:00.000Z';
const hours_offset = 3;

/**
 * Convert a date string to a Unix timestamp, adjusted for an optional hours offset.
 * @param {string} date_string - The date string in the format 'YYYY-MM-DDTHH:MM:SS.sssZ'.
 * @param {number} hours_offset - The optional hours offset.
 * @returns {number} The Unix timestamp in minutes.
 */
function decode_date_string(date_string: string, hours_offset: number = 0): number {
  // Convert a date string to a Unix timestamp, adjusted for an optional hours offset.
  const date_time = new Date(date_string);
  const unix_timestamp = Math.floor((date_time.getTime() + hours_offset * 60 * 60 * 1000) / 1000);
  return Math.floor(unix_timestamp / 60);
}

/**
 * Convert a UTF-32 value to its corresponding Unicode character.
 * @param {number} utf32_value - The UTF-32 value to convert.
 * @returns {string} The corresponding Unicode character.
 * @throws {Error} If the UTF-32 value is invalid. 
 */
function convert_from_utf32(utf32_value: number): string {
  // Convert a UTF-32 value to its corresponding Unicode character.
  if (utf32_value < MIN_UTF32_VALUE || utf32_value > MAX_UTF32_VALUE || (utf32_value >= MIN_SURROGATE_VALUE && utf32_value <= MAX_SURROGATE_VALUE)) {
    throw new Error('Invalid UTF-32 value');
  }
  if (utf32_value < 65536) {
    return String.fromCharCode(utf32_value);
  }
  utf32_value -= 65536;
  const first_surrogate = String.fromCharCode(utf32_value / 1024 + 55296);
  const second_surrogate = String.fromCharCode((utf32_value % 1024) + 56320);
  return first_surrogate + second_surrogate;
}

/**
 * Decode into a UTF-32 string
 * @param {string} date_string - The date string in the format 'YYYY-MM-DDTHH:MM:SS.sssZ'.
 * @param {number} hours_offset - The optional hours offset.
 * @returns {string}
 */
export function decode(date_string: string, hours_offset: number = 3): string {
  // Convert date string to Unix timestamps
  const first_timestamp = decode_date_string(date_string);
  const second_timestamp = decode_date_string(date_string, hours_offset);
  
  // Decode UTF-32 values and concatenate them into a single string
  const first_char = convert_from_utf32(first_timestamp & NUM1_MASK);
  const second_char = convert_from_utf32(first_timestamp >> NUM2_SHIFT);
  const third_char = convert_from_utf32(second_timestamp & NUM1_MASK);
  const fourth_char = convert_from_utf32(second_timestamp >> NUM2_SHIFT);
  
  const result = first_char + second_char + third_char + fourth_char;
  
  return result
}