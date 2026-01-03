<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { useFluidContext } from '@/lib/context/fluid.svelte';
	import { onMount } from 'svelte';

	const fluid = useFluidContext();

	onMount(() => {
		console.log(fluid);
		fluid.registerText('LIAM');
	});
</script>
