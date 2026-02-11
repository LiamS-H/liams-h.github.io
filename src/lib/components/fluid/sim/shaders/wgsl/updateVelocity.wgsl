#include "./common/idx.wgsl"

struct Uniforms {
    res: vec2<f32>,
    mouse_pos: vec2<f32>,
    mouse_vel: vec2<f32> 
};

#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> vel_read_x: array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_y: array<f32>;
@group(0) @binding(3) var<storage, read_write> vel_write_x: array<f32>;
@group(0) @binding(4) var<storage, read_write> vel_write_y: array<f32>;


@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    if (pos.x <= 6) {
    // if (pos.x >= 1 && ( pos.x <= 5 || pos.x >= U.res.x - 4 ) ) {
        vel_write_x[index] = 0.03;
        vel_write_y[index] = 0.0;
        return;
    }
    if (U.mouse_vel.x != 0 || U.mouse_vel.y != 0) {
        var mouse_pos = U.mouse_pos;
        mouse_pos.x *= U.res.x;
        mouse_pos.y *= U.res.y;

        var distance = pos - mouse_pos;
        distance.x *= U.res.x / U.res.y;
        var vel = U.mouse_vel;
        vel.x = U.res.x / U.res.y;

        var motion = exp(-dot(distance,distance) / 100) * vel;
        motion *= 0.01;

        vel_write_x[index] = vel_read_x[index] + motion.x;
        vel_write_y[index] = vel_read_y[index] + motion.y;
        return;
    }

    vel_write_x[index] = vel_read_x[index];
    vel_write_y[index] = vel_read_y[index];
}
