#include "./common/idx.wgsl"
#include "./common/rect.wgsl"
#include "./common/checkBoundsRect.wgsl"

struct Uniforms {
    res: vec2<f32>,
    rects: f32,
    padding: f32,
}

#include "./common/binding.wgsl"
@group(0) @binding(1) var<storage, read> rectangles : array<rect>;
@group(0) @binding(2) var<storage, read_write> solids: array<f32>;

fn checkSolidBounds(pos:vec2<f32>) -> bool {
    let numRects = u32(U.rects);
    for (var i = 0u; i < numRects; i = i + 1u) {
        let r = rectangles[i];
        if (r.w == 0) {return false;}
        if (checkBoundsRect(pos, r)) {
            return true;
        }
    }
    return false;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    var pos = vec2<f32>(global_id.xy);
    let index = idx(pos.x, pos.y);

    if (checkSolidBounds(pos)) {
        solids[index] = 0.0;
    } 
}
