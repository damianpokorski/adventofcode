const source = require('fs')
    .readFileSync('./day7.input')
    .toString()
    .split("\n")
    .map(rule => ({
        color: rule.split(" contain ")[0]
            .split("bags").join("")
            .split("bag").join("")
            .trim(),
        contains: rule
            .split(" contain ")[1]
            .split(", ").map(x => x.replace(".", ""))
            .filter(x => x !== "no other bags")
            .map(x => ({
                "number": parseInt(x.split(" ")[0]), 
                "color": x.split(" ")
                    .splice(1, x.split(" ").length -1)
                    .join(" ")
                    .split("bags").join("")
                    .split("bag").join("")
                    .trim()
            }))
    }))

const canBeWrappedIn = (color) => {
    let acceptableColours = [
        ...new Set(source
            .filter(bag => bag.contains.filter(inner => inner.color == color).length > 0)
            .map(x => x.color))
    ];
    let recursedColours = [
        ...new Set(acceptableColours.map(subcolor => canBeWrappedIn(subcolor)).flat())
    ];
    return [...new Set([...acceptableColours, ...recursedColours])];
}


const bagsCounterRecursive = (color) => {
    return  source
        .find(x => x.color == color).contains
        .map(bag => bag.number + (bag.number * bagsCounterRecursive(bag.color)))
        .reduce((a,b) => a+b, 0)
}

console.log(`Part 1: Shiny goldd back can be contained in ${canBeWrappedIn("shiny gold").length} different bags`);
console.log(`Part 2: Shiny gold has to contained  ${ bagsCounterRecursive("shiny gold") } individual bags`);