import { data } from "./data/day9.data";
import {Instance as chalkFactory} from "chalk";
const chalk = new chalkFactory();

// const data = [
//   "2199943210", 
//   "3987894921", 
//   "9856789892", 
//   "8767896789", 
//   "9899965678", 
// ];

const map = data.map(row => row.split("").map(number => parseInt(number)));
interface Point {
  lowPoint: boolean;
  adjecentHeights: number[];
  x: number;
  y: number;
  height: number;
  up: number;
  down: number;
  left: number;
  right: number;
};
const points = map
.map((row, y) => row
    // Self contained point information
    .map((height, x) => ({
      x,
      y,
      height,
      up: map[y-1] !== undefined ? map[y-1][x] : null,
      down: map[y+1] !== undefined ? map[y+1][x]: null,
      left: map[y][x-1] !== undefined ? map[y][x-1] : null,
      right: map[y][x+1] !== undefined ? map[y][x+1] : null,
    }))
    // Put adjecents into array
    .map((point) => ({
      ...point,
      adjecentHeights: [
        point.left,
        point.right,
        point.up,
        point.down,
      ].filter((value): value is number => Number.isInteger(value))
    }))
    // Flag low points
    .map((point) => ({
      ...point,
      lowPoint: point.adjecentHeights.filter(adjectentHeight => adjectentHeight > point.height).length == point.adjecentHeights.length
    }))
  ) as Point[][];

// console.log(points);
const lowPoints = points.flat().filter(point => point.lowPoint);
const risk = lowPoints.map(point => point.height + 1);
const riskSum = risk.reduce((a,b) => a+b, 0); 
console.log({
  ["Part 1"]: riskSum
});

// Find basins by growing
const pointToHash = (p: Point):string => `${p.x}:${p.y}`;

function growBasinLowPoints(allPoints: Point[], pointToCheck: Point, pointsInBasin: string[] = []) {

  if(pointToCheck.height == 9) {
    return pointsInBasin;
  }

  // Add current point to basin
  pointsInBasin.push(pointToHash(pointToCheck));

  // If basin grows smoothly left
  if((pointToCheck.left - pointToCheck.height) >= 1) {
    const left = allPoints.find(left => left.x == pointToCheck.x-1 && left.y == pointToCheck.y);
    // If point exists & is not already in basin
    if(left && !pointsInBasin.includes(pointToHash(left))) {
      pointsInBasin = [...pointsInBasin, ...growBasinLowPoints(allPoints, left, pointsInBasin)];
    }
  }
  // If basin grows smoothly right
  if((pointToCheck.right - pointToCheck.height) >= 1) {
    const right = allPoints.find(right => right.x == pointToCheck.x+1 && right.y == pointToCheck.y);
    // If point exists & is not already in basin
    if(right && !pointsInBasin.includes(pointToHash(right))) {
      pointsInBasin = [...pointsInBasin, ...growBasinLowPoints(allPoints, right, pointsInBasin)];
    }
  }
  // If basin grows smoothly down
  if((pointToCheck.down - pointToCheck.height) >= 1) {
    const down = allPoints.find(down => down.y == pointToCheck.y+1 && down.x == pointToCheck.x);
    // If point exists & is not already in basin
    if(down && !pointsInBasin.includes(pointToHash(down))) {
      pointsInBasin = [...pointsInBasin, ...growBasinLowPoints(allPoints, down, pointsInBasin)];
    }
  }
  // If basin grows smoothly up
  if((pointToCheck.up - pointToCheck.height) >= 1) {
    const up = allPoints.find(up => up.y == pointToCheck.y-1 && up.x == pointToCheck.x);
    // If point exists & is not already in basin
    if(up && !pointsInBasin.includes(pointToHash(up))) {
      pointsInBasin = [...pointsInBasin, ...growBasinLowPoints(allPoints, up, pointsInBasin)];
    }
  }
  return [... new Set(pointsInBasin)];
};

const basins = lowPoints.map(low => growBasinLowPoints(points.flat(), low));
const basinSizes = basins.map(x => x.length);
const biggestBasins = basinSizes.sort((a,b) => b - a);
const multipliedValues = biggestBasins.slice(0, 3).reduce((a,b) => a*b, 1);
points.map((row, y) => {
  console.log(
    row.map((point, x) => {
      if(lowPoints.map(pointToHash).includes(pointToHash(point))) {
        return chalk.bgRed.white.bold(point.height)
      }
      if(basins.filter(basin => basin.includes(pointToHash(point))).length > 0) {
        let basinColor = chalk.bgGray;
        const basinIndexModulus = basins.findIndex(basin => basin.includes(pointToHash(point))) % 6;
        switch(basinIndexModulus) {
          case 0:
            basinColor = chalk.bgRed;
            break;
          case 1:
            basinColor = chalk.bgYellow;
            break;
          case 2:
            basinColor = chalk.bgGreen;
            break;
          case 3:
            basinColor = chalk.bgMagenta;
            break;
          case 4:
            basinColor = chalk.bgCyan;
            break;
          case 5:
            basinColor = chalk.bgGreenBright;
            break;
        }
        return basinColor.black.bold(point.height.toString());
      }
      return chalk.gray(point.height);
    }).join("")
  );
});

console.log([... new Set(basins.flat())].length);
console.log(biggestBasins);
console.log(multipliedValues);
