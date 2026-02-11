#include "./common/idx.wgsl"
struct Uniforms {
    res: vec2<f32>,
    visc: f32,
    padding:f32,
}
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> pres_read : array<f32>;
@group(0) @binding(2) var<storage, read_write> pres_write : array<f32>;
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    pres_write[index] = pres_read[index]*U.visc;
}
