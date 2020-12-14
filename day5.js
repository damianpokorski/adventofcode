
const source = require('fs').readFileSync('./day5.input').toString().split("\n");

const binaryPartitioning = (items, bools) => {
    let range = [...Array(items)].map((x, index) => index);
    for(let i = 0; i < bools.length; i++) {
        range.splice(bools[i] ? 0 : (range.length / 2), range.length / 2);
    }
    return range.pop();
}

const toSeatID = (code) => {
    const rowFlags = [...code.substr(0, code.length - 3)].map(x => x == "B");
    const columnFlags = [...code.substr(code.length - 3, 3)].map(x => x == "R");

    return (binaryPartitioning(128, rowFlags) * 8) + binaryPartitioning(8, columnFlags);
}

console.log([
    'FBFBBFFRLR',
    'BFFFBBFRRR',
    'FFFBBBFRRR',
    'BBFFBBFRLL'
].map(x => toSeatID(x)))
// return;
const part1highestBoardingPassId = source.map(code => toSeatID(code)).reduce((a,b) => Math.max(a,b), 0);
console.log(`Highest seat ID around: ${part1highestBoardingPassId}`);

seatIdsSorted = source.map(code => toSeatID(code)).sort((a,b) => a-b);
const part2mySeatId = seatIdsSorted.filter((seatId, index) => seatIdsSorted[index+1] == (seatId+2) || seatIdsSorted[index-1] == (seatId-2))
console.log(`My seat ID: ${part2mySeatId}`);