<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';

	const { infoOpen, toggleInfo }: { infoOpen: boolean; toggleInfo: () => void } = $props();

	let isHovered = $state(false);
</script>

<button
	class="px-3 pt-1 pb-1.5 h-9 mt-2 w-fit md:mr-9 text-transparent bg-clip-text bg-gradient-0 hover:bg-gradient-3"
	onclick={toggleInfo}
	use:registerSolid={{
		id: 'about-button',
		color: isHovered ? 3 : 0,
		inner: 4
	}}
	onpointerleave={() => (isHovered = false)}
	onpointerenter={() => (isHovered = true)}
>
	{#if infoOpen}
		Read Less
	{:else}
		Learn More
	{/if}
</button>
