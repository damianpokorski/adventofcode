import {data} from "./data/day11.data";
import { Instance as chalkFactory } from "chalk";
const chalk = new chalkFactory();
const sleep = async (ms: number) => await new Promise((resolve, reject) => setTimeout(resolve, ms));
const slowDown = 25;
// const data = [
//   "5483143223",
//   "2745854711",
//   "5264556173",
//   "6141336146",
//   "6357385478",
//   "4167524645",
//   "2176841721",
//   "6882881134",
//   "4846848554",
//   "5283751526",
// ];

const dumbos = data.map(row => row.split("").map(dumbo => parseInt(dumbo)));
(async () => {

  let totalFlashes = 0;
  for (let cycle = 1; cycle <= 1000; cycle++) {
    // Add one energy to all octopuses - Once per cycle
    for (let y = 0; y < dumbos.length; y++) {
      for (let x = 0; x < dumbos[y].length; x++) {
        dumbos[y][x] = dumbos[y][x] + 1;
      }
    }
    // Keep updating while they "pop"
    let updated = true;
    let subcycle = 0;
    let flashedDumbos: { x: number, y: number }[] = [];
    while (updated) {
      updated = false;
      for (let y = 0; y < dumbos.length; y++) {
        for (let x = 0; x < dumbos[y].length; x++) {
          
          // If it's a new flash
          if (dumbos[y][x] > 9 && !flashedDumbos.map((f) => `${f.x}/${f.y}`).includes(`${x}/${y}`)) {
            // Mark as in need of a new cycle
            updated = true;
            // Mark current dumbo as flashed
            flashedDumbos.push({ x, y });
            // Add +1 to the adjecent ones
            // Up
            if (y > 0) dumbos[y - 1][x] += 1;
            // Up Right
            if (y > 0 && x < 9) dumbos[y - 1][x + 1] += 1;
            // Right
            if (x < 9) dumbos[y][x + 1] += 1;
            // Down Right
            if (y < 9 && x < 9) dumbos[y + 1][x + 1] += 1;
            // Down 
            if (y < 9) dumbos[y + 1][x] += 1;
            // Down Left
            if (y < 9 && x > 0) dumbos[y + 1][x - 1] += 1;
            // Left
            if (x > 0) dumbos[y][x - 1] += 1;
            // Up Left
            if (y > 0 && x > 0) dumbos[y - 1][x - 1] += 1;
          }
        }
      }

      // console.log(flashedDumbos);
      subcycle += 1;
      // Draw
      console.clear();
      console.log(`Cycle: ${cycle}, Subcycle: ${subcycle}, Flashes: ${flashedDumbos.length}, Total Flashes: ${totalFlashes}`);
      console.log("");
      // 
      for (let row of dumbos) {
        console.log(row.map(dumbo => {
          if (dumbo > 9) {
            return chalk.bgYellow.black(" ");
          }
          if (dumbo == 9) {
            return chalk.bgGray(dumbo.toString());
          }
          if (dumbo == 0) {
            return chalk.white(dumbo.toString());
          }
          return chalk.gray(dumbo.toString());
        }).join(""))
      }
      console.log("");
      
      // Update flashed dumbos to 0
      for (let flashedDumbo of flashedDumbos) {
        dumbos[flashedDumbo.y][flashedDumbo.x] = 0;
      };
      await sleep(slowDown);
    }
    // Save total flashes
    totalFlashes = totalFlashes + flashedDumbos.length;
    // Part 2: - Uncomment
    if(flashedDumbos.length == 100) {
      console.log(`First cycle all octopuses blink ${cycle}`);
      process.exit();
    }
    await sleep(slowDown);
  }
  console.log(`Total flashes post final cycle: ${totalFlashes}`)
})();