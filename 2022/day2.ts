import { loadDay } from "./_";

enum Moves {
  Rock,
  Paper,
  Scissors,
}
const lookup = {
  A: Moves.Rock,
  X: Moves.Rock,
  B: Moves.Paper,
  Y: Moves.Paper,
  C: Moves.Scissors,
  Z: Moves.Scissors,
};
const winConditionLookup = {
  X: false,
  Y: null,
  Z: true,
};
const scores = {
  [Moves.Rock]: 1,
  [Moves.Paper]: 2,
  [Moves.Scissors]: 3,
};

const fight = (opponent: Moves, mymove: Moves) => {
  if (opponent == mymove) {
    return null;
  }
  return {
    [Moves.Rock]: {
      [Moves.Paper]: false,
      [Moves.Scissors]: true,
    },

    [Moves.Paper]: {
      [Moves.Rock]: true,
      [Moves.Scissors]: false,
    },

    [Moves.Scissors]: {
      [Moves.Paper]: true,
      [Moves.Rock]: false,
    },
  }[mymove][opponent];
};

const solve = (rows: string[], part1: boolean = true) => {
  return rows.map((row) => {
    let [a, b] = row.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"];

    let otherMove = lookup[a];
    let recommendedMove = Moves.Rock;
    // Part 1
    if (part1) {
      recommendedMove = lookup[b];
    } else {
      const recommendedResult = winConditionLookup[b];
      const [move] = (
        [
          [Moves.Rock, fight(otherMove, Moves.Rock)],
          [Moves.Scissors, fight(otherMove, Moves.Scissors)],
          [Moves.Paper, fight(otherMove, Moves.Paper)],
        ] as [Moves, boolean?][]
      ).find(([move, result]) => result == recommendedResult) as [
        Moves,
        boolean?
      ];
      recommendedMove = move;
    }

    const result = fight(otherMove, recommendedMove);
    const score = result == true ? 6 : result == null ? 3 : 0;
    const moveScore = scores[recommendedMove];
    return score + moveScore;
  });
};
console.log({
  part1: solve(loadDay("day2.data"), true).reduce((a, b) => a + b, 0),
  part2: solve(loadDay("day2.data"), false).reduce((a, b) => a + b, 0),
});
