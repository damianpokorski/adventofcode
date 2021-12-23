
import { Instance as Chalk } from "chalk";
const chalk = new Chalk();

let debug = false;
export const data = [
  {
    label: "Example 1",
    input: ["[[[[[9,8],1],2],3],4]"],
    expected: "[[[[0,9],2],3],4]",
  },
  {
    label: "Example 2",
    input: ["[7,[6,[5,[4,[3,2]]]]]"],
    expected: "[7,[6,[5,[7,0]]]]"
  },
  {
    label: "Example 3",
    input: ["[[6,[5,[4,[3,2]]]],1]"],
    expected: "[[6,[5,[7,0]]],3]"
  },
  {
    label: "Example 4",
    input: ["[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]"],
    expected: "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"
  },
  {
    label: "Example 5",
    input: ["[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]"],
    expected: "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]"
  },
  {
    label: "Example 6",
    input: [
      "[1,1]",
      "[2,2]",
      "[3,3]",
      "[4,4]",
    ],
    expected: "[[[[1,1],[2,2]],[3,3]],[4,4]]"
  },
  {
    label: "Example 7",
    input: [
      "[1,1]",
      "[2,2]",
      "[3,3]",
      "[4,4]",
      "[5,5]",
    ],
    expected: "[[[[3,0],[5,3]],[4,4]],[5,5]]"
  },
  {
    label: "Example 8",
    input: [
      "[1,1]",
      "[2,2]",
      "[3,3]",
      "[4,4]",
      "[5,5]",
      "[6,6]",
    ],
    expected: "[[[[5,0],[7,4]],[5,5]],[6,6]]"
  },
  {
    label: "Example 9.1",
    input: [
      "[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
      "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
    ],
    expected: "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]"
  },
  {
    label: "Example 9.2",
    input: [
      "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]",
      "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
    ],
    expected: "[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]"
  },
  {
    label: "Example 9.3",
    input: [
      "[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]",
      "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
    ],
    expected: "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]"
  },
  {
    label: "Example 9.4",
    input: [
      "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]",
      "[7,[5,[[3,8],[1,4]]]]",
    ],
    expected: "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]"
  },
  {
    label: "Example 9.5",
    input: [
      "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]",
      "[[2,[2,2]],[8,[8,1]]]"
    ],
    expected: "[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]"
  },
  {
    label: "Example 9.6",
    input:[
      "[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]",
      "[2,9]"
    ],
    expected: "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]",
    maxCycles: 20000 // 8
  },
  {
    label: "Example 9.7",
    input: [
      "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]",
      "[1,[[[9,3],9],[[9,0],[0,7]]]]"
    ],
    expected: "[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]"    
  },
  {
    label: "Example 9.8",
    input: [
      "[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]",
      "[[[5,[7,4]],7],1]"
    ],
    expected: "[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]"
  },
  {
    label: "Example 9.9",
    input: [
      "[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]",
      "[[[[4,2],2],6],[8,7]]"
    ],
    expected: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
  },
  {
    label: "Example 9.*",
    input: [
      "[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
      "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
      "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
      "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
      "[7,[5,[[3,8],[1,4]]]]",
      "[[2,[2,2]],[8,[8,1]]]",
      "[2,9]",
      "[1,[[[9,3],9],[[9,0],[0,7]]]]",
      "[[[5,[7,4]],7],1]",
      "[[[[4,2],2],6],[8,7]]",
  ],
    expected: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
  }
];

const integers = [0,1,2,3,4,5,6,7,8,9].map(x => x.toString());
interface ReduceResult {
  result: string;
  exploded: boolean;
  split: boolean;
}
// let idCounter = 0;
// class Tree<T> {
//   // id: number = idCounter++;
//   constructor(
//     public left: T|Tree<T>|null = null,
//     public right: T|Tree<T>|null = null, 
//   ) {

//   }
//   // Pair array into tree
//   static from<T>(value: T|any[]) {
//     const tree = new Tree();
//     const [left, right] = value as any[];
//     tree.left = Array.isArray(left) ? Tree.from<T>(left) : (left||null);
//     tree.right = Array.isArray(right) ? Tree.from<T>(right) : (right||null);
//     return tree;
//   }
//   canTraverseLeft() {
//     // Can be traversed into
//     return Object.keys(this.left).includes("left");
//   }
//   canTraverseRight() {
//     // Can be traversed into
//     return Object.keys(this.right).includes("left");
//   }
//   // Create tree
//   traverseUntil(parentStack:Tree<T>[] = [], depth = 0, condition = (node: Tree<T>, parentStack:Tree<T>[] = [], depth: number):boolean => false) {
//     // Evaluate condition if we're looking at a value
//     if(!this.canTraverseLeft()) {
//       console.log(`Got ${this.left as T}, depth ${depth}`);
//       // If condition is met, stop the traversing
//       if(condition(this, parentStack, depth)) {
//         return;
//       }
//     } else {
//       console.log(`Traversing deeper left, ${depth}`);
//       (this.left as Tree<T>).traverseUntil([...parentStack, this], depth+1, condition);
//     }
//     // Evaluate condition if we are looking at a value
//     if(!this.canTraverseRight()) {
//       console.log(`Got ${this.right as T}, depth: ${depth}`);
//       // If condition is met, stop the traversing
//       if(condition(this, parentStack, depth)) {
//         return;
//       }
//     } else {
//       console.log(`Traversing deeper right, ${depth}`);
//       (this.right as Tree<T>).traverseUntil([...parentStack, this], depth+1, condition);
//     }
//   }
//   serialize(): any {
//     return [
//       this.canTraverseLeft() ? (this.left as Tree<T>).serialize() : this.left as T,
//       this.canTraverseRight() ? (this.right as Tree<T>).serialize() : this.right as T,
//     ]
//   }
// }

// function reduceSnailMath(raw: string, attemptExplodeOnly = false): ReduceResult {
//   const root = Tree.from<number>(JSON.parse(raw));
//   console.log(JSON.stringify(root, null, 2));
//   let parentStack = [root];
//   // Find nodes to explode
//   let rootBeforeTraversing = JSON.stringify(root.serialize());

//   root.traverseUntil([], 0, (node: Tree<number>, parentStack: Tree<number>[], depth) => {
//     // We're only checking against value pairs
//     if(node.canTraverseLeft() || node.canTraverseRight()) {
//       return false;
//     }

//     // If we're under depth 4 or more - explosion time
//     if(depth >= 4) {
//       // Explosion logic
//       console.log(parentStack);
//       // Go through parents upwards
//       let parentWithValueOnLeft = null as Tree<number>;
//       for(let parentIndex = parentStack.length-1; parentIndex >= 0; parentIndex--) {
//         if(!parentStack[parentIndex].canTraverseLeft()) {
//           console.log("Found a value node on left!");
//           parentWithValueOnLeft = parentStack[parentIndex];
//           break;
//         }
//       }
//       // Go through parents upwards
//       let parentWithValueOnRight = null as Tree<number>;
//       for(let parentIndex = parentStack.length-1; parentIndex >= 0; parentIndex--) {
//         if(!parentStack[parentIndex].canTraverseRight()) {
//           console.log(`Found a value node on right!${parentStack[parentIndex].right}`);
//           parentWithValueOnRight = parentStack[parentIndex];
//           // Update value
//           parentWithValueOnRight.right = (parentWithValueOnRight.right as number) + (node.right as number); 
//           break;
//         }
//       }
//       return true;
//     }
//     return false;
//   });
//   // Check if we have managed to explode anyting
//   let rootAfterTraversing = JSON.stringify(root.serialize());
//   if(rootBeforeTraversing !== rootAfterTraversing) {
//     return {
//       exploded: true,
//       split: false,
//       result: rootAfterTraversing
//     }
//   }
//   return {
//     exploded: false,
//     split: false,
//     result: ""
//   };
// }

function reduceSnailMath(raw: string, attemptExplodeOnly = false): ReduceResult {
  let left = [] as string[];
  let right = raw.split("");
  // Keep moving characters from left to right
  let depth = 0;
  let currentValues = [] as number[];
  // Check if we can explode first - if so that's the route we return
  if(attemptExplodeOnly == false) {
    const explodeOnlyAttempt = reduceSnailMath(raw, true);
    // If exploding succeeded - return that result
    if(explodeOnlyAttempt.exploded) {
      // Debug only - announces how many nested explosions will follow
      if(debug) {
        let howManyExplodesExpected = 1;
        let explosionCycleResult = reduceSnailMath(explodeOnlyAttempt.result, true);
        while(explosionCycleResult.exploded) {
          explosionCycleResult = reduceSnailMath(explosionCycleResult.result, true)
          howManyExplodesExpected++;
        }
        console.log(`Expecting ${howManyExplodesExpected} explosions`);
      } 
      return explodeOnlyAttempt;
    };
    if(explodeOnlyAttempt.split) {
      console.log(["Could no longer explode", explodeOnlyAttempt]);
      process.exit();
    }
  }
  while(right.length > 0) {
    let currentCharacter = right.splice(0, 1).join("");

    if(currentCharacter == "[") {
      depth++;
      // Opening new pair, resetting current values
      currentValues = [];
    } else if(currentCharacter == "]") {
      depth--;
      // Closed pair, resetting current values
      currentValues = [];
    } 
    else if(currentCharacter.split("").every(digit => integers.includes(digit))) {
      // Check if the following character is not also a digit - if it is consume it too
      while(integers.includes(right[0])) {
        currentCharacter += right.splice(0,1);
      }
      currentValues.push(parseInt(currentCharacter));
      if(debug) {
        console.log(`Read values: ${currentValues}`);
      }
      // Explosion logic
      if(attemptExplodeOnly && currentValues.length == 2 && depth > 4) {
        if(debug) {
          console.log(`Explosion time!`);
        }
        let removedCharacters = [];
        // Keep removing characters from left
        while(true) {
          removedCharacters.push(left.pop());
          if(removedCharacters.includes("[")) {
            break;
          }
        };
        if(debug) {
          console.log(`Removing left opening bracket and values`);
          console.log(`${removedCharacters.join("")}`);
        }
        // Determine whether the pair that explode is within left or right side
        const isLeftSide = left[left.length-1] !== ",";

        // Remove value from right
        currentCharacter = "";

        // Slice of closing bracket on the right
        if(right[0] == "]") {
          right.splice(0, 1);
        }

        // Find nearest leftmost value and add left to it
        // Go backwards through left array
        let foundLeftSide = false;
        for(let i = left.length-1; i >= 0; i--) {
          // // First last digit occurence
          if(integers.includes(left[i-1])) {
            const leftStart = [];
            let leftmostDigits = [];
            const leftEnd = [];
            let end = i;
            // Keep going from I to find out where string ends
            let start = i;
            while(start > 0 && integers.includes(left[start-1])) {
              start--;
            }
            
            // Group left side into 3 sections
            for(let index = 0; index < left.length; index++) {  
              if(index < start){
                leftStart.push(left[index]);
              } else if(index >= start && index < end ){
                leftmostDigits.push(left[index]);
              } else {
                leftEnd.push(left[index])
              }
            }

            // Add digit values
            const leftmostDigitsNew = (parseInt(leftmostDigits.join("")) + currentValues[0]).toString().split("");
            

            // console.log({
            //   leftStart:leftStart.join(""),
            //   leftDigits: leftmostDigits.join(""),
            //   leftDigitsNew: leftmostDigitsNew,
            //   leftEnd: leftEnd.join("")
            // });
            
            // Reconstruct left side
            left = (leftStart.join("") + leftmostDigitsNew.join("") + leftEnd.join("")).split("");
            foundLeftSide = true;
            break;
          }
        }
        // If value has not been replaced - insert 0
        if(isLeftSide) {
          left.push("0")
        };
        // Go forwards through right side and add replace nearest value
        for(let i = 0; i < right.length; i++) {
          if(integers.includes(right[i])) {
            let digits = [right[i]];
            // Find more consecutive digits
            while(integers.includes(right[i+1])) {
              digits.push(right.splice(i+1, 1).join(""));
            }
            const valueToReplace = parseInt(digits.join(""));
            const newValue = currentValues[1] + valueToReplace;
            
            // If value if over 10 - immediately explode it 
            right[i] = newValue.toString();
            break;
          }
        }
        // If there's no value to replace, insert 0
        if(!isLeftSide) {
          right.unshift("0");
        }

        // console.log({
        //   left: left.join(""),
        //   current: currentCharacter,
        //   right: right.join("")
        // })
        // Return - and mark as exploded
        return {
          exploded: true,
          split: false,
          result: `${left.join("")}${currentCharacter}${right.join("")}`,
        } as ReduceResult;
      }
      // Splitting logic - only attempt if we have determined that explode cannot be done
      if(attemptExplodeOnly == false && currentValues.filter(value => value > 9).length > 0){
        const isLeft = currentValues[0] > 9;
        const valueToSplit = currentValues.find(value => value > 9);
        let newPairLeft = Math.floor(valueToSplit / 2);
        let newPairRight = Math.ceil(valueToSplit / 2);
        return {
          split: true,
          exploded: false,
          result: `${left.join("")}[${newPairLeft},${newPairRight}]${right.join("")}`
        } as ReduceResult;
      }
    }
    // Append new character back to the loop
    left.push(currentCharacter);
    // Make sure left is an array of 1 character each
    left = left.join("").split("");
  }
  return {
    exploded: false,
    split: false,
    result: left.join("")
  } as ReduceResult;
}

//
const styleResult = (rawInput: string) => {
  let source = rawInput.split("");
  let character = "";
  let left = [];
  let depth = 0;
  let explosionHighlight = []
  while(source.length > 0) {
    character = source.splice(0,1).join();
    if(character == "[") {
      depth++;
      if(depth > 4) {
        // look forward - if we're looking forward to check if we're within a value pair
        let next = "";
        // Consume until closed
        while(source[0] !== "]") {
          next += source.splice(0,1).join("");
        }
        // Value pair 
        if(next.split(",").length == 2) {
          character += chalk.bgYellowBright.black.bold(next);
        } else {
          // Put characters back
          source = [...next.split(""), ...source];
        }
      }
    } else if(character == "]") {
      depth --;
    }
    if(integers.includes(character)) {
      // keep consuming numbers into characters while numbers as in sequence
      while(integers.includes(source[0])) {
        character += source.splice(0,1).join("");
      }
      if(parseInt(character) > 9) {
        character = chalk.cyan.bold(character);
      }
    }
    left.push(character);
  }
  return left.join("")
}


// Iterate through puzzles
for(let puzzle of data) {
  console.log("")
  console.log(chalk.gray(` ${puzzle.label} `.padStart(24, "=").padEnd(36, "=")));
  console.log(`Puzzle input:    `);
  for(let input of puzzle.input) {
    console.log(` + ${chalk.bold(styleResult(input))}`)
  }
  // Keep going while the changes are happening
  let additionsToPerform = [...puzzle.input];
  let previousResult = null;
  while(additionsToPerform.length > 0) {
    let nextAddition = additionsToPerform.splice(0, 1).join("");
    // If there's a previous result - wrap it into next one as a pair
    if(previousResult !== null) {
      nextAddition = `[${previousResult},${nextAddition}]`;
      console.log(`Reducing together with next pair :`);
      console.log(`    ${styleResult(nextAddition)}`)
    }
    // Keep reducing until no more left
    let reduceResult:ReduceResult = null;
    let maxCycles =puzzle.maxCycles || 20000;
    let cycles = 0
    while((cycles++) < maxCycles && (reduceResult == null || reduceResult.exploded || reduceResult.split)) {
      let state = reduceResult == null ? nextAddition : reduceResult.result;
      reduceResult = reduceSnailMath(state);
      

      //
      let prefix = ""
      console.log(`${
        reduceResult.exploded == false && reduceResult.split == false 
        ? "No change:      " 
        : (reduceResult.exploded 
          ? (""+chalk.bgYellowBright.black.bold("Exploded") + ":") 
          : ""+chalk.bgCyan("Splitted") +": ")} ${styleResult(reduceResult.result)}`);
    }
    previousResult = reduceResult.result;
  }
  console.log("")
  console.log(`${chalk.bgGray.white.bold("Expected output")}: ${puzzle.expected}`);
  console.log(`Reduced output:  ${previousResult}`);
  console.log(`Status:          ${previousResult == puzzle.expected ? chalk.bgGreen.white.bold("Success") : chalk.bgRed.white.bold("Failure")}`);
  if(previousResult !== puzzle.expected) {
    break;
  }
}