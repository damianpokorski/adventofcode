import { data } from "./data/day8.data";
interface IClockRead {
  uniquePatterns: string[];
  values: string[];
};

// test data
// const data = [
//   // Small test
//   // [["acedgfb", "cdfbe", "gcdfa", "fbcad", "dab", "cefabd", "cdfgeb", "eafb", "cagedb", "ab"], ["cdfeb", "fcadb", "cdfeb", "cdbaf"]],
//   // // Bigger test
//   [["be", "cfbegad", "cbdgef", "fgaecd", "cgeb", "fdcge", "agebfd", "fecdb", "fabcd", "edb"], ["fdgacbe", "cefdb", "cefbgd", "gcbe"]],
//   [["edbfga", "begcd", "cbg", "gc", "gcadebf", "fbgde", "acbgfd", "abcde", "gfcbed", "gfec"], ["fcgedb", "cgb", "dgebacf", "gc"]],
//   [["fgaebd", "cg", "bdaec", "gdafb", "agbcfd", "gdcbef", "bgcad", "gfac", "gcb", "cdgabef" ], ["cg", "cg", "fdcagb", "cbg"]],
//   [["fbegcd", "cbd", "adcefb", "dageb", "afcb", "bc", "aefdc", "ecdab", "fgdeca", "fcdbega" ], ["efabcd", "cedba", "gadfec", "cb"]],
//   [["aecbfdg", "fbg", "gf", "bafeg", "dbefa", "fcge", "gcbea", "fcaegb", "dgceab", "fcbdga" ], ["gecf", "egdcabf", "bgf", "bfgea"]],
//   [["fgeab", "ca", "afcebg", "bdacfeg", "cfaedg", "gcfdb", "baec", "bfadeg", "bafgc", "acf" ], ["gebdcfa", "ecba", "ca", "fadegcb"]],
//   [["dbcfg", "fgd", "bdegcaf", "fgec", "aegbdf", "ecdfab", "fbedc", "dacgb", "gdcebf", "gf" ], ["cefg", "dcbef", "fcge", "gbcadfe"]],
//   [["bdfegc", "cbegaf", "gecbf", "dfcage", "bdacg", "ed", "bedf", "ced", "adcbefg", "gebcd" ], ["ed", "bcgafe", "cdgba", "cbgef"]],
//   [["egadfb", "cdbfeg", "cegd", "fecab", "cgb", "gbdefca", "cg", "fgcdab", "egfdb", "bfceg" ], ["gbdfcae", "bgc", "cg", "cgb"]],
//   [["gcafb", "gcf", "dcaebfg", "ecagb", "gf", "abcdeg", "gaef", "cafbge", "fdbac", "fegbdc" ], ["fgae", "cfgab", "fg", "bagce"]],
// ];

const clocks: IClockRead[] = data.map(([a, b]) => ({
  uniquePatterns: a.map(characters => [...characters].sort().join("")),
  values: b.map(characters => [...characters].sort().join(""))
}));


/**
 * 
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
 */

const segmentDisplayLookUp = [
  { value: "0", on: [..."abcefg"] },
  { value: "1", on: [..."cf"] },
  { value: "2", on: [..."acdeg"] },
  { value: "3", on: [..."acdfg"] },
  { value: "4", on: [..."bcdf"] },
  { value: "5", on: [..."abdfg"] },
  { value: "6", on: [..."abdefg"] },
  { value: "7", on: [..."acf"] },
  { value: "8", on: [..."abcdefg"]},
  { value: "9", on: [..."abcdfg"]},
].map(entry => ({ ...entry, on: entry.on.sort().join("")}));

// 
const uniqueCountMatches = (clock: IClockRead) => {
  // Starting point
  return clock.uniquePatterns
    .filter(uniquePattern => [2,3,4,7].includes(uniquePattern.length))
    .map(uniquePattern => {
        const match = segmentDisplayLookUp.find(segment => segment.on.length == uniquePattern.length);
        if(match === undefined) {
          return null;
        }
        return {
          value: match.value,
          correct: [...match.on].sort().join(""),
          confusing: [...uniquePattern].sort().join(""),
        };
    })
    .filter((result): result is {
      value: string;
      correct: string;
      confusing: string;
    } => result !== null)
};

// Initial cheatsheet
const cheatSheet = segmentDisplayLookUp.reduce((counters, set) => {
  for (let segment of [...set.on]) {
    counters[segment] = counters[segment] !== undefined ? counters[segment] + 1 : 1;
  }
  return counters;
}, {} as Record<string, number>);

// Part 2 - Detective work
const result = clocks.map(clock => {
  // 
  const pairs = uniqueCountMatches(clock)
    .map(match => ({ ...match, correct: match.correct, confusing: match.confusing }))
    .reduce((merge, match) => ({ ...merge, [match.value]: match }), {}) as Record<string, {
      value: string;
      correct: string;
      confusing: string;
    }>;

  // 
  const letterCounts = [...clock.uniquePatterns.join("")].reduce((counters, letter) => {
    counters[letter] = counters[letter] !== undefined ? counters[letter] + 1 : 1;
    return counters;
  }, {} as Record<string, number>);

  // Initial pass
  const wiresSolved = {
    "a": [...pairs["7"].confusing].filter(wireConnectedTo7 => {
      return !pairs["1"].confusing.includes(wireConnectedTo7);
    }).join(""),
    "b": Object.keys(letterCounts).find(letterCountWire => letterCounts[letterCountWire] == 6) || null,
    "c": null as null|string|string[]|undefined,
    "d": null as null|string|string[]|undefined,
    "e": Object.keys(letterCounts).find(letterCountWire => letterCounts[letterCountWire] == 4) || null,
    "f": Object.keys(letterCounts).find(letterCountWire => letterCounts[letterCountWire] == 9) || null,
    "g": null as null|string|string[]|undefined,
  }

  // After initial pass some of the more refined guesses can be made
  wiresSolved["c"] = Object.keys(letterCounts).find(letterCountWire => letterCounts[letterCountWire] == 8 && letterCountWire !== wiresSolved.a);
  wiresSolved["d"] = Object.keys(letterCounts).filter(letterCountWire => letterCounts[letterCountWire] == 7 && [...pairs["4"].confusing].includes(letterCountWire));
  wiresSolved["g"] = Object.keys(letterCounts).filter(letterCountWire => letterCounts[letterCountWire] == 7 && ![...pairs["4"].confusing].includes(letterCountWire)); 

  // Unjumble the wires
  const valuesUnjumbled = clock.values.map(value => {
    return [...value]
      .map(wireInvalid => {
        return Object.entries(wiresSolved)
        .filter(([key, value]) => {
          return value == wireInvalid;
        }).map(([key, value]) => key);
      }).flat()
      .sort()
      .join("");
  });
  const result = valuesUnjumbled
    .map(wires => {
      return segmentDisplayLookUp.find(display => [...display.on].sort().join("") == [...wires].sort().join(""))?.value;
    })
    .filter((valid): valid is string => typeof valid === "string")
    .join("")
    
    return result;
}).map(result => parseInt(result)).reduce((a,b) => a+b, 0)


console.log({
  ["Part 1"]: clocks.map((clock) => (clock.values).filter(value => [2,3,4,7].includes(value.length)).length).reduce((a,b) => a+b, 0),
  ["Part 2"]: result
});
