<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Fluid from '$lib/components/fluid/fluid.svelte';
	import Navbar from '$lib/components/navbar/navbar.svelte';

	let { children } = $props();
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
