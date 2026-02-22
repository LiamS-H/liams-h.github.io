<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, ...anchor }: Omit<HTMLAnchorAttributes, 'class'> = $props();
</script>

<a
	{...anchor}
	class="flex items-center gap-2 rounded-full p-4 text-xl text-white shadow-lg transition-colors duration-300 hover:bg-white/5 hover:text-white/50 active:bg-purple-700/20"
>
	{@render children?.()}
</a>
