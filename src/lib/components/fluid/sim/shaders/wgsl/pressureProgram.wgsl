#include "./common/idx.wgsl"
#include "./common/uniforms_res_dt.wgsl"
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> pres_read : array<f32>;
@group(0) @binding(2) var<storage, read> divergence : array<f32>;
// @group(0) @binding(3) var<storage, read> solids : array<f32>;
@group(0) @binding(3) var<storage, read_write> pres_write : array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    let L = pos - vec2(1, 0);
    let R = pos + vec2(1, 0);
    let B = pos - vec2(0, 1);
    let T = pos + vec2(0, 1);

    let Lx = pres_read[idx(L.x, L.y)];
    let Rx = pres_read[idx(R.x, R.y)];
    let Bx = pres_read[idx(B.x, B.y)];
    let Tx = pres_read[idx(T.x, T.y)];

    let bC = divergence[index];

    let alpha = -(U.dx * U.dx);
    let rBeta = .25;

    pres_write[index] = (Lx + Rx + Bx + Tx + alpha * bC) * rBeta;
}
