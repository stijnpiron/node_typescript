import { v4 } from 'uuid';

export const compareStrings = (a: string, b: string): boolean => {
  return a.localeCompare(b) === 0;
};

export const getUUID = (): string => {
  return v4();
};
