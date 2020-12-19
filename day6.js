
const source = require('fs').readFileSync('./day6.input').toString();

const amountOfPositiveAnswersToEachQuestionInEachGroup = source
    .split("\n\n")
    .map(x => x.split("\n").join(""))
    .map(x => [...x].filter(x => /^[a-z]{1}$/))
    .map(x => [...new Set(x)])
    .map(x => x.length)
    .reduce((a,b) => a+b, 0);

const amountOfPositiveAnswersToEachQuestionByEveryoneInGroup = source
    .split("\n\n")
    .map(x => x.split("\n"))
    .map(group => ({
        "people": group.length, 
        answers: group.map(x => [...new Set(x)])})
    ).map(group => ({
        ...group, 
        allAnswers: [...new Set(group.answers.flat())]
    })).map(group => group.allAnswers
        .filter(answer => group.answers.every(person => person.includes(answer)))
    ).map(x => x.length)
    .reduce((a,b) => a+b, 0);

console.log(`Part 1 Answer: ${amountOfPositiveAnswersToEachQuestionInEachGroup}`);
console.log(`Part 2 Answer: ${amountOfPositiveAnswersToEachQuestionByEveryoneInGroup}`);