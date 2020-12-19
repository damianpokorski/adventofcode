const source = require('fs')
    .readFileSync('./day8.input')
    .toString()
    .split("\n")
    .map(line => ({
        "operation": line.split(" ")[0], 
        "value": parseInt(line.split(" ")[1].replace("+", ""))
    }));

const processBootCode = (operations) => {
    let executedOperations = [];
    let operationIndex = 0;
    let accumulator = 0;
    let previousOperationIndex = 0;
    while(operationIndex >= 0 && operationIndex < operations.length && !executedOperations.includes(operationIndex)) {
        executedOperations.push(operationIndex);
        previousOperationIndex = operationIndex;
        switch(operations[operationIndex].operation) {
            case "jmp":
                operationIndex += operations[operationIndex].value;
            break;
            case "acc":
                accumulator += operations[operationIndex].value;
            default:
                operationIndex ++;
            break;
        }
    }
    return {
        "accumulator": accumulator,
        "operationIndex": operationIndex,
        "previousOperationIndex": previousOperationIndex,
        "executedOperations": executedOperations.sort((a,b) => b-a)
    }
}


console.log(`Part 1 - Highest accumulator before boot sequence encounters a loop ${processBootCode(source).accumulator}`);

for(let i = 0; i < source.length; i++) {
    let duplicate = JSON.parse(JSON.stringify(source));
    if(duplicate[i].operation == "nop") {
        duplicate[i].operation = "jmp";
    }
    if(duplicate[i].operation == "jmp") {
        duplicate[i].operation = "nop";
    }
    let result = processBootCode(duplicate);
    
    if(source.length == result.operationIndex) {
        console.log(`Part 2 - Swapping single jump or nop instruction, swapped instruction at ${i} from ${source[i].operation} to ${duplicate[i].operation}, achieved accumulator of ${result.accumulator}`);
        break;
    }
}