<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { routes } from '$lib/data/routes';
	import { onMount } from 'svelte';

	const fluid = useFluidContext();

	onMount(() => {
		fluid.registerText('LIAM');
		fluid.changeColor(routes[0].color);
	});
</script>

<svelte:head>
	<title>LiamS-H</title>
</svelte:head>
