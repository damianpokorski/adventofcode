import { readFileSync } from 'fs';

// File loading
export const loadDay = (file: string) => readFileSync(file).toString().split('\n');

// Mass replacing
export const mapReplace = (str: string, map: Record<string, string>) =>
  Object.entries(map).reduce((value, replacePair) => value.split(replacePair[0]).join(replacePair[1]), str);

// Lowest common multiple
export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

export enum Direction {
  North = 'North',
  South = 'South',
  West = 'West',
  East = 'East',
  NorthEast = 'NorthEast',
  SouthEast = 'SouthEast',
  NorthWest = 'NorthWest',
  SouthWest = 'SouthWest'
}
export const directions = {
  [Direction.North]: { x: 0, y: -1 },
  [Direction.South]: { x: 0, y: 1 },
  [Direction.West]: { x: -1, y: 0 },
  [Direction.East]: { x: 1, y: 0 },
  [Direction.NorthEast]: { x: 1, y: -1 },
  [Direction.SouthEast]: { x: 1, y: 1 },
  [Direction.NorthWest]: { x: -1, y: 1 },
  [Direction.SouthWest]: { x: -1, y: -1 }
} as Record<Direction, { x: number; y: number }>;

export const moveInDirection = (direction: Direction, x: number = 0, y: number = 0) => ({
  x: x + directions[direction].x,
  y: y + directions[direction].y
});

// Output colouring - might feel a bit awkward, but saves a library import
export const consoleColors = {
  Bright: (input: string, resetAfterwards = true) => ['\x1b[1m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Dim: (input: string, resetAfterwards = true) => ['\x1b[2m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Underscore: (input: string, resetAfterwards = true) => ['\x1b[4m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Blink: (input: string, resetAfterwards = true) => ['\x1b[5m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Reverse: (input: string, resetAfterwards = true) => ['\x1b[7m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  Hidden: (input: string, resetAfterwards = true) => ['\x1b[8m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgBlack: (input: string, resetAfterwards = true) => ['\x1b[30m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgRed: (input: string, resetAfterwards = true) => ['\x1b[31m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgGreen: (input: string, resetAfterwards = true) => ['\x1b[32m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgYellow: (input: string, resetAfterwards = true) => ['\x1b[33m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgBlue: (input: string, resetAfterwards = true) => ['\x1b[34m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgMagenta: (input: string, resetAfterwards = true) => ['\x1b[35m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgCyan: (input: string, resetAfterwards = true) => ['\x1b[36m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgWhite: (input: string, resetAfterwards = true) => ['\x1b[37m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  FgGray: (input: string, resetAfterwards = true) => ['\x1b[90m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgBlack: (input: string, resetAfterwards = true) => ['\x1b[40m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgRed: (input: string, resetAfterwards = true) => ['\x1b[41m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgGreen: (input: string, resetAfterwards = true) => ['\x1b[42m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgYellow: (input: string, resetAfterwards = true) => ['\x1b[43m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgBlue: (input: string, resetAfterwards = true) => ['\x1b[44m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgMagenta: (input: string, resetAfterwards = true) => ['\x1b[45m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgCyan: (input: string, resetAfterwards = true) => ['\x1b[46m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgWhite: (input: string, resetAfterwards = true) => ['\x1b[47m', input, resetAfterwards ? '\x1b[0m' : ''].join(''),
  BgGray: (input: string, resetAfterwards = true) => ['\x1b[100m', input, resetAfterwards ? '\x1b[0m' : ''].join('')
};
