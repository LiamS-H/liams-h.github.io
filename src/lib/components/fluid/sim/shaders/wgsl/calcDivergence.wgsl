#include "./common/idx.wgsl"
#include "./common/uniforms_res_dt.wgsl"
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
@group(0) @binding(3) var<storage, read_write> divergence : array<f32>;

fn vel(x : f32, y : f32) -> vec2<f32> { let id = idx(x, y); return vec2(vel_read_x[id], vel_read_y[id]); }

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    let L = vel(pos.x - 1, pos.y).x;
    let R = vel(pos.x + 1, pos.y).x;
    let B = vel(pos.x, pos.y - 1).y;
    let T = vel(pos.x, pos.y + 1).y;

    divergence[index] = 0.5 * U.rdx * ((R - L) + (T - B));
}
