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
const solve = (rows: string[], ignoreSpaces = false) => {
  const values = {} as Record<string, number[]>;
  for (let row of rows) {
    row = ignoreSpaces ? row.replace(/\s/g, '') : row;
    let [label, data] = row.split(':').map((value) => value.trim());
    const input = data
      .split(' ')
      .filter((x) => x !== '')
      .map((x) => parseInt(x, 10));
    console.log({ label, data, input });
    values[label] = input;
  }
  const { Time, Distance } = values;

  // Iterate through rounds
  const results = [] as number[];
  let ticker = 0;
  for (let round = 0; round < Time.length; round++) {
    const t = Time[round];
    const d = Distance[round];

    console.log({ t, d });
    let recordBreakers = 0;
    // Iterate through possibilities
    for (let holdDuration = 1; holdDuration < t; holdDuration++) {
      let timeRemaining = t - holdDuration;
      let distanceTravelled = timeRemaining * holdDuration;
      if (distanceTravelled > d) {
        recordBreakers = recordBreakers + 1;
      }
    }
    results.push(recordBreakers);
  }
  const result = results.reduce((a, b) => a * b, 1);
  console.log({ result });
  return result;
};

console.log({
  part1: solve(loadDay('day6.data')),
  part2: solve(loadDay('day6.data'), true)
});
