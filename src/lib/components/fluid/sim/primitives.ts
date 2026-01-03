/// <reference types="@webgpu/types" />

export class Buffer {
	length: number;
	dims: number;
	size: number;
	device!: GPUDevice;
	private buffers: GPUBuffer[] = [];
	private registry: FinalizationRegistry<GPUBuffer>;
	constructor(device: GPUDevice, length: number, dims: number, label?: string) {
		this.registry = new FinalizationRegistry<GPUBuffer>((buffer: GPUBuffer) => buffer.destroy());
		this.device = device;
		this.length = length;
		this.dims = dims;
		this.size = length * 4;
		for (let i = 0; i < dims; i++) {
			const newBuffer = this.genBuffer(`${label}${i}`);
			this.buffers.push(newBuffer);
			this.registry.register(this, newBuffer);
		}
	}
	public getBuffers() {
		return this.buffers;
	}
	protected genBuffer(label?: string) {
		return this.device.createBuffer({
			label,
			size: this.size,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
		});
	}
	copyTo(buffer: Buffer, commandEncoder: GPUCommandEncoder) {
		if (buffer.dims !== this.dims) {
			console.error('dimension mismatch on buffer copy');
		}
		for (let i = 0; i < Math.max(this.dims, buffer.dims); i++) {
			commandEncoder.copyBufferToBuffer(
				this.buffers[Math.min(i, this.buffers.length - 1)],
				0,
				buffer.buffers[Math.min(i, buffer.buffers.length - 1)],
				0,
				this.size
			);
		}
	}
	copyFrom(buffers: GPUBuffer[] | GPUBuffer | Buffer, commandEncoder: GPUCommandEncoder) {
		if (buffers instanceof Buffer) {
			buffers = buffers.buffers;
		}
		if (buffers instanceof GPUBuffer) {
			buffers = [buffers];
		}
		if (buffers.length !== this.dims) {
			console.error('dimension mismatch on buffer copy');
		}
		for (let i = 0; i < Math.max(this.dims, buffers.length); i++) {
			commandEncoder.copyBufferToBuffer(
				buffers[Math.min(i, buffers.length - 1)],
				0,
				this.buffers[Math.min(i, this.buffers.length - 1)],
				0,
				this.size
			);
		}
	}

	public write(dataList: Float32Array<ArrayBuffer>[] | Float32Array<ArrayBuffer>) {
		if (dataList instanceof Float32Array) {
			dataList = [dataList];
		}
		if (dataList.length !== this.dims) {
			throw Error(`could not write to ${this.buffers[0].label}, dimension mismatch`);
		}
		for (let i = 0; i < dataList.length; i++) {
			this.writeBuffer(this.buffers[i], dataList[i]);
		}
	}
	public async read(): Promise<ArrayBuffer[]> {
		const promises: Promise<ArrayBuffer>[] = [];
		for (let i = 0; i < this.dims; i++) {
			promises.push(this.readBuffer(this.buffers[i]));
		}

		return await Promise.all(promises);
	}

	protected writeBuffer(buffer: GPUBuffer, data: Float32Array<ArrayBuffer>) {
		this.device.queue.writeBuffer(buffer, 0, data, 0, data.length);
	}

	protected async readBuffer(buffer: GPUBuffer): Promise<ArrayBuffer> {
		const readBuffer = this.device.createBuffer({
			size: this.size,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
		});

		const commandEncoder = this.device.createCommandEncoder();
		commandEncoder.copyBufferToBuffer(buffer, 0, readBuffer, 0, this.size);

		this.device.queue.submit([commandEncoder.finish()]);
		await this.device.queue.onSubmittedWorkDone();

		await readBuffer.mapAsync(GPUMapMode.READ);
		const arrayBuffer = readBuffer.getMappedRange();
		const floatArray = arrayBuffer.slice(0);

		readBuffer.unmap();
		return floatArray;
	}
}

export class Uniform {
	data: number[] = [];
	device: GPUDevice;
	buffer: GPUBuffer;
	length: number;
	size: number;
	constructor(device: GPUDevice, length: number = 8, label?: string, data?: number[]) {
		if (length % 2 !== 0) {
			console.error(
				'uniform sizes must align with 64 bit (8byte) chunks, they should have even length'
			);
		}
		this.device = device;
		this.length = length;
		this.size = length * 4;
		this.buffer = device.createBuffer({
			size: this.size,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label
		});
		if (data) {
			this.update(data);
		}
	}
	public async update(data?: number[]) {
		if (!data) return;
		if (data.length === 0) return;
		if (data.length !== this.length) {
			throw Error(`invalid uniform label[${this.buffer.label}]`);
		}
		if (this.data.length === data.length && this.data.every((v, i) => v == data[i])) {
			return;
		}

		for (let i = data.length; i < this.length; i++) {
			data.push(0);
		}
		this.device.queue.writeBuffer(this.buffer, 0, new Float32Array(data));
		await this.device.queue.onSubmittedWorkDone();
		this.data = data;
	}
}

export class ComputeProgram {
	device: GPUDevice;
	uniforms: Uniform[];
	inputs: Buffer[];
	outputs: Buffer[];
	dispatchX: number;
	dispatchY: number;
	shader_module: GPUShaderModule;
	pipeline: GPUComputePipeline;
	binding!: GPUBindGroup;
	layout!: GPUBindGroupLayout;
	constructor(
		device: GPUDevice,
		code: string,
		inputs: Buffer[],
		outputs: Buffer[],
		uniform: Uniform[],
		dispatchX: number,
		dispatchY: number,

		label?: string
	) {
		this.device = device;
		this.uniforms = uniform;
		this.inputs = inputs;
		this.outputs = outputs;
		this.dispatchX = dispatchX;
		this.dispatchY = dispatchY;

		this.shader_module = device.createShaderModule({ code, label });
		this.pipeline = this.device.createComputePipeline({
			label: this.shader_module.label,
			layout: 'auto',
			compute: {
				module: this.shader_module
			}
		});
		this.layout = this.pipeline.getBindGroupLayout(0);
		this.binding = this.genBinding();
	}
	protected genBinding() {
		const buffers: GPUBuffer[][] = [];
		buffers.push(this.uniforms.map((u) => u.buffer));
		for (const buffer of this.inputs) {
			buffers.push(buffer.getBuffers());
		}
		for (const buffer of this.outputs) {
			buffers.push(buffer.getBuffers());
		}
		const entries: GPUBindGroupEntry[] = buffers.flat().map((b, i) => ({
			binding: i,
			resource: { buffer: b }
		}));

		return this.device.createBindGroup({
			layout: this.layout,
			entries
		});
	}
	public dispatch(computePass: GPUComputePassEncoder) {
		computePass.setPipeline(this.pipeline);
		computePass.setBindGroup(0, this.binding);
		computePass.dispatchWorkgroups(Math.ceil(this.dispatchX / 8), Math.ceil(this.dispatchY / 8));
	}
}
