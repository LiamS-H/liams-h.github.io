<script lang="ts">
	import { registerSolid } from '$lib/actions/solid.svelte';

	const { infoOpen, toggleInfo }: { infoOpen: boolean; toggleInfo: () => void } = $props();

	let isHovered = $state(false);
</script>

<button
	class="bg-gradient-0 hover:bg-gradient-3 mt-2 h-9 w-fit bg-clip-text px-3 pt-1 pb-1.5 text-transparent"
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
