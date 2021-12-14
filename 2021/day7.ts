import { data } from "./data/day7.data";

// test data
// const data = [
//   16, 1, 2, 0, 4, 2, 7, 1, 2, 14
// ];


const minPosition = data.reduce((a, b) => Math.min(a, b), 0);
const maxPosition = data.reduce((a, b) => Math.max(a, b), 0);


const calculateFuel = (crabHorizontalPositions: number[], suggestedPosition: number, fuelCostCalc = (fuelCost: number) => fuelCost) =>
  crabHorizontalPositions
    .map(horizontalPosition => Math.abs(suggestedPosition - horizontalPosition))
    .map(fuelCost => fuelCostCalc(fuelCost))
    .reduce((a, b) => a + b, 0);

const positions = [...new Array(maxPosition - minPosition + 1)]
  .map((x, index) => minPosition + index);

// Part 1
((() => {
  const fuelCostPerTargetPosition = positions
    .map(position => ({ position, fuel: calculateFuel(data, position) }));

  const mostEfficientFuelCostPosition = fuelCostPerTargetPosition
    .slice(1)
    .reduce((a, b) => a.fuel < b.fuel ? a : b, fuelCostPerTargetPosition[0])

  console.log({
    ["Part 1"]: {
      mostEfficientFuelCostPosition
    },
  });
})());

{
  const exponentialFuelCalc = (positionsToMove: number, totalFuelCost: number = 0, previousFuelCost: number = 0): number => {
    while(positionsToMove > 0) {
      positionsToMove -= 1;
      totalFuelCost += (previousFuelCost + 1);
      previousFuelCost += 1;
    }
    return totalFuelCost;
  }

  const fuelCostPerTargetPosition = positions
    .map(position => ({ position, fuel: calculateFuel(data, position, exponentialFuelCalc) }));

  const mostEfficientFuelCostPosition = fuelCostPerTargetPosition
    .slice(1)
    .reduce((a, b) => a.fuel < b.fuel ? a : b, fuelCostPerTargetPosition[0])

  console.log({
    ["Part 2"]: {
      mostEfficientFuelCostPosition
    }
  });
};