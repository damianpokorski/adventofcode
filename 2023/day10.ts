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
  // Upscale for part 2
  if (part1 == false) {
    // Upscale rows to 3x3

    // Create new matrix
    const newRows = [...new Array(rows.length * 3)].map(() => [...new Array(rows[0].length * 3)].map(() => '.'));

    // Upscale original rows
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[0].length; x++) {
        const upscaledY = y * 3;
        const upscaledX = x * 3;
        const source = rows[y][x];
        switch (source) {
          case '|':
            newRows[upscaledY][upscaledX + 1] = '|';
            newRows[upscaledY + 1][upscaledX + 1] = source;
            newRows[upscaledY + 2][upscaledX + 1] = '|';
            break;
          case 'F':
          case 'S':
            newRows[upscaledY + 1][upscaledX + 2] = '-';
            newRows[upscaledY + 1][upscaledX + 1] = source;
            newRows[upscaledY + 2][upscaledX + 1] = '|';
            break;
          case 'L':
            newRows[upscaledY][upscaledX + 1] = '|';
            newRows[upscaledY + 1][upscaledX + 1] = source;
            newRows[upscaledY + 1][upscaledX + 2] = '-';
            break;
          case '7':
            newRows[upscaledY + 1][upscaledX] = '-';
            newRows[upscaledY + 1][upscaledX + 1] = source;
            newRows[upscaledY + 2][upscaledX + 1] = '|';
            break;
          case 'J':
            newRows[upscaledY][upscaledX + 1] = '|';
            newRows[upscaledY + 1][upscaledX + 1] = source;
            newRows[upscaledY + 1][upscaledX] = '-';
            break;
          case '-':
            newRows[upscaledY + 1][upscaledX] = '-';
            newRows[upscaledY + 1][upscaledX + 1] = source;
            newRows[upscaledY + 1][upscaledX + 2] = '-';
            break;
        }
      }
    }

    // Overwrite rows
    rows = newRows.map((x) => x.join(''));
  }

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

  const loop = [] as Node[];
  // While we have unsolved pipes
  while (unsolvedPipes.length > 0) {
    // Grab first pipe
    let cursor = unsolvedPipes.shift() as Node;

    // Create a loop
    loop.push(cursor);
    const loopIds = [cursor.id];

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
    }
  }

  let enclosedByLoop = 0;
  // This is mostly visualizing - but also tallies part 2
  let processedRows = [] as any[][];
  for (let y = 0; y < rows.length; y++) {
    const newRow = [];
    processedRows.push([]);
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
      } else if (inner) {
        enclosedByLoop = enclosedByLoop + 1;
        text = consoleColors.BgMagenta(text);
      }
      newRow.push(text);
      processedRows[processedRows.length - 1].push({
        x,
        y,
        starting,
        inLoop,
        filled,
        inner,
        innerAndNotPipe: inner,
        text
      });
    }
  }

  // Downscaling - Only for part 2
  if (part1 == false) {
    processedRows = processedRows
      .map((row) => {
        return row.filter((item) => item.x % 3 == 1 && item.y % 3 == 1);
      })
      .filter((row) => row.length > 0);
  }
  if (part1 == false) {
    // Rendered processed data - Only for part 2
    for (let y = 0; y < processedRows.length; y++) {
      console.log(processedRows[y].map((x) => x.text).join(''));
    }
  }

  // Further point away in the loop
  if (part1) {
    return (
      processedRows
        .map((row) => row.map((row) => (row.inLoop ? 1 : 0) as number).reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0) / 2
    );
  }
  return processedRows
    .map((row) => row.map((cell) => (cell.innerAndNotPipe ? 1 : 0) as number).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
};

// TLDR: This is overall incredibly inefficient - but it works and resolves result in about 2~min
console.log({
  part1: solve(loadDay('day10.data')),
  part2: solve(loadDay('day10.data'), false)
});
