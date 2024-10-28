import { FUNCTION, UNIFORM } from "./utils";

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
    output.texCoord.x = (vertices[vertexIndex].x + 2) * 0.5;
    output.texCoord.y = (vertices[vertexIndex].y + 1.0) * 0.5;
    // output.texCoord = (vertices[vertexIndex]+1) * 0.5;

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
    let x = texCoord.x * (U.res.x)+1;
    let y = texCoord.y * (U.res.y)+1;
    // let index = idx(x, y);
    let index = u32((y * U.res.x) + x);

    let smoke_color = vec3<f32>(smoke_r[index], smoke_g[index], smoke_b[index]);
    let s = solids[index];
    if (s == 0) {
        // return vec4<f32>(0.5,0,0, 1.0);
        // return vec4<f32>(1,1,1, 1.0);
        return vec4<f32>(0,0,0, 1.0);
    }
    let u = vel_x[index];
    let v = vel_y[index];
    let p = pressure[index];
    let vel = sqrt(u*u+v*v);

    let d = divergence[index];
    let vscale = 0.07;

    var out = vec4<f32>(smoke_color, 1.0);
    if (out.r <=0.1 && out.g <=0.1 &&out.b <=0.1) {
        return out;
    }
    out.r += abs(v) * 5;
    out.b += abs(u) * 5;
    
    // out.g += abs(v) * abs(u) * 2.25;
    return out;


    // return vec4<f32>(x / U.res.x, y / U.res.y, 0.0, 1.0);
    // return vec4<f32>(f32(index)/1024,0.0,0.0, 1.0);
    // return vec4<f32>(f32(x>=1 && x <= 4),f32(y>=1 && y<=2),0, 1.0);
    // return vec4<f32>(smoke_color, 1.0);
    // return vec4<f32>(f32(d>0 && x>6),0,0, 1.0);
    // return vec4<f32>(f32(texCoord.x > 1),0.0, 0.0, 1.0);
    // return vec4<f32>(f32(u32(U.res.x) == 1636),f32(u32(U.res.y) == 1024), 0.0, 1.0);
// return vec4<f32>(texCoord.x, texCoord.y, 0.0, 1.0);
}
`;
