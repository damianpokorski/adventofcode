// let source = require('fs')
//     .readFileSync('./day10.input')
//     .toString()
//     .split("\n")
//     .map(line => parseInt(line))
//     .sort((a,b) => a-b);

// let source = `16
// 10
// 15
// 5
// 1
// 11
// 7
// 19
// 6
// 12
// 4`
// .split("\n")
// .map(line => parseInt(line))
// .sort((a,b) => a-b);

let source = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`
.split("\n")
.map(line => parseInt(line))
.sort((a,b) => a-b);


const min = 0;
const max = source[source.length-1]+3;
source = [min, ...source, max];

const getGroups = (basesource) => {
    let groups = basesource.reduce((differences,value, index) => {
        const difference = Math.abs(differences.previousValue - value);

        const item = {value, difference, index};
        if(Object.keys(differences).includes(difference.toString())) {
            differences[difference.toString()].push(item);
        } else {
            differences[difference.toString()] = [item];
        }

        differences.previousValue = value;
        return differences;
    }, {"previousValue": 0});
    delete groups.previousValue;
    return groups;
}

const groups = getGroups(source);

console.log([(groups["1"].length), (groups["3"].length), (groups["1"].length) * (groups["3"].length)]);



const isValidChain = (basesource) => {
    return basesource[0] == min && basesource[basesource.length-1] == max && Object.keys(getGroups(basesource)).every(x => parseInt(x) <= 3)
}



const quickValidate = (basesource) => {
    for(let i = 0; i < basesource.length-2; i++) {
        if((basesource[i+1] -  basesource[i]) > 3) {
            return false;
        }
    }   
    return true;
}


const getDifferencesOffset = (basesource) => {
    return basesource.map((value, index) => {
        // Exclude first and last elements
        if(index == 0 || index == basesource.length-1) {
            return -1;
        }

        if (index+1 == basesource.length) {
            return 0;
        }
        return [(basesource[index+1] -  value), index];
    })
}

const getDifferencesOffsetFor = (basesource, difference) => getDifferencesOffset(basesource).filter(pair => pair[0] == difference).map(x => x[1]);

// console.log(quickValidate(source, 1));
// return;

let recursivelyRemoveOne = (source, minIndex = 0) => {
    // Create array which is missing at least one element from current source (keeping first and last element)
    let options = [];
    // let groups = getGroups(source);
    
    // Only items with difference of 1 and 2 can be considered for removals
    let removals = [
        ...getDifferencesOffsetFor(source, 1),
        ...getDifferencesOffsetFor(source, 2)
    ].filter(x => minIndex <= x);
    // for(let i = 0; i < source.length-2; i++) {
    //     if((source[i+1] -  source[i]) < 3) {
    //         removals.push(source[i]);
    //     }
    // }   
    // console.log(removals);

    if (!quickValidate(source)) {
        return options;
    }

    for(let i = 0; i < removals.length; i++) {
        let newOption = [...source];
        newOption.splice(removals[i], 1);
        // console.log(newOption);
        if(quickValidate(newOption)) {
            options.push(newOption);
            const newOptions = recursivelyRemoveOne(newOption, removals[i]);
            for(let j = 0; j < newOptions.length; j++) {
                options.push(newOptions[j]);
            }
        }
    }

    return options;
}


console.log([...new Set([source, ...recursivelyRemoveOne(source)].map(x => JSON.stringify(x)))].map(x => JSON.parse(x)).length)