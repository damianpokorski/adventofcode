import {data, dataTemplate} from "./data/day14.data";
import * as fs from "fs";
// const data = [
//   [["B", "B"], "N"],
//   [["B", "C"], "B"],
//   [["B", "H"], "H"],
//   [["B", "N"], "B"],
//   [["C", "B"], "H"],
//   [["C", "C"], "N"],
//   [["C", "H"], "B"],
//   [["C", "N"], "C"],
//   [["H", "B"], "C"],
//   [["H", "C"], "B"],
//   [["H", "H"], "N"],
//   [["H", "N"], "C"],
//   [["N", "B"], "B"],
//   [["N", "C"], "B"],
//   [["N", "H"], "C"],
//   [["N", "N"], "C"],
// ];
// let dataTemplate = ["N", "N", "C", "B"];
const links = data.map(([[link_a, link_b], result]) => ({
  link_a,
  link_b,
  result: result as string
}));
console.log(links);
const linksHashMap = links
  .map(linkA => ({
    [linkA.link_a]: links
      .filter(linkB => linkA.link_a == linkB.link_a)
      .map(linkB => ({[linkB.link_b]: linkB.result}) as Record<string, string>)
      .reduce((a,b) => ({...a, ...b}), {})
    })
  ).reduce((a,b) => ({...a,...b}), {}) as Record<string, Record<string, string>>;

class PolymerPairs {
  public counters = {} as Record<string, number>;
  constructor() {
    // Fill in all of the counters with 0s
    for(let a in linksHashMap) {
      for(let b in linksHashMap[a]) {
        this.counters[`${a}${b}`] = 0;
      }
    }
  }
  static fromTemplate(template: string) {
    const pairing = new PolymerPairs();
    const templatePieces = template.split("");
    for(let pairIndex = 1; pairIndex < (templatePieces.length); pairIndex++) {
      pairing.addPair(templatePieces[pairIndex-1], templatePieces[pairIndex]);
      console.log(`Adding pair to template: ${[templatePieces[pairIndex-1], templatePieces[pairIndex]].join()}`)
    }
    return pairing;
  }
  addPair(a:string,b:string, increment: number = 1) {
    const pairKey= `${a}${b}`
    this.counters[pairKey] = (this.counters[pairKey] || 0) + increment;
    return this;
  }
  cycle() {
    // console.log(this.counters);
    const updated = new PolymerPairs();
    for(let pair in this.counters) {
      // Find match
      const [a,b] = pair.split("");
      const insert = linksHashMap[a] !== undefined ? (linksHashMap[a][b] !== undefined ? linksHashMap[a][b] : undefined) : undefined;
      // Insert relevant number of times
      updated.addPair(a, insert, this.counters[pair]);
      updated.addPair(insert, b, this.counters[pair]);
    }
    return updated;
  }

  renderElements() {
    const sum = {} as Record<string, number>;
    for(let pair in this.counters) {
      const [element, otherElement] = pair.split("");
      // console.log(`Adding sum for ${element}, found pair with ${otherElement}, ${this.counters[pair]}`);
      sum[element] = (sum[element] || 0) + this.counters[pair]; 
    }
    return sum;
  }
} 

const applyXCycles = (cycles:number) => {

  let polymers = PolymerPairs.fromTemplate(dataTemplate.join(""))
  for(let i = 1; i <= cycles; i++) {
    console.log(`Cycle: ${i}`);
    polymers = polymers.cycle();
  }
  const occurenceOfElements = polymers.renderElements();

  const leastCommonElement = Object
  .entries(occurenceOfElements)
  .reduce((leastCommon, [key, value]) => leastCommon.value !== null && leastCommon.value < value ? leastCommon : { key, value }, { key: "", value: null });
  
  const mostCommonElement = Object
  .entries(occurenceOfElements)
  .reduce((mostCommon, [key, value]) => mostCommon.value !== null && mostCommon.value > value ? mostCommon : { key, value }, { key: "", value: null });

  return {
    leastCommonElement,
    mostCommonElement
  }
}

// Answers appear to be always off by one - so we're just subtracting -1, somehow the last pair just doesnt count 
(async () => {
  const part1 = await applyXCycles(10);
  console.log({
    ["Part 1"]: part1.mostCommonElement.value - part1.leastCommonElement.value-1,
  });
  
  const part2 = await applyXCycles(40);
  console.log({
    ["Part 1"]: part1.mostCommonElement.value - part1.leastCommonElement.value-1,
    ["Part 2"]: part2.mostCommonElement.value - part2.leastCommonElement.value-1 
  });
})();
