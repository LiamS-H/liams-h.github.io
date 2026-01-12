<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { routes } from '$lib/data/routes';
	import { onMount } from 'svelte';

	const fluid = useFluidContext();
	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(routes[1].color);
	});
</script>

<svelte:head>
	<title>About - LiamS-H</title>
</svelte:head>
