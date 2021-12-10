
import { data } from "./data/day4.data";

// // Test data
// const data = {
//   draw: [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1],
//   boards: [
//     [
//       22, 13, 17, 11, 0,
//       8, 2, 23, 4, 24,
//       21, 9, 14, 16, 7,
//       6, 10, 3, 18, 5,
//       1, 12, 20, 15, 19,
//     ], [
//       3, 15, 0, 2, 22,
//       9, 18, 13, 17, 5,
//       19, 8, 7, 25, 23,
//       20, 11, 10, 24, 4,
//       14, 21, 16, 12, 6,
//     ], [
//       14, 21, 17, 24, 4,
//       10, 16, 15, 9, 19,
//       18, 8, 23, 26, 20,
//       22, 11, 13, 6, 5,
//       2, 0, 12, 3, 7,
//     ]
//   ]
// };

// Part 1

// Assuming square boards
const convertArrayToBingoBoard = (values: number[]) => [...new Array(Math.sqrt(values.length))]
  .map((x, index) => values.slice(index * Math.sqrt(values.length), (index+1) * Math.sqrt(values.length)))

const hasBingo = (board: number[][], draws: number[]) => {
  // Horizontal check
  if(board.some(row => row.every(number => draws.includes(number)))) {
    return true;
  }
  // Flip board around then apply same check as above
  const flippedBoard = board.map((row, rowIndex) => row.map((value, columnIndex) => board[columnIndex][rowIndex]));
  if(flippedBoard.some(row => row.every(number => draws.includes(number)))) {
    return true;
  }
  return false;
}

const calculateBoardScore = (board: number[][], draws: number[]) => {
  return board
    // Flatten the board
    .flat(2)
    // Filter numbers that are not in the bingo
    .filter(value => !draws.includes(value))
    // Sum
    .reduce((sum, value) => sum+value, 0) * draws[draws.length - 1];
}

// Convert arrays into bingo boards
const boards = data.boards.map(convertArrayToBingoBoard);

// Part 1
{
  const drawPlayback: number[] = [];
  let winner: undefined|number[][]= undefined;
  while(winner == undefined ) {
    // Draw next number
    drawPlayback.push(data.draw[drawPlayback.length]);
    console.log(`Drew: ${drawPlayback[drawPlayback.length-1]}`);
  
    // 
    const winningBoards = boards.filter(board => hasBingo(board, drawPlayback));
    if(winningBoards.length > 0) {
      winner = winningBoards[0];
    }
  }
  console.log({
    ["Part 1"]: {
      winnerScore: calculateBoardScore(winner, drawPlayback)
    }
  });
}

// Part 2 - Find the last winning board
const drawPlayback2: number[] = [];
let lastWinner: undefined|number[][]= undefined;
let lastWinnerScore = 0;

let unresolvedBoards = data.boards.map(convertArrayToBingoBoard);
while(drawPlayback2.length < data.draw.length) {
  // Draw next number
  drawPlayback2.push(data.draw[drawPlayback2.length]);
  console.log(`Drew: ${drawPlayback2[drawPlayback2.length-1]}`);

  // 
  const winningBoard = unresolvedBoards
    .find(board => hasBingo(board, drawPlayback2));

  if(winningBoard !== undefined) {
    // New winner
    if(JSON.stringify(winningBoard) !== JSON.stringify(lastWinner)) {
      lastWinner = winningBoard;
      // Remove winning boards from the circulation
      unresolvedBoards = unresolvedBoards.filter((board) => !hasBingo(board, drawPlayback2));
      // Calculate the score at winning moment
      lastWinnerScore = calculateBoardScore(lastWinner, drawPlayback2);
      // Announce the winner
      console.log(`New Winner! Winner: ${winningBoard}, remaining boards: ${unresolvedBoards.length}, Score: ${lastWinnerScore}`);
    }
  }
}
console.log({
  ["Part 2"]: {
    lastWinnerScore: lastWinnerScore
  }
});
