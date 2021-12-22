
const data = {
  // // Example 1
  // minX:20,
  // maxX:30,
  // minY:-10,
  // maxY:-5
  // Puzzle input
  minX:70,
  maxX:96, 
  minY:-179,
  maxY:-124
}

class Vector {
  constructor(public x: number, public y: number) {}
  toString() {
    return `X:${this.x} Y:${this.y}`
  }
}
class Probe {
  position: Vector = new Vector(0,0);
  velocity: Vector;
  initialVelocity: Vector;
  constructor(x:number = 0,y: number = 0) {
    this.velocity = new Vector(x,y);
    this.initialVelocity = new Vector(x,y);
  }

  step() {
    // Apply X velocity
    this.position.x += this.velocity.x;
    // Apply Y Velocity
    this.position.y += this.velocity.y;
    // Reduce X velocity - if there's any to reduce
    if(this.velocity.x !== 0) {
      this.velocity.x = this.velocity.x + (this.velocity.x > 0 ? -1 : 1);  
    }
    // Y velocity - due to gravice it always accelerated downwards
    this.velocity.y--;
  }
  targetHit(){
    return this.position.x >= data.minX &&
       this.position.x <= data.maxX &&
       this.position.y >= data.minY && 
       this.position.y <= data.maxY;
  }
  outOfBounds() {
    // Out of bounds Y
    if(this.position.y < data.minY) {
      return true;
    }
    // Out of bounds X
    if(this.position.x > data.maxX) {
      return true;
    }
    return false;
  }
}


let bestShotVelocity: Vector = null;
let bestShotMaxHeight: number = null;
// Bruteforce
const maxCycles = 10000;
const maxXVelocity = 20000;
const maxYVelocity = 20000;
for(let x = 0; x < maxXVelocity; x++) {
  for(let y = 0; y < maxYVelocity; y++) {
    let cycle = 0;
    let probe = new Probe(x,y);
    let maxY = 0;
    while(cycle < maxCycles) {
      // Apply velocity changes
      probe.step();
      // Log state
      // console.log(`Velocity (${probe.initialVelocity.toString()}), Cycle ${cycle}/${maxCycles}, Position (${probe.position.toString()})`);
      // Keep track of max Y reached and update accordingly
      maxY = Math.max(maxY, probe.position.y);
      // If we land a hit - end it, check if it's new high score
      if(probe.targetHit()) {
        // console.log("HIT");
        if((bestShotMaxHeight == null || bestShotMaxHeight < maxY)) {
          bestShotVelocity = probe.initialVelocity;
          bestShotMaxHeight = maxY;
        }
        break;
      }
      // Get out of loop if we're too far right or too low
      else if(probe.outOfBounds()) {
        // console.log("miss");
        break;
      }
      cycle++;
    }
  } 
}
console.log({
  bestShotVelocity,
  bestShotMaxHeight
});