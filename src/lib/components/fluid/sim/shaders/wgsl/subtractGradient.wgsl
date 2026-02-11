#include "./common/idx.wgsl"
#include "./common/uniforms_res_dt.wgsl"
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> pres_read : array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_x : array<f32>;
@group(0) @binding(3) var<storage, read> vel_read_y : array<f32>;
@group(0) @binding(4) var<storage, read_write> vel_write_x : array<f32>;
@group(0) @binding(5) var<storage, read_write> vel_write_y : array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    let L = pos - vec2(1, 0);
    let R = pos + vec2(1, 0);
    let B = pos - vec2(0, 1);
    let T = pos + vec2(0, 1);

    let xL = pres_read[idx(L.x, L.y)];
    let xR = pres_read[idx(R.x, R.y)];
    let yB = pres_read[idx(B.x, B.y)];
    let yT = pres_read[idx(T.x, T.y)];
    
    let finalX = vel_read_x[index] - .5 * U.rdx * (xR - xL);
    let finalY = vel_read_y[index] - .5 * U.rdx * (yT - yB);

    vel_write_x[index] = finalX;
    vel_write_y[index] = finalY;
}
