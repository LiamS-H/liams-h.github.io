<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { routes } from '$lib/data/routes';

	const fluid = useFluidContext();

	afterNavigate(() => {
		fluid.registerText('LIAM');
		fluid.changeColor(routes[0].color);
	});
</script>

<svelte:head>
	<title>LiamS-H</title>
</svelte:head>
