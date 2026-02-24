/// <reference types="@webgpu/types" />

import { Uniform, ComputeProgram, Buffer } from './primitives';
import updateSolids from './shaders/wgsl/updateSolids.wgsl';
import updateSmoke from './shaders/wgsl/updateSmoke.wgsl';
import updateVelocity from './shaders/wgsl/updateVelocity.wgsl';
import advectVelocity from './shaders/wgsl/advectVelocity.wgsl';
import velocityBoundary from './shaders/wgsl/velocityBoundary.wgsl';
import calcDivergence from './shaders/wgsl/calcDivergence.wgsl';
import calcRepeatBoundary from './shaders/wgsl/calcRepeatBoundary.wgsl';
import pressureProgram from './shaders/wgsl/pressureProgram.wgsl';
import subtractGradient from './shaders/wgsl/subtractGradient.wgsl';
import clearPressure from './shaders/wgsl/clearPressure.wgsl';
import calcVorticity from './shaders/wgsl/calcVorticity.wgsl';
import vorticityConfinement from './shaders/wgsl/vorticityConfinement.wgsl';
import advectSmoke from './shaders/wgsl/advectSmoke.wgsl';
import render_shader from './shaders/wgsl/render.wgsl';

export interface FluidRectObj {
	x: number;
	y: number;
	w: number;
	h: number;
	color?: number;
}

export type FluidRect = [number, number, number, number, number];

export type FluidRectList = FluidRect[];

export type FluidRects = Map<string, FluidRectObj | null>;

const ignore_alias: string[] = ['h', 'i', 'l', 't'] as const;

export class Simulator {
	private time: number = 0;
	private initialized: boolean = false;
	private buffered_frames: number = 0;
	private broken: boolean = false;
	// Initial values & constants

	private text?: string;
	private prevText?: string;
	private rectMap: FluidRects = new Map();
	private solidBoxes: FluidRectList = [];
	private colorBoxes: FluidRectList = [];
	//              x,      y,      w,      h,      c,      p,      p,      p

	private maxRects: number = 1000;
	private smoke_color: number = 0;
	private prev_smoke_color?: number;

	private horizontal_view_buffer: number = 10;
	private vertical_view_buffer: number = 1;

	private grid_size: number = 512;
	private width!: number;
	private height!: number;
	private viewWidth!: number;
	private viewHeight!: number;
	private numCells!: number;
	private diffusion: number = 0.999;
	private pressureIterations!: number;
	// private dt: number = 0.03; // delta time
	// private dt: number = 0.015; // delta time
	private dt_mult: number = 2.5;
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
	private touch: boolean = false;

	// GPU Globals
	private canvas!: HTMLCanvasElement;
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
	private solidRects!: Buffer;
	private colorRects!: Buffer;
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

	public constructor() {}
	public static async create(canvas: HTMLCanvasElement): Promise<Simulator | null> {
		const instance = new Simulator();
		// if (isOutdated()) return null;
		await instance.init(canvas);
		return instance;
	}

	private async reset() {
		this.initSizes();
		await this.initBuffers();
		this.initComputePrograms();
		this.initRenderPipeline();
	}

	public async init(canvas: HTMLCanvasElement) {
		this.initialized = false;
		this.canvas = canvas;
		if (!(await this.initGPU())) return false;
		await this.reset();
		this.initialized = true;
		return true;
	}
	private initSizes() {
		const vw = window.visualViewport?.width || window.innerWidth;
		const vh = window.visualViewport?.height || window.innerHeight;

		const aspectRatio = vw / vh;
		const limits = this.device.limits;
		// console.log(
		// 	limits.maxComputeInvocationsPerWorkgroup,
		// 	limits.maxStorageBufferBindingSize,
		// 	limits.maxComputeWorkgroupStorageSize
		// );
		const TOP_END_LIMITS = {
			maxComputeInvocationsPerWorkgroup: 512,
			maxStorageBufferBindingSize: 256_000_000,
			maxComputeWorkgroupStorageSize: 32_768 // 32 KB
		};

		const HIGH_END_LIMITS = {
			maxComputeInvocationsPerWorkgroup: 256,
			maxStorageBufferBindingSize: 128_000_000, // 128 mb
			maxComputeWorkgroupStorageSize: 16_000 // 16 KB
		};

		const MID_RANGE_LIMITS = {
			maxComputeInvocationsPerWorkgroup: 128,
			maxStorageBufferBindingSize: 64_000_000, // 64 MB
			maxComputeWorkgroupStorageSize: 8_000 // 8 KB
		};

		if (
			limits.maxComputeInvocationsPerWorkgroup >=
				TOP_END_LIMITS.maxComputeInvocationsPerWorkgroup &&
			limits.maxStorageBufferBindingSize >= TOP_END_LIMITS.maxStorageBufferBindingSize &&
			limits.maxComputeWorkgroupStorageSize >= TOP_END_LIMITS.maxComputeWorkgroupStorageSize &&
			Math.max(vw, vh) > 1900
		) {
			this.grid_size = 1024; // Top-end
		} else if (
			limits.maxComputeInvocationsPerWorkgroup >=
				HIGH_END_LIMITS.maxComputeInvocationsPerWorkgroup &&
			limits.maxStorageBufferBindingSize >= HIGH_END_LIMITS.maxStorageBufferBindingSize &&
			limits.maxComputeWorkgroupStorageSize >= HIGH_END_LIMITS.maxComputeWorkgroupStorageSize &&
			Math.max(vw, vh) > 1900
		) {
			this.grid_size = 768; // High-end
		} else if (
			limits.maxComputeInvocationsPerWorkgroup >=
				MID_RANGE_LIMITS.maxComputeInvocationsPerWorkgroup &&
			limits.maxStorageBufferBindingSize >= MID_RANGE_LIMITS.maxStorageBufferBindingSize &&
			limits.maxComputeWorkgroupStorageSize >= MID_RANGE_LIMITS.maxComputeWorkgroupStorageSize &&
			Math.max(vw, vh) > 1200
		) {
			this.grid_size = 512; // Mid-range
		} else {
			this.grid_size = 384; // Low-end - smallest size that still looks good
		}

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
			if (w * h * 4 >= maxBufferSize) downRatio = Math.sqrt(maxBufferSize / (w * h * 3));

			// Prevent canvas size overflow
			if (w > maxCanvasSize) downRatio = maxCanvasSize / w;
			else if (h > maxCanvasSize) downRatio = maxCanvasSize / h;

			return {
				w: Math.floor(w * downRatio),
				h: Math.floor(h * downRatio)
			};
		};

		// Calculate preferred visible dimensions
		const gridSize = getPreferredDimensions(this.grid_size);
		const viewWidth = gridSize.w;
		const viewHeight = gridSize.h;

		// Expand simulation grid by fixed cell buffers
		this.width = viewWidth + 2 * this.horizontal_view_buffer;
		this.height = viewHeight + 2 * this.vertical_view_buffer;

		// Validate expanded dimensions are within GPU limits and update final sizes
		const finalSizes = getValidDimensions(this.width, this.height);
		this.width = finalSizes.w;
		this.height = finalSizes.h;

		// Recalculate visible area based on final simulation grid
		this.viewWidth = this.width - 2 * this.horizontal_view_buffer;
		this.viewHeight = this.height - 2 * this.vertical_view_buffer;

		this.pressureIterations = Math.floor(this.width / 300);

		this.rdx = this.grid_size * 4;
		this.dx = 1 / this.rdx;

		// Resize the canvas to the final VISIBLE dimensions
		this.canvas.width = this.viewWidth;
		this.canvas.height = this.viewHeight;
		this.numCells = this.width * this.height;
		// console.log("w", this.width, "h", this.height);
	}

	private async initGPU() {
		try {
			const adapter = await navigator.gpu.requestAdapter();
			if (!adapter) {
				console.error('Missing adapter');
				this.broken = true;
				return false;
			}
			const device = await adapter.requestDevice();
			const context = this.canvas.getContext('webgpu');
			if (!context) {
				console.error('Missing context');
				this.broken = true;
				return false;
			}
			const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
			context.configure({
				device: device,
				format: canvasFormat
			});

			this.context = context;
			this.device = device;
			return true;
		} catch {
			return false;
		}
	}

	private async updateUniforms() {
		this.Ures.update([
			this.width,
			this.height,
			this.horizontal_view_buffer,
			this.vertical_view_buffer
		]);
		this.Ures_mouse.update([
			this.width,
			this.height,
			this.mouseX,
			this.mouseY,
			this.mouseV,
			this.mouseU
		]);
		this.Ures_rect.update([this.width, this.height, this.solidBoxes.length, 0]);
		this.Ures_dif.update([
			this.width,
			this.height,
			this.diffusion,
			this.smoke_color,
			this.colorBoxes.length,
			0
		]);
		this.Ures_dt.update([
			this.width,
			this.height,
			this.dt,
			this.dx,
			this.rdx,
			0 //padding
		]);
		this.Ures_dt_vort.update([this.width, this.height, this.dt, this.dx, this.rdx, this.vort]);
		this.Ures_visc.update([this.width, this.height, this.visc, 0]);
		await this.device.queue.onSubmittedWorkDone();
	}

	private async initBuffers() {
		this.velocity = new Buffer(this.device, this.numCells, 2, 'vel');
		this.velocity0 = new Buffer(this.device, this.numCells, 2, 'vel0');
		this.smoke = new Buffer(this.device, this.numCells, 3, 'smok');
		this.smoke0 = new Buffer(this.device, this.numCells, 3, 'smok0');
		this.divergence = new Buffer(this.device, this.numCells, 1, 'div');
		this.divergence0 = new Buffer(this.device, this.numCells, 1, 'div0');
		this.pressure = new Buffer(this.device, this.numCells, 1, 'pres');
		this.pressure0 = new Buffer(this.device, this.numCells, 1, 'pres0');
		this.vorticity = new Buffer(this.device, this.numCells, 1, 'vort');
		this.solids = new Buffer(this.device, this.numCells, 1, 'solid');
		this.solids0 = new Buffer(this.device, this.numCells, 1, 'solid0');
		this.solidRects = new Buffer(this.device, this.maxRects * 8, 1, 'solidRect');
		this.colorRects = new Buffer(this.device, this.maxRects * 8, 1, 'colorRect');

		const solids0 = new Float32Array(this.numCells);
		solids0.fill(1.0);

		this.solids0.write(solids0);

		const velocity0x = new Float32Array(this.numCells);
		velocity0x.fill(0.01);
		this.velocity0.write([velocity0x, new Float32Array(0)]);

		//uniforms
		this.Ures = new Uniform(this.device, 4, 'Ures', [
			this.width,
			this.height,
			this.horizontal_view_buffer,
			this.vertical_view_buffer
		]);
		this.Ures_mouse = new Uniform(this.device, 6, 'Ures_mouse', [
			this.width,
			this.height,
			this.mouseX,
			this.mouseY,
			this.mouseV,
			this.mouseU
		]);
		this.Ures_rect = new Uniform(this.device, 4, 'Ures_rect', [
			this.width,
			this.height,
			this.solidBoxes.length,
			0
		]);
		this.Ures_dif = new Uniform(this.device, 6, 'Ures_dif', [
			this.width,
			this.height,
			this.diffusion,
			this.smoke_color,
			this.colorBoxes.length,
			0
		]);
		this.Ures_dt = new Uniform(this.device, 6, 'Ures_dt', [
			this.width,
			this.height,
			this.dt,
			this.dx,
			this.rdx,
			0 //padding
		]);
		this.Ures_dt_vort = new Uniform(this.device, 6, 'Ures_dt_vort', [
			this.width,
			this.height,
			this.dt,
			this.dx,
			this.rdx,
			this.vort
		]);
		this.Ures_visc = new Uniform(this.device, 4, 'Ures_dt_visc', [
			this.width,
			this.height,
			this.visc,
			0
		]);
		await this.device.queue.onSubmittedWorkDone();
	}

	private initRenderPipeline() {
		const render_module = this.device.createShaderModule({
			label: 'render_shader',
			code: render_shader
		});
		this.renderPipeline = this.device.createRenderPipeline({
			label: 'render',
			layout: 'auto',
			vertex: {
				module: render_module,
				entryPoint: 'vertexMain'
			},
			fragment: {
				module: render_module,
				entryPoint: 'fragmentMain',
				targets: [{ format: this.context.getCurrentTexture().format }]
			},
			primitive: {
				topology: 'triangle-list'
			}
		});
	}

	private setRenderBindings() {
		const buffers: GPUBuffer[][] = [
			[this.Ures.buffer],
			this.smoke.getBuffers(),
			this.solids.getBuffers(),
			this.velocity.getBuffers(),
			this.divergence.getBuffers(),
			this.pressure.getBuffers()
		];
		const entries: GPUBindGroupEntry[] = buffers.flat().map((b, i) => ({
			binding: i,
			resource: { buffer: b }
		}));
		this.renderBindings = this.device.createBindGroup({
			layout: this.renderPipeline.getBindGroupLayout(0),
			entries
		});
	}

	private initComputePrograms() {
		this.updateSolids = new ComputeProgram(
			this.device,
			updateSolids,
			[this.solidRects],
			[this.solids],
			[this.Ures_rect],
			this.width,
			this.height,
			'updateSolids'
		);
		this.updateVelocity = new ComputeProgram(
			this.device,
			updateVelocity,
			[this.velocity],
			[this.velocity0],
			[this.Ures_mouse],
			this.width,
			this.height,
			'updateVelocity'
		); //clear pressure, set wind tunnel
		this.updateSmoke = new ComputeProgram(
			this.device,
			updateSmoke,
			[this.smoke, this.solids, this.colorRects],
			[this.smoke0],
			[this.Ures_dif],
			this.width,
			this.height,
			'updateSmoke'
		);
		this.advectVelocity = new ComputeProgram(
			this.device,
			advectVelocity,
			[this.velocity0],
			[this.velocity],
			[this.Ures_dt],
			this.width,
			this.height,
			'advectVelocity'
		);
		this.velocityBoundary = new ComputeProgram(
			this.device,
			velocityBoundary,
			[this.velocity, this.solids],
			[this.velocity0],
			[this.Ures],
			this.width,
			this.height,
			'velocityBoundary'
		);
		this.calcDivergence = new ComputeProgram(
			this.device,
			calcDivergence,
			[this.velocity0],
			[this.divergence0],
			[this.Ures_dt],
			this.width,
			this.height,
			'calcDivergence'
		);
		this.divergenceBoundary = new ComputeProgram(
			this.device,
			calcRepeatBoundary,
			[this.divergence0, this.solids],
			[this.divergence],
			[this.Ures],
			this.width,
			this.height,
			'divergenceBoundary'
		);
		this.pressureProgram = new ComputeProgram(
			this.device,
			pressureProgram,
			[this.pressure, this.divergence],
			[this.pressure0],
			[this.Ures_dt],
			this.width,
			this.height,
			'pressureProgram'
		);
		this.pressureBoundary = new ComputeProgram(
			this.device,
			calcRepeatBoundary,
			[this.pressure0, this.solids],
			[this.pressure],
			[this.Ures],
			this.width,
			this.height,
			'pressureBoundary'
		);
		this.gradientSubtract = new ComputeProgram(
			this.device,
			subtractGradient,
			[this.pressure, this.velocity0],
			[this.velocity],
			[this.Ures_dt],
			this.width,
			this.height,
			'gradientSubtract'
		);
		this.advectSmoke = new ComputeProgram(
			this.device,
			advectSmoke,
			[this.smoke0, this.velocity],
			[this.smoke],
			[this.Ures_dt],
			this.width,
			this.height
		);
		this.clearPressure = new ComputeProgram(
			this.device,
			clearPressure,
			[this.pressure],
			[this.pressure0],
			[this.Ures_visc],
			this.width,
			this.height,
			'clearPressure'
		);
		this.calcVorticity = new ComputeProgram(
			this.device,
			calcVorticity,
			[this.velocity],
			[this.vorticity],
			[this.Ures_dt],
			this.width,
			this.height,
			'calcVorticity'
		);
		this.vorticityConfinement = new ComputeProgram(
			this.device,
			vorticityConfinement,
			[this.velocity, this.vorticity],
			[this.velocity0],
			[this.Ures_dt_vort],
			this.width,
			this.height,
			'vorticityConfinement'
		);
	}

	private render() {
		this.setRenderBindings();
		const commandEncoder = this.device.createCommandEncoder({
			label: 'render_encoder'
		});
		const renderPass = commandEncoder.beginRenderPass({
			label: 'render pass',
			colorAttachments: [
				{
					view: this.context.getCurrentTexture().createView(),
					loadOp: 'clear',
					storeOp: 'store',
					clearValue: { r: 0, g: 0, b: 0, a: 1 }
				}
			]
		});
		renderPass.setPipeline(this.renderPipeline);
		renderPass.setBindGroup(0, this.renderBindings);

		renderPass.draw(6);
		renderPass.end();

		this.device.queue.submit([commandEncoder.finish()]);
	}
	private isBoxSame(newSolid: FluidRectList, newColor: FluidRectList) {
		if (newSolid.length !== this.solidBoxes.length || newColor.length !== this.colorBoxes.length) {
			return false;
		}
		const solidSame = this.solidBoxes.every((box, i) => box.every((v, j) => v === newSolid[i][j]));
		const colorSame = this.colorBoxes.every((box, i) => box.every((v, j) => v === newColor[i][j]));
		return solidSame && colorSame;
	}

	public async updateText(text: string) {
		this.text = text;
	}

	private async updateTextMatte() {
		if (!this.initialized) return;
		if (this.prevText == this.text) return;
		this.prevText = this.text;
		const text = this.text?.toLowerCase() ?? '';
		const fontSize = Math.floor(Math.floor(this.viewWidth / 4) / 2) * 2;
		const letterSpacing = 50;
		await document.fonts.ready;
		await document.fonts.load(`bold ${fontSize}px Megrim`);
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		const context = canvas.getContext('2d');
		if (!context) throw new Error('2D context not available');

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.textBaseline = 'middle';
		context.fillStyle = 'black';
		context.font = `bold ${fontSize}px Megrim`;

		let totalWidth = 0;
		for (let i = 0; i < text.length; i++) {
			totalWidth += context.measureText(text[i]).width;
		}
		totalWidth += letterSpacing * (text.length - 2);

		const startX = Math.floor((this.viewWidth - totalWidth) / 2);
		const y = Math.floor(this.viewHeight / 2);
		const draws = [];

		let x = startX;
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			context.fillText(char, x, y);
			if (char == 'm') {
				const w = context.measureText(char).width;
				const o = Math.floor(w * 0.15);
				context.clearRect(x, y + o * 2, w, w * 0.2);
				context.drawImage(context.canvas, x, y + o, w, o, x, y + o * 2, w, o);
			}
			if (char == 'a') {
				const w = context.measureText(char).width;
				context.clearRect(x + w * 0.2, y + w * 0.45, w * 0.3, w * 0.2);
			}
			const w = context.measureText(char).width + letterSpacing;
			draws.push({
				b: x - 7,
				e: w + x + 2,
				noAlias: ignore_alias.includes(char)
			});
			x += w;
		}

		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixelArray = imageData.data;
		const matte = new Float32Array(this.numCells).fill(1.0);

		for (const draw of draws) {
			const canvasXStart = Math.floor(draw.b + this.horizontal_view_buffer);
			const canvasXEnd = Math.floor(draw.e + this.horizontal_view_buffer);

			for (let canvasX = canvasXStart; canvasX < canvasXEnd; canvasX++) {
				for (let canvasY = 0; canvasY < this.height; canvasY++) {
					const canvasIdx = canvasY * this.width + canvasX;

					const simX = canvasX - this.horizontal_view_buffer;
					const simY = this.viewHeight - 1 - (canvasY - this.vertical_view_buffer);

					const simIdx = simY * this.width + simX;

					const alpha = pixelArray[canvasIdx * 4 + 3] / 255.0;

					const finalAlpha = draw.noAlias ? (alpha > 0.5 ? 1.0 : 0.0) : alpha;

					matte[simIdx] = 1.0 - finalAlpha;
				}
			}
		}

		this.solids0.write(matte);
		return this.device.queue.onSubmittedWorkDone();
	}

	public async changeColor(color: number) {
		this.smoke_color = color;
	}

	private async updateColor() {
		if (!this.initialized) return;
		if (this.prev_smoke_color == this.smoke_color) return;
		this.prev_smoke_color = this.smoke_color;
		this.Ures_dif.update([
			this.width,
			this.height,
			this.diffusion,
			this.smoke_color,
			this.colorBoxes.length,
			0
		]);
		return this.device.queue.onSubmittedWorkDone();
	}

	public async registerRectangle(rect: FluidRectObj | null, id: string) {
		if (!rect) {
			this.rectMap.delete(id);
			return;
		}
		this.rectMap.set(id, rect);
	}

	private async updateRectangles() {
		if (!this.initialized) return;
		const new_solids: FluidRectList = [];
		const new_colors: FluidRectList = [];
		if (!this.rectMap) {
			return;
		}

		for (const [, rect] of this.rectMap) {
			if (!rect) continue;
			if (rect.color === undefined || rect.color < 0) {
				new_solids.push([rect.x, rect.y, rect.w, rect.h, -1]);
			} else {
				new_colors.push([rect.x, rect.y, rect.w, rect.h, rect.color]);
			}
		}

		if (this.isBoxSame(new_solids, new_colors)) {
			return;
		}
		const vh = window.visualViewport?.height || window.innerHeight;
		const vw = window.visualViewport?.width || window.innerWidth;

		this.solidBoxes = new_solids;
		this.colorBoxes = new_colors;

		this.Ures_rect.update([this.width, this.height, this.solidBoxes.length, 0]);
		this.Ures_dif.update([
			this.width,
			this.height,
			this.diffusion,
			this.smoke_color,
			this.colorBoxes.length,
			0
		]);

		const solidData = new Float32Array(this.maxRects * 8);
		this.solidBoxes.forEach(([x, y, w, h, c], i) => {
			const x_sim = (this.horizontal_view_buffer + (x / vw) * this.viewWidth) / this.width;
			const y_sim =
				(this.vertical_view_buffer + ((vh - h - y) / vh) * this.viewHeight) / this.height;
			const w_sim = ((w / vw) * this.viewWidth) / this.width;
			const h_sim = ((h / vh) * this.viewHeight) / this.height;
			solidData.set([x_sim, y_sim, w_sim, h_sim, c, 0, 0, 0], i * 8);
		});
		this.solidRects.write(solidData);

		const colorData = new Float32Array(this.maxRects * 8);
		this.colorBoxes.forEach(([x, y, w, h, c], i) => {
			const x_sim = (this.horizontal_view_buffer + (x / vw) * this.viewWidth) / this.width;
			const y_sim =
				(this.vertical_view_buffer + ((vh - h - y) / vh) * this.viewHeight) / this.height;
			const w_sim = ((w / vw) * this.viewWidth) / this.width;
			const h_sim = ((h / vh) * this.viewHeight) / this.height;
			colorData.set([x_sim, y_sim, w_sim, h_sim, c, 0, 0, 0], i * 8);
		});
		this.colorRects.write(colorData);

		return this.device.queue.onSubmittedWorkDone();
	}

	public async updateMouse(x: number, y: number, touch?: true) {
		const vh = window.visualViewport?.height || window.innerHeight;
		const vw = window.visualViewport?.width || window.innerWidth;
		const ny = y / vh;
		const nx = x / vw;

		this.mouseX = (this.horizontal_view_buffer + nx * this.viewWidth) / this.width;
		this.mouseY = (this.vertical_view_buffer + (1 - ny) * this.viewHeight) / this.height;
		this.touch = touch || false;
	}

	private async simulate() {
		const commandEncoder = this.device.createCommandEncoder({
			label: 'simulation_encoder'
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
		this.initialized = false;
		this.prevText = undefined;
		this.solidBoxes = [];
		this.colorBoxes = [];
		await this.reset();
		this.initialized = true;
	}

	public async step() {
		if (this.initialized == false) return;
		const now = Date.now();
		const elapsed = now - this.time;

		if (this.buffered_frames > 1) {
			console.log('Skipped rendering another buffered frame');
			return; // fps cap
		}
		this.buffered_frames += 1;
		// this.dt_mult = 2.0 + Math.sin((Date.now() / 1000) % 180) * 0.5;

		const dt = (elapsed * this.dt_mult) / 1000;
		if (dt == 0) return;
		this.time = now;
		this.dt = Math.min(dt, 0.05);

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
			if (this.touch) {
				this.mouseU *= 100;
				this.mouseV *= 100;
			}
		}
		this.updateRectangles();
		this.updateTextMatte();
		this.updateColor();

		this.updateUniforms();
		await this.simulate();
		this.render();
		this.buffered_frames -= 1;
	}
}
