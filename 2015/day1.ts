import { data as raw} from './data/1.data';

const firstStar = (data: string[]) => {
  let level = 0;
  for(let i = 0; i < data.length; i++) {
    level += data[i] == '(' ? 1 : -1
  }
  return level;
}
const secondStar = (data: string[]) => {
  let level = 0;
  for(let i = 0; i < data.length; i++) {
    level += data[i] == '(' ? 1 : -1
    if(level == -1) {
      return i+1;
    }
  }
  return -1;
}

console.log({
  firstAnswer: firstStar(raw),
  secondAnswer: secondStar(raw),
});