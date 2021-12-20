import {data} from "./data/day12.data";
// const data = [
//   // // Test data 1
//   // "start-A",
//   // "start-b",
//   // "A-c",
//   // "A-b",
//   // "b-d",
//   // "A-end",
//   // "b-end",
//   // Test data 2
//   // "dc-end",
//   // "HN-start",
//   // "start-kj",
//   // "dc-start",
//   // "dc-HN",
//   // "LN-dc",
//   // "HN-end",
//   // "kj-sa",
//   // "kj-HN",
//   // "kj-dc",
//   // Test data 3
//   "fs-end",
//   "he-DX",
//   "fs-he",
//   "start-DX",
//   "pj-DX",
//   "end-zg",
//   "zg-sl",
//   "zg-pj",
//   "pj-he",
//   "RW-he",
//   "fs-DX",
//   "pj-RW",
//   "zg-RW",
//   "start-pj",
//   "he-WI",
//   "zg-he",
//   "pj-fs",
//   "start-RW",
// ];

interface Cave {
  id: string,
  links: string[],
  isStart: boolean,
  isEnd: boolean,
  isSmallCave: boolean,
  isLargeCave: boolean
}

const caves = {} as Record<string, Cave>;

// Parse data into caves
for (let link of data) {
  const links = link.split("-");
  for (let cave of links) {
    // If cave does not exist - create
    if (!Object.keys(caves).includes(cave)) {
      caves[cave] = {
        id: cave,
        links: links.filter(link => link !== cave),
        isStart: cave == "start",
        isEnd: cave == "end",
        isLargeCave: cave !== "start" && cave !== "end" && cave == cave.toUpperCase(),
        isSmallCave: cave !== "start" && cave !== "end" && cave == cave.toLowerCase(),
      } as Cave;
    }
    // If cave already exists - Just append the link
    if (Object.keys(caves).includes(cave)) {
      caves[cave].links = [...new Set([...caves[cave].links, ...links.filter(link => link !== cave)])];
    }
  }
}

const floodfill = (startingPoint: string, visitedCaves: string[], allowRevisitingOfASingleSmallCave = false): string[][] => {
  const paths: string[][] = [
    // Add node for this path
    [...visitedCaves, startingPoint]
  ];
  // Stop expanding if we're at the end
  if (caves[startingPoint].isEnd) {
    return paths;
  }
  // Check if previous path is a big or a small cave
  const validPaths = caves[startingPoint].links
    // Filter out any visited small caves
    .filter(link => !visitedCaves
      // Get all small caves which have been visited
      .filter(visitedCave => visitedCave == visitedCave.toLowerCase())
      .includes(link)
    )
    // Prevent going back to start
    .filter(link => link !== "start")

  // Part 2 - Allow revisiting a small cave
  if (allowRevisitingOfASingleSmallCave) {
    // Check only "rejected paths"
    const rejectedSmallCaves = caves[startingPoint].links
      .filter(rejectedPath => !validPaths.includes(rejectedPath))
      .filter(rejectedPath => rejectedPath !== "start")
      .filter(rejectedPath => rejectedPath === rejectedPath.toLowerCase());

    // Only if the route so far did not revisit a single small cave
    const smallVisitedCaves = visitedCaves.filter(visitedCave => visitedCave == visitedCave.toLowerCase());
    if (smallVisitedCaves.length == [...new Set(smallVisitedCaves)].length) {
      // Re-add rejected paths
      for (let rejectedPath of rejectedSmallCaves) {
        validPaths.push(rejectedPath);
      }
    }
  }

  if (validPaths.length > 0) {
    for (let validPath of validPaths) {
      for (let newPath of floodfill(validPath, [...visitedCaves, startingPoint], allowRevisitingOfASingleSmallCave)) {
        paths.push(newPath);
      }
    }
  }
  return paths;
}

const uniqueRoutes = (partTwo: boolean) => floodfill("start", [], partTwo)
  .filter(nodes => caves[nodes[0]].isStart)
  .filter(nodes => caves[nodes[nodes.length - 1]].isEnd)
  .filter(nodes => {
    // Filthy hack to remove random duplicates
    const smallCaves = nodes.filter(node => node.toLowerCase() == node)
      .filter(node => !caves[node].isStart)
      .filter(node => !caves[node].isEnd);
    return (smallCaves.length - [...new Set(smallCaves)].length < 2);
  })

console.log({ 
  ["Part 1"]: uniqueRoutes(false).length, 
  ["Part 2"]: uniqueRoutes(true).length
});