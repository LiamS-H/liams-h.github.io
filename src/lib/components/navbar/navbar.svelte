<script lang="ts">
	import { page } from '$app/state';
	import Item from './item.svelte';

	const routes = [
		{ path: '/', label: 'Home', color: 0 },
		{ path: '/about', label: 'About', color: 1 },
		{ path: '/projects', label: 'Projects', color: 6 }
	];
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

<nav class="fixed bottom-0 w-full mb-20 md:mb-8 md:px-[20%]">
	<ul class="flex justify-around">
		{#each routes as route}
			<Item {...route} active={match(page.url.pathname, route.path)} />
		{/each}
	</ul>
</nav>
