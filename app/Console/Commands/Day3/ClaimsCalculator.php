<?php

namespace App\Console\Commands\Day3;

use App\Day3\Claim;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Arr;

class ClaimsCalculator extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'day3:calculateClaims';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Performs the calculation of overlapping claims';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Load file
        $text = Storage::disk('day3')->get('puzzle-input.txt');

        // Split into lines
        $lines = explode(PHP_EOL, $text);

        // Map into claims objects
        $claims = array_map('\App\Day3\Claim::fromString', $lines);

        // Test for overlaps
        $overlapping = Claim::findOverlaping($claims);

        // Part 1
        $overlappingArea = $this->part1($overlapping);

        // Part 2
        $nonOverlappingClaimId = $this->part2($claims, $overlapping);

        // Output the results
        echo 'Part 1:'.PHP_EOL;
        echo '> Final amount of fabric claims overlapping is '.$overlappingArea.' inches.'.PHP_EOL.PHP_EOL;
        echo 'Part 2:'.PHP_EOL;
        echo '> The one claim that got away has id of: '.$nonOverlappingClaimId.'.'.PHP_EOL;
    }

    /**
     * Part 1 of the puzzle:
     * Calculate the amount of the fabric which is overlapping
     * Caveat - Each claimed fabric can only be counted count
     * @param Array[Claim] $overlapping
     * @return int
     */
    public function part1(Array $overlapping):int
    {
        // Get overlapped cells
        $overlappingCells = \array_map(function (Claim $claim) {
            return $claim->split();
        }, $overlapping);

        // Flatten the multi dimensional array
        $overlappingCells = Arr::flatten($overlappingCells);

        // Filter out unique cells
        $overlappingCellsUnique = \array_unique($overlappingCells, SORT_STRING);

        // Calculate the overlapping area, and return value
        return \array_reduce($overlappingCellsUnique, function (int $carry, Claim $item) {
            return $carry + $item->getArea();
        }, 0);
    }

    /**
     * Part 2 of the puzzle:
     * Find out the unique non overlapping claim
     * @param Array[Claim] $allClaims
     * @param Array[Claim] $overlapping
     * @return int
     */
    public function part2(Array $allClaims, Array $overlapping)
    {
        // Get ids of all claims, and overlapping claims
        $allIds = \array_map(function (Claim $claim) {
            return $claim->getId();
        }, $allClaims);

        $overlappingIds = \array_map(function (Claim $claim) {
            return $claim->getId();
        }, $overlapping);

        // Flatten both
        $allIds = Arr::flatten($allIds);
        $overlappingIds = Arr::flatten($overlappingIds);

        return implode(',', \array_diff($allIds, $overlappingIds));
    }
}
