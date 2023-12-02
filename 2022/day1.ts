import { loadDay } from "./_";

const solve = (rows: string[]) =>
  rows
    .reduce(
      (elves, currentCalories: string) => {
        if (currentCalories == "") {
          elves.push([]);
        } else {
          elves[elves.length - 1].push(parseInt(currentCalories, 10));
        }
        return elves;
      },
      [[] as number[]]
    )
    .map((items) => items.reduce((a, b) => a + b, 0));

console.log({
  part1: Math.max(...solve(loadDay("day1.data"))),
  part2: solve(loadDay("day1.data"))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b, 0),
});
