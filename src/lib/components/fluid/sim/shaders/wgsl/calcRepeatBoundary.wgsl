#include "./common/idx.wgsl"
#include "./common/uniforms_res.wgsl"
#include "./common/binding.wgsl"

@group(0) @binding(1) var<storage, read> val_read_x : array<f32>;
@group(0) @binding(2) var<storage, read> solids_read : array<f32>;
@group(0) @binding(3) var<storage, read_write> val_write_x : array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_boundary_header.wgsl"

    if (pos.x == 0) { pos.x += 1;}
    // if (pos.x == U.res.x - 1) { pos.x -= 1;}
    if (pos.y == 0) { pos.y += 1;}
    if (pos.y == U.res.y - 1) { pos.y -= 1; }

    if (solids_read[index] == -1) {
        let ST = solids_read[idx(pos.x,pos.y+1)];
        let SB = solids_read[idx(pos.x,pos.y-1)];
        let SR = solids_read[idx(pos.x+1,pos.y)];
        let SL = solids_read[idx(pos.x-1,pos.y)];
        if (ST==0) {
            pos.y -= 1;
        }
        if (SB==0) {
            pos.y += 1;
        }
        if (SR==0) {
            pos.x -= 1;
        }
        if (SL==0) {
            pos.x += 1;
        }
        if (ST + SB + SR + SL == 0) {
            // val_write_x[index] = val_read_x[idx(pos.x, pos.y)] * 0.9;
            val_write_x[index] = 0.0;
            return;
        }
    }
    val_write_x[index] = val_read_x[idx(pos.x, pos.y)];
}
