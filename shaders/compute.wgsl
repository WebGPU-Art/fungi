@binding(0) @group(0) var<uniform> canvas_size: vec2<u32>;
@binding(1) @group(0) var<storage, read> current: array<u32>;
@binding(2) @group(0) var<storage, read_write> next: array<u32>;

// an array with length 2**9 , filling with 0/1
@binding(3) @group(0) var<storage, read> rules: array<u32>;

override blockSize = 8;

fn getIndex(x: i32, y: i32) -> i32 {
  let h = i32(canvas_size.y);
  let w = i32(canvas_size.x);

  return (y % h) * w + (x % w);
}

fn getCell(x: i32, y: i32) -> u32 {
  // edge is a mirror
  var index_x = x;
  var index_y = y;
  // if x < 0 {
  //   return 1u;
  // }
  // if y < 0 {
  //   return 1u;
  // }
  // if x >= i32(canvas_size.x) {
  //   return 1u;
  // }
  // if y >= i32(canvas_size.y) {
  //   return 1u;
  // }

  return current[getIndex(index_x, index_y)];
}

// power function
fn pow_int(base: u32, exp: u32) -> u32 {
  var result = 1u;
  for (var i = 0u; i < exp; i = i + 1u) {
    result = result * base;
  }
  return result;
}

/// in a w*x grid, read a self and other 8 neighbors(9 in total) from pervious grid,
/// first one times 2^8 , last one times 2^0 which is 0 , sum them up as a number, also an index,
/// read rule from rules array, return the rule
fn next_state_by_rule(x: u32, y: u32) -> u32 {
  let h = canvas_size.y;
  let w = canvas_size.x;


  var index = 0u;
  for (var j = -1i; j <= 1i; j = j + 1i) {
    for (var i = -1i; i <= 1i; i = i + 1i) {
      // however this is wrong
      let local_y = 1 - j;
      let local_x = 1 - i;
      let v = local_y * 3i + local_x;
      let scaled = pow_int(2u, u32(v));

      // let cell = getCell(i32(x) + i, i32(y) + j);
      // index = index + cell * (1u << u32(u32(i) + 1u) * 3u + (j + 1u));
      let cell = getCell(i32(x) + i, i32(y) + j);
      index = index + cell * scaled;
    }
  }

  return rules[index];
}

@compute @workgroup_size(blockSize, blockSize)
fn main(@builtin(global_invocation_id) grid: vec3<u32>) {
  let x = grid.x;
  let y = grid.y;
  let w = canvas_size.x;
  let h = canvas_size.y;

  if x == 0u || y == 0u || x == w - 1u || y == h - 1u {
    let index = getIndex(i32(x), i32(y));
    return ;
  }
  // let n = countNeighbors(x, y);
  let n = next_state_by_rule(x, y);
  // next[getIndex(x, y)] = select(u32(n == 3u), u32(n == 2u || n == 3u), getCell(x, y) == 1u);
  next[getIndex(i32(x), i32(y))] = n;
}

