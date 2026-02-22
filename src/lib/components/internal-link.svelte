<script lang="ts">
	import type { Snippet } from 'svelte';

	const { href, children }: { href: string; children: Snippet } = $props();
</script>

<a
	{href}
	class="bg-linear-to-r from-pink-500 to-purple-600 bg-size-[200%_200%] bg-clip-text bg-left text-transparent transition-all duration-300 hover:bg-right"
>
	{@render children()}
</a>
