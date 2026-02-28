<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children } = $props();
</script>

<div class="relative w-fit overflow-hidden rounded-full will-change-transform">
	<div
		class="pointer-events-none absolute -inset-4 mask-[radial-gradient(closest-side,transparent_40%,black_75%)] backdrop-blur-3xl"
	></div>
	{@render children()}
</div>
