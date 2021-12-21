import {data, dataTemplate} from "./data/day14.data";
// const data = [
//   [["C", "H"], "B"],
//   [["H", "H"], "N"],
//   [["C", "B"], "H"],
//   [["N", "H"], "C"],
//   [["H", "B"], "C"],
//   [["H", "C"], "B"],
//   [["H", "N"], "C"],
//   [["N", "N"], "C"],
//   [["B", "H"], "H"],
//   [["N", "C"], "B"],
//   [["N", "B"], "B"],
//   [["B", "N"], "B"],
//   [["B", "B"], "N"],
//   [["B", "C"], "B"],
//   [["C", "C"], "N"],
//   [["C", "N"], "C"],
// ];
// let template = ["N", "N", "C", "B"];
const links = data.map(([[link_a, link_b], result]) => ({
  link_a,
  link_b,
  result: result as string
}));
console.log(links);

const findMostCommonAndLeastCommonElementsAfterXCycles = (maxCycles:number = 10) => {
  let template = [...dataTemplate];
  for(let cycle =1 ; cycle <= maxCycles; cycle++) {
    console.log(`Template: ${template.join("")}`)
    console.log(`Cycle #${cycle}`)
    // Generate pairs
    const pairs = [];
    for(let pairIndex = 1; pairIndex < template.length; pairIndex++) {
      pairs.push([
        template[pairIndex-1],
        template[pairIndex],
      ]);
    }
    // console.log(`Pairs: ${pairs.map(([a,b]) => a +"/"+b).join(", ")}`);
    // Reset template
    template = [];
    let finalSuffix = "";
    for(let pair of pairs) {
      // Check if there's an insertion step
      const [a,b] = pair;
      
      // Merge A back into template
      template.push(a);
  
      // Set final suffix - Most iterations skip inserting B (since its A in next set), expect for final
      finalSuffix = b;
  
      // Find if there's an insertion and add it
      const insertion = links.find(link => link.link_a == a && link.link_b == b);
      if(insertion) {
        template.push(insertion.result);
      }
    }
    template.push(finalSuffix);
    console.log(`Post insertion: ${template.join("")}, length: ${template.length}`);
    console.log("-----");
  }
  
  const occurenceOfElements = template.reduce((counters, element) => ({
    ...counters,
    [element]: Object.keys(counters).includes(element) ? counters[element] + 1 : 1
  }), {} as Record<string, number>)
  console.log(occurenceOfElements);
  
  const leastCommonElement = Object
    .entries(occurenceOfElements)
    .reduce((leastCommon, [key, value]) => leastCommon.value < value ? leastCommon : {key, value}, {key: "", value: 10000000000});
  
  const mostCommonElement = Object
    .entries(occurenceOfElements)
    .reduce((mostCommon, [key, value]) => mostCommon.value > value ? mostCommon : {key, value}, {key: "", value: 0});
  
    return {
    leastCommonElement,
    mostCommonElement
  };
}
const part1 = findMostCommonAndLeastCommonElementsAfterXCycles(10);
console.log({
  ["Part 1"]: part1.mostCommonElement.value - part1.leastCommonElement.value
});

// Part one - subtract the least common element from the most common
// console.log
