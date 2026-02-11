#include "./common/idx.wgsl"
#include "./common/uniforms_res_dt.wgsl"
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> vel_read_x: array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_y: array<f32>;
// @group(0) @binding(3) var<storage, read> solids: array<f32>;
@group(0) @binding(3) var<storage, read_write> vel_write_x: array<f32>;
@group(0) @binding(4) var<storage, read_write> vel_write_y: array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"
    var x = pos.x - U.dt * U.rdx * vel_read_x[index];
    var y = pos.y - U.dt * U.rdx * vel_read_y[index];
    // x = clamp(x, 0, U.res.x-1);
    // y = clamp(y, 0, U.res.y-1);
    if (x < 1) { x = 1; }
    // if (x >= U.res.x - 1) { x = U.res.x - 1; }
    if (y < 0) { y = 0; }
    if (y >= U.res.y - 1) { y = U.res.y - 1; }

    let x1 = floor(x);
    let y1 = floor(y);
    let x2 = x1+1;
    let y2 = y1+1;

    let TL = vec2(vel_read_x[idx(x1, y2)], vel_read_y[idx(x1, y2)]);
    let TR = vec2(vel_read_x[idx(x2, y2)], vel_read_y[idx(x2, y2)]);
    let BL = vec2(vel_read_x[idx(x1, y1)], vel_read_y[idx(x1, y1)]);
    let BR = vec2(vel_read_x[idx(x2, y1)], vel_read_y[idx(x2, y1)]);

    let xMod = fract(x);
    let yMod = fract(y);
    
    let bilerp = mix( mix(BL, BR, xMod), mix(TL, TR, xMod), yMod );

    vel_write_x[index] = bilerp.x;
    vel_write_y[index] = bilerp.y;
}
