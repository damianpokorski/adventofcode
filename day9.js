const source = require('fs')
    .readFileSync('./day9.input')
    .toString()
    .split("\n")
    .map(line => parseInt(line));

const getPreamble = (index, amount) => source.slice(index-amount, index);
const getPossibleNumbersInPreamble = (index, amount) => getPreamble(index, amount)
    .map((x, x_index) => getPreamble(index, amount)
        .map((y, y_index) => ({addition: x+y, self: x_index == y_index}))
        .filter(result => result.self == false)
        .map(result => result.addition)
    ).reduce((a,b) => [...new Set([...a, ...b])], [])

const previousValuesDontMatch = (preamble) => source
    .slice(preamble, source.length)
    .filter((number, index) => !getPossibleNumbersInPreamble(index+preamble, preamble).includes(number))

const numberWithInvalidPreamble = previousValuesDontMatch(25)[0]
console.log(`Part 1: First numbers which previous 25 numbers did not contain the addition for ${numberWithInvalidPreamble}`);


const addConsecutive = (x) => source
    .map((value, index) => source.slice(index, index + x))
    .filter(numbers => numbers.length == x)
    .map(numbers => ({values: numbers, "addition": numbers.reduce((a,b) => a+b, 0)}))


let possibilityLength = 2;
let matches = []
while (possibilityLength < source.length && matches.length == 0) {
    matches = addConsecutive(possibilityLength)
        .filter(result => result.addition == numberWithInvalidPreamble);
    possibilityLength++;
}
let numbersToAdd = matches[0].values.sort((a,b) => a-b);
console.log(`Part 2: Numbers which require addition ${numbersToAdd.join(", ")}, smallest: ${numbersToAdd[0]}, largest: ${numbersToAdd[numbersToAdd.length-1]}, together: ${numbersToAdd[0] + numbersToAdd[numbersToAdd.length-1]}`);