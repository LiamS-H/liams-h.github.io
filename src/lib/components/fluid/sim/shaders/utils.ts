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
}
export namespace UNIFORM {
    export const binding = /*wgsl*/ `
    @group(0) @binding(0) var<uniform> U: Uniforms;`;

    export const res = /*wgsl*/ `
    struct Uniforms {
        res: vec2<f32>,
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
