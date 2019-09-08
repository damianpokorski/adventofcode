<?php

namespace Tests\Unit\Day3;

use App\Day3\Claim;
use Tests\TestCase;

class ClaimTest extends TestCase
{
    /**
     * A basic unit test of a area claimed by the elf.
     *
     * @return void
     */
    public function testValidStringToObject()
    {
        $claim = Claim::fromString('#2 @ 3,1: 4x4');
        $this->assertInstanceOf(Claim::class, $claim);
    }

    /**
     * A basic unit test validating whether submitting an
     * invalid string will return an exception
     *
     * @return void
     */
    public function testInvalidStringToClaimThrowsException()
    {
        $this->expectException(\InvalidArgumentException::class);
        Claim::fromString('Invalid string');
    }


    /**
     * A basic unit test of a area claimed by the elf.
     *
     * @return void
     */
    public function testValidStringGetsMappedToAClaimAccurately()
    {
        $claim = Claim::fromString('#2 @ 3,1: 4x4');
        $this->assertEquals(2, $claim->getId());
        $this->assertEquals(3, $claim->getX());
        $this->assertEquals(1, $claim->getY());
        $this->assertEquals(4, $claim->getWidth());
        $this->assertEquals(4, $claim->getHeight());
    }

    public function testClaimsOverlapping()
    {
        // Define claims
        $claims = [
            Claim::fromString('#1 @ 1,3: 4x4'),
            Claim::fromString('#2 @ 3,1: 4x4'),
            Claim::fromString('#3 @ 5,5: 2x2')
        ];

        $overlaps = Claim::findOverlaping($claims);

        var_dump($overlaps);

        // Assert Id's 1 & 2 are overlapping
        $this->assertContains('1', $overlaps[0]->getId());
        $this->assertContains('2', $overlaps[0]->getId());
        
        // Assert the square area of the overlap is 
        $this->assertEquals(4, $overlaps[0]->getArea());
    }
}
