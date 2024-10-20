/// looks like some pattern here
let rule1 =
  "00110011011011111101100111101110010000011111001111010100000001110010010011100010001110011001011011001111000100100010111010001011001100001101001101101000000110100001110110011100000111010110011101111011000001001001110001111110011011111111000100011010111010011110000101110101110010011001101101111001111000111010000100001111010001011000000010111001100000111100011000100010001011110100001111101111100010000010000101111010110100100101001100111001001011010010000000101000101000101101111100101000000111000100110100011110"
    .split("")
    .map(Number);

/// things building from bottom to top
let rule2 =
  "00111011010001111100110100101101001100010100001010010011011100011010000100010110010101101101101110101110011010111101100111000111000011000110110010010100110010111110000101000010111011101110011100011110100100110100100101101100110010111001000001110010111111001111101000011111011101001011010001101001110111010110101111000001011110010010100011110110101001110101100111101110011101110111001000100000100000100111011100100110100011011100011100000110100001100111010000100110000011001111100011111001011100000101111001010100"
    .split("")
    .map(Number);

export let getRules = () => {
  let rulesData = new Uint32Array(2 ** 9);
  for (let i = 0; i < 2 ** 9; i++) {
    // rulesData[i] = rule1[i];
    rulesData[i] = rule2[i];
    // rulesData[i] = Math.random() < 0.5 ? 1 : 0;
  }

  return rulesData;
};

export let getInitialCells = (width: number, height: number) => {
  let cells = new Uint32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    // 400 pixles radius near the center, write 1
    let radius = 200;
    let x = i % width;
    let y = Math.floor(i / width);
    if ((x - width / 2) ** 2 + (y - height / 2) ** 2 < radius ** 2) {
      // random
      cells[i] = Math.random() < 0.5 ? 1 : 0;
    } else {
      cells[i] = 0;
    }
  }

  return cells;
};
