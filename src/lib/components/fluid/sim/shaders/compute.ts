import { FUNCTION, UNIFORM } from './utils';
const COMPUTE_BOUNDARY_HEADER = /*wgsl*/ `
var pos = vec2<f32>(global_id.xy);
let index = idx(pos.x, pos.y);
`;
const COMPUTE_HEADER = /*wgsl*/ `
var pos = vec2<f32>(f32(global_id.x),f32(global_id.y));

if (pos.x == 0 || pos.y == 0 || pos.x >= U.res.x - 1 || pos.y >= U.res.y - 1) {
    return;
}

let index = idx(pos.x, pos.y);
`;
export namespace PROGRAM {
	export const updateSolids = /*wgsl*/ `
    ${FUNCTION.idx}
    struct Uniforms {
        res: vec2<f32>,
        rects: f32,
        padding: f32,
    }
    struct rect {
        x: f32,
        y: f32,
        w: f32,
        h: f32,
    }

    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> rectangles : array<rect>;
    @group(0) @binding(2) var<storage, read_write> solids: array<f32>;

    fn checkBounds(pos:vec2<f32>) -> bool {
        let numRects = u32(U.rects);
        // let rect = rectangles[0];
        // if (numRects > 0) {
        //     return rect.w > 0;
        // }
        for (var i = 0u; i < numRects; i = i + 1u) {
            let rect = rectangles[i];
            
            let x = rect.x * U.res.x;
            let y = rect.y * U.res.y;
            let w = rect.w * U.res.x;
            let h = rect.h * U.res.y;

            if (x < pos.x && pos.x < x + w && y < pos.y && pos.y < y + h) {
                return true;
            }
        }
        return false;
    }

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        var pos = vec2<f32>(global_id.xy);
        let index = idx(pos.x, pos.y);

        // if (pos.x == 0 || pos.y == 0 || pos.x >= U.res.x - 1 || pos.y >= U.res.y - 1) {
        // if (pos.x == 0 || pos.y == 0 || pos.y >= U.res.y - 1) {
        //     solids[index] = 0.0;
        //     return;
        // }

        if (checkBounds(pos)) {
            solids[index] = 0.0;
        } 
        // solids[index] = 1;
    }
    `;
	export const updateSmoke = /*wgsl*/ `
    ${FUNCTION.idx}
    struct Uniforms {
        res: vec2<f32>,
        diffusion: f32,
        color: f32,
    }
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> smoke_read_r: array<f32>;
    @group(0) @binding(2) var<storage, read> smoke_read_g: array<f32>;
    @group(0) @binding(3) var<storage, read> smoke_read_b: array<f32>;
    @group(0) @binding(4) var<storage, read_write> solids_read: array<f32>;
    @group(0) @binding(5) var<storage, read_write> smoke_write_r: array<f32>;
    @group(0) @binding(6) var<storage, read_write> smoke_write_g: array<f32>;
    @group(0) @binding(7) var<storage, read_write> smoke_write_b: array<f32>;


    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

        if (pos.x <= 4) {
            if (U.color == 0) {
                smoke_write_r[index] = 1;
                smoke_write_g[index] = f32(pos.y / U.res.y);
                smoke_write_b[index] = 1;
                return;
            }
            // if (U.color == 0 || (pos.y > 0.6 * U.res.y || pos.y < 0.4 * U.res.y )) {
            //     return;
            // }
            if (U.color == 1) {
                smoke_write_r[index] = 1;
                smoke_write_g[index] = f32(pos.y / U.res.y);
                smoke_write_b[index] = 0.5;
                return;
            }
            if (U.color == 2) {
                smoke_write_r[index] = f32(pos.y / U.res.y);
                smoke_write_g[index] = 1;
                smoke_write_b[index] = 0.5;
                return;
            }
            if (U.color == 3) {
                smoke_write_r[index] = f32(pos.y / U.res.y);
                smoke_write_g[index] = 1;
                smoke_write_b[index] = 1;
                return;
            }
            if (U.color == 4) {
                smoke_write_r[index] = 1;
                smoke_write_g[index] = f32(pos.y / U.res.y)*0.5;
                smoke_write_b[index] = f32(pos.y / U.res.y)*0.5;
                return;
            }
            if (U.color == 5) {
                smoke_write_r[index] = 1;
                smoke_write_g[index] = f32(pos.y / U.res.y)*0.5;
                smoke_write_b[index] = 0.5 + f32(pos.y / U.res.y)*0.2;
                return;
            }
            if (U.color == 6) {
                smoke_write_r[index] = 0.5 + f32(pos.y / U.res.y)*0.2;
                smoke_write_g[index] = f32(pos.y / U.res.y)*0.5;
                smoke_write_b[index] = 1;
                return;
            }
        }
        if (solids_read[index] == 0) {
            smoke_write_r[index] = smoke_read_r[index] * 0.0;
            smoke_write_g[index] = smoke_read_g[index] * 0.0;
            smoke_write_b[index] = smoke_read_b[index] * 0.0;
            // smoke_write_r[index] = smoke_read_r[index] * U.diffusion * 0.99;
            // smoke_write_g[index] = smoke_read_g[index] * U.diffusion * 0.99;
            // smoke_write_b[index] = smoke_read_b[index] * U.diffusion * 0.99;
            return;
        }

        smoke_write_r[index] = smoke_read_r[index] * U.diffusion;
        smoke_write_g[index] = smoke_read_g[index] * U.diffusion;
        smoke_write_b[index] = smoke_read_b[index] * U.diffusion;
    }
    `;
	export const updateVelocity = /*wgsl*/ `
    ${FUNCTION.idx}
    struct Uniforms {
        res: vec2<f32>,
        mouse_pos: vec2<f32>,
        mouse_vel: vec2<f32> 
    };
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> vel_read_x: array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_y: array<f32>;
    @group(0) @binding(3) var<storage, read_write> vel_write_x: array<f32>;
    @group(0) @binding(4) var<storage, read_write> vel_write_y: array<f32>;


    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER} 

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
    `;
	export const advectVelocity = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res_dt}
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> vel_read_x: array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_y: array<f32>;
    // @group(0) @binding(3) var<storage, read> solids: array<f32>;
    @group(0) @binding(3) var<storage, read_write> vel_write_x: array<f32>;
    @group(0) @binding(4) var<storage, read_write> vel_write_y: array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}
        var x = pos.x - U.dt * U.rdx * vel_read_x[index];
        var y = pos.y - U.dt * U.rdx * vel_read_y[index];
        // x = clamp(x, 0, U.res.x-1);
        // y = clamp(y, 0, U.res.y-1);
        if (x < 1) { x = 1; }
        // if (x >= U.res.x - 1) { x = U.res.x - 1; }
        if (y < 0) { y = 0; }
        if (y >= U.res.y - 1) { y = U.res.y - 1; }

        let x1 = floor(x);
        let y1 = floor(y);
        let x2 = x1+1;
        let y2 = y1+1;

        let TL = vec2(vel_read_x[idx(x1, y2)], vel_read_y[idx(x1, y2)]);
        let TR = vec2(vel_read_x[idx(x2, y2)], vel_read_y[idx(x2, y2)]);
        let BL = vec2(vel_read_x[idx(x1, y1)], vel_read_y[idx(x1, y1)]);
        let BR = vec2(vel_read_x[idx(x2, y1)], vel_read_y[idx(x2, y1)]);

        let xMod = fract(x);
        let yMod = fract(y);
        
        let bilerp = mix( mix(BL, BR, xMod), mix(TL, TR, xMod), yMod );

        vel_write_x[index] = bilerp.x;
        vel_write_y[index] = bilerp.y;
    }
    `;
	export const velocityBoundary = /*wgsl*/ `
    // TO DO: allow non binary solids
    ${FUNCTION.idx}
    ${UNIFORM.res}
    ${UNIFORM.binding}

    @group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
    @group(0) @binding(3) var<storage, read> solids_read : array<f32>;
    @group(0) @binding(4) var<storage, read_write> vel_write_x : array<f32>;
    @group(0) @binding(5) var<storage, read_write> vel_write_y : array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_BOUNDARY_HEADER}

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

    }`;
	export const calcDivergence = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res_dt}
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
    @group(0) @binding(3) var<storage, read_write> divergence : array<f32>;

    fn vel(x : f32, y : f32) -> vec2<f32> { let id = idx(x, y); return vec2(vel_read_x[id], vel_read_y[id]); }

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

        let L = vel(pos.x - 1, pos.y).x;
        let R = vel(pos.x + 1, pos.y).x;
        let B = vel(pos.x, pos.y - 1).y;
        let T = vel(pos.x, pos.y + 1).y;

        divergence[index] = 0.5 * U.rdx * ((R - L) + (T - B));
    }
    `;
	export const calcRepeatBoundary = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res}
    ${UNIFORM.binding}

    @group(0) @binding(1) var<storage, read> val_read_x : array<f32>;
    @group(0) @binding(2) var<storage, read> solids_read : array<f32>;
    @group(0) @binding(3) var<storage, read_write> val_write_x : array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_BOUNDARY_HEADER}

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
    }`;
	export const pressureProgram = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res_dt}
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> pres_read : array<f32>;
    @group(0) @binding(2) var<storage, read> divergence : array<f32>;
    // @group(0) @binding(3) var<storage, read> solids : array<f32>;
    @group(0) @binding(3) var<storage, read_write> pres_write : array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER};

        let L = pos - vec2(1, 0);
        let R = pos + vec2(1, 0);
        let B = pos - vec2(0, 1);
        let T = pos + vec2(0, 1);

        let Lx = pres_read[idx(L.x, L.y)];
        let Rx = pres_read[idx(R.x, R.y)];
        let Bx = pres_read[idx(B.x, B.y)];
        let Tx = pres_read[idx(T.x, T.y)];

        let bC = divergence[index];

        let alpha = -(U.dx * U.dx);
        let rBeta = .25;

        pres_write[index] = (Lx + Rx + Bx + Tx + alpha * bC) * rBeta;
    }`;
	export const subtractGradient = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res_dt}
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> pres_read : array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_x : array<f32>;
    @group(0) @binding(3) var<storage, read> vel_read_y : array<f32>;
    @group(0) @binding(4) var<storage, read_write> vel_write_x : array<f32>;
    @group(0) @binding(5) var<storage, read_write> vel_write_y : array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

        let L = pos - vec2(1, 0);
        let R = pos + vec2(1, 0);
        let B = pos - vec2(0, 1);
        let T = pos + vec2(0, 1);

        let xL = pres_read[idx(L.x, L.y)];
        let xR = pres_read[idx(R.x, R.y)];
        let yB = pres_read[idx(B.x, B.y)];
        let yT = pres_read[idx(T.x, T.y)];
        
        let finalX = vel_read_x[index] - .5 * U.rdx * (xR - xL);
        let finalY = vel_read_y[index] - .5 * U.rdx * (yT - yB);

        vel_write_x[index] = finalX;
        vel_write_y[index] = finalY;
    }`;
	export const clearPressure = /*wgsl*/ `
    ${FUNCTION.idx}
    struct Uniforms {
        res: vec2<f32>,
        visc: f32,
        padding:f32,
    }
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> pres_read : array<f32>;
    @group(0) @binding(2) var<storage, read_write> pres_write : array<f32>;
    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

        pres_write[index] = pres_read[index]*U.visc;
    }`;
	export const calcVorticity = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res_dt}
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
    @group(0) @binding(3) var<storage, read_write> vorticity_write : array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

        let Ly = vel_read_y[idx(pos.x - 1, pos.y)];
        let Ry = vel_read_y[idx(pos.x + 1, pos.y)];
        let Bx = vel_read_x[idx(pos.x, pos.y - 1)];
        let Tx = vel_read_x[idx(pos.x, pos.y + 1)];

        vorticity_write[index] = 0.5 * U.rdx * ((Ry - Ly) - (Tx - Bx));
    }`;
	export const vorticityConfinement = /*wgsl*/ `      
    ${FUNCTION.idx}
    struct Uniforms {
        res: vec2<f32>,
        dt: f32,
        dx: f32,
        rdx: f32,
        vort: f32,
    }
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> vel_read_x : array<f32>;
    @group(0) @binding(2) var<storage, read> vel_read_y : array<f32>;
    @group(0) @binding(3) var<storage, read> vort_read : array<f32>;
    @group(0) @binding(4) var<storage, read_write> vel_write_x : array<f32>;
    @group(0) @binding(5) var<storage, read_write> vel_write_y : array<f32>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

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
    }`;

	export const advectSmoke = /*wgsl*/ `
    ${FUNCTION.idx}
    ${UNIFORM.res_dt}
    ${UNIFORM.binding}
    @group(0) @binding(1) var<storage, read> smoke_read_r : array<f32>;
    @group(0) @binding(2) var<storage, read> smoke_read_g : array<f32>;
    @group(0) @binding(3) var<storage, read> smoke_read_b : array<f32>;
    @group(0) @binding(4) var<storage, read> vel_read_x : array<f32>;
    @group(0) @binding(5) var<storage, read> vel_read_y : array<f32>;
    @group(0) @binding(6) var<storage, read_write> smoke_write_r : array<f32>;
    @group(0) @binding(7) var<storage, read_write> smoke_write_g : array<f32>;
    @group(0) @binding(8) var<storage, read_write> smoke_write_b : array<f32>;

    fn smoke(x : f32, y : f32) -> vec3<f32> {
        let id = idx(x, y);
        return vec3(smoke_read_r[id], smoke_read_g[id], smoke_read_b[id]);
    }
    fn vel(x : f32, y : f32) -> vec2<f32> { 
        let id = idx(x,y);
        return vec2(vel_read_x[id], vel_read_y[id]);
    }

    fn vel_bilerp(x0 : f32, y0 : f32) -> vec2<f32> {
        var x = x0;
        var y = y0;

        x = clamp(x, 0, U.res.x);
        y = clamp(y, 0, U.res.y);

        let x1 = floor(x);
        let y1 = floor(y);
        let x2 = x1 + 1;
        let y2 = y1 + 1;

        let TL = vel(x1, y2);
        let TR = vel(x2, y2);
        let BL = vel(x1, y1);
        let BR = vel(x2, y1);

        let xMod = fract(x);
        let yMod = fract(y);

        return mix( mix(BL, BR, xMod), mix(TL, TR, xMod), yMod );
    }

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
        ${COMPUTE_HEADER}

        

        let V = vel_bilerp(pos.x, pos.y);

        var x = pos.x - U.dt * U.rdx * V.x;
        var y = pos.y - U.dt * U.rdx * V.y;

        x = clamp(x, 0, U.res.x);
        y = clamp(y, 0, U.res.y);

        let x1 = floor(x);
        let y1 = floor(y);
        let x2 = x1 + 1;
        let y2 = y1 + 1;

        let TL = smoke(x1, y2);
        let TR = smoke(x2, y2);
        let BL = smoke(x1, y1);
        let BR = smoke(x2, y1);

        let xMod = fract(x);
        let yMod = fract(y);

        let bilerp = mix( mix(BL, BR, xMod), mix(TL, TR, xMod), yMod );

        smoke_write_r[index] = bilerp.x;
        smoke_write_g[index] = bilerp.y;
        smoke_write_b[index] = bilerp.z;
    }`;
}
