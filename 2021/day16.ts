// Helpers for animations
import { Instance as Chalk } from "chalk";
const chalk = new Chalk();
const sleep = async () => await new Promise((resolve, reject) => setTimeout(resolve, 500));


const data =
  "D2FE28";
  // "620080001611562C8802118E34";

class Packet {
  constructor(
    public version: number = null,
    public typeID: number = null,
    public literalValues: string[] = [],
    public literalValue: number = null,
    public subpackets: Packet[] = [],
    public parent: Packet = null,
  ) { }
}

let decode = async (hex: string) => {
  const binary = parseInt(data, 16).toString(2).split("");
  let index = 0;
  
  // Set up packet tree
  const rootPacket = new Packet();
  let currentPacket = rootPacket;
  
  // Iterate through code
  let buffer:string[] = [];
  for(let bit of binary) {
    let messages = [];
    // Add bit to unallocated cache
    buffer.push(bit);

    if(currentPacket.version == null && buffer.length < 3){
      messages.push("Waiting for enough characters to begin parsing version number...");
    }else if(currentPacket.version == null && buffer.length == 3) {
      messages.push("Reading version number");
      currentPacket.version = parseInt(buffer.join(""), 2);
      buffer = [];
    } else if (currentPacket.version !== null && currentPacket.typeID == null && buffer.length < 3){
      messages.push("Waiting for enough characters to begin parsing packet type id...");
    } else if (currentPacket.version !== null && currentPacket.typeID == null && buffer.length == 3){
      messages.push("Reading packet type id...");
      currentPacket.typeID = parseInt(buffer.join(""), 2);
      buffer = [];
    } else if (currentPacket.version  !== null && currentPacket.typeID == 4) {
      if(buffer.length < 5) {
        messages.push(`Waiting for buffer to reach 5 characters, currently ${buffer.length}${buffer[0] == "0" ? ", last buffer": ""}`)
      } else {
        if(buffer[0] == "0") {
          currentPacket.literalValues.push(buffer.slice(1).join(""));
          currentPacket.literalValue = parseInt(currentPacket.literalValues.join(""), 2);
          // Packet type id 4 is now finished
          let newPacket = new Packet();
          newPacket.parent = currentPacket;
          currentPacket = newPacket;
        } else {
          currentPacket.literalValues.push(buffer.slice(1).join(""));
        }
        buffer = [];
      }
    } else {
      messages.push("Unexpected state");
    }
    const version = parseInt(binary.slice(0, 3).join(""), 2);
    const packetTypeID = parseInt(binary.slice(3, 6).join(""), 2);
    
    const numberOfPackets = Math.floor(binary.slice(6).length / 5);
    
    let packets = [... new Array(numberOfPackets)]
    .map((_, index) => index)
    .map(packetIndex => {
        const value = binary.slice(6 + (5 * packetIndex)).slice(1,4).join("");
        const packetLabel = binary.slice(6 + (5 * packetIndex)).slice(0,1).join("");
        return {value, packetLabel};
      });
      let operator = "";
    // Render state
    index++;
    await sleep();
    console.clear();
    console.log(`Binary: ${binary.join("")}`);
    console.log(`Parsed: ${binary.slice(0, index).join("")}`);
    console.log(`Buffer: ${buffer.join("")}`);
    console.log("============================");
    if(messages.length > 0) {
      console.log(`Messages:`);
      for(let message of messages) {
        console.log(` - ${message}`);
      }
      console.log("============================");
    }
    console.log(`Current packet tree:`);
    console.log(JSON.stringify(rootPacket, null, 2));
  }
  // console.log({
  //   version,
  //   packetTypeID,
  //   packets
  // })
};
(async() => {
  await decode(data);
})();
