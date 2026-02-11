#include "./common/idx.wgsl"
#include "./common/uniforms_res_dt.wgsl"
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> smoke_read_r : array<f32>;
@group(0) @binding(2) var<storage, read> smoke_read_g : array<f32>;
@group(0) @binding(3) var<storage, read> smoke_read_b : array<f32>;
@group(0) @binding(4) var<storage, read> vel_read_x : array<f32>;
@group(0) @binding(5) var<storage, read> vel_read_y : array<f32>;
@group(0) @binding(6) var<storage, read_write> smoke_write_r : array<f32>;
@group(0) @binding(7) var<storage, read_write> smoke_write_g : array<f32>;
@group(0) @binding(8) var<storage, read_write> smoke_write_b : array<f32>;

fn smoke(x : f32, y : f32) -> vec3<f32> {
    let id = idx(x, y);
    return vec3(smoke_read_r[id], smoke_read_g[id], smoke_read_b[id]);
}
fn vel(x : f32, y : f32) -> vec2<f32> { 
    let id = idx(x,y);
    return vec2(vel_read_x[id], vel_read_y[id]);
}

fn vel_bilerp(x0 : f32, y0 : f32) -> vec2<f32> {
    var x = x0;
    var y = y0;

    x = clamp(x, 0, U.res.x);
    y = clamp(y, 0, U.res.y);

    let x1 = floor(x);
    let y1 = floor(y);
    let x2 = x1 + 1;
    let y2 = y1 + 1;

    let TL = vel(x1, y2);
    let TR = vel(x2, y2);
    let BL = vel(x1, y1);
    let BR = vel(x2, y1);

    let xMod = fract(x);
    let yMod = fract(y);

    return mix( mix(BL, BR, xMod), mix(TL, TR, xMod), yMod );
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    

    let V = vel_bilerp(pos.x, pos.y);

    var x = pos.x - U.dt * U.rdx * V.x;
    var y = pos.y - U.dt * U.rdx * V.y;

    x = clamp(x, 0, U.res.x);
    y = clamp(y, 0, U.res.y);

    let x1 = floor(x);
    let y1 = floor(y);
    let x2 = x1 + 1;
    let y2 = y1 + 1;

    let TL = smoke(x1, y2);
    let TR = smoke(x2, y2);
    let BL = smoke(x1, y1);
    let BR = smoke(x2, y1);

    let xMod = fract(x);
    let yMod = fract(y);

    let bilerp = mix( mix(BL, BR, xMod), mix(TL, TR, xMod), yMod );

    smoke_write_r[index] = bilerp.x;
    smoke_write_g[index] = bilerp.y;
    smoke_write_b[index] = bilerp.z;
}
