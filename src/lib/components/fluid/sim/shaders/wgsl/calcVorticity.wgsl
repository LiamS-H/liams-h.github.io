#include "./common/idx.wgsl"
#include "./common/uniforms_res_dt.wgsl"
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
@group(0) @binding(3) var<storage, read_write> vorticity_write : array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    let Ly = vel_read_y[idx(pos.x - 1, pos.y)];
    let Ry = vel_read_y[idx(pos.x + 1, pos.y)];
    let Bx = vel_read_x[idx(pos.x, pos.y - 1)];
    let Tx = vel_read_x[idx(pos.x, pos.y + 1)];

    vorticity_write[index] = 0.5 * U.rdx * ((Ry - Ly) - (Tx - Bx));
}
