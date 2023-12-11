import { directions, loadDay, consoleColors, mapReplace } from './_';

interface Node {
  x: number;
  y: number;
  id?: string;
}
const addIdToNode = (node: Node) => ({ ...node, id: `${node.x},${node.y}` });

const connectors = {
  '|': [directions.North, directions.South],
  '-': [directions.East, directions.West],
  L: [directions.North, directions.East],
  J: [directions.North, directions.West],
  '7': [directions.South, directions.West],
  F: [directions.South, directions.East],
  // Hardcoding S -> L cause im lazy
  // S: [directions.North, directions.East]
  S: [directions.South, directions.East]
} as Record<string, Node[]>;

const edges = {} as Record<number, Record<number, Node[]>>;

const solve = (rows: string[], part1 = true) => {
  let unsolvedPipes = [] as Node[];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const cell = rows[y][x];
      // If cell isnt ground
      if (cell != '.') {
        // Save starting pipe to unsolved list
        if (cell == 'S') {
          unsolvedPipes.push(addIdToNode({ x, y }));
        }
        // Save which nodes it links to
        const connections = [...(connectors[cell] ?? [])]
          .map((connection) => ({
            x: x + connection.x,
            y: y + connection.y
          }))
          .map((node) => addIdToNode(node));
        if (edges[y] == undefined) {
          edges[y] = {};
        }
        edges[y][x] = connections;
      }
    }
  }
  //
  // console.log(JSON.stringify(edges, null, 2));

  const loop = [] as Node[];
  console.log({ unsolvedPipes });
  // While we have unsolved pipes
  while (unsolvedPipes.length > 0) {
    // Grab first pipe
    let cursor = unsolvedPipes.shift() as Node;

    // Create a loop
    loop.push(cursor);
    const loopIds = [cursor.id];

    console.log(edges, cursor);

    while (true) {
      // Keep finding adjecent nodes - which have not been visited - Grab first one
      const lastLoopEntry = loop[loop.length - 1];
      const connection = ((edges[lastLoopEntry.y] ?? {})[lastLoopEntry.x] ?? [])
        .filter((connection) => !loopIds.includes(connection.id))
        .pop();

      // Break if we do not have more nodes
      if (!connection) {
        break;
      }
      // Add connection to loop
      loop.push(connection);
      loopIds.push(connection.id);
      // Remove all pipes from current loop from unresolved list
      // unsolvedPipes = unsolvedPipes.filter((node) => !loopIds.includes(node.id));
      // console.log({ unsolvedPipes: unsolvedPipes.length });
    }
  }

  // A little bit of fun visualizing it - get ids of nodes in loop
  const loopIds = loop.map((node) => node.id);

  // Flood fill
  const floodFilled = [] as Node[];
  const floodFilledIds = [] as string[];
  const tilesToFloodFill = [
    addIdToNode({ x: 0, y: 0 }),
    addIdToNode({ x: rows[0].length - 1, y: 0 }),
    addIdToNode({ x: rows[0].length - 1, y: rows[0][0].length - 1 }),
    addIdToNode({ x: 0, y: rows[0][0].length - 1 })
  ];

  // Flood fill outsides, count remainig items
  while (tilesToFloodFill.length > 0) {
    const tileToFill = tilesToFloodFill.shift() as Node;
    // If tile hasnt been filled yet
    if (!floodFilledIds.includes(tileToFill.id as string)) {
      floodFilled.push(tileToFill);
      floodFilledIds.push(tileToFill.id as string);
      // Detect neighbours
      const { x, y } = tileToFill;
      const neighbours = [
        ...Object.values(directions)
          .map((direction) =>
            addIdToNode({
              x: x + direction.x,
              y: y + direction.y
            })
          )
          // Filter within bounds
          .filter((node) => node.x >= 0)
          .filter((node) => node.x <= rows[0].length)
          .filter((node) => node.y >= 0)
          .filter((node) => node.y <= rows.length)
          .filter((node) => !floodFilledIds.includes(node.id as string))
          .filter((node) => !loopIds.includes(node.id as string))
      ];
      tilesToFloodFill.push(...neighbours);
      // console.log({ tileToFill: tilesToFloodFill.map((x) => x.id) });
    }
  }

  let enclosedByLoop = 0;
  // This is mostly visualizing - but also tallies part 2
  for (let y = 0; y < rows.length; y++) {
    const newRow = [];
    for (let x = 0; x < rows[y].length; x++) {
      const cellId = addIdToNode({ x, y }).id;
      const inLoop = loopIds.includes(cellId);
      const filled = floodFilledIds.includes(cellId);
      const starting = rows[y][x] == 'S';

      const inner = inLoop == false && filled == false && starting == false;

      let text = mapReplace(rows[y][x], {
        '7': '┒',
        L: '┖',
        J: '┚',
        F: '┎',
        '|': '┃',
        '-': '─',
        '.': '.'
      });

      if (starting) {
        text = consoleColors.BgRed(text);
      } else if (inLoop) {
        text = consoleColors.BgGray(text);
      } else if (filled) {
        text = consoleColors.BgCyan(text);
      } else if (inner && rows[y][x] == '.') {
        enclosedByLoop = enclosedByLoop + 1;
        text = consoleColors.BgMagenta(text);
      }
      newRow.push(text);
    }
    console.log(newRow.join(''));
  }

  console.log({
    filled: floodFilledIds,
    enclosedByLoop
  });
  return loop.length / 2;
};

console.log(JSON.stringify(solve(loadDay('day10.data')), null, 2));

// console.log({
//   part1: solve(loadDay('day10.data'))
//   // part2: solve(loadDay('day10.data'), false)
// });

// import * as graphviz from 'graphviz';
