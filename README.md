# Advent of code

Just a simple project which solves advent of code puzzles using PHP

## Day 3

[Puzzle for day 3 available here](https://adventofcode.com/2018/day/3)

### Execution
I have written this puzzle using the artisan commands, you can execute the code by 
```
php artisan day3:calculateClaims
```

Afterwards you should see the following output

```
Part 1:
> Final amount of fabric claims overlapping is 110827 inches.

Part 2:
> The one claim that got away has id of: 116.
```

There are also unit tests included within the project, you can execute them by
```
./vendor/phpunit/phpunit/phpunit
```


### Notes

I have actually found this really enjoyable, and honestly I am tempted to finish all of the days (maybe at a slower pace).

Also I have to admit that I have slightly misread the puzzle and initially calculate all of the overlapping areas , instead of the amount of the area claimed. This threw a wrench into my command float a little but (which is why I have decided to split each 'claim' into individual 1x1 claims, and then extract unique elements), however I think end solution came out fairly readable though it could definitely be improved on.

### Highlights (files)
You might find following files interesting

```
PHP Artisan command definitions and overall logic:
app/ConsoleCommands/Day3/ClaimsCalculator.php

Main 'Claim' class / structure:
app/Day3/Claim.php

Unit testing:
tests/Unit/ClaimTest.php
```
