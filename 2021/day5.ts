
import { data } from "./data/day5.data";
// const data = [
//   {start: {x: 0, y:9}, end: {x: 5, y:9}},
//   {start: {x: 8, y:0}, end: {x: 0, y:8}},
//   {start: {x: 9, y:4}, end: {x: 3, y:4}},
//   {start: {x: 2, y:2}, end: {x: 2, y:1}},
//   {start: {x: 7, y:0}, end: {x: 7, y:4}},
//   {start: {x: 6, y:4}, end: {x: 2, y:0}},
//   {start: {x: 0, y:9}, end: {x: 2, y:9}},
//   {start: {x: 3, y:4}, end: {x: 1, y:4}},
//   {start: {x: 0, y:0}, end: {x: 8, y:8}},
//   {start: {x: 5, y:5}, end: {x: 8, y:2}},
// ];


// Fill horizontally
const coordsToPixels = (horizontalOnly = true) => data.map(line => {
  const minX = Math.min(line.start.x, line.end.x);
  const minY = Math.min(line.start.y, line.end.y);
  
  const maxX = Math.max(line.start.x, line.end.x);
  const maxY = Math.max(line.start.y, line.end.y);
  
  const diffX = maxX - minX;
  const diffY = maxY - minY;
  // If horizontal only and both diffs are above 0 and different - bail
  if(horizontalOnly && diffX > 0 && diffY > 0 && diffX !== diffY) {
    return [];
  }
  
  // Diagonals
  if(diffX > 0 && diffY > 0 && diffX == diffY) {
    // 45 Deg, doesnt matter if we go off diffX or Y, we are only moving at 45 so it's always the same
    return [...new Array(diffX+1)]
    .map((x, index) => ({
      x: line.start.x + ((line.start.x < line.end.x ? 1 : -1) * index), 
      y: line.start.y + + ((line.start.y < line.end.y ? 1 : -1) * index)
    }))
    .flat();
  }

  // Straight lines
  return [...new Array(diffX+1)]
    .map((x, index) => minX+index)
    .map(x => {
      return [...new Array(diffY+1)]
        .map((y, index) => minY+index)
        .map(y => ({x, y}))
    }).flat()

}).flat().reduce((hashmap, cell) => {
  hashmap[`${cell.x}:${cell.y}`] = hashmap[`${cell.x}:${cell.y}`] === undefined ? 1 : (hashmap[`${cell.x}:${cell.y}`]+1)
  return hashmap;
}, {} as Record<string, number>);

const getOverlappingPixels = (lines: Record<string, number>) => Object.keys(lines).filter(key => lines[key] > 1);

const lines = coordsToPixels(true);

// console.log({
//   ["Part 1"]: getOverlappingPixels(lines).length
// })


const mapSize = data
  .map(line => [line.start, line.end])
  .flat()
  .reduce((biggest, nextSet) => ({
    x: Math.max(biggest.x, nextSet.x),
    y: Math.max(biggest.y, nextSet.y)
  }), {x: 0, y:0});

console.log(mapSize);

const diagonalLines = coordsToPixels(false);
// Draw it - test one
for(let y = 0; y < mapSize.x; y++) {
  const line = [];
  for(let x = 0; x < mapSize.y; x++) {
    line.push(diagonalLines[`${x}:${y}`] ? diagonalLines[`${x}:${y}`] : ".")
  } 
  console.log(line.join(""));
}
console.log({
  // overlapping: getOverlappingPixels(diagonalLines),
  ["Part 2"]: getOverlappingPixels(diagonalLines).length
});