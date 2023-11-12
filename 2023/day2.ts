import { loadDay } from "./_";

const solve = (
  rows: string[],
  test: Record<string, number>,
  part1: boolean = true
) =>
  rows
    .map((row) => {
      // Parse input
      const [game, setsRaw] = row.split(":");
      const gameId = parseInt(game.replace("Game ", ""), 10);

      const sets = setsRaw.split(";").map((x) =>
        x
          .split(", ")
          .map((y) => y.trim().split(" "))
          .map(([number, color]) => ({ [color]: parseInt(number, 10) }))
          .reduce((dictionary, pair) => ({ ...dictionary, ...pair }), {})
      );

      // Extract max counts per game
      const maxSets = sets.reduce((maxValues, currentValues) => {
        for (const [color, count] of Object.entries(currentValues)) {
          maxValues[color] = Math.max(count, maxValues[color] ?? 0);
        }
        return maxValues;
      }, {});

      // Part 1
      if (part1) {
        for (const [requiredColor, requiredCount] of Object.entries(maxSets)) {
          const availableColor = test[requiredColor] ?? 0;
          if (availableColor < requiredCount) {
            console.log({ requiredColor, availableColor, requiredCount });
            return 0;
          }
        }
        return gameId;
      }

      // Part 2
      return Object.values(maxSets).reduce((a, b) => a * b, 1);
    })
    .reduce((a, b) => a + b, 0);

console.log({
  part1: solve(loadDay("day2.data"), {
    red: 12,
    green: 13,
    blue: 14,
  }),
  part2: solve(loadDay("day2.data"), {}, false),
});
