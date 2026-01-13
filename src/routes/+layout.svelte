<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Fluid from '$lib/components/fluid/fluid.svelte';
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Fluid>
	<main class="h-full">
		{@render children()}
	</main>
	<Navbar />
</Fluid>
