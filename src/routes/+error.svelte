<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import InternalLink from '$lib/components/internal-link.svelte';
	import { useFluidContext } from '$lib/context/fluid.svelte';

	const fluid = useFluidContext();

	afterNavigate(() => {
		fluid.registerText(page.status.toString());
		return () => fluid.registerText('');
	});
</script>

<div class="absolute top-8 left-1/2 -translate-x-1/2 translate-y-8">
	<div use:registerSolid={{ id: 'error' }} class="p-4 text-white flex flex-col items-center">
		<h1 class="text-2xl">{page.status}</h1>
		<p class="text-3xl">{page.error?.message}</p>
		<InternalLink href="/">Go Home</InternalLink>
	</div>
</div>
