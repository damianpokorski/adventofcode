import { loadDay } from "./_";

const solve = (rows: string[], spelledOutLetters= false) => rows.map(row => {

    // Regex check for digit
    const hasNumber = (x:string) => /\d/g.test(x);

    // Extract digits from string
    const getDigit = (x:string) => x.replace(/[^\d]*/g, " ").split(" ").filter(x => x);

    // Swap one -> 1 etc
    const swapspelledoutdigit = (x:string) => spelledOutLetters ? x.split("one").join("1")
        .split("two").join("2")
        .split("three").join("3")
        .split("four").join("4")
        .split("five").join("5")
        .split("six").join("6")
        .split("seven").join("7")
        .split("eight").join("8")
        .split("nine").join("9") : x;

    // Matches storage
    let firstNumber = null;
    let lastNumber = null;

    // Iterate from both ends
    for (let i = 0; i < row.length; i++) {
        // Build substrings from both sides based on current index
        const start = swapspelledoutdigit(row.substring(0, i));
        const end = swapspelledoutdigit(row.substring(row.length - i - 1));


        // Grab match if new substring has one
        if (firstNumber == null && hasNumber(start)) {
            firstNumber = getDigit(start);
        }

        if (lastNumber == null && hasNumber(end)) {
            lastNumber = getDigit(end);
        }
    }

    // Combine two digits, fallback on other digit in case of only 1 present
    return parseInt([firstNumber ?? lastNumber, lastNumber ?? firstNumber].join(""), 10);
}).reduce((a, b) => a + b, 0);

console.log({
    part1: solve(loadDay('day1.data'), false),
    part2: solve(loadDay('day1.data'), true)
});