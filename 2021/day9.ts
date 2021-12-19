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


// Find basins by growing
const pointToHash = (p: Point):string => `${p.x}:${p.y}`;

function growBasinLowPoints(allPoints: Point[], pointToCheck: Point, pointsInBasin: string[] = []) {

  if(pointToCheck.height == 9) {
    return pointsInBasin;
  }

  // Add current point to basin
  pointsInBasin.push(pointToHash(pointToCheck));

  // If basin grows smoothly left
  const spread = [
    {value: pointToCheck.left, x: pointToCheck.x -1, y: pointToCheck.y},
    {value: pointToCheck.right, x: pointToCheck.x +1, y: pointToCheck.y},
    {value: pointToCheck.up, x: pointToCheck.x , y: pointToCheck.y-1},
    {value: pointToCheck.down, x: pointToCheck.x , y: pointToCheck.y+1},
  ];

  for(let direction of spread) {
    const cell = allPoints.find(point => point.x == direction.x && point.y == direction.y);
    if(cell && !pointsInBasin.includes(pointToHash(cell))) {
      pointsInBasin = [...pointsInBasin, ...growBasinLowPoints(allPoints, cell, pointsInBasin)];
    }
  }

  return [... new Set(pointsInBasin)];
};

const basins = lowPoints.map(low => growBasinLowPoints(points.flat(), low));
const basinSizes = basins.map(x => x.length);
const biggestBasins = basinSizes.sort((a,b) => b - a);
const multipliedValues = biggestBasins.slice(0, 3).reduce((a,b) => a*b, 1);
// Rendering the map basins
points.map((row, y) => {
  console.log(
    row.map((point, x) => {
      if(lowPoints.map(pointToHash).includes(pointToHash(point))) {
        return chalk.bgRed.white.bold(point.height)
      }
      if(basins.filter(basin => basin.includes(pointToHash(point))).length > 0) {
        const backgrounds = [
          // chalk.bgGray,
          chalk.bgRed,
          chalk.bgYellow,
          chalk.bgGreen,
          chalk.bgMagenta,
          chalk.bgCyan,
          chalk.bgGreenBright,
          chalk.bgMagentaBright,
          chalk.bgRedBright
        ];
        let basinColor = backgrounds[basins.findIndex(basin => basin.includes(pointToHash(point))) % backgrounds.length];
        return basinColor.black.bold(point.height.toString());
      }
      return chalk.gray(point.height);
    }).join("")
  );
});
console.log({
  ["Part 1"]: riskSum
});
console.log({
  ["Part 2"]:multipliedValues
})