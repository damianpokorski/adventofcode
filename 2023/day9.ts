import { loadDay } from './_';
const nodes = {} as Record<string, any>;

const solve = (rows: string[], part1 = true) => {
  return rows
    .map((row) => {
      console.log(row);
      const entries = row
        .split(' ')
        .map((value) => parseInt(value, 10))
        .filter((value) => !isNaN(value));

      const histories = [entries] as number[][];
      while (true) {
        // Check if last history is filled with same numbers
        if (histories[histories.length - 1].every((value) => value == 0)) {
          console.log({ final: histories[histories.length - 1] });
          break;
        }
        histories.push([]);
        // Add new history
        const previousPrediction = histories[histories.length - 2];
        for (let i = 1; i < previousPrediction.length; i++) {
          const a = previousPrediction[i - 1];
          const b = previousPrediction[i];
          histories[histories.length - 1].push(b - a);
        }
      }
      // Combine the last entries
      if (part1) {
        return histories.map((history) => history[history.length - 1]).reduce((a, b) => a + b, 0);
      }
      const firstHistories = histories.map((history) => history[0]);
      const previousPrediction = firstHistories.reverse().reduce((a, b) => {
        const result = b - a;
        console.log({ a, b, result });
        return result;
      }, 0);

      console.log({ firstHistories, previousPrediction });
      console.log('----');
      return previousPrediction;
    })
    .reduce((a, b) => a + b, 0);
};

console.log({
  part1: solve(loadDay('day9.data')),
  part2: solve(loadDay('day9.data'), false)
});
