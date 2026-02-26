#include "./common/idx.wgsl"
#include "./common/rect.wgsl"
#include "./common/checkBoundsRect.wgsl"
#include "./common/smokeColor.wgsl"

struct Uniforms {
    res: vec2<f32>,
    diffusion: f32,
    color: f32,
    rects: f32,
    padding: f32,
}

#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> smoke_read_r: array<f32>;
@group(0) @binding(2) var<storage, read> smoke_read_g: array<f32>;
@group(0) @binding(3) var<storage, read> smoke_read_b: array<f32>;
@group(0) @binding(4) var<storage, read_write> solids_read: array<f32>;
@group(0) @binding(5) var<storage, read> rectangles : array<rect>;
@group(0) @binding(6) var<storage, read_write> smoke_write_r: array<f32>;
@group(0) @binding(7) var<storage, read_write> smoke_write_g: array<f32>;
@group(0) @binding(8) var<storage, read_write> smoke_write_b: array<f32>;

struct SmokeBound {
    color: i32,
    y_ratio: f32,
    coverage: f32
}

fn checkSmokeBounds(pos: vec2<f32>) -> SmokeBound {
    let numRects = u32(U.rects);
    for (var i = 0u; i < numRects; i = i + 1u) {
        let r = rectangles[i];
        if (r.w == 0) {break;}
        let coverage = checkBoundsRect(pos, r);
        if (coverage > 0.0) {
            if (r.h > 0.2) {
                return SmokeBound(i32(r.color), (pos.y-(r.y * U.res.y))/(r.h * U.res.y), coverage);
            }
            return SmokeBound(i32(r.color), 0.0, coverage);
        }
    }
    return SmokeBound(-1, 0.0, 0.0);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    #include "./common/compute_header.wgsl"

    let y_ratio = f32(pos.y / U.res.y);

    if (pos.x <= 4) {
        let smoke = smokeColor(i32(U.color), y_ratio);
        smoke_write_r[index] = smoke.x;
        smoke_write_g[index] = smoke.y;
        smoke_write_b[index] = smoke.z;
        return;
    }

    let smoke = checkSmokeBounds(pos);
    if (smoke.color >= 0) {
        let sc = smokeColor(smoke.color, smoke.y_ratio);
        smoke_write_r[index] = mix(smoke_read_r[index], sc.x, smoke.coverage);
        smoke_write_g[index] = mix(smoke_read_g[index], sc.y, smoke.coverage);
        smoke_write_b[index] = mix(smoke_read_b[index], sc.z, smoke.coverage);
        return;
    }

    if (solids_read[index] == 0) {
        smoke_write_r[index] = smoke_read_r[index] * 0.0;
        smoke_write_g[index] = smoke_read_g[index] * 0.0;
        smoke_write_b[index] = smoke_read_b[index] * 0.0;
        return;
    }

    smoke_write_r[index] = smoke_read_r[index] * U.diffusion;
    smoke_write_g[index] = smoke_read_g[index] * U.diffusion;
    smoke_write_b[index] = smoke_read_b[index] * U.diffusion;
}
