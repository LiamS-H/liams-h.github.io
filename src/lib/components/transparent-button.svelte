<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	const { children, ...button_props }: Omit<HTMLButtonAttributes, 'class'> = $props();
</script>

<button
	{...button_props}
	class="flex gap-2 items-center text-xl rounded-full p-4 shadow-lg transition-colors duration-300 hover:bg-white/5 active:bg-purple-700/20 hover:text-white/50"
>
	{@render children?.()}
</button>
