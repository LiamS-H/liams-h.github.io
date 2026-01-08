<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { onMount } from 'svelte';
	import { registerSolid } from '$lib/components/fluid/solid.svelte';

	const fluid = useFluidContext();

	onMount(() => {
		fluid.registerText('LIAM');
	});
</script>

<div class="absolute bottom-10 right-1/2 w-10 h-10 flex items-center justify-center" use:registerSolid={{ id: 'test', color: 4 }}>
    <div class="w-8 h-8" use:registerSolid={{ id: 'test1' }}></div>
</div>
