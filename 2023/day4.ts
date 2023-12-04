import { loadDay } from './_';
interface Scratch {
  game: string;
  winningNumbers: number[];
  elvesNumbers: number[];
  elvesWinningNumbers: number[];
  elvesPoints: number;
  matches: number;
}
const scratches = {} as Record<string, Scratch>;
const solve = (rows: string[]) => {
  return rows
    .map((row) => {
      const [game, data] = row
        .replace('Card ', '')
        .split(':')
        .map((value) => value.trim());
      const [winningNumbers, elvesNumbers] = data.split(' | ').map((value) =>
        value
          .trim()
          .split(' ')
          .map((numberString) => parseInt(numberString, 10))
          .filter((value) => !isNaN(value))
      );
      const elvesWinningNumbers = elvesNumbers.filter((elvesNumber) => winningNumbers.includes(elvesNumber));
      const elvesPoints = Math.floor(elvesWinningNumbers.reduce((totalPoints, winningPoint) => totalPoints * 2, 1) / 2);
      scratches[game] = {
        game,
        winningNumbers,
        elvesNumbers,
        elvesWinningNumbers,
        matches: elvesWinningNumbers.length,
        elvesPoints
      };
      return elvesPoints;
    })
    .reduce((a, b) => a + b, 0);
};

const solvePart2 = () => {
  const scratchesToProcess = Object.values(scratches);

  let scratchesTotal = 0;
  while (scratchesToProcess.length > 0) {
    // Grab next scratch to process
    const nextScratch = scratchesToProcess.shift() as Scratch;
    // Count this scratch
    scratchesTotal++;

    if (nextScratch.matches > 0) {
      // Grab consecutive scratches
      const gameId = parseInt(nextScratch.game, 10);
      const extraScratches = [...new Array(nextScratch.matches)]
        .map((_, index) => index)
        .map((consecutiveOffset) => gameId + consecutiveOffset + 1)
        .map((newScratchId) => scratches[newScratchId.toString()]);

      // Insert into the stack
      scratchesToProcess.unshift(...extraScratches);
    }
  }
  return scratchesTotal;
};

console.log({
  part1: solve(loadDay('day4.data')),
  part2: solvePart2()
});
