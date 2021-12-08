import { data } from "./data/day1.data";

// Part 1
const measurementDeltas = data
  .map((measurement, index, values) => (index == 0 ? 0 : (measurement - values[index - 1])));

console.log({ ["Part 1"] :{
  increased: measurementDeltas.filter(value => value > 0).length,
  decreased: measurementDeltas.filter(value => value < 0).length,
  na: measurementDeltas.filter(value => value == 0).length,
}});

// Part 2
const slidingMeasurements = data
  // Convert to sliding of 3
  .map((measurement, index, values) => [
    measurement,
    (index + 1) >= values.length ? 0 : (data[index+1]),
    (index + 2) >= values.length  ? 0 : (data[index+2]),
  ].reduce((carry, current) => carry + current, 0))
  .map((measurement, index, values) => (index == 0 ? 0 : (measurement - values[index - 1])))

console.log({ ["Part 2"] :{
  increased: slidingMeasurements.filter(value => value > 0).length,
  decreased: slidingMeasurements.filter(value => value < 0).length,
  na: slidingMeasurements.filter(value => value == 0).length,
}});