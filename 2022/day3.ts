import { loadDay, letters, lowercase, uppercase } from "./_";

const priorities = {
  ...[
    Object.entries(uppercase).map(([letter, ascii]) => ({
      [letter]: ascii - 64 + 26,
    })),
    Object.entries(lowercase).map(([letter, ascii]) => ({
      [letter]: ascii - 32 - 64,
    })),
  ]
    .flat()
    .reduce((a, b) => ({ ...a, ...b }), {}),
};
const solve = (rows: string[], part1: boolean = true) => {
  return rows.map((row) => {
    const left = row.substring(0, row.length / 2).split("");
    const right = row.substring(row.length / 2).split("");
    const overlap = left.find((l) => right.includes(l)) as string;
    return priorities[overlap] ?? 0;
  });
};

const solvePart2 = (rows: string[], part1: boolean = true) => {
  let sets = [] as string[][];
  return rows.map((row) => {
    sets.push(row.split(""));
    // Every time we have 3 sets
    if (sets.length == 3) {
      // Find cross matches between 1->2 and 1->3
      const [firstAndSecond, firstAndThird] = [
        sets[0].filter((first) => sets[1].includes(first)),
        sets[0].filter((first) => sets[2].includes(first)),
      ];
      // Find the matching one in second and third
      const match = firstAndSecond.find((submatch) =>
        firstAndThird.includes(submatch)
      ) as string;
      sets = [];
      return priorities[match] ?? 0;
    }
    return 0;
  });
};
console.log({
  part2: solve(loadDay("day3.data")).reduce((a, b) => a + b, 0),
  part1: solvePart2(loadDay("day3.data")).reduce((a, b) => a + b, 0),
});

// console.log({ priorities });
