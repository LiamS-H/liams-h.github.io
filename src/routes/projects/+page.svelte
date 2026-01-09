<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { onMount } from 'svelte';
	import { registerSolid } from '$lib/components/fluid/solid.svelte';

	const fluid = useFluidContext();

	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(6);
	});
</script>

<div
	class="absolute bottom-1/2 right-1/2 w-10 h-10 flex items-center justify-center"
	use:registerSolid={{ id: 'projects', color: 4 }}
></div>
