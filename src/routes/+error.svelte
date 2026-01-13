<script lang="ts">
	import { page } from '$app/state';
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { onMount } from 'svelte';

	const fluid = useFluidContext();

	onMount(() => {
		fluid.registerText(page.status.toString());
		return () => fluid.registerText('');
	});
</script>

<div class="absolute top-8 left-1/2 -translate-x-1/2 translate-y-8">
	<div use:registerSolid={{ id: 'error' }} class="p-4 text-white flex flex-col items-center">
		<h1 class="text-9xl">{page.status}</h1>
		<p class="text-3xl">{page.error?.message}</p>
		<a
			href="/"
			class="bg-size-[200%_200%] bg-left transition-all duration-300 hover:bg-right bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-purple-600"
			>Go Home</a
		>
	</div>
</div>
