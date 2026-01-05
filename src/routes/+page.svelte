<script lang="ts">
	import { useFluidContext } from '@/lib/context/fluid.svelte';
	import { onMount } from 'svelte';

	const fluid = useFluidContext();

	onMount(() => {
		fluid.registerText('LIAM');
	});
</script>
