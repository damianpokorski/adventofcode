const fn = (numbers, search) => {
    for(var i = 0; i < numbers.length; i++){
        for(var j = Math.min(i+1, numbers.length); j < numbers.length; j++){
            for(var k = Math.min(j+1, numbers.length); k < numbers.length; k++){
                if((numbers[i] + numbers[j] + numbers[k]) == search) {
                    return (numbers[i] * numbers[j] * numbers[k]);
                }
            }
        }
    }
    return -1;
}
const numbers =  require('fs').readFileSync('./day1.input').toString().split("\n").map(x => parseInt(x));
console.log(fn(numbers, 2020));