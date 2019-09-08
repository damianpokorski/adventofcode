<?php

namespace App\Day3;

class Claim
{

    private $id     = null;
    private $x      = null;
    private $y      = null;
    private $width  = null;
    private $height = null;

    public function __construct()
    {
    }

    public static function fromString(string $string): Claim
    {
        // Validate input string against regex
        $regex = '/\#(\d+) \@ (\d+),(\d+)\: (\d+)x(\d+)/';
        if (!\preg_match_all($regex, $string, $matches)) {
            throw new \InvalidArgumentException("String does not match the regular expression: ".$regex);
        }

        // Map matches into a new object
        return (new Claim())
        ->setId($matches[1][0])
        ->setX($matches[2][0])
        ->setY($matches[3][0])
        ->setWidth($matches[4][0])
        ->setHeight($matches[5][0]);
    }

    public function __toString(): String
    {
        #1 @ 1,3: 4x4
        return implode('', [
            '#',
            $this->getId(),
            ' @ ',
            $this->getX(),
            ',',
            $this->getY(),
            ': ',
            $this->getWidth(),
            'x',
            $this->getHeight()
        ]);
    }

    /**
     * Tests whether the claims overlap,
     * - if claims overlap - returns a new claim
     * - If claims do not overlap - returns null
     *
     * @param Claim $other
     * @return Claim|null
     */
    public function overlap(Claim $other): ?Claim
    {
        // Standard AABB (Axis-Aligned Bounding Box) collision formula
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        if ($this->getX() < $other->getX() + $other->getWidth() &&
            $other->getX() < $this->getX() + $this->getWidth() &&
            $this->getY() < $other->getY() + $other->getHeight() &&
            $other->getY() < $this->getY() + $this->getHeight()
        ) {
            // Calculating overlapping area
            // http://blog.meltinglogic.com/2015/04/aabb-overlapping-area/
            $overlap = (new Claim())
                ->setId([$this->getId(), $other->getId()])
                ->setX(max($this->getX(), $other->getX()))
                ->setY(max($this->getY(), $other->getY()));
            return $overlap
                ->setWidth(
                    min($this->getX() + $this->getWidth(), $other->getX() + $other->getWidth()) -
                    $overlap->getX()
                )
                ->setHeight(
                    min($this->getY() + $this->getHeight(), $other->getY() + $other->getHeight()) -
                    $overlap->getY()
                );
        }

        return null;
    }

    /**
     * Returns overlapping claims within the area
     *
     * @param Array $claims
     * @return Array
     */
    public static function findOverlaping(Array $claims, $recurse = true): Array
    {
        $overlaps = [];
        for ($i = 0; $i < count($claims); $i++) {
            for ($j = 0; $j < count($claims); $j++) {
                // Prevent collisions against self & collisions being detected both ways
                if ($i < $j && \array_key_exists($i, $claims) && \array_key_exists($j, $claims)) {
                    // var_dump('Testing '.$i.' vs. '.$j.' /'.count($claims));
                    $overlaps[] = $claims[$i]->overlap($claims[$j]);
                }
            }
        }

        // Return only instances, ignore nulls
        $overlaps = \array_filter($overlaps, 'is_object');

        // // Now we recurse this function until we make sure that multiple overlapping areas (pairs) are only reported once
        // if ($recurse) {
        //     $overlapsRecursed = Claim::findOverlaping($overlaps, false);
        //     if (count($overlaps) != count($overlapsRecursed)) {
        //         return Claim::findOverlaping($overlapsRecursed);
        //     }
        // }

        return $overlaps;
    }

    /**
     * Get the value of id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of x
     */
    public function getX()
    {
        return $this->x;
    }

    /**
     * Set the value of x
     *
     * @return  self
     */
    public function setX($x)
    {
        $this->x = $x;

        return $this;
    }

    /**
     * Get the value of y
     */
    public function getY()
    {
        return $this->y;
    }

    /**
     * Set the value of y
     *
     * @return  self
     */
    public function setY($y)
    {
        $this->y = $y;

        return $this;
    }

    /**
     * Get the value of width
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set the value of width
     *
     * @return  self
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }

    /**
     * Get the value of height
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * Set the value of height
     *
     * @return  self
     */
    public function setHeight($height)
    {
        $this->height = $height;

        return $this;
    }

    /**
     * Get the area covered in square inches
     *
     * @return  self
     */
    public function getArea()
    {
        return $this->getWidth() * $this->getHeight();
    }

    /**
     * Returns the claim as an array of x,y coordinates withing it
     *
     * @return Array
     */
    public function split()
    {
        $cells = [];
        for ($i = 0; $i < $this->getWidth(); $i++) {
            for ($j = 0; $j < $this->getHeight(); $j++) {
                $cells[] = (new Claim())
                    ->setX($this->getX() + $i)
                    ->setY($this->getY() + $j)
                    ->setWidth(1)
                    ->setHeight(1);
            }
        }
        return $cells;
    }
}
