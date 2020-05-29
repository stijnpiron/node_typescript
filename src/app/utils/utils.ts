import { v4 } from 'uuid';

/**
 * Function that receives a list of strings and that returns the result for the check if every single argument is equal or not
 *
 * @param {Array.string} input list of strings that will be compared against each other
 * @returns {boolean}
 */
export function compareStrings(...input: string[]): boolean {
  return input.every((a) => a === input[0]);
}

/**
 * Returns a UUID generated by uuid.v4()
 *
 * @returns {string}
 */
export function getUUID(): string {
  return v4();
}

/**
 * Function that checks if the input string includes any single element of a given series of strings at any place.
 * If no elements are given, or the length of elements is 0, the function wille return true.
 *
 * @param {string} input String to be checked upon
 * @param {?Array.string} elements Elements to be checked if present in input string
 * @returns {boolean}
 */
export function stringContainsElementOfArray(input: string, elements: string[] = []): boolean {
  // Check if there are elements to check, otherwise return true
  if (!elements.length) return true;
  // Check for every element if it is present in the string at any place
  for (const element of elements) {
    if (input.includes(element)) return true;
  }
  // Return false if all elements are not present in the input string
  return false;
}

/**
 * Function accepts 2 Date objects and returns difference in ms
 *
 * @todo: add functionality to set the return scale (ms, s, m, ...)
 * @param {Date} start start time
 * @param {Date} end end time
 * @returns {number}
 */
export function timeDiff(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return diff;
}

/**
 * Functions accepts Date object and will return the representing UTC string
 *
 * @todo: Add functionality to pass custom formats and default back to UTC string when none provided
 * @param input
 * @returns {string}
 */
export function dateFormat(input: Date): string {
  return input.toUTCString();
}
