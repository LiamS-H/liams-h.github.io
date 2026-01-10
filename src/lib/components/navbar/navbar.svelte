<script lang="ts">
	import { page } from '$app/state';
	import { routes } from '$lib/data/routes';
	import Item from './item.svelte';

	function match(path: string, path2: string) {
		if (path2 === '/') {
			return path === path2;
		}
		if (path === path2) {
			return true;
		}
		if (path.startsWith(path2)) {
			return true;
		}
		return false;
	}
</script>

<nav class="fixed bottom-0 w-full mb-14 md:mb-8 md:px-[20%]">
	<ul class="flex justify-around">
		{#each routes as route}
			<Item {...route} active={match(page.url.pathname, route.path)} />
		{/each}
	</ul>
</nav>
