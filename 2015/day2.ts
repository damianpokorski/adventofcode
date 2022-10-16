import { data as raw} from './data/2.data';

const parse = (row: string) => {
  const [x,y,z] = row.split("x").map(x => parseInt(x));
  return {x,y,z};
}

const paperRequired = (entry: {x: number, y: number, z: number}) => {
  const xy = entry.x * entry.y;
  const yz = entry.y * entry.z;
  const zx = entry.z * entry.x;

  return ((xy + yz + zx) * 2) + Math.min(xy, yz, zx);
}

const ribbonRequired = (entry: {x: number, y: number, z: number}) => {
  const [a,b] = [entry.x, entry.y, entry.z].sort((a,b) => a-b).slice(0, 2);
  return a+a+b+b+ (entry.x * entry.y * entry.z);
}

const firstStar = (data: string[]) => {
  return data
    .map(parse)
    .map(paperRequired)
    .reduce((a,b) => a+b, 0);
}
const secondStar = (data: string[]) => {
  return data
    .map(parse)
    .map(ribbonRequired)
    .reduce((a,b) => a+b, 0)
}

console.log({
  firstAnswer: firstStar(raw),
  secondAnswer: secondStar(raw),
});