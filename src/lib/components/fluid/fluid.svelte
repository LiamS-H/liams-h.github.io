<script lang="ts">
	import { onMount } from 'svelte';
	import { Simulator } from './sim';
	import { setFluidContext } from '@/lib/context/fluid.svelte';

	let { children } = $props();

	let canvas: HTMLCanvasElement;
	let frame: number;
	// let sim: Simulator;
	// let sim: Simulator | null = null;
	let sim = new Simulator(new Map());
	setFluidContext(() => sim);

	let isFocused = true;
	function handleFocus(focus: boolean) {
		return () => (isFocused = focus);
	}

	async function init() {
		// sim = await Simulator.create(canvas, new Map());
		await sim.init(canvas);
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
		const minW = 4;
		const minH = 4;

		const vw = window.visualViewport?.width || window.innerWidth;
		const vh = window.visualViewport?.height || window.innerHeight;

		canvas.width = Math.max(vw, minW);
		canvas.height = Math.max(vh, minH);
		await sim.resize();
	}
	function mouseMove(e: MouseEvent) {
		const vh = window.visualViewport?.height || window.innerHeight;
		const vw = window.visualViewport?.width || window.innerWidth;
		sim?.updateMouse(e.clientX / vw, e.clientY / vh);
	}
	function touchMove(e: TouchEvent) {
		const vw = window.visualViewport?.width || window.innerWidth;
		const vh = window.visualViewport?.height || window.innerHeight;
		const touch = e.touches[0];
		sim?.updateMouse(touch.clientX / vw, touch.clientY / vh, true);
	}

	onMount(() => {
		init();
		return () => cancelAnimationFrame(frame);
	});
</script>

<svelte:window
	on:resize={resize}
	on:mousemove={mouseMove}
	on:touchmove={touchMove}
	on:pageshow={handleFocus(true)}
	on:pagehide={handleFocus(false)}
	on:focus={handleFocus(true)}
	on:blur={handleFocus(false)}
/>

<div class="w-full h-full absolute top-0 left-0 -z-10 overflow-hidden max-w-screen">
	<canvas bind:this={canvas} class="w-full h-full"></canvas>
</div>
{@render children()}
