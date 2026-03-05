<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	const {
		src,
		alt,
		class: className
	} = $props<{ src: string; alt: string; class: HTMLImgAttributes['class'] }>();
	let loaded = $state(false);
</script>

<enhanced:img
	class={`transition-all ease-in ${className}`}
	{src}
	{alt}
	class:blur-md={!loaded}
	class:blur-none={loaded}
	onload={() => (loaded = true)}
/>
