const fs = require('fs');
(function(){
    const items = fs.readFileSync('./day2.input').toString().split("\n");
//     const items = `1-3 a: abcde
// 1-3 b: cdefg
// 2-9 c: ccccccccc`.toString().split("\n");
    const itemsParsed = items.map(item => ({
        min: parseInt(item.split(" ")[0].split("-")[0]),
        max: parseInt(item.split(" ")[0].split("-")[1]),
        character: item.split(" ")[1].replace(":", ""),
        password: item.split(" ")[2],
        passwordArray: Array.from(item.split(" ")[2]),
        passwordCoutners: Array.from(item.split(" ")[2]).reduce((totals, current) => {
            if(current in totals) {
                totals[current] = totals[current]+1;
            } else {
                totals[current] = 1
            }
            return totals;
        }, {}),
    }));

    const part1condition = itemsParsed.filter(item => item.character in item.passwordCoutners && item.passwordCoutners[item.character] >= item.min && item.passwordCoutners[item.character] <= item.max);
    console.log(`Valid passwords part 1: ${part1condition.length}`);

    const part2condition = itemsParsed.map(item => ({
        character: item.character,
        password: item.password,
        min: item.min,
        max: item.max,
        firstCharacter:  item.password.substring(item.min-1, item.min),
        // firstCharacterValid: item.password.substring(item.min-1, item.min) == item.character,
        secondCharacter: item.password.substring(item.max-1, item.max),
        // secondCharacterValid: item.password.substring(item.max-1, item.max) == item.character,
        bothValid: (item.password.substring(item.min-1, item.min) == item.character) && (item.password.substring(item.max-1, item.max) == item.character)
        })
    ).filter(item => item.firstCharacterValid || item.secondCharacterValid).filter(item => !item.bothValid);
    console.log(`Valid passworts part 2: ${part2condition.length}`);
    // console.log(part2condition);

})();