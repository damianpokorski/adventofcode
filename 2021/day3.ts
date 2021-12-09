import { data } from "./data/day3.data";

// Test data
// const data = [
//   "00100",
//   "11110",
//   "10110",
//   "10111",
//   "10101",
//   "01111",
//   "00111",
//   "11100",
//   "10000",
//   "11001",
//   "00010",
//   "01010",
// ].map(binaryString => [...binaryString].map(binaryValue => parseInt(binaryValue)));

// Part 1

// Calculate most common bit for each column
const getGamma = (rowsOfBinaryValues: number[][]) => rowsOfBinaryValues
  .reduce((sum, rowOfBinaryValues) => sum
    .map((binaryValueSum, binaryValueHorizontalIndex) => binaryValueSum + rowOfBinaryValues[binaryValueHorizontalIndex])
  , data[0].map(x => 0))
  .map(sumOfBinaryValues => sumOfBinaryValues >= (rowsOfBinaryValues.length/2) ? 1 : 0)

const getEpsilon = (rowsOfBinaryValues: number[][]) => getGamma(rowsOfBinaryValues)
  .map(binaryValue => binaryValue == 1 ? 0 : 1);

const binaryArrayToDecimal = (rowsOfBinaryValues: number[]) => parseInt(rowsOfBinaryValues.map(binaryValue => binaryValue.toString()).join(""), 2);

// Convert to decimal
const gamma = getGamma(data);
const epsilon = getEpsilon(data);

// Part 1 - 
const gammaDecimal = binaryArrayToDecimal(gamma);
const epsilonDecimal = binaryArrayToDecimal(epsilon);

// Calculate fuel consumption of the submarine
const powerConsumption = gammaDecimal * epsilonDecimal;

// Solution
console.log({
  ["Part 1"]: {
    gamma, epsilon, gammaDecimal, epsilonDecimal, powerConsumption
  }
});

// Part 2
// Starting with most popular binary value
const getRating = (rowsOfBinaryValues: number[][], criterialEvaluator: (rowsOfBinaryValues: number[][]) => (0 | 1)[]) => {
  const criteria = [criterialEvaluator(rowsOfBinaryValues)[0]];
  
  // Follow gamma matching in order to get oxygen Generate rating
  let dataMatchingCriteria = [...rowsOfBinaryValues];
  
  while(dataMatchingCriteria.length !==1) {
    dataMatchingCriteria = dataMatchingCriteria
      .filter(binaryValues => criteria
        .every((criteriaValue,criteriaIndex)  => binaryValues[criteriaIndex] == criteriaValue)
      );
  
    // Calculate next gamma character
    criteria.push(criterialEvaluator(dataMatchingCriteria)[criteria.length]);
  }
  return binaryArrayToDecimal(dataMatchingCriteria[0]);
};

const getOxygenGeneratorRating = (rowsOfBinaryValues: number[][]) => getRating(rowsOfBinaryValues, getGamma);
const getCO2ScrubberRating = (rowsOfBinaryValues: number[][]) => getRating(rowsOfBinaryValues, getEpsilon);
console.log({
  ["Part 2"]: {
    OxygenGeneratorRating: getOxygenGeneratorRating(data),
    CO2ScrubberRating: getCO2ScrubberRating(data),
    Answer: getOxygenGeneratorRating(data) * getCO2ScrubberRating(data)
  }
});