import { loadDay, consoleColors, unique, getRowElements, getColumnElements, compareArrays, createX } from './_';
import { Permutation, CartesianProduct } from 'js-combinatorics';

const solve = (rows: string[], part1 = true) => {
  return rows
    .map((row, rowId) => {
      let [itemsRaw, checksRaw] = row.split(' ');

      // Part 2 boogaloo
      if (part1 == false) {
        itemsRaw = createX(5, itemsRaw).join('?');
        checksRaw = createX(5, checksRaw).join(',');
      }

      const items = itemsRaw.split('');
      const checksums = checksRaw.split(',').map((x) => parseInt(x, 10));
      // Grab the known sums
      const unknowns = items.filter((spring) => spring == '?').length;
      const damaged = items.filter((spring) => spring == '#').length;
      const operational = items.filter((spring) => spring == '.').length;
      // Calcuate how much we damaged items we're expecting
      const expectedDamaged = checksums.reduce((a, b) => a + b, 0);
      const damagedUnknowns = expectedDamaged - damaged;
      const operationalUknowns = unknowns - damagedUnknowns;

      const validate = (value: string, expected: number[]) => {
        return compareArrays(
          value
            .split('.')
            .filter((x) => x.length > 0)
            .map((x) => x.length),
          expected
        );
      };

      // console.log({
      //   items,
      //   checksums,
      //   unknowns,
      //   damaged,
      //   operational,
      //   expectedDamaged,
      //   damagedUnknowns,
      //   operationalUknowns,
      //   validation: validate(itemsRaw, checksums)
      // });

      // Iterate permutations
      const validPermutations = [] as string[];
      let permutationCounter = 0;
      // const source = new Permutation([
      //   ...createX(damagedUnknowns, '#'),
      //   ...createX(operationalUknowns, '.')
      // ]);
      const input = [...createX(unknowns, '#.')];
      const source = new CartesianProduct(...input);
      for (const permutation of source) {
        const permutatedString = [...items.map((item) => (item == '?' ? (permutation.shift() as string) : item))].join(
          ''
        );

        if (validate(permutatedString, checksums) && !validPermutations.includes(permutatedString)) {
          // console.log(permutatedString);
          validPermutations.push(permutatedString);
        }
        permutationCounter += 1;
        if (permutationCounter % 100000 == 0) {
          console.log(permutationCounter);
        }
      }
      console.log(`Progress: ${Math.round(((rowId + 1) / rows.length) * 100)}%`);
      console.log({ result: validPermutations.length });
      return validPermutations.length;
    })
    .reduce((a, b) => a + b, 0);
  // Render
  return 0;
};

console.log({
  part1: solve(loadDay('day12.data'))
  // // part2: solve(loadDay('day12.data'))
});
