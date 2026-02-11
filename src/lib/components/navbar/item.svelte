<script lang="ts">
	import { registerSolid } from '$lib/actions/solid.svelte';
	import { colors, hovers } from '$lib/utils/colors';

	const {
		active,
		color,
		label,
		path
	}: { path: string; label: string; color: number; active: boolean } = $props();

	let isHovered = $state(false);
</script>

<a
	href={path}
	data-sveltekit-preload-data="hover"
	onpointerleave={() => (isHovered = false)}
	onpointerenter={() => (isHovered = true)}
>
	<div
		class={`p-4 ${active || isHovered ? colors[color] : 'text-white'} ${hovers[color]} `}
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
