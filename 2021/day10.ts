import {data} from "./data/day10.data";

// const data = [
//   "[({(<(())[]>[[{[]{<()<>>",
//   "[(()[<>])]({[<{<<[]>>(",
//   "{([(<{}[<>[]}>{[]{[(<()>",
//   "(((({<>}<{<{<>}{[]{[]{}",
//   "[[<[([]))<([[{}[[()]]]",
//   "[{[{({}]{}}([{[{{{}}([]",
//   "{<[[]]>}<{[{[{[]{()[[[]",
//   "[<(<(<(<{}))><([]([]()",
//   "<{([([[(<>()){}]>(<<{{",
//   "<{([{{}}[<[[[<>{}]]]>[]]",
// ];

const opening = ["(", "[", "{", "<"];
const closing = [")", "]", "}", ">"];
const points = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
} as Record<string, number>;
const pointsPart2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
} as Record<string, number>;
const errors = {
  ")": 0,
  "]": 0,
  "}": 0,
  ">": 0,
} as Record<string, number>;
const autocompletes = [];
for(let line of data) {
  const currentlyOpened = [];
  let validLine = true;
  for(let character of line) {
    if(opening.includes(character)) {
      currentlyOpened.push(character);
    }
    if(closing.includes(character)) {
      let valid = true;
      // Closing when there's nothing to close
      if(currentlyOpened.length == 0) {
        valid = false;
      }
      // Check if it's valid close character
      if(valid && closing.indexOf(character) !== opening.indexOf(currentlyOpened[currentlyOpened.length-1])) {
        valid = false;
      }

      // If invalid - break and add to score
      if(!valid) {
        console.log(`${line}: Expected ${closing[opening.indexOf(currentlyOpened[currentlyOpened.length-1])]}, but found ${character} instead`)
        errors[character] = errors[character] + 1;
        validLine = false;
        break;
      }
      // If its valid remove from stack
      currentlyOpened.pop();
    }
  }

  if(currentlyOpened.length > 0 && validLine) {
    let autocomplete = [];
    let autocompleteScore = 0;
    for(let opened of currentlyOpened.reverse()) {
      autocomplete.push(closing[opening.indexOf(opened)]);
      // Calculate the score
      autocompleteScore = autocompleteScore * 5;
      autocompleteScore = autocompleteScore + (pointsPart2[closing[opening.indexOf(opened)]] || 0);
    }
    autocompletes.push({completion: autocomplete.join(""), score: autocompleteScore});
    console.log(`Autocompleted: ${line} with ${autocomplete.join("")}, score: ${autocompleteScore}`);
  }
}

const score = Object.keys(points)
  .map(character => (errors[character] || 0) * (points[character] || 0))
  .reduce((a,b) => a+b,0)


console.log({["Part 1"]: score});
console.log({["Part 2"]: autocompletes.map(complete => complete.score).sort((a,b) => a-b)[Math.floor(autocompletes.length/2)]});