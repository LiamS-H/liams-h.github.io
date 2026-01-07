export namespace FUNCTION {
    export const idx = /*wgsl*/ `
    fn idx(x: f32, y: f32) -> u32 {
        return u32((y * U.res.x) + x);
    }
    `;
    export const checkBounds = /*wgsl*/ `
    fn checkBounds(x: f32, y: f32) -> bool {
        return x >= U.res.x - 1 || y >= U.res.y - 1 || x == 0 || y == 0;
    }
    `;
    export const checkBoundsRect = /*wgsl*/ `
    fn checkBoundsRect(pos: vec2<f32>, rect: rect) -> bool {
        let x = rect.x * U.res.x;
        let y = rect.y * U.res.y;
        let w = rect.w * U.res.x;
        let h = rect.h * U.res.y;
        return x < pos.x && pos.x < x + w && y < pos.y && pos.y < y + h;
    }
    `;
    export const smokeColor = /*wgsl*/ `
    fn smokeColor(c: i32, y_ratio: f32) -> vec3<f32> {
        if (c == 0) {
            return vec3<f32>(1.0, y_ratio, 1.0);
        } else if (c == 1) {
            return vec3<f32>(1.0, y_ratio, 0.5);
        } else if (c == 2) {
            return vec3<f32>(y_ratio, 1.0, 0.5);
        } else if (c == 3) {
            return vec3<f32>(y_ratio, 1.0, 1.0);
        } else if (c == 4) {
            return vec3<f32>(1.0, y_ratio * 0.5, y_ratio * 0.5);
        } else if (c == 5) {
            return vec3<f32>(1.0, y_ratio * 0.5, 0.5 + y_ratio * 0.2);
        } else if (c == 6) {
            return vec3<f32>(0.5 + y_ratio * 0.2, y_ratio * 0.5, 1.0);
        }
        return vec3<f32>(0.0, 0.0, 0.0);
    }
    `;
}
export namespace STRUCT {
    export const rect = /*wgsl*/ `
    struct rect {
        x: f32,
        y: f32,
        w: f32,
        h: f32,
        color: f32,
        p1: f32,
        p2: f32,
        p3: f32,
    }
    `;
}
export namespace UNIFORM {
    export const binding = /*wgsl*/ `
    @group(0) @binding(0) var<uniform> U: Uniforms;`;

    export const res = /*wgsl*/ `
    struct Uniforms {
        res: vec2<f32>,
        horizontal_view_buffer: f32,
        vertical_view_buffer: f32,
    };`;

    export const res_dt = /*wgsl*/ `
    struct Uniforms {
        res: vec2<f32>,
        dt: f32,
        dx: f32,
        rdx: f32,
        padding: f32,
    }`;
}
