// Helpers
import { Instance as Chalk } from "chalk";
const chalk = new Chalk();
const slowDown = 1;
const sleep = async () => await new Promise((resolve, reject) => setTimeout(resolve, slowDown));

import {data} from "./data/day15.data";
// const data = [
//   "1163751742",
//   "1381373672",
//   "2136511328",
//   "3694931569",
//   "7463417111",
//   "1319128137",
//   "1359912421",
//   "3125421639",
//   "1293138521",
//   "2311944581",
// ];



((async () => {


  class Point {
    // A* - F = Total cost calculated using - G (Distance) * H (heuristic "guess1")
    f: number = 0;
    g: number = 0;
    h: number = 0;
    constructor(public x: number, public y: number, public risk: number, public parent: Point = null) { }
    compare(other: Point): boolean {
      return this.x == other.x && this.y == other.y;
    }
    clone() {
      return new Point(this.x, this.y, this.risk);
    }
  }

  const map = data
    .map((row, y) => row
      .split("")
      .map((risk, x) => new Point(x, y, parseInt(risk)))
    );

  const [startX, startY] = [0, 0];
  const [maxX, maxY] = [map.length - 1, map[0].length - 1];
  const [endX, endY] = [map.length - 1, map[0].length - 1];


  const isStart = (point: Point): boolean => {
    return point.x == startX && point.y == startY;
  }
  const isEnd = (point: Point): boolean => {
    return point.x == endX && point.y == endY;
  }

  let frame = 0;

  const render = async (path: Point[] = [], openNodes: Point[] = [], closedNodes: Point[] = []) => {
    console.clear();
    console.log(`Frame: ${frame++}`);
    console.log("");
    for (let y = 0; y <= maxY; y++) {
      console.log(map[y].map((point, x) => {
        if (isStart(point)) {
          return chalk.bgGreen.black.bold(point.risk.toString())
        }
        if (isEnd(point)) {
          return chalk.bgRed.black.bold(point.risk.toString())
        }
        if(path.find(node => node.compare(point))) {
          return chalk.bgGreen.white.bold(point.risk);
        }
        if(openNodes.find(openNode => openNode.compare(point))) {
          return chalk.bgBlue.black(point.risk);
        }
        if(closedNodes.find(closedNode => closedNode.compare(point))) {
          return chalk.bgGreen.black(point.risk);
        }
        return chalk.gray(point.risk.toString());
      }).join(""));
    }
    await sleep();
  }

  const pathFromNode = (point: Point) => {
    const path = [point];
    let head = point;
    while (head.parent !== null) {
      path.push(head.parent);
      head = head.parent;
    }
    return path;
  }

  const getPathRisk = (point: Point): number => {
    return pathFromNode(point).map(point => point.risk).reduce((a,b) => a+b, 0);
  }

  const AStarPathFinding = async() => {
    let openNodes = [] as Point[];
    let closedNodes = [] as Point[];

    // Create current node - Starting point
    let currentNode = map[startY][startX];

    // Add start node to the first point
    openNodes.push(currentNode);

    // Iterate through open nodes
    while (openNodes.length > 0) {
      // Sort the open nodes & remove the one with lowest F
      currentNode = openNodes.sort((openNode, otherOpenNode) => openNode.f - otherOpenNode.f).shift()
      
      // Move it to closed nodes
      closedNodes.push(currentNode);

      // Final update
      await render(pathFromNode(currentNode), openNodes, closedNodes);
      if (isEnd(currentNode)) {
        return currentNode;
      }

      // Create child nodes
      const childNodes = [
        // Up
        currentNode.y - 1 >= 0 ? map[currentNode.y - 1][currentNode.x] : null,
        // Down
        currentNode.y + 1 <= maxY ? map[currentNode.y + 1][currentNode.x] : null,
        // Left
        currentNode.x - 1 >= 0 ? map[currentNode.y][currentNode.x - 1] : null,
        // Right
        currentNode.x + 1 <= maxX ? map[currentNode.y][currentNode.x + 1] : null,
      ].filter(point => point !== null).map(point => point.clone()) as Point[];

      // Adjust child nodes
      for (let childNode of childNodes) {

        // console.log(["Tick", childNode]);
        // If node is in closed list - skip it
        if (closedNodes.find(closedNode => closedNode.compare(childNode))) {
          continue;
        }
        // Calculate f g h
        childNode.parent = currentNode;
        // childNode.g = currentNode.g + 1
        // childNode.f = childNode.g + childNode.h;
        // childNode.f = currentNode.risk + childNode.risk;
        // childNode.h = ((childNode.x - map[endY][endX].x) ** 2) + ((childNode.y - map[endY][endX].y) ** 2);
        // childNode.g = currentNode.risk + childNode.risk;
        // childNode.g = currentNode.risk + childNode.risk;
        // childNode.f = childNode.f + childNode.g;
        childNode.f = childNode.g = getPathRisk(childNode);
        // If node is in closed list - skip it
        if (openNodes.find(openNode => openNode.compare(childNode))) {
          continue;
        }
        openNodes.push(childNode);
        await render(pathFromNode(currentNode), openNodes, closedNodes);
      }
      // break;
    }

  }

  const nodetree = await AStarPathFinding();
  const nodetreeArray = pathFromNode(nodetree);
  console.log();
  console.log(`Total risk: ${getPathRisk(nodetree) - map[startY][startX].risk}`)
})());