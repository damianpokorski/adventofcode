const fs = require('fs');
const treesEncountered = (function(x = 3, y = 1){
    // currently it's in Y / X coords, would probs need transposing
    const map = fs.readFileSync('./day3.input').toString().split("\n").map(x => [...x]);
    
    // Maps x/y coords against y/x 2d array
    const isTree = (target_x, target_y) => map[target_y][(target_x % map[0].length)] == '#';
    let currentY = 0;
    let currentX = 0;
    let trees = 0;

    while(currentY < map.length) {
        trees += isTree(currentX, currentY) ? 1 : 0;
        currentY += y;
        currentX += x;
    }

    return trees;
});
// Part one answer
console.log(`Trees encountered on the first slope: ${treesEncountered(3, 1)}`);

// Part two answer
const part2result = [
    {x: 1, y:1},
    {x: 3, y:1},
    {x: 5, y:1},
    {x: 7, y:1},
    {x: 1, y:2},
].map(pair => treesEncountered(pair.x, pair.y)).reduce((a, b) => a * b, 1);
console.log(`Multiplied number of trees encountered in 2nd part: ${part2result}`);

