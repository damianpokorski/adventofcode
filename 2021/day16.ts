// Helpers for animations
import { Instance as Chalk } from "chalk";
const chalk = new Chalk();
const sleep = async () => await new Promise((resolve, reject) => setTimeout(resolve, 100));


const data =
  // // Example 1
  // "D2FE28";
  // Example 2
  "38006F45291200"
// "620080001611562C8802118E34";

class Packet {
  constructor(
    public version: number = null,
    public typeID: number = null,
    // Type 1 propertes
    public literalValues: string[] = [],
    public literalValue: number = null,
    // Type 6 properties
    public lengthType: number = null,
    public lengthTypeValue: number = null,
    // Shared
    public subpackets: Packet[] = [],
    public isClosed: boolean = false
  ) { }
}

let decode = async (binary: string[], topLevel = false) => {
  let index = 0;

  // Set up packet tree
  const rootPacket = new Packet();
  let currentPacket = rootPacket;
  let outputPackets = [currentPacket];

  // Iterate through code
  let buffer: string[] = [];
  let bytesToSkip = 0;
  for (let i = 0; i < binary.length; i++) {
    let bit = binary[i];
    let messages = [];

    // Add bit to unallocated cache
    buffer.push(bit);

    // Big ol' state machine
    //

    // Skip irrelevant bytes
    if (bytesToSkip > 0) {
      bytesToSkip--;
      messages.push(`Skipping this byte as per instructions, bytes to skip remaining ${bytesToSkip}`);
      if (bytesToSkip == 0) {
        messages.push(`Flushing buffer after skipping ${buffer.join("")}`);
        buffer = [];
      }
    }
    // Packet version - awaiting
    else if (currentPacket.version == null && buffer.length < 3) {
      messages.push("Waiting for aenough characters to begin parsing version number...");
    }
    // Packet version - parsing
    else if (currentPacket.version == null && buffer.length == 3) {
      messages.push("Reading version number");
      currentPacket.version = parseInt(buffer.join(""), 2);
      buffer = [];
    }
    // Packet type id - awaiting
    else if (currentPacket.version !== null && currentPacket.typeID == null && buffer.length < 3) {
      messages.push("Waiting for enough characters to begin parsing packet type id...");
    }
    // Packet type id - processing
    else if (currentPacket.version !== null && currentPacket.typeID == null && buffer.length == 3) {
      messages.push("Reading packet type id...");
      currentPacket.typeID = parseInt(buffer.join(""), 2);
      buffer = [];
    }
    // Literal packet processing (type id = 4)
    else if (currentPacket.version !== null && currentPacket.typeID == 4) {
      // Waiting for 5 character buffer
      if (buffer.length < 5) {
        messages.push(`Waiting for buffer to reach 5 characters, currently ${buffer.length}${buffer[0] == "0" ? ", last buffer" : ""}`)
      } else {
        if (buffer[0] == "0") {
          currentPacket.literalValues.push(buffer.slice(1).join(""));
          currentPacket.literalValue = parseInt(currentPacket.literalValues.join(""), 2);

          // Packet type id 4 is now finished
          currentPacket.isClosed = true;
          let newPacket = new Packet();
          currentPacket = newPacket;
          outputPackets = [...outputPackets, currentPacket];

          // Count bytes to skip per hexadecimal instructions
          if(topLevel) {
            bytesToSkip = 3 - (index % 4);
          }
        } else {
          currentPacket.literalValues.push(buffer.slice(1).join(""));
        }
        buffer = [];
      }
    }
    // Operator type packet processing - Parsing length type
    else if (currentPacket.version !== null && currentPacket.typeID !== 4 && currentPacket.lengthType == null) {
      messages.push("Reading length type");
      if (buffer[0] == "0") {
        currentPacket.lengthType = 15;
        buffer = [];
      }
      if (buffer[0] == "1") {
        currentPacket.lengthType = 11;
        buffer = [];
      }
    }
    // Operator type processing - Awaiting length type value
    else if (currentPacket.version !== null && currentPacket.typeID !== 4 && currentPacket.lengthType !== null && currentPacket.lengthTypeValue == null && buffer.length < currentPacket.lengthType) {
      messages.push(`Reading bytes for length type value ${buffer.length}/${currentPacket.lengthType}`);
    }
    // Operator type processing - Parsing length type value 
    else if (currentPacket.version !== null && currentPacket.typeID !== 4 && currentPacket.lengthType !== null && currentPacket.lengthTypeValue == null && buffer.length == currentPacket.lengthType) {
      currentPacket.lengthTypeValue = parseInt(buffer.join(""), 2);
      buffer = [];
    }
    // Operator type 0 - Awaiting
    else if (currentPacket.version !== null && currentPacket.typeID !== 4 && currentPacket.lengthType == 15 && currentPacket.lengthTypeValue !== null && buffer.length < currentPacket.lengthTypeValue) {
      messages.push(`Reading bytes for length type value ${buffer.length}/${currentPacket.lengthTypeValue}`);
    } 
    // Operator type 0 - Reading
    else if (currentPacket.version !== null && currentPacket.typeID !== 4 && currentPacket.lengthType == 15 && currentPacket.lengthTypeValue !== null && buffer.length == currentPacket.lengthTypeValue) {
      messages.push(`Processing subpacket: ${buffer}`);
      currentPacket.subpackets = [...currentPacket.subpackets, ...(await decode(buffer))];
      currentPacket.isClosed = true;
    } 
    // Operator type 1 - Reading
    else if (currentPacket.version !== null && currentPacket.typeID !== 4 && currentPacket.lengthType == 11 && currentPacket.lengthTypeValue !== null && buffer.length < currentPacket.lengthTypeValue) {
      messages.push(`Reading buffer until packets ${currentPacket.lengthTypeValue}`);
    } 
    
    else {
      messages.push("Unexpected state");
    }

    // Render state
    index++;
    if (topLevel) {
      await sleep();
      console.clear();
      console.log(`Binary: ${binary.join("")} - Length ${binary.length}`);
      console.log(`Parsed: ${binary.slice(0, index).join("")}`);
      console.log(`Buffer: ${buffer.join("")}`);
      console.log("============================");
      if (messages.length > 0) {
        console.log(`Messages:`);
        for (let message of messages) {
          console.log(` - ${message}`);
        }
        console.log("============================");
      }
      console.log(`Current packet tree:`);
      console.log(JSON.stringify(outputPackets, null, 2));
    }
  }
  return outputPackets;
};
(async () => {

  // Convert hex to binary
  let binary = parseInt(data, 16).toString(2).split("");
  // Add leading zeroes
  binary = [...[... new Array(4 - (binary.length % 4))].map(() => "0"), ...binary];
  // Decode
  await decode(binary, true);
})();
