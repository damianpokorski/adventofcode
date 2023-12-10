import { loadDay } from './_';
const nodes = {} as Record<string, any>;

const solve = (rows: string[], part1 = true) => {
  // Process input
  const directions = (rows.find((row) => !row.includes(' = ') && row != '\n') ?? '').split('');
  for (let row of rows.filter((row) => row.includes(' = '))) {
    const [from, to] = row.split(' = ');
    const [L, R] = to.split('(').join('').split(')').join('').split(', ');
    nodes[from] = { from, L, R };
  }

  const findStepsTillTheEndAndLoop = (startNode: string) => {
    const goalNode = 'ZZZ';
    let currentNode = startNode;
    let stepsTaken = 0;

    const move = () => {
      const nextDirection = directions[stepsTaken % directions.length];
      const nextStep = nodes[currentNode][nextDirection];
      // console.log(`Moved ${nextDirection} from ${currentNode} to ${nextStep}`);
      currentNode = nextStep;
    };

    while ((part1 && currentNode !== goalNode) || (!part1 && !currentNode.endsWith('Z'))) {
      move();
      // We've finished the step
      stepsTaken = stepsTaken + 1;
    }
    return stepsTaken;
  };

  // Solve it
  if (part1) {
    let currentNode = 'AAA';
    return findStepsTillTheEndAndLoop(currentNode);
  } else {
    // Part 2

    // LCM Logic
    // common denominator + least common multiple
    const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
    const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

    // Grab starting nodes
    let startingNodes = Object.keys(nodes).filter((x) => x.endsWith('A'));

    return startingNodes.map((node) => findStepsTillTheEndAndLoop(node)).reduce(lcm);
  }
};

console.log({
  part1: solve(loadDay('day8.data')),
  part2: solve(loadDay('day8.data'), false)
});
