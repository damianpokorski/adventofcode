import { Instance as Chalk } from "chalk";
import {data} from "./data/day13.data";
const chalk = new Chalk();
const slowDown = 500;
const sleep = async () => await new Promise((resolve, reject) => setTimeout(resolve, slowDown));
// const data = {
//   dots: [
//     [6, 10],
//     [0, 14],
//     [9, 10],
//     [0, 3],
//     [10, 4],
//     [4, 11],
//     [6, 0],
//     [6, 12],
//     [4, 1],
//     [0, 13],
//     [10, 12],
//     [3, 4],
//     [3, 0],
//     [8, 4],
//     [1, 10],
//     [2, 14],
//     [8, 10],
//     [9, 0],
//   ],
//   folds: [    
//     {x: 0, y: 7},
//     {x: 5, y: 0},
//   ]
// };
 
class Sheet {
  public cellEmpty = ".";
  public cellFull = "#";
  public cellCreaseX = "|";
  public cellCreaseY = "-";
  public cells: string[][];
  constructor(public width: number, public height: number) {
    this.cells = [...new Array(height)].map(() => [...new Array(width)].map(() => this.cellEmpty));
  }

  mark(x: number, y: number) {
    this.cells[y][x] = this.cellFull;
    return this;
  }

  creaseVertically(column: number) {
    for(let i = 0; i < this.height; i++) {
      this.cells[i][column] = this.cellCreaseX;
    }
  }
  creaseHorizontally(row: number) {
    for(let i = 0; i < this.width; i++) {
      this.cells[row][i] = this.cellCreaseY;
    }
  }
  foldUp(row: number) {
    // Create half sheet
    const fold = new Sheet(this.width, row);
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        if(this.cells[y][x] == this.cellFull && y < row) {
          fold.mark(x,y);
        }
        if(this.cells[y][x] == this.cellFull && y > row) {
          fold.mark(x,row +((y-row)*-1));
        }
      }
    }
    return fold;
  }


  foldLeft(column: number) {
    // Create half sheet
    const fold = new Sheet(column, this.height);
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        if(this.cells[y][x] == this.cellFull && x < column) {
          fold.mark(x,y);
        }
        if(this.cells[y][x] == this.cellFull && x > column) {
          fold.mark(column +((x-column)*-1),y);
        }
      }
    }
    return fold;
  }

  visibleDots(){
    return this.cells.flat().filter(cell => cell == this.cellFull).length;
  }

  render() {
    console.clear();
    for(let row of this.cells) {
      console.log(row.join(""))
    }
    console.log("");
    console.log(`Total visible dots: ${this.visibleDots}`);
  }
}
let visibleDotsAfterFirstFold = null;
(async () => {
  const maxX = data.dots.map(([x,y]) => x).reduce((a,b) => Math.max(a,b), 0) +1;
  const maxY = data.dots.map(([x,y]) => y).reduce((a,b) => Math.max(a,b), 0) +1;
  // Create 2d array
  let sheet = new Sheet(maxX, maxY);
  await sleep();
  sheet.render();

  // Apply all dots
  for(let dot of data.dots) {
    sheet.mark(dot[0], dot[1]);
  }
  await sleep();
  sheet.render();
  await sleep();

  // Apply all folds
  for(let fold of data.folds) {
    if(fold.x > 0) {
      // Draw crease
      sheet.creaseVertically(fold.x);
      sheet.render();
      await sleep();
      // Fold
      sheet = sheet.foldLeft(fold.x);
      sheet.render();
      await sleep();
      if(visibleDotsAfterFirstFold == null) {
        visibleDotsAfterFirstFold = sheet.visibleDots();
      }
    }
    
    if(fold.y > 0) {
      // Draw crease
      sheet.creaseHorizontally(fold.y);
      sheet.render();
      await sleep();
      // Fold
      sheet = sheet.foldUp(fold.y);
      sheet.render();
      await sleep();
      
      if(visibleDotsAfterFirstFold == null) {
        visibleDotsAfterFirstFold = sheet.visibleDots();
      }
    }
  }

})();