"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
exports.__esModule = true;
var day9_data_1 = require("./data/day9.data");
// const data = [
//   "2199943210", 
//   "3987894921", 
//   "9856789892", 
//   "8767896789", 
//   "9899965678", 
// ];
var map = day9_data_1.data.map(function (row) { return row.split("").map(function (number) { return parseInt(number); }); });
;
var points = map
    .map(function (row, y) { return row
    // Self contained point information
    .map(function (height, x) { return ({
    x: x,
    y: y,
    height: height,
    up: map[y - 1] !== undefined ? map[y - 1][x] : null,
    down: map[y + 1] !== undefined ? map[y + 1][x] : null,
    left: map[y][x - 1] !== undefined ? map[y][x - 1] : null,
    right: map[y][x + 1] !== undefined ? map[y][x + 1] : null
}); })
    // Put adjecents into array
    .map(function (point) { return (__assign(__assign({}, point), { adjecentHeights: [
        point.left,
        point.right,
        point.up,
        point.down,
    ].filter(function (value) { return Number.isInteger(value); }) })); })
    // Flag low points
    .map(function (point) { return (__assign(__assign({}, point), { lowPoint: point.adjecentHeights.filter(function (adjectentHeight) { return adjectentHeight > point.height; }).length == point.adjecentHeights.length })); }); })
    .flat();
// console.log(points);
var lowPoints = points.filter(function (point) { return point.lowPoint; });
var risk = lowPoints.map(function (point) { return point.height + 1; });
var riskSum = risk.reduce(function (a, b) { return a + b; }, 0);
console.log((_a = {},
    _a["Part 1"] = riskSum,
    _a));
// Find basins by growing
var pointToHash = function (p) { return "".concat(p.x, ":").concat(p.y); };
function growBasinLowPoints(allPoints, pointToCheck, pointsInBasin) {
    if (pointsInBasin === void 0) { pointsInBasin = []; }
    if (pointToCheck.height == 9) {
        return pointsInBasin;
    }
    // Add current point to basin
    pointsInBasin.push(pointToHash(pointToCheck));
    // If basin grows smoothly left
    if (pointToCheck.left == pointToCheck.height + 1) {
        var left = allPoints.find(function (left) { return left.x == pointToCheck.x - 1 && left.y == pointToCheck.y; });
        // If point exists & is not already in basin
        if (left && !pointsInBasin.includes(pointToHash(left))) {
            pointsInBasin = __spreadArray(__spreadArray([], pointsInBasin, true), growBasinLowPoints(allPoints, left, pointsInBasin), true);
        }
    }
    // If basin grows smoothly right
    if (pointToCheck.right == pointToCheck.height + 1) {
        var right = allPoints.find(function (right) { return right.x == pointToCheck.x + 1 && right.y == pointToCheck.y; });
        // If point exists & is not already in basin
        if (right && !pointsInBasin.includes(pointToHash(right))) {
            pointsInBasin = __spreadArray(__spreadArray([], pointsInBasin, true), growBasinLowPoints(allPoints, right, pointsInBasin), true);
        }
    }
    // If basin grows smoothly down
    if (pointToCheck.down == pointToCheck.height + 1) {
        var down = allPoints.find(function (down) { return down.y == pointToCheck.y + 1 && down.x == pointToCheck.x; });
        // If point exists & is not already in basin
        if (down && !pointsInBasin.includes(pointToHash(down))) {
            pointsInBasin = __spreadArray(__spreadArray([], pointsInBasin, true), growBasinLowPoints(allPoints, down, pointsInBasin), true);
        }
    }
    // If basin grows smoothly up
    if (pointToCheck.up == pointToCheck.height + 1) {
        var up = allPoints.find(function (up) { return up.y == pointToCheck.y - 1 && up.x == pointToCheck.x; });
        // If point exists & is not already in basin
        if (up && !pointsInBasin.includes(pointToHash(up))) {
            pointsInBasin = __spreadArray(__spreadArray([], pointsInBasin, true), growBasinLowPoints(allPoints, up, pointsInBasin), true);
        }
    }
    return __spreadArray([], new Set(pointsInBasin), true);
}
;
var basins = lowPoints.map(function (low) { return growBasinLowPoints(points, low); });
var basinSizes = basins.map(function (x) { return x.length; });
var biggestBasins = basinSizes.sort(function (a, b) { return b - a; });
var multipliedValues = biggestBasins.slice(0, 3).reduce(function (a, b) { return a * b; }, 1);
console.log(basins.flat().length);
console.log(__spreadArray([], new Set(basins.flat()), true).length);
console.log(biggestBasins);
console.log(multipliedValues);
// const hashMap = map
//   .map((row, y) => row.map((cell, x) => ({[`${x}:${y}`]: cell})))
//   .flat(2)
//   .reduce((merged, cell) => ({...merged, ...cell}), {}) as Record<string, number>;
// console.log(hashMap);
// const findLowPoints = (hashTable: Record<string, number>) => 
//   Object
//     .keys(hashTable)
//     .map(coordinate => ({
//       value: Object[coordinate]
//     }))
