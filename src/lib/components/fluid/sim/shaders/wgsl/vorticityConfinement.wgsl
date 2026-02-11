#include "./common/idx.wgsl"
struct Uniforms {
    res: vec2<f32>,
    dt: f32,
    dx: f32,
    rdx: f32,
    vort: f32,
}
#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
@group(0) @binding(3) var<storage, read> vort_read : array<f32>;
@group(0) @binding(4) var<storage, read_write> vel_write_x : array<f32>;
@group(0) @binding(5) var<storage, read_write> vel_write_y : array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    let L = vort_read[idx(pos.x - 1, pos.y)];
    let R = vort_read[idx(pos.x + 1, pos.y)];
    let B = vort_read[idx(pos.x, pos.y - 1)];
    let T = vort_read[idx(pos.x, pos.y + 1)];
    let C = vort_read[index];

    var force = 0.5 * U.rdx * vec2(abs(T) - abs(B), abs(R) - abs(L));

    let epsilon = 2.4414e-4;
    let magSqr = max(epsilon, dot(force, force));

    force = force / sqrt(magSqr);
    force *= U.dx * U.vort * U.dt * C * vec2(1, -1);

    vel_write_x[index] = vel_read_x[index] + force.x;
    vel_write_y[index] = vel_read_y[index] + force.y;
    // vel_write_x[index] = vel_read_x[index] ;
    // vel_write_y[index] = vel_read_y[index] ;
}
