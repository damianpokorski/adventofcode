import { loadDay, consoleColors, unique, getRowElements, getColumnElements } from './_';

const solve = (rows: string[], part1 = true) => {
  let nodes = rows.map((row) => row.split(''));

  // Detect empty rows
  const emptyRowsIndices = [] as number[];
  for (let y = 0; y < rows.length; y++) {
    if (unique(getRowElements(nodes, y)).length == 1) {
      emptyRowsIndices.push(y);
    }
  }

  // Detect empty columns
  const emptyColumnIndices = [] as number[];
  for (let x = 0; x < rows[0].length; x++) {
    const columnContent = getColumnElements(nodes, x);
    if (unique(columnContent).length == 1) {
      emptyColumnIndices.push(x);
    }
  }

  // Detect stars
  let stars = [] as { x: number; y: number; id: number }[];

  for (let y = 0; y < nodes.length; y++) {
    for (let x = 0; x < nodes[0].length; x++) {
      if (nodes[y][x] == '#') {
        stars.push({
          x,
          y,
          id: stars.length + 1
        });
      }
    }
  }

  // Shift them via expanded space
  stars = stars.map((star) => {
    return {
      ...star,
      x: emptyColumnIndices.filter((column) => column < star.x).length * (part1 ? 1 : 1000000 - 1) + star.x,
      y: emptyRowsIndices.filter((row) => row < star.y).length * (part1 ? 1 : 1000000 - 1) + star.y
    };
  });

  // Hashmap
  const starsById = stars.reduce(
    (dict, star) => ({ ...dict, [star.id.toString()]: star }),
    {} as Record<string, { x: number; y: number; id: number }>
  );

  // Find unique paths
  let paths = stars
    .map((star) => stars.filter((otherStar) => otherStar.id > star.id).map((otherStar) => [star.id, otherStar.id]))
    .flat();

  // Calculate distance between the paths
  // paths = [[5, 9]];
  let totalDistance = 0;
  for (const path of paths) {
    const a = starsById[path[0]];
    const b = starsById[path[1]];
    const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    totalDistance += dist;
  }
  return totalDistance;
};

console.log({
  part1: solve(loadDay('day11.data')),
  part2: solve(loadDay('day11.data'), false)
});
