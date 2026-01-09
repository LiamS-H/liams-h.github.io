<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';

	const routes = [
		{ path: '/', label: 'Home', color: 0 },
		{ path: '/about', label: 'About', color: 1 },
		{ path: '/projects', label: 'Projects', color: 6 }
	];
</script>

<nav class="fixed bottom-0 w-full mb-20 md:mb-8 md:px-[20%]">
	<ul class="flex justify-around">
		{#each routes as route}
			<a href={`${route.path}`} data-sveltekit-preload-data="hover">
				<div
					class={`text-transparent bg-clip-text bg-color-1 animate-gradient-swirl p-4`}
					use:registerSolid={{ id: `nav-${route.path}`, color: route.color, inner: 4 }}
				>
					<span>
						{route.label}
					</span>
				</div>
			</a>
		{/each}
	</ul>
</nav>
