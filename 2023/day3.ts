import { loadDay } from './_';

const directions = [
  // Up down left right
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  // Diagonals clockwise, starting top right
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 }
];

// Helper for finding adjecent values
const getAdjecent = <T>(input: T[][], offsetX = 0, offsetY = 0) => {
  return directions.map((offset) => (input[offsetY + offset.y] ?? [])[offsetX + offset.x]).filter((x: T) => x !== undefined);
};

const numberFinder = (rows: string[], x: number, y: number, direction: { x: number; y: number }, reverse: boolean = false) => {
  const matches = [] as string[];
  let [iterX, iterY] = [x, y];
  while (true) {
    // If current pointer targets the valid number
    const value = (rows[iterY] ?? [])[iterX];
    if (!isNaN(value as unknown as number) || value == '0') {
      matches.push(value);
      iterX += direction.x;
      iterY += direction.y;
    } else {
      break;
    }
  }
  return (reverse ? matches.reverse() : matches).join('');
};

const solve = (rows: string[], part1: boolean = true) => {
  // We're really lazy so we inject an extra border of dots around the input
  rows = [[...new Array(rows[0].length)].map((_) => '.').join(''), ...rows.map((row) => ['.', ...row, '.'].join('')), [...new Array(rows[0].length)].map((_) => '.').join('')];
  const validDitigs = [] as number[];
  let currentDigit = [];

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const currentCharacter = rows[y][x];

      // Check if we're looking at the digit - store it
      if (!isNaN(currentCharacter as unknown as number)) {
        currentDigit.push(currentCharacter);
      } else {
        // Start
        let adjecents = [] as string[];
        for (let digit = 0; digit < currentDigit.length; digit++) {
          // Extract all of the adjectents next to our digits
          const neighbours = getAdjecent(rows as unknown as string[][], x - digit - 1, y);
          adjecents = [...adjecents, ...neighbours];
        }
        // filter out undefineds, non numbers, and non dots

        adjecents = adjecents
          .flat()
          .filter((character) => character !== undefined)
          .filter((character) => isNaN(character as unknown as number))
          .filter((character) => character !== '.');
        if (adjecents.length) {
          // console.log({ currentDigit, adjecents });
          validDitigs.push(parseInt(currentDigit.join(''), 10));
        }
        // Reset current digit stack
        currentDigit = [];
      }
    }
  }
  // return validDitigs;
  return validDitigs.reduce((a, b) => a + b, 0);
};

const solvePart2 = (rows: string[]) => {
  // We're really lazy so we inject an extra border of dots around the input
  rows = [[...new Array(rows[0].length)].map((_) => '.').join(''), ...rows.map((row) => ['.', ...row, '.'].join('')), [...new Array(rows[0].length)].map((_) => '.').join('')];
  const gearRatios = [] as number[];

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const currentCharacter = rows[y][x];

      // Check if we're looking at the digit - store it
      if (currentCharacter == '*') {
        const top = [(rows[y - 1] ?? [])[x - 1], (rows[y - 1] ?? [])[x], (rows[y - 1] ?? [])[x + 1]];
        const left = (rows[y] ?? [])[x - 1];
        const right = (rows[y] ?? [])[x + 1];
        const down = [(rows[y + 1] ?? [])[x - 1], (rows[y + 1] ?? [])[x], (rows[y + 1] ?? [])[x + 1]];

        // Check if we have exactly two part numbers
        const hasDigits = {
          top: top
            .join('')
            .split('.')
            .filter((x) => x !== '').length,
          right: !isNaN(right as unknown as number) ? 1 : 0,
          down: down
            .join('')
            .split('.')
            .filter((x) => x !== '').length,
          left: !isNaN(left as unknown as number) ? 1 : 0
        };

        // Shorthand to check exactly how much values we have available
        const partNumbersAvailable = Object.values(hasDigits).reduce((a, b) => a + b, 0);

        // Only 2 gears are valid for ratios
        if (partNumbersAvailable == 2) {
          // Find first digit positions
          const upOffsetX = x + top.findIndex((x) => !isNaN(x as unknown as number)) - 1;
          const downOffsetX = x + down.findIndex((x) => !isNaN(x as unknown as number)) - 1;

          gearRatios.push(
            // Find numbers based on finder results
            [
              // Top side with 1 number
              ...(hasDigits.top == 1 ? [[numberFinder(rows, upOffsetX, y - 1, { x: -1, y: 0 }, true), numberFinder(rows, upOffsetX, y - 1, { x: 1, y: 0 }, false).substring(1)].join('')] : []),
              ...(hasDigits.down == 1 ? [[numberFinder(rows, downOffsetX, y + 1, { x: -1, y: 0 }, true), numberFinder(rows, downOffsetX, y + 1, { x: 1, y: 0 }).substring(1)].join('')] : []),
              // Left side
              ...(hasDigits.left ? [numberFinder(rows, x - 1, y, { x: -1, y: 0 }, true)] : []),
              // Right side
              ...(hasDigits.right ? [numberFinder(rows, x + 1, y, { x: 1, y: 0 })] : []),
              // Top with two separated digits
              ...(hasDigits.top == 2 ? [numberFinder(rows, x - 1, y - 1, { x: -1, y: 0 }, true), numberFinder(rows, x + 1, y - 1, { x: 1, y: 0 })] : []),
              // Down with two separated digits,
              ...(hasDigits.down == 2 ? [numberFinder(rows, x - 1, y + 1, { x: -1, y: 0 }, true), numberFinder(rows, x + 1, y + 1, { x: 1, y: 0 })] : [])
            ]
              // Multiply numbers
              .flat()
              .map((value) => parseInt(value, 10))
              .reduce((a, b) => a * b, 1)
          );
        }
      }
    }
  }
  // return validDitigs;
  return gearRatios.reduce((a, b) => a + b, 0);
};

console.log({
  part1: solve(loadDay('day3.data')),
  part2: solvePart2(loadDay('day3.data'))
});
