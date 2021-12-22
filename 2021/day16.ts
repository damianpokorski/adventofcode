// Helpers for animations
import { Instance as Chalk } from "chalk";
const chalk = new Chalk();
const sleep = async () => await new Promise((resolve, reject) => setTimeout(resolve, 1));
import { data as input } from "./data/day16.data";
let debug = true;
// const data = "D2FE28";                         // // Part 1 - Example 1
// const data = "38006F45291200";                 // // Part 1 - Example 2 - Pass
// const data = "EE00D40C823060";                 // // Part 1 - Example 3 - Pass
// const data = "8A004A801A8002F478";             // // Part 1 - Example 4 - Pass - Version = 16
// const data = "620080001611562C8802118E34";     // // Part 1 - Example 5 - Pass - Version = 12
// const data = "C0015000016115A2E0802F182340";   // // Part 1 - Example 6 - Pass - Version sum = 23
// const data = "A0016C880162017C3686B18A3D4780"; // // Part 1 - Example 7 - Pass - Version sum = 31
// const data = "C200B40A82";                     // // Part 2 - Example 1 - Pass - Returning 3
// const data = "04005AC33890";                   // // Part 2 - Example 2 - Pass - Returning (tests product) 54.
// const data = "880086C3E88112";                 // // Part 2 - Example 3 - Pass Return (tests min) 7.
// const data = "CE00C43D881120";                 // // Part 2 - Example 4 - Pass Return (tests max) 9.
// const data = "D8005AC2A8F0";                   // // Part 2 - Example 5 - Pass Return (tests less than) 1.
// const data = "F600BC2D8F";                     // // Part 2 - Example 6 - Pass Return (tests more than) 0.
// const data = "9C005AC2F8F0";                   // // Part 2 - Example 7 - Pass Return (tests equals) 0
// const data = "9C0141080250320F1802104A08"      // // Part 2 - Example 8- Pass Return (tests equals) 1

// Live data
const data = input;
let packetId = 0;
class Packet {
  protected id: number;
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
    public subpackets: Packet[] = []
  ) {
    this.id = packetId++;
  }

  public setVersion(version: number) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'version' to '${version}'`);
    }
    this.version = version;
  }
  public setTypeID(typeID: number) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'typeID' to '${typeID}'`);
    }
    this.typeID = typeID;
  }
  public setLiteralValues(literalValues: string[]) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'literalValues' to '${literalValues}'`);
    }
    this.literalValues = literalValues;
  }
  public setLiteralValue(literalValue: number) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'literalValue' to '${literalValue}'`);
    }
    this.literalValue = literalValue;
  }
  public setLengthType(lengthType: number) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'lengthType' to '${lengthType}'`);
    }
    this.lengthType = lengthType;
  }
  public setLengthTypeValue(lengthTypeValue: number) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'lengthTypeValue' to '${lengthTypeValue}'`);
    }
    this.lengthTypeValue = lengthTypeValue;
  }
  public setSubpackets(subpackets: Packet[]) {
    if (debug) {
      console.log(`[${this.id}] Setting: 'subpackets' to '${subpackets}'`);
    }
    this.subpackets = subpackets;
  }

  public render(indentAmount = 0) {
    const indentCharacter = " ";
    let indent = [...new Array(indentAmount)].map(() => indentCharacter).join("");
    const isLiteral = this.typeID == 4;
    let detail = ""
    if (isLiteral) {
      detail = `${this.literalValue} (${this.literalValues.join(", ")})`;
    } else {
      detail = `Length Type: ${this.lengthType} ${this.lengthType == 11 ? "(Number of subpackets " + this.subpackets.length.toString() + ")" : "(Total bits)"}, Type Value: ${this.lengthTypeValue}`
    }
    console.log(`${indent}${indentAmount > 0 ? "└── " : ""}V: ${this.version}, ID: ${this.typeID} (${this.typeID == 4 ? "Literal" : "Operator"}), ${detail}`);
    for (let child of this.subpackets) {
      child.render(indentAmount + 1);
    }
  }
  public versionSum() {
    return this.subpackets
      .map(subpacket => subpacket.versionSum())
      .reduce((a, b) => a + b, this.version);
  }
  // Part 2 Operate
  public operate(): number {
    switch (this.typeID) {
      // Sum
      case 0:
        return this.subpackets
          .map(subpacket => subpacket.operate())
          .reduce((a, b) => {
            console.log(`${a} + ${b} = ${a+b}`);
            return a + b;
          }, 0);
      // Product
      case 1:
        return this.subpackets
          .map(subpacket => subpacket.operate())
          .reduce((a, b) => {
            console.log(`${a} * ${b} = ${a*b}`);
            return a * b;
          }, 1);
      // Min
      case 2:
        return this.subpackets
          .map(subpacket => subpacket.operate())
          .reduce((a, b) => {
            console.log(`min(${a},${b}) = ${Math.min(a,b)}`);
            return Math.min(a, b);
          }, Number.MAX_SAFE_INTEGER);
      // Max
      case 3:
        return this.subpackets
          .map(subpacket => subpacket.operate())
          .reduce((a, b) => {
            console.log(`max(${a},${b}) = ${Math.max(a,b)}`);
            return Math.max(a, b);
          }, 0);
      // Literal value
      case 4:
        console.log(`literal(${this.literalValues.join("")}) = ${this.literalValue}`);
        return this.literalValue;

      // Greater than
      case 5:
      case 6:
      case 7:
        const a = this.subpackets[0].operate();
        const b = this.subpackets[1].operate();
        switch(this.typeID) {
          case 5:
            console.log(`${this.typeID} //${a} > ${b} = ${a > b ? 1 : 0}`);
            return a > b ? 1 : 0;
          // Less than
          case 6:
            console.log(`${a} < ${b} = ${a < b ? 1 : 0}`);
            return a < b ? 1 : 0;
          // Equal
          case 7:
            console.log(`${a} == ${b} = ${a == b ? 1 : 0}`);
            return a == b ? 1 : 0;
        }
    }
    return 0;
  }
}
let decode = async (input: string[], packetCap = -1) => {
  // Clone input internally as we keep slicing against it
  let binary = [...input];

  // Set up packet tree
  let outputPackets = [] as Packet[];
  let initialInputSize = binary.length;

  while (binary.length > 7 && (packetCap < 0 || outputPackets.length < packetCap)) {
    const currentPacket = new Packet();
    // Packet version
    currentPacket.setVersion(parseInt(binary.splice(0, 3).join(""), 2));
    // Packet type id
    currentPacket.setTypeID(parseInt(binary.splice(0, 3).join(""), 2));

    // Literal packet
    if (currentPacket.typeID == 4) {
      // Remove first letter for comparison
      while (binary.splice(0, 1).join("") == "1") {
        // Remove next 4 for value
        currentPacket.setLiteralValues([...currentPacket.literalValues, binary.splice(0, 4).join("")]);
      }

      // Remove last 5, only keep last 4 - While above ending on a 0 would splice that 0 away
      currentPacket.setLiteralValues([...currentPacket.literalValues, binary.splice(0, 4).join("")]);

      // Calculate actual value
      currentPacket.setLiteralValue(parseInt(currentPacket.literalValues.join(""), 2));
    }
    // Operator packets
    else {
      // Length type : 0 = Next 15 bits state the size of all sub packets, 11 means next bits state number of sub packets 
      currentPacket.setLengthType(binary.splice(0, 1).join("") == "0" ? 15 : 11);

      // Remove next 11 or 15 bytes
      currentPacket.setLengthTypeValue(parseInt(binary.splice(0, currentPacket.lengthType).join(""), 2));
      if (currentPacket.lengthType == 15) {
        // Now we know the subpacket size
        const subpackets = binary.splice(0, currentPacket.lengthTypeValue);

        // Passing reference on purpose here
        const result = await decode(subpackets);
        currentPacket.subpackets = result.packets;
      } else if (currentPacket.lengthType == 11) {
        // We process the data - Passing in a reference against
        const result = await decode(binary, currentPacket.lengthTypeValue);
        currentPacket.subpackets = result.packets;

        // Slice off once we know how much characters we have processed
        binary.splice(0, result.charactersProcessed);
      } else {
        console.error(`Invalid length type ${currentPacket.lengthType}`);
        process.exit();
      }
    }
    outputPackets.push(currentPacket);
  }

  return {
    packets: outputPackets,
    charactersProcessed: initialInputSize - binary.length
  };
};

(async () => {

  // Convert hex to binary
  // Sensible way - not applicable for this puzzle, ensure each hex is converted to binary indivudually
  let binary = data
    .split("")
    .map(character => parseInt(character, 16).toString(2).padStart(4, "0"))
    .join("")
    .split("");

  // Decode
  console.log("")
  console.log(`Hex: ${data}`);
  console.log(`Binary: ${binary.join("")}`);
  console.log("======= Operations =========");
  const resultingPackets = await decode(binary);
  console.log("============================");
  console.log("Final results: ")
  if (debug) {
    console.log(resultingPackets.packets);
    for (let resultPacket of resultingPackets.packets) {
      resultPacket.render();
    }
  }
  console.log(" - Version sum: ")
  console.log(resultingPackets.packets.map(packet => packet.versionSum()).reduce((a, b) => a + b, 0));
  console.log(" - Operational value: ")
  console.log(resultingPackets.packets.map(packet => packet.operate()));
})();
