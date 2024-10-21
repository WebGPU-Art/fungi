/// looks like some pattern here

import { hexToBinary } from "./hex-code";

let rules = [
  // 0. expand triangles
  "00000100010110010100010001110000101100001100101001001100100000100001000011001010000000000000000000100001000100000000000100000010100000110000000000000000000101000000001000000000100000110000000000000000001000101000000110011000000000000000101000010000000101000000000000000000000001000000011011000000000000000000000101100010010000001000000000000000000010000000010000000001000010100101010001100000001000011001111000110100000000000000000110110000100100000001000000110000000000000100001000100000000000110000001010110001",
  // 1. dots
  "01101101111111101111101111111111010111101011111110111110111111111110110110010111100111111111101101111101111101101111111110111001000111111011001110011011100101111101100111010111111111111101111111010111111110111101101110101101110101111101101111110010111111111011111111111010100111111010111111011100111111011111100111101111111100111111011011010101111011111001111011111010000111110111011111011101011111001011011110011111111111111011010101110111101011111101111111111111111111110111111111111111111111101110011111111111",
  // 2. tides
  "10011101111110011001110111111111011011101111011111110100111101111111111111111111111111111111101111000001111111111110110101011111111111110110011111110011011011111110111111111110111110101110111111111111111101111101110110101011110011111110011111111111101111101111101111110111001111111111101111111110111101101101110101111111111111111110111111111011111011110110111011110101101010101111110110101111110111110111111100110111010111101001101111111111111111111111100111110011111110111111110011011111101111111110101111111111",
  // 3. beach
  "11111111101111011111110111011111111011010110110111111111111111011111001111111001010111111111110111100110111011111100111101111011110111111111111111111100111101111111100110111111111011111101101111110111010010111111101111101111111111110111001111111111110001011111111111110110101111111111111111110111111111011111101100111111101111100011101101111111111100111111111111111111111111101111111111111011110111110011111101111111111111111110111111111011101111001111111110101110111111011100101101111100101011101111111101110111",
  // 4. dots
  "11111111101011111011010101011110011110111111111111101110010111111111101101111011101100110101011111111101111101111111111110001011110111111111011110100111111111001001100101010111111111101110011111101100111111110111111011111101110111011110111110111111111101110111011010111010111111110010111111011111110111010111111111111111101111111110111101111100101111111111111101111111101101011010000101110111001001100011111101111111110110110101011110101101001110011111111111111100111111101111111111111101011011101111111111111111",
  // 5. pattern
  "10111111101101110111111010111110111110111011100111111011101110111011100111111101111110011101111111111101000100111111011010111111111110100111011111101111001101110111111011100111111110011111001111111011111111111100111101111101110100111101100111111101110111111101111001111111110111110111101111111110111010101111011100101110111111111111101111101110110110011101101110111111101111111111111111111011111111011111010111111111111111111101111101111111111110111111011111110111111001110001100111111111111101111110110111001111",
  // 6. collapse
  "10111111111111111110111011111011101111111111011111110011110101110111110110111110111100010111111001111110001110111101010111111101111111110111101110110101101100110111101111110111111011011101010110101111101111111100011111011111111111111010111100111111011110111111110101011111110111111011111111001111111110110110111111111111110011110111111111111111110011010101111111111111001101111111111111111111101111111110011111011011011110111110100110111101101111110011111101111111111111010011111111111001111011100111001101011101",
  // 7. grids
  "01101111101111111111111111111111110110101111111111101010110111111111111111111111111110110101011111111111111111111111111011001111111110111110110110111110101111111111111111011100111101101110101101011111111111111100100110111111111111111110111110011111111110011111111101111101111111111100111110010101111110011011111110110101110111111101111101101111111111101010111001100111111011111101111111111111111111111111010111110111111111111101110110111110110110011111110111011111001110101011111111100111011111101011111111011111",
  // 8. lines
  "10011111111101111111110101110101011000111111111111101110111111111010111000100111100101111101011111111111111110101111111101110111100111101110111111111010101011011111111001111111111111111111010110101111111101111111011111110111111011111101101111111111111111111111111101111110111101111101111111010101011110000011111101111011011111111111111111111011001011110111111111110111001111101000001111111111111111111110011111111111110111111111000111111111111101111100100110111011011101111011111111111111111111100111101101111111",
  // 9. draw card
  "01111011111101111011011011110111111101010101111110011110111011111110111110111111110111101111101111111111011111101100101101010111011011111010111111010111011111110111111101101101111111111111110111111101101011111111111111111110111010110011011111111101000111111001110011011011101111101001111110111011011111111111010101111001111001111101011100111111111011111011111101110110110110111111011111101111111101011011011111110101111100110111111111101011111111111011111111111111011110001001111010111111111111111011111111101111",
  // 10. dots left
  "10111011111101101110111101101101111011111010101110111111110111111111111110111111110011111011111111111101010111111111111111111111110101111000111111111111011111101111111111111111110101011101111101101111111111110111011001111111001111111111111111111111110001111001101111111101111111111100111101111110111001110111111111000111111011111111011110110111111110101101001111111001101111011111110111111111110010000011111011101111111111010111111110011011111001111111111111001111111101111111111101111111111111000111111100111111",
  // 11. Sierpiński
  "11111101111101111010011111001111111110011101111110111110111111110001111101111111011110011111011101101110111011100101111101101111110111111111000111011111111110110111111110111011110011111100111101101111111111101011101011110110011100000111011110101111101110111111101011111101011111110111111100111101111111111111111111010111110111111011111110111110010111110111010010011111111011111111111111011110101110111010111111111111110111111111011000111111110110110111111111111111110111111101111111111111111111000101111110110011",
  // 12. Dramatic lift and collapse
  hexToBinary(
    "effdfaffe5bffbfaedf7ff3fdefdba5dc7e33ef7f7f8cf1dbffff7d1e9fefcdf9f5ffbffddd2bfaffeefdf7efffefed77fbddbfffbecbeffbbf87e3dea6f3dfb"
  ),
  // 13. meteors falling
  "01011111111111110111110101110101111011001010011001111111111111110111101111011111111100111010001111111111111101111101111011111110011111111100110110111111010011111101111011101111110111011101110010111111011101111111111101100111101100101111111111101111110111111111110001011001111111011111111111111011111111101110111111001101100111011110101011110111101111111001110110111111110111110111001110111111110010111011101111110110111111011110110001111010011111011111111111101001111111100111111111111110111111111110111100101111",
  // 14. area thrink
  "11111110111110111111111011111111111011111101110101011101111111111011110011110111111011111100111011111111011011101111111111001111111101100101111011011111101100111111111111101111111111111101111111110101111111011111111110110111011111111111101010101111100011111111110111111010111101100100101111111111111110111111111110111111111111110101110111110111111111111101111111101110111110111101111111111101111111111111111111111011111111011111101111101111111111111111111111110111111111100111111101111011111111111111101111111000",
  // 15. strips drawing
  "01111111111111111111011101110111111110111110111111111101011111101111011111110110001111011110111111111011111111110010010111111111101110011111011111111101111001111111011111111011000111010111011111010101111111001100111111111100110111111101001011011011111111111111111111111111110111101001111111101111111111111101111101011111001110111011101111111111110011111111000111101101111111011110111011111110101111100011111010111011101111011001111111111111001111111101111110111111111111111010111110110011111111010101110101011111",
  // 16. draw hairs
  "01111111111111110111111101001111111000111111111011111111110101101101111111110111011011111110111000011111111011111011111010111111110011111110101111111101111111011111100111111110111111111110001111111110111111110110011111011111001110011101111011111111101011111111111111110111101111110110110111010111111011010111111100110001101111111111111101111111111011111111001111011111111111111111111111011110011101011011001111111111111111111111110111100011011111100111110001110111111011111101110111110111110111101111101111111111",
  // 17. drops
  "11111111111111111111111111111011111111101101011111111111111111111101111110110111111111111111111111101111010011111111011011111101111111101111110001111111101111101111111011100010110101110111110111101111101101110111111011110111011011101111111111111110111011111110111101111101100111111110110011101111001111111111111011110111011101111100101100101111101111011111011111110110111111110111111111100111110011100111101110101101110111111111011110101111111111111111011111111111110111111010011110101111111100110101100011111010",
  // 18. ferns
  "11111110110111111101111110010101011111011111111111101111010111111111111111110101110111111111111111111101111111111001111011111111100111111111011110110111111110110101111011011011101011111111111110111111111111111101011001101101111101011111010111111110111101110011111110101101111101100111101111111111011101100101101111111101101111111000111101111111111011111111110011111111111100011111111111101111111111110101101011111111111101110110011110111101111111110111011111011111111101111111110101110010011010101110110111100111",
  // 19. triangles
  "00111111111111111111111111111111011110110111000101111010101011010111111101101110101110111110111101110111111111011111110111010111111111011110111011111010110101010110011110101111100101111110111100111111011101011111110111011011011111111111111100011101011011111010101111111100101111101100111111110111100101110111111111111111001111111110111111010011110100111110000101101111011110111011011110010111101011111111111111111001101111010011011111101101011001011111010010111001111111001111101111111011101111111101101110101111",
  // 20.
  "11111111101010111111111111101101110110010011111111010111111111110011111111101011111101111101011111111101101110101101111111111110101110001111111010111111110011111110111111101011111111011110011111111111001111111111111111111010111011111111101111010101011111100111101010001001101101101111111111111111111100101111111111111111111101111111011111111111110010011111111010111110111010111101110101110110101110111101111111111101111111110111111111110111111011010111111111101001111111111111111110111111101111111111111111101111",
].map((x) => x.split("").map(Number));

export let getRules = () => {
  let rulesData = new Uint32Array(2 ** 9);
  for (let i = 0; i < 2 ** 9; i++) {
    rulesData[i] = Math.random() < 0.8 ? 1 : 0;
    rulesData[i] = rules[20][i];
  }

  return rulesData;
};

export let getInitialCells = (width: number, height: number) => {
  let cells = new Uint32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    // cells[i] = Math.random() < 0.5 ? 1 : 0;
    // 400 pixles radius near the center, write 1
    let radius = 17;
    let x = i % width;
    let y = Math.floor(i / width);
    if ((x - width / 2) ** 2 + (y - height / 2) ** 2 < radius ** 2) {
      // random
      // cells[i] = Math.random() < 0.5 ? 1 : 0;
      cells[i] = 1;
    } else {
      cells[i] = 0;
    }
  }

  return cells;
};
