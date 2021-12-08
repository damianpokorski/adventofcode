import { data } from "./data/day2.data";

interface Vector2 {
  depth: number;
  horizontal: number;
};

const Vector2Zero = {
  depth: 0,
  horizontal: 0
} as Vector2;

const addVector2 = (a: Vector2, b: Vector2) => ({
  depth: a.depth + b.depth,
  horizontal: a.horizontal + b.horizontal,
}) as Vector2;

const multiplyVectorValues = (vector: Vector2) => vector.depth * vector.horizontal;

const stringToVector = (input: string): Vector2 => {
  const direction = input.split(" ").shift() || "";
  const value = parseInt(input.split(" ").pop() || "") || 0;
  switch(direction) {
    case "forward":
      return { horizontal: value, depth: 0 } as Vector2;
    case "down":
      return { horizontal: 0, depth: value } as Vector2;
    case "up":
      return { horizontal: 0, depth: value * -1 } as Vector2;
  }
  return {...Vector2Zero};
}


// Part 1
console.log({
  ["Part 1"]: multiplyVectorValues(
    data
      .map(stringToVector)
      .reduce(addVector2, Vector2Zero)
  )
});

// Part 2
interface Vector3 extends Vector2{
  aim: number
};

const result = data
  .map(stringToVector)
  .map(vector => ({...vector, aim: 0}) as Vector3)
  .reduce((previousVector: Vector3, currentVector: Vector3): Vector3 => {
    return {
      depth: previousVector.depth + (currentVector.horizontal * previousVector.aim),
      horizontal: previousVector.horizontal + currentVector.horizontal,
      aim: previousVector.aim + currentVector.depth
    }
  }, {aim: 0, horizontal: 0, depth: 0} as Vector3);

console.log({["Part 2"] : result.horizontal * result.depth});