import { FUNCTION, UNIFORM } from './utils';

export const render_shader = /*wgsl*/ `
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
};

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    
    let vertices = array<vec2<f32>, 6>(
        vec2<f32>(-1, -1),
        vec2<f32>(1, -1),
        vec2<f32>(-1, 1),
        vec2<f32>(-1, 1),
        vec2<f32>(1,-1),
        vec2<f32>(1, 1)
    );

    output.position = vec4<f32>(vertices[vertexIndex], 0.0, 1.0);
    output.texCoord = (vertices[vertexIndex] + 1.0) * 0.5;

    return output;
}

${UNIFORM.res}
${UNIFORM.binding}
@group(0) @binding(1) var<storage, read> smoke_r: array<f32>;
@group(0) @binding(2) var<storage, read> smoke_g: array<f32>;
@group(0) @binding(3) var<storage, read> smoke_b: array<f32>;
@group(0) @binding(4) var<storage, read> solids: array<f32>;
@group(0) @binding(5) var<storage, read> vel_x: array<f32>;
@group(0) @binding(6) var<storage, read> vel_y: array<f32>;
@group(0) @binding(7) var<storage, read> divergence: array<f32>;
@group(0) @binding(8) var<storage, read> pressure: array<f32>;

${FUNCTION.idx}

@fragment
fn fragmentMain(@location(0) texCoord: vec2<f32>) -> @location(0) vec4<f32> {
    let x = clamp(texCoord.x * U.res.x, 0.0, U.res.x - 1.0);
    let y = clamp(texCoord.y * U.res.y, 0.0, U.res.y - 1.0);
    let index = u32(floor(y) * U.res.x + floor(x));

    var smoke_color = vec3<f32>(smoke_r[index], smoke_g[index], smoke_b[index]);
    let s = solids[index];

    if (s == 0) {
        return vec4<f32>(0,0,0, 1.0);
    }
    let u = vel_x[index];
    let v = vel_y[index];
    let p = pressure[index];
    // let vel = sqrt(u*u+v*v) * 2;
    let vel = u*u+v*v * 400;

    let vscale = 30.0;

    let d = divergence[index];
    if (smoke_color.x <0.01 && smoke_color.y <0.01 && smoke_color.z<0.01) {
        return vec4<f32>(smoke_color, 1.0);
    }

    smoke_color = smoke_color * (1 / pow(smoke_color, vec3<f32>(vel,vel,vel))); 

    smoke_color.r *= 1 + abs(v) * vscale;
    smoke_color.b *= 1 + abs(u) * vscale;


    return vec4<f32>(smoke_color, 1.0);
}
`;
