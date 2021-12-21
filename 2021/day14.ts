// import {data, dataTemplate} from "./data/day14.data";
import * as fs from "fs";
const data = [
  [["C", "H"], "B"],
  [["H", "H"], "N"],
  [["C", "B"], "H"],
  [["N", "H"], "C"],
  [["H", "B"], "C"],
  [["H", "C"], "B"],
  [["H", "N"], "C"],
  [["N", "N"], "C"],
  [["B", "H"], "H"],
  [["N", "C"], "B"],
  [["N", "B"], "B"],
  [["B", "N"], "B"],
  [["B", "B"], "N"],
  [["B", "C"], "B"],
  [["C", "C"], "N"],
  [["C", "N"], "C"],
];
let dataTemplate = ["N", "N", "C", "B"];
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


const chunkSize = 1024 * 1024 * 8;
const cycleFilename = (cycle: number) => `data/cache/day14.cycle.${cycle}`;
const getChunk = async (filename, chunkIndex: number): Promise<string> => {
  // Open a stream
  const stream = fs.createReadStream(
    filename, {
    highWaterMark: 1 * chunkSize,
    encoding: 'utf8'
  });
  return (new Promise((resolve, reject) => {
    let readChunks = -1;
    // On chunk being read
    stream.on('data', function (chunk) {
      // Add chunk id
      readChunks++;
      // If we find the chunk we're looking for
      if (readChunks == chunkIndex) {
        // Close strem, wrap promise
        stream.close(() => resolve(chunk.toString()));
      }
    }).on('end', function () {
      resolve("");
    });
  }));
};

const append = (filename: string, data: string) => {
  fs.appendFileSync(filename, data, {
    encoding: "utf-8"
  })
}
function getCharacters(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

const findMostCommonAndLeastCommonElementsAfterXCycles = async (maxCycles: number = 10) => {
  let template = [...dataTemplate].join("");
  // Create cycle 0
  append(cycleFilename(0), template);
  for (let cycle = 1; cycle <= maxCycles; cycle++) {
    console.log(`Cycle #${cycle}`)
    let outputTemplate = "";
    let finalSuffix = "";
    // Get previous cached file length
    const templateLength = getCharacters(cycleFilename(cycle-1));
    // Start by loading two chunks
    let chunksLoaded = (await getChunk(cycleFilename(cycle-1), 0)) + (await getChunk(cycleFilename(cycle-1), 1)); 
    // Iterate through pairs
    let loadedChunkIndex = 0;
    // Append buffer
    let appendBuffer = "";
    const appendWithBuffer = (filename: string, data: string, forceSave = false) => {
      appendBuffer += data;
      if(forceSave || appendBuffer.length > chunkSize) {
        append(filename, appendBuffer);
        appendBuffer = "";
      }
    }
    for (let pairIndex = 1; pairIndex < templateLength; pairIndex++) {
      const pair = [
        chunksLoaded[(pairIndex - 1) % chunkSize],
        chunksLoaded[((pairIndex - 1) % chunkSize)+1],
      ];

      // Check if there's an insertion step
      const [a, b] = pair;

      // Merge A back into template
      appendWithBuffer(cycleFilename(cycle), a);

      // Set final suffix - Most iterations skip inserting B (since its A in next set), expect for final
      finalSuffix = b;

      // Find if there's an insertion and add it
      // const insertion = links.find(link => link.link_a == a && link.link_b == b)
      const insertion = linksHashMap[a] !== undefined ? (linksHashMap[a][b] !== undefined ? linksHashMap[a][b] : undefined) : undefined;
      if (insertion) {
        // appendWithBuffer(cycleFilename(cycle), insertion.result);
        appendWithBuffer(cycleFilename(cycle), insertion);
      }

      // Load two chunks into cache if we're over
      let relevantChunksToLoad = Math.floor(pairIndex / chunkSize);
      if(loadedChunkIndex !== relevantChunksToLoad) {
        chunksLoaded = (await getChunk(cycleFilename(cycle-1), relevantChunksToLoad)) + (await getChunk(cycleFilename(cycle-1), relevantChunksToLoad))
        loadedChunkIndex = relevantChunksToLoad;
      }
    }

    // Add final character
    appendWithBuffer(cycleFilename(cycle), finalSuffix, true);
    console.log(`Post insertion length: ${getCharacters(cycleFilename(cycle))}`);
    console.log("-----");
    // Swap templates
    template = outputTemplate;
  }

  const occurenceOfElements = {} as Record<string, number>;
  let chunkIndex = -1;
  while(true) {
    chunkIndex++;
    let chunk = await getChunk(cycleFilename(maxCycles), chunkIndex);
    // if there's no chunk to read
    if(chunk == "") {
      break;
    }
    for (let element of chunk) {
      occurenceOfElements[element] = (occurenceOfElements[element] || 0) + 1
    }
  }

  console.log(occurenceOfElements);

  const leastCommonElement = Object
    .entries(occurenceOfElements)
    .reduce((leastCommon, [key, value]) => leastCommon.value < value ? leastCommon : { key, value }, { key: "", value: 10000000000 });

  const mostCommonElement = Object
    .entries(occurenceOfElements)
    .reduce((mostCommon, [key, value]) => mostCommon.value > value ? mostCommon : { key, value }, { key: "", value: 0 });

  return {
    leastCommonElement,
    mostCommonElement
  };
}
(async () => {
  const part1 = await findMostCommonAndLeastCommonElementsAfterXCycles(10);
  console.log({
    ["Part 1"]: part1.mostCommonElement.value - part1.leastCommonElement.value,
  });
  
  const part2 = await findMostCommonAndLeastCommonElementsAfterXCycles(40);
  console.log({
    ["Part 1"]: part1.mostCommonElement.value - part1.leastCommonElement.value,
    ["Part 2"]: part2.mostCommonElement.value - part2.leastCommonElement.value
  });
})();
