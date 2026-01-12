<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, ...anchor }: Omit<HTMLAnchorAttributes, 'class'> = $props();
</script>

<a
	{...anchor}
	class="flex text-white gap-2 items-center text-xl rounded-full p-4 shadow-lg transition-colors duration-300 hover:bg-white/5 active:bg-purple-700/20 hover:text-white/50"
>
	{@render children?.()}
</a>
