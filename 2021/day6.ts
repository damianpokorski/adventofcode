
import { data } from "./data/day6.data";

// test data
// const data = [
//   3,4,3,1,2
// ];


const cycle = (inputLanternFish: number[], inputCyclesLeft = 1): number => {

  const lanternFishHashed: Record<string, number> = {
    "-1": 0,
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
  };

  // Apply lantern fish from source
  for(let fishInCycle of inputLanternFish) {
    lanternFishHashed[fishInCycle.toString()] = lanternFishHashed[fishInCycle.toString()]+1;
  }
  while(inputCyclesLeft > 0) {
    // New babies are born from 0
    let newGeneration = lanternFishHashed["0"];

    // Tick down a day all entries
    lanternFishHashed["0"] = lanternFishHashed["1"];
    lanternFishHashed["1"] = lanternFishHashed["2"];
    lanternFishHashed["2"] = lanternFishHashed["3"];
    lanternFishHashed["3"] = lanternFishHashed["4"];
    lanternFishHashed["4"] = lanternFishHashed["5"];
    lanternFishHashed["5"] = lanternFishHashed["6"];
    lanternFishHashed["6"] = lanternFishHashed["7"];
    lanternFishHashed["7"] = lanternFishHashed["8"];
    
    // New babies
    lanternFishHashed["8"] = newGeneration;

    // Same amount of parents goes back to 6 as new babies
    lanternFishHashed["6"] = lanternFishHashed["6"] + newGeneration;
    inputCyclesLeft = inputCyclesLeft - 1;
  }
  return Object
    .values(lanternFishHashed)
    .reduce((a,b) => a+b, 0);
}

console.log({
  ["Part 1"]: cycle(data, 80),
  ["Part 2"]: cycle(data, 256),
});