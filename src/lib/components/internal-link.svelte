<script lang="ts">
	import type { Snippet } from 'svelte';

	const { href, children }: { href: string; children: Snippet } = $props();
</script>

<a
	{href}
	class="bg-size-[200%_200%] bg-left transition-all duration-300 hover:bg-right bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-purple-600"
>
	{@render children()}
</a>
