<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Fluid from '$lib/components/fluid/fluid.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main >
	<Fluid>
		{@render children()}
	</Fluid>
</main>
