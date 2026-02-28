<script lang="ts">
	import { onMount } from 'svelte';
	import type { Simulator } from './sim';
	import { setFluidContext } from '$lib/context/fluid.svelte';
	import { NoGpuStore } from '$lib/context/no-gpu-store';

	let { children } = $props();

	// svelte-ignore non_reactive_update
	let canvas: HTMLCanvasElement;
	let frame: number;
	let error = $state(false);
	const fluidState = setFluidContext();
	let sim: Simulator | null = null;

	let isFocused = true;

	async function init() {
		const { Simulator } = await import('./sim');
		sim = new Simulator(fluidState);
		if (!(await sim.init(canvas))) {
			error = true;
			NoGpuStore.set(true);
			return;
		}
		frame = requestAnimationFrame(animate);
	}

	function animate() {
		frame = requestAnimationFrame(animate);
		if (!isFocused) return;
		if (!sim) return;
		if (!sim.isInitialized()) return;

		sim.step();
	}

	async function resize() {
		if (!sim) {
			frame = requestAnimationFrame(resize);
			return;
		}
		if (!canvas) return;
		const minW = 4;
		const minH = 4;

		const vw = window.visualViewport?.width || window.innerWidth;
		const vh = window.visualViewport?.height || window.innerHeight;

		canvas.width = Math.max(vw, minW);
		canvas.height = Math.max(vh, minH);
		await sim.resize();
		isFocused = true;
	}

	function mouseMove(e: MouseEvent) {
		if (!sim) return;
		sim.updateMouse(e.clientX, e.clientY);
		// sim.registerRectangle({
		//     x:e.clientX-5,
		//     y:e.clientY-5,
		//     w: 10, h: 10,

		// },"mouse")
	}

	function touchMove(e: TouchEvent) {
		if (!sim) return;
		const touch = e.touches[0];
		sim.updateMouse(touch.clientX, touch.clientY, true);
	}

	onMount(() => {
		init();
		return () => cancelAnimationFrame(frame);
	});
</script>

<svelte:window on:resize={resize} on:mousemove={mouseMove} on:touchmove={touchMove} />
{#if error}
	<div
		class="bg-gradient-0 animate-gradient-swirl absolute top-0 left-0 -z-10 h-full w-full max-w-screen overflow-hidden"
	></div>
	<a href="/gpu" class="absolute top-4 left-4 z-10 text-blue-500 hover:text-blue-600">
		NO-GPU: Rendering Limited - Learn More
	</a>
{:else}
	<div class="absolute top-0 left-0 -z-10 h-full w-full max-w-screen overflow-hidden">
		<canvas bind:this={canvas} class="h-full w-full"></canvas>
		<!-- Force font activation -->
		<span style="font-family: 'Megrim'; opacity: 0; position: absolute; pointer-events: none;">
			loading font
		</span>
	</div>{/if}
{@render children()}
