<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';

	const {
		active,
		color,
		label,
		path
	}: { path: string; label: string; color: number; active: boolean } = $props();
	const hovers: Record<number, string> = {
		0: 'hover:text-color-0',
		1: 'hover:text-rose-500',
		6: 'hover:text-color-6'
	};

	const colors: Record<number, string> = {
		0: 'text-color-0',
		1: 'text-rose-500',
		6: 'text-color-6'
	};

	let isHovered = $state(false);
</script>

<a
	href={`${path}`}
	data-sveltekit-preload-data="hover"
	onmouseenter={() => {
		isHovered = true;
	}}
	onmouseleave={() => (isHovered = false)}
>
	<div
		class={`p-4 ${active ? colors[color] : 'text-white'} ${hovers[color]} `}
		use:registerSolid={{
			id: `nav-${path}`,
			color: isHovered ? color : undefined,
			inner: isHovered ? 4 : undefined
		}}
	>
		<span>
			{label}
		</span>
	</div>
</a>
