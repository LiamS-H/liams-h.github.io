<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Fluid from '$lib/components/fluid/fluid.svelte';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	onMount(() => {
		if (dev) return;

		fetch('https://abacus.jasoncameron.dev/hit/liams-h.github.io/visits');

		const hasVisited = localStorage.getItem('has_visited');
		if (!hasVisited) {
			fetch('https://abacus.jasoncameron.dev/hit/liams-h.github.io/unique-visits');
			localStorage.setItem('has_visited', 'true');
		}
	});

	let transitionType = $state('vt-blur');

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// Add transition class to root element
			document.documentElement.classList.add(transitionType);

			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});

			transition.finished.finally(() => {
				// Cleanup transition class
				document.documentElement.classList.remove(transitionType);
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Fluid>
	<main class="h-full">
		{@render children()}
	</main>
	<Navbar />

	<div
		class="fixed bottom-4 left-4 z-50 flex flex-col gap-2 rounded-lg bg-black/50 p-2 backdrop-blur-md"
	>
		<label for="transition-select" class="text-xs font-bold text-white/50 uppercase">
			Transition
		</label>
		<select
			id="transition-select"
			bind:value={transitionType}
			class="appearance-none rounded border border-white/20 bg-transparent px-2 py-1 text-sm outline-none focus:border-white/40"
		>
			<option class="bg-transparent" value="vt-fade">Fade</option>
			<option class="bg-transparent" value="vt-slide">Slide</option>
			<option class="bg-transparent" value="vt-float">Float</option>
			<option class="bg-transparent" value="vt-zoom">Zoom</option>
			<option class="bg-transparent" value="vt-blur">Soft Blur</option>
			<option class="bg-transparent" value="vt-iris">Iris Wipe</option>
			<option class="bg-transparent" value="vt-swing">Swing</option>
		</select>
	</div>
</Fluid>
