<script lang="ts">
	import { technologies, type Technology } from '$lib/data/technologies';
	import { colors } from '$lib/utils/colors';
	import { registerSolid } from './fluid/solid.svelte';

	const { tech, parent }: { tech: Technology; parent?: HTMLElement } = $props();
	const { type } = $derived(technologies[tech]);

	function getColor(_types: typeof type) {
		const types = _types as readonly string[];
		if (types.includes('Framework')) return 3;
		if (types.includes('CICD')) return 1;
		if (types.includes('Database')) return 4;
		if (types.includes('Library')) return 2;
		return 1;
	}
	const color = $derived(getColor(type));
</script>

<div
	use:registerSolid={{ id: `${tech}`, color, inner: 4, parent }}
	class={`px-3 pt-1 pb-1.5 ${colors[color]}`}
>
	{tech}
</div>
