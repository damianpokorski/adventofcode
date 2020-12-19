
const source = require('fs').readFileSync('./day4.input').toString();
const data = source.split("\n\n").map(passportData => 
    passportData
        .split("\n")
        .join(" ")
        .split(' ')
        .map(pair => ({key: pair.split(':')[0], val: pair.split(':')[1]}))
        .reduce((combined, pair) => {
            combined[pair.key] = pair.val;
            return combined;
        }, {})
);

const fields = [
    {
        field: 'byr',
        description:  'Birth Year',
        required: true,
        predicate: (byr) => parseInt(byr) >= 1920 && parseInt(byr) <= 2002
    },{
        field: 'iyr',
        description:  'Issue Year',
        required: true,
        predicate: (iyr) => parseInt(iyr) >=2010 && parseInt(iyr) <= 2020
    },{
        field: 'eyr',
        description:  'Expiration Year',
        required: true,
        predicate: (eyr) => parseInt(eyr) >= 2020 && parseInt(eyr) <= 2030
    },{
        field: 'hgt',
        description:  'Height',
        required: true,
        predicate: (hgt) => (hgt.endsWith("cm") && parseInt(hgt.replace("cm", "")) >= 150 && parseInt(hgt.replace("cm", "")) <= 193) || 
            (hgt.endsWith("in") && parseInt(hgt.replace("in", "")) >= 59 && parseInt(hgt.replace("in", "")) <= 76) 
    },{
        field: 'hcl',
        description:  'Hair Color',
        required: true,
        predicate: hcl => /^\#[0-9a-f]{6}$/.test(hcl)
    },{
        field: 'ecl',
        description:  'Eye Color',
        required: true,
        predicate: ecl => ['amb','blu','brn','gry','grn','hzl','oth'].includes(ecl)
    },{
        field: 'pid',
        description:  'Passport ID',
        required: true,
        predicate: pid => /^[0-9]{9}$/.test(pid)
    },{
        field: 'cid',
        description:  'Country ID',
        required: false,
        predicate: cid => true
    }
]

const validatePart1 = (passport) => fields.filter(field => field.required).map(field => Object.keys(passport).includes(field.field)).every(x=>x);
console.log(`Valid passports part 1: ${data.filter(validatePart1).length}`);

const validatePart2 = (passport) => fields
    .filter(field => field.required)
    .map(field => Object.keys(passport).includes(field.field) && field.predicate(passport[field.field]))
    .every(x => x);
console.log(`Valid passports part 2: ${data.filter(validatePart2).length}`);

