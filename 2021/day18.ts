export {};
// import {data} from "./data/day18.data";
let debug = false;
const data = [
  // // Example 1
  {
    input: "[[[[[9,8],1],2],3],4]",
    expected: "[[[[0,9],2],3],4]"
  },
  // Example 2
  {
    input: "[7,[6,[5,[4,[3,2]]]]]",
    expected: "[7,[6,[5,[7,0]]]]"
  },
  // Example 3
  {
    input: "[[6,[5,[4,[3,2]]]],1]",
    expected: "[[6,[5,[7,0]]],3]"
  },
  // Example 4
  {
    input: "[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]",
    expected: "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"
  }
];

const integers = [0,1,2,3,4,5,6,7,8,9].map(x => x.toString());
function reduceSnailMath(raw: string) {
  let left = [] as string[];
  let right = raw.split("");
  // Keep moving characters from left to right
  let depth = 0;
  let currentValues = [] as number[];
  while(right.length > 0) {
    let currentCharacter = right.splice(0, 1).join("");
    
    if(debug) {
      console.log("====");
      console.log(`Current Character: ${currentCharacter}`);
      console.log(`Left: ${left.join("")}`);
      console.log(`Right: ${right.join("")}`);
      console.log(`Depth: ${depth}`);
    }

    if(currentCharacter == "[") {
      depth++;
      // Opening new pair, resetting current values
      currentValues = [];
    } else if(currentCharacter == "]") {
      depth--;
      // Closed pair, resetting current values
      currentValues = [];
    } else if(integers.includes(currentCharacter)) {
      currentValues.push(parseInt(currentCharacter));
      if(debug) {
        console.log(`Read values: ${currentValues}`);
      }
      
      if(currentValues.length == 2 && depth > 4) {
        if(debug) {
          console.log(`Explosion time!`);
        }
        // Find remove last 3 characters from left
        const removedCharacters = left.splice(left.length-3, left.length).join("");
        if(debug) {
          console.log(`Removing left opening bracket and values`);
          console.log(`${removedCharacters}`);
        }
        // Determine whether the pair that explode is within left or right side
        const isLeftSide = left[left.length-1] !== ",";

        // Remove value from right
        currentCharacter = "";

        // Slice of closing bracket on the right
        right.splice(0, 1);

        // Find nearest leftmost value and add left to it
        // Go backwards through left array
        let leftValueReplaced = false;
        for(let i = left.length; i > 0; i--) {
          if(integers.includes(left[i])) {
            const valueToReplace = parseInt(left[i]);
            const newValue = currentValues[0] + valueToReplace;

            // If value if over 10 - immediately explode it 
            left[i] = newValue.toString();
            leftValueReplaced = true;
            break;
          }
        }
        // If value has not been replaced - insert 0
        if(!leftValueReplaced) {
          left.push("0")
        };
        // Go forwards through right side and add replace nearest value
        let rightValueReplaced = false;
        for(let i = 0; i < right.length; i++) {
          if(integers.includes(right[i])) {
            const valueToReplace = parseInt(right[i]);
            const newValue = currentValues[1] + valueToReplace;
            
            // If value if over 10 - immediately explode it 
            right[i] = newValue.toString();
            rightValueReplaced = true;
            break;
          }
        }
        // If there's no value to replace, insert 0
        if(!isLeftSide) {
          right.unshift("0");
        }
      }
    }
    // Append new character back to the loop
    left.push(currentCharacter);
  }
  return left.join("");
}
for(let puzzle of data) {
  let homeworkRaw = puzzle.input;
  let previousResult = reduceSnailMath(homeworkRaw);
  let unchangedResult = reduceSnailMath(previousResult);
  // Keep going while the changes are happening
  while(previousResult !== unchangedResult) {
    previousResult = unchangedResult;
    unchangedResult = reduceSnailMath(previousResult);
  }
  console.log("==========");
  console.log(`Puzzle input:    ${puzzle.input}`);
  console.log(`Expected output: ${puzzle.expected}`);
  console.log(`Reduced output:  ${unchangedResult}`);
  console.log(`Status:          ${unchangedResult == puzzle.expected ? "Success" : "Failure"}`);
}