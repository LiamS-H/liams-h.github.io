// TO DO: allow non binary solids
#include "./common/idx.wgsl"
#include "./common/uniforms_res.wgsl"
#include "./common/binding.wgsl"

@group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
@group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
@group(0) @binding(3) var<storage, read> solids_read : array<f32>;
@group(0) @binding(4) var<storage, read_write> vel_write_x : array<f32>;
@group(0) @binding(5) var<storage, read_write> vel_write_y : array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_boundary_header.wgsl"

    var scaleX = 1.;
    var scaleY = 1.;

    

    if (pos.x == 0) { pos.x += 1; scaleX = -1.; }
    // if (pos.x == U.res.x - 1) { pos.x -= 1; scaleX = -1.; }
    if (pos.y == 0) { pos.y += 1; scaleY = -1.; }
    if (pos.y == U.res.y - 1) { pos.y -= 1; scaleY = -1.; }

    if (solids_read[index] == 0) {
        let ST = solids_read[idx(pos.x,pos.y+1)];
        let SB = solids_read[idx(pos.x,pos.y-1)];
        let SR = solids_read[idx(pos.x+1,pos.y)];
        let SL = solids_read[idx(pos.x-1,pos.y)];
        if (ST==0) {
            scaleY = -1;
            pos.y -= 1;
        }
        if (SB==0) {
            scaleY = -1;
            pos.y += 1;
        }
        if (SR==0) {
            scaleX = -1;
            pos.x -= 1;
        }
        if (SL==0) {
            scaleX = -1;
            pos.x += 1;
        }
        if (ST + SB + SR + SL == 0) {
            // very fun for non 0 values
            // scaleX = 1.01;
            // scaleY = 1.01;
            scaleX = 0.00;
            scaleY = 0.00;
        }
    }
    vel_write_x[index] = vel_read_x[idx(pos.x, pos.y)] * scaleX;
    vel_write_y[index] = vel_read_y[idx(pos.x, pos.y)] * scaleY;

}
