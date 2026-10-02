// Placeholder — se reemplaza por el shader final.
struct Params { time: f32, resolution: vec2f, pointer: vec2f }
@group(0) @binding(0) var<uniform> params: Params;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let c = mix(vec3f(0.043, 0.086, 0.149), vec3f(0.769, 0.325, 0.184), uv.y * (0.6 + 0.4 * sin(params.time * 0.3)));
  return vec4f(c, 1.0);
}
