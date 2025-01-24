/// <reference types="@webgpu/types" />

import { Uniform, ComputeProgram, Buffer } from "./primitives";
import { PROGRAM } from "./shaders/compute";
import { render_shader } from "./shaders/render";

export class Simulator {
    private time: number = 0;
    private initialized: boolean = false;
    private broken: boolean = false;
    // Initial values & constants

    private text?: string;
    private boxes: [number, number, number, number][] = [];
    //              x,      y,      w,      h,
    private maxBoxes: number = 50;
    private smoke_color: number = 0;

    private grid_size: number = 512;
    private width!: number;
    private height!: number;
    private numCells!: number;
    private diffusion: number = 0.999;
    private pressureIterations: number = 5;
    // private dt: number = 0.03; // delta time
    // private dt: number = 0.015; // delta time
    private dt_mult: number = 2.0;
    private dt: number = 0.0; // delta time
    private dx!: number;
    private rdx!: number;
    private vort: number = 0.2;
    private visc: number = 1;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private prevMouseX: number | null = null;
    private prevMouseY: number | null = null;
    private mouseU: number = 0;
    private mouseV: number = 0;

    // GPU Globals
    private canvas: HTMLCanvasElement;
    private context!: GPUCanvasContext;
    private device!: GPUDevice;

    // Render Constructs
    private renderBindings!: GPUBindGroup;
    private renderPipeline!: GPURenderPipeline;

    // GPU Buffers
    private velocity!: Buffer;
    private velocity0!: Buffer;
    private smoke!: Buffer;
    private smoke0!: Buffer;
    private divergence!: Buffer;
    private divergence0!: Buffer;
    private pressure!: Buffer;
    private pressure0!: Buffer;
    private vorticity!: Buffer;
    private solids!: Buffer;
    private rectangles!: Buffer;
    private solids0!: Buffer;
    // uniforms
    private Ures!: Uniform;
    private Ures_mouse!: Uniform;
    private Ures_rect!: Uniform;
    private Ures_dif!: Uniform;
    private Ures_dt!: Uniform;
    private Ures_dt_vort!: Uniform;
    private Ures_visc!: Uniform;

    //programs

    private updateSolids!: ComputeProgram;
    private updateVelocity!: ComputeProgram; //clear pressure, set wind tunnel
    private updateSmoke!: ComputeProgram;
    private advectVelocity!: ComputeProgram;
    private velocityBoundary!: ComputeProgram;
    private calcDivergence!: ComputeProgram;
    private divergenceBoundary!: ComputeProgram;
    private pressureProgram!: ComputeProgram;
    private pressureBoundary!: ComputeProgram;
    private gradientSubtract!: ComputeProgram;
    private clearPressure!: ComputeProgram;
    private calcVorticity!: ComputeProgram;
    private vorticityConfinement!: ComputeProgram;
    private advectSmoke!: ComputeProgram;

    private constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }
    public static async create(canvas: HTMLCanvasElement): Promise<Simulator> {
        console.log("creating new instance");
        const instance = new Simulator(canvas);
        instance.canvas = canvas;
        await instance.initGPU();
        await instance.init();
        return instance;
    }
    private async init() {
        console.log("initializing instance");
        this.initSizes();
        await this.initBuffers();
        this.updateTextMatte("Liam");
        this.initComputePrograms();
        this.initRenderPipeline();
        this.initialized = true;
    }
    private initSizes() {
        const vw = window.visualViewport?.width || window.innerWidth;
        const vh = window.visualViewport?.height || window.innerHeight;

        const aspectRatio = vw / vh;
        const limits = this.device.limits;
        console.log(limits);

        const HIGH_END_LIMITS = {
            maxComputeInvocationsPerWorkgroup: 512,
            maxStorageBufferBindingSize: 256_000_000, // 1GB
            maxComputeWorkgroupStorageSize: 32_768, // 32 KB
        };

        const MID_RANGE_LIMITS = {
            maxComputeInvocationsPerWorkgroup: 256,
            maxStorageBufferBindingSize: 128_000_000, // 512 MB
            maxComputeWorkgroupStorageSize: 16_384, // 16 KB
        };

        if (
            limits.maxComputeInvocationsPerWorkgroup >=
                HIGH_END_LIMITS.maxComputeInvocationsPerWorkgroup &&
            limits.maxStorageBufferBindingSize >=
                HIGH_END_LIMITS.maxStorageBufferBindingSize &&
            limits.maxComputeWorkgroupStorageSize >=
                HIGH_END_LIMITS.maxComputeWorkgroupStorageSize
        ) {
            this.grid_size = 1024; // High-end
        } else if (
            limits.maxComputeInvocationsPerWorkgroup >=
                MID_RANGE_LIMITS.maxComputeInvocationsPerWorkgroup &&
            limits.maxStorageBufferBindingSize >=
                MID_RANGE_LIMITS.maxStorageBufferBindingSize &&
            limits.maxComputeWorkgroupStorageSize >=
                MID_RANGE_LIMITS.maxComputeWorkgroupStorageSize
        ) {
            this.grid_size = 512; // Mid-range
        } else {
            this.grid_size = 256; // Low-end
        }
        // set to lower sim fidelity for testing
        // this.grid_size = 256;

        const maxBufferSize = this.device.limits.maxStorageBufferBindingSize;
        const maxCanvasSize = this.device.limits.maxTextureDimension2D;

        const getPreferredDimensions = (size: number) => {
            let w, h;

            if (vh < vw) {
                w = Math.floor(size * aspectRatio);
                h = size;
            } else {
                w = size;
                h = Math.floor(size / aspectRatio);
            }

            return getValidDimensions(w, h);
        };

        const getValidDimensions = (w: number, h: number) => {
            let downRatio = 1;

            // Prevent buffer size overflow
            if (w * h * 4 >= maxBufferSize)
                downRatio = Math.sqrt(maxBufferSize / (w * h * 3));

            // Prevent canvas size overflow
            if (w > maxCanvasSize) downRatio = maxCanvasSize / w;
            else if (h > maxCanvasSize) downRatio = maxCanvasSize / h;

            return {
                w: Math.floor(w * downRatio),
                h: Math.floor(h * downRatio),
            };
        };

        // Calculate simulation buffer dimensions
        const gridSize = getPreferredDimensions(this.grid_size);
        this.width = gridSize.w;
        this.height = gridSize.h;

        this.pressureIterations = Math.floor(this.width / 250);

        // Useful values for the simulation
        this.rdx = this.grid_size * 4;
        this.dx = 1 / this.rdx;

        // Resize the canvas
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.numCells = this.width * this.height;
        console.log("w", this.width);
        console.log("h", this.height);
    }

    private async initGPU() {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.error("Missing adapter");
            this.broken = true;
            return;
        }
        const device = await adapter.requestDevice();
        const context = this.canvas.getContext("webgpu");
        if (!context) {
            console.error("Missing context");
            this.broken = true;
            return;
        }
        const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: device,
            format: canvasFormat,
        });

        this.context = context;
        this.device = device;
    }

    private async updateUniforms() {
        this.Ures.update([this.width, this.height]);
        this.Ures_mouse.update([
            this.width,
            this.height,
            this.mouseX,
            this.mouseY,
            this.mouseV,
            this.mouseU,
        ]);
        this.Ures_rect.update([this.width, this.height, this.boxes.length, 0]);
        this.Ures_dif.update([
            this.width,
            this.height,
            this.diffusion,
            this.smoke_color,
        ]);
        this.Ures_dt.update([
            this.width,
            this.height,
            this.dt,
            this.dx,
            this.rdx,
            0, //padding
        ]);
        this.Ures_dt_vort.update([
            this.width,
            this.height,
            this.dt,
            this.dx,
            this.rdx,
            this.vort,
        ]);
        this.Ures_visc.update([this.width, this.height, this.visc, 0]);
        await this.device.queue.onSubmittedWorkDone();
    }

    private async initBuffers() {
        this.velocity = new Buffer(this.device, this.numCells, 2, "vel");
        this.velocity0 = new Buffer(this.device, this.numCells, 2, "vel0");
        this.smoke = new Buffer(this.device, this.numCells, 3, "smok");
        this.smoke0 = new Buffer(this.device, this.numCells, 3, "smok0");
        this.divergence = new Buffer(this.device, this.numCells, 1, "div");
        this.divergence0 = new Buffer(this.device, this.numCells, 1, "div0");
        this.pressure = new Buffer(this.device, this.numCells, 1, "pres");
        this.pressure0 = new Buffer(this.device, this.numCells, 1, "pres0");
        this.vorticity = new Buffer(this.device, this.numCells, 1, "vort");
        this.solids = new Buffer(this.device, this.numCells, 1, "solid");
        this.solids0 = new Buffer(this.device, this.numCells, 1, "solid0");
        this.rectangles = new Buffer(this.device, this.maxBoxes * 4, 1, "rect");

        const solids0 = new Float32Array(this.numCells);
        solids0.fill(1.0);

        this.solids0.write(solids0);

        //uniforms
        this.Ures = new Uniform(this.device, 2, "Ures", [
            this.width,
            this.height,
        ]);
        this.Ures_mouse = new Uniform(this.device, 6, "Ures_mouse", [
            this.width,
            this.height,
            this.mouseX,
            this.mouseY,
            this.mouseV,
            this.mouseU,
        ]);
        this.Ures_rect = new Uniform(this.device, 4, "Ures_rect", [
            this.width,
            this.height,
            this.boxes.length,
            0,
        ]);
        this.Ures_dif = new Uniform(this.device, 4, "Ures_dif", [
            this.width,
            this.height,
            this.diffusion,
            this.smoke_color,
        ]);
        this.Ures_dt = new Uniform(this.device, 6, "Ures_dt", [
            this.width,
            this.height,
            this.dt,
            this.dx,
            this.rdx,
            0, //padding
        ]);
        this.Ures_dt_vort = new Uniform(this.device, 6, "Ures_dt_vort", [
            this.width,
            this.height,
            this.dt,
            this.dx,
            this.rdx,
            this.vort,
        ]);
        this.Ures_visc = new Uniform(this.device, 4, "Ures_dt_visc", [
            this.width,
            this.height,
            this.visc,
            0,
        ]);
        await this.device.queue.onSubmittedWorkDone();
    }

    private initRenderPipeline() {
        const render_module = this.device.createShaderModule({
            label: "render_shader",
            code: render_shader,
        });
        this.renderPipeline = this.device.createRenderPipeline({
            label: "render",
            layout: "auto",
            vertex: {
                module: render_module,
                entryPoint: "vertexMain",
            },
            fragment: {
                module: render_module,
                entryPoint: "fragmentMain",
                targets: [{ format: this.context.getCurrentTexture().format }],
            },
            primitive: {
                topology: "triangle-list",
            },
        });
    }

    private setRenderBindings() {
        const buffers: GPUBuffer[][] = [
            [this.Ures.buffer],
            this.smoke.getBuffers(),
            this.solids.getBuffers(),
            this.velocity.getBuffers(),
            this.divergence.getBuffers(),
            this.pressure.getBuffers(),
        ];
        const entries: GPUBindGroupEntry[] = buffers.flat().map((b, i) => ({
            binding: i,
            resource: { buffer: b },
        }));
        this.renderBindings = this.device.createBindGroup({
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries,
        });
    }

    private initComputePrograms() {
        this.updateSolids = new ComputeProgram(
            this.device,
            PROGRAM.updateSolids,
            [this.rectangles],
            [this.solids],
            [this.Ures_rect],
            this.width,
            this.height,
            "updateSolids"
        );
        this.updateVelocity = new ComputeProgram(
            this.device,
            PROGRAM.updateVelocity,
            [this.velocity],
            [this.velocity0],
            [this.Ures_mouse],
            this.width,
            this.height,
            "updateVelocity"
        ); //clear pressure, set wind tunnel
        this.updateSmoke = new ComputeProgram(
            this.device,
            PROGRAM.updateSmoke,
            [this.smoke, this.solids],
            [this.smoke0],
            [this.Ures_dif],
            this.width,
            this.height,
            "updateSmoke"
        );
        this.advectVelocity = new ComputeProgram(
            this.device,
            PROGRAM.advectVelocity,
            [this.velocity0],
            [this.velocity],
            [this.Ures_dt],
            this.width,
            this.height,
            "advectVelocity"
        );
        this.velocityBoundary = new ComputeProgram(
            this.device,
            PROGRAM.velocityBoundary,
            [this.velocity, this.solids],
            [this.velocity0],
            [this.Ures],
            this.width,
            this.height,
            "velocityBoundary"
        );
        this.calcDivergence = new ComputeProgram(
            this.device,
            PROGRAM.calcDivergence,
            [this.velocity0],
            [this.divergence0],
            [this.Ures_dt],
            this.width,
            this.height,
            "calcDivergence"
        );
        this.divergenceBoundary = new ComputeProgram(
            this.device,
            PROGRAM.calcRepeatBoundary,
            [this.divergence0, this.solids],
            [this.divergence],
            [this.Ures],
            this.width,
            this.height,
            "divergenceBoundary"
        );
        this.pressureProgram = new ComputeProgram(
            this.device,
            PROGRAM.pressureProgram,
            [this.pressure, this.divergence],
            [this.pressure0],
            [this.Ures_dt],
            this.width,
            this.height,
            "pressureProgram"
        );
        this.pressureBoundary = new ComputeProgram(
            this.device,
            PROGRAM.calcRepeatBoundary,
            [this.pressure0, this.solids],
            [this.pressure],
            [this.Ures],
            this.width,
            this.height,
            "pressureBoundary"
        );
        this.gradientSubtract = new ComputeProgram(
            this.device,
            PROGRAM.subtractGradient,
            [this.pressure, this.velocity0],
            [this.velocity],
            [this.Ures_dt],
            this.width,
            this.height,
            "gradientSubtract"
        );
        this.advectSmoke = new ComputeProgram(
            this.device,
            PROGRAM.advectSmoke,
            [this.smoke0, this.velocity],
            [this.smoke],
            [this.Ures_dt],
            this.width,
            this.height
        );
        this.clearPressure = new ComputeProgram(
            this.device,
            PROGRAM.clearPressure,
            [this.pressure],
            [this.pressure0],
            [this.Ures_visc],
            this.width,
            this.height,
            "clearPressure"
        );
        this.calcVorticity = new ComputeProgram(
            this.device,
            PROGRAM.calcVorticity,
            [this.velocity],
            [this.vorticity],
            [this.Ures_dt],
            this.width,
            this.height,
            "calcVorticity"
        );
        this.vorticityConfinement = new ComputeProgram(
            this.device,
            PROGRAM.vorticityConfinement,
            [this.velocity, this.vorticity],
            [this.velocity0],
            [this.Ures_dt_vort],
            this.width,
            this.height,
            "vorticityConfinement"
        );
    }

    private render() {
        this.setRenderBindings();
        const commandEncoder = this.device.createCommandEncoder({
            label: "render_encoder",
        });
        const renderPass = commandEncoder.beginRenderPass({
            label: "render pass",
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    loadOp: "clear",
                    storeOp: "store",
                    clearValue: { r: 0, g: 0, b: 0, a: 1 },
                },
            ],
        });
        renderPass.setPipeline(this.renderPipeline);
        renderPass.setBindGroup(0, this.renderBindings);

        renderPass.draw(6);
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }
    private isBoxSame(newBoxes: [number, number, number, number][]) {
        if (newBoxes.length !== this.boxes.length) {
            return false;
        }
        return this.boxes.every((box, i) => {
            return box.every((v, j) => {
                return v === newBoxes[i][j];
            });
        });
    }

    public async updateTextMatte(text: string) {
        if (this.text == text) {
            return;
        }
        this.text = text;
        const fontSize = this.width / 5;
        const letterSpacing = 50;

        await document.fonts.ready;
        await document.fonts.load(`bold ${fontSize}px Megrim`);

        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("2D context not available");
        context.translate(0, canvas.height);
        context.scale(1, -1);

        // Set background transparent and draw centered text
        context.clearRect(0, 0, canvas.width, canvas.height);
        // context.font = "bold 400px futura";
        context.textBaseline = "middle";
        context.fillStyle = "black"; // Text color
        context.font = `bold ${fontSize}px Megrim`;

        let totalWidth = 0;
        for (let i = 0; i < text.length; i++) {
            totalWidth += context.measureText(text[i]).width;
            if (i < text.length - 1) {
                totalWidth += letterSpacing;
            }
        }
        const startX = (canvas.width - totalWidth) / 2;
        const y = canvas.height / 2;

        // Draw each character with custom letter spacing
        let x = startX;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            context.fillText(char, x, y);
            if (char == "m") {
                const w = context.measureText(char).width;
                context.clearRect(
                    x + w * 0.22,
                    y + w * 0.3,
                    w * 0.573,
                    w * 0.2
                );
            }
            if (char == "a") {
                const w = context.measureText(char).width;
                context.clearRect(x + w * 0.2, y + w * 0.45, w * 0.1, w * 0.2);
            }
            x += context.measureText(char).width + letterSpacing;
        }

        // context.fillText(text, canvas.width / 2, canvas.height / 2);
        // Get image data from the canvas
        const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );
        const pixelArray = imageData.data;
        const matte = new Float32Array(this.numCells);

        for (let i = 0; i < this.numCells; i++) {
            matte[i] = pixelArray[i * 4 + 3] > 0 ? 0.0 : 1.0;
            // matte[i] = 1;
        }

        this.solids0.write(matte);
        return this.device.queue.onSubmittedWorkDone();
    }

    public async updateColor(color: number) {
        this.smoke_color = color;
        this.Ures_dif.update([
            this.width,
            this.height,
            this.diffusion,
            this.smoke_color,
        ]);
        return this.device.queue.onSubmittedWorkDone();
    }

    public async updateRectangles(
        newBoxes: [number, number, number, number][]
    ) {
        if (this.isBoxSame(newBoxes)) {
            return;
        }
        this.boxes = newBoxes;
        // this.Ures_rect.update([this.width, this.height, this.boxes.length, 0]);
        this.rectangles.write(new Float32Array(this.boxes.flat()));
        return this.device.queue.onSubmittedWorkDone();
    }

    public async updateMouse(x: number, y: number) {
        this.mouseX = x;
        this.mouseY = 1 - y;

        // console.log(this.mouseX, this.mouseY, this.mouseU, this.mouseV);
    }

    private async simulate() {
        const commandEncoder = this.device.createCommandEncoder({
            label: "simulation_encoder",
        });

        this.solids0.copyTo(this.solids, commandEncoder);
        this.velocity0.copyTo(this.velocity, commandEncoder);
        this.pressure0.copyTo(this.pressure, commandEncoder);

        const computePass = commandEncoder.beginComputePass();
        this.updateSolids.dispatch(computePass); // update the bounds
        this.updateVelocity.dispatch(computePass); //clear pressure, set wind tunnel
        this.updateSmoke.dispatch(computePass);
        this.advectVelocity.dispatch(computePass);
        this.velocityBoundary.dispatch(computePass);
        this.calcDivergence.dispatch(computePass);
        this.divergenceBoundary.dispatch(computePass);
        for (let i = 0; i < this.pressureIterations; i++) {
            this.pressureProgram.dispatch(computePass);
            this.pressureBoundary.dispatch(computePass);
        }
        this.gradientSubtract.dispatch(computePass);
        this.clearPressure.dispatch(computePass);
        this.calcVorticity.dispatch(computePass);
        this.vorticityConfinement.dispatch(computePass);
        this.advectSmoke.dispatch(computePass);
        computePass.end();

        this.device.queue.submit([commandEncoder.finish()]);
        await this.device.queue.onSubmittedWorkDone();
    }
    public isInitialized(): boolean {
        return this.initialized;
    }
    public isBroken(): boolean {
        return this.broken;
    }
    public async resize() {
        const tW = this.width;
        const tH = this.height;
        this.initSizes();
        if (this.width == tW && this.height == tH) {
            return;
        }
        this.text = undefined;
        this.boxes = [];
        await this.init();
    }

    public async step() {
        const now = Date.now();
        const dt = (now - this.time) * this.dt_mult;
        this.time = now;
        if (dt < 200) {
            this.dt = dt / 1000;
        }
        if (this.dt === 0) {
            return;
        }

        const prevX = this.prevMouseX;
        const prevY = this.prevMouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        if (prevX == null || prevY == null) {
            this.mouseU = 0;
            this.mouseV = 0;
        } else {
            this.mouseU = this.mouseX - prevX;
            this.mouseV = this.mouseY - prevY;
        }
        // console.log(this.mouseU, this.mouseV);

        this.updateUniforms();
        // this.updateRectangles([[0.5, 0.5, 0.2, 0.2]]);
        // this.updateRectangles([
        //     [0.1, 0.4, 0.005, 0.2],
        //     [0.1, 0.1, 0.005, 0.2],
        //     [0.1, 0.7, 0.005, 0.2],
        // ]);
        await this.simulate();
        this.render();
    }
}
