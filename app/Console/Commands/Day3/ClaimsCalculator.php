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

        // Get overlapped cells
        $overlappingCells = \array_map(function (Claim $claim) {
            return $claim->split();
        }, $overlapping);

        $overlappingCells = Arr::flatten($overlappingCells);

        // Filter out unique cells
        $overlappingCellsUnique = \array_unique($overlappingCells, SORT_STRING);

        // Calculate the overlapping area
        $overlappingArea = \array_reduce($overlappingCellsUnique, function (int $carry, Claim $item) {
            return $carry + $item->getArea();
        }, 0);

        // // Output
        echo 'Final amount of fabric claims overlapping is '.$overlappingArea.' inches.'.PHP_EOL;
    }
}
