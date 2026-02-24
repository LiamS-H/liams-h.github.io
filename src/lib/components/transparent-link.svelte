<script lang="ts">
	import { blurMirror } from '$lib/actions/blurMirror';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, ...anchor }: Omit<HTMLAnchorAttributes, 'class'> = $props();
</script>

<a
	{...anchor}
	class="flex items-center gap-2 rounded-full p-4 text-xl text-white/80 shadow-lg transition-colors duration-300 hover:bg-white/10 hover:text-white active:bg-purple-700/20"
	use:blurMirror
>
	{@render children?.()}
</a>
