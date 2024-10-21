// with help of Claude

export function binaryToHex(binary: string): string {
  // validation input
  if (!/^[01]+$/.test(binary) || binary.length % 4 !== 0) {
    throw new Error("Invalid binary string");
  }

  let hex = "";
  for (let i = 0; i < binary.length; i += 4) {
    const chunk = binary.slice(i, i + 4);
    const decimal = parseInt(chunk, 2);
    hex += decimal.toString(16);
  }

  return hex.toLowerCase();
}

export function hexToBinary(hex: string): string {
  // validation input
  if (!/^[0-9A-Fa-f]+$/.test(hex)) {
    throw new Error("Invalid hexadecimal string");
  }

  let binary = "";
  for (let i = 0; i < hex.length; i++) {
    const decimal = parseInt(hex[i], 16);
    const chunk = decimal.toString(2).padStart(4, "0");
    binary += chunk;
  }

  return binary;
}

let test = () => {
  const binaryString = "0101101001011010";
  console.log("Original binary:", binaryString);

  const hexString = binaryToHex(binaryString);
  console.log("Converted to hex:", hexString);

  const backToBinary = hexToBinary(hexString);
  console.log("Converted back to binary:", backToBinary);

  console.log("Conversion successful:", binaryString === backToBinary);
};

// test();
