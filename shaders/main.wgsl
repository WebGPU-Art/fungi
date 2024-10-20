
struct Out {
  @builtin(position) pos: vec4<f32>,
  @location(0) cell: f32,
}

@binding(0) @group(0) var<uniform> screen_size: vec2<u32>;

@vertex
fn vert_main(@builtin(instance_index) i: u32, @location(0) cell: u32, @location(1) pos: vec2<u32>) -> Out {
  let w = screen_size.x;
  let h = screen_size.y;
  let x = (f32(i % w + pos.x) / f32(w) - 0.5) * 2.0;
  let y = (f32((i - (i % w)) / w + pos.y) / f32(h) - 0.5) * 2.0;

  return Out(vec4<f32>(x, y, 0., 1.), f32(cell) * 0.7);
}

@fragment
fn frag_main(@location(0) cell: f32) -> @location(0) vec4<f32> {
  return vec4<f32>(cell, cell, cell, 1.);
}
