import { readFileSync } from "fs";

export const loadDay = (file: string) =>
  readFileSync(file).toString().split("\n");

export const uppercase = [...new Array(26)]
  .map((_, index) => 65 + index)
  .map((value) => ({ [String.fromCharCode(value)]: value }))
  .reduce((a, b) => ({ ...a, ...b }));
export const lowercase = [...new Array(26)]
  .map((_, index) => 65 + 26 + 6 + index)
  .map((value) => ({ [String.fromCharCode(value)]: value }))
  .reduce((a, b) => ({ ...a, ...b }));

export const letters = {
  ...uppercase,
  ...lowercase,
};
