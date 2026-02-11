<script lang="ts">
	import { registerSolid } from '$lib/actions/solid.svelte';
	import { type ProjectID, projects } from '$lib/data/projects';
	import { gradients } from '$lib/utils/colors';

	const {
		id,
		active,
		behavior = 'smooth'
	}: { id: ProjectID; active: boolean; behavior?: ScrollBehavior } = $props();
	const project = projects[(() => id)()];
	let bind: HTMLElement;
	let preload = $state(false);

	$effect(() => {
		if (active) bind.scrollIntoView({ behavior, inline: 'center' });
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#if preload}
		{#each project.images as image}
			<link rel="prefetch" href={image.src} as="image" />
		{/each}
	{/if}
</svelte:head>

<li
	bind:this={bind}
	class="relative flex h-60 min-h-60 w-60 min-w-60 snap-center flex-col justify-between mx-4 select-none"
	use:registerSolid={{
		id: `project-card-${id}`,
		color: project.colorNum,
		inner: 4
	}}
	{id}
>
	<button
		type="button"
		class="absolute inset-0 z-0"
		aria-label={`Scroll project ${project.title} into view`}
		onclick={() => {
			bind.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		}}
	></button>

	<div
		class={`pointer-events-none relative z-10 p-4 flex h-full flex-col justify-between animate-gradient-swirl bg-clip-text text-transparent ${gradients[project.colorNum]}`}
	>
		<h1 class="text-[2.15rem] pt-2 text-4xl">{project.title}</h1>
		<p>{project.intro.summary}</p>
		<i>{project.intro.hook}</i>

		<div class="pointer-events-auto flex flex-row justify-center space-x-4 align-middle">
			{#if project.liveLink}
				<a
					class="bg-size-[200%_200%] bg-left transition-all duration-300 hover:bg-right bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-purple-600"
					href={project.liveLink}
				>
					Visit Site
				</a>
			{:else if project.githubLink}
				<a
					class="bg-size-[200%_200%] bg-left transition-all duration-300 hover:bg-right bg-clip-text text-transparent bg-linear-to-r from-color-1 to-color-4"
					href={project.githubLink}
				>
					Github
				</a>
			{/if}
			{#if project.paragraphs.length > 0}
				<a
					class={`bg-size-[300%_100%] bg-left transition-all duration-300 hover:bg-right bg-clip-text text-transparent bg-linear-to-r from-color-3 to-color-${project.colorNum}`}
					href={`/projects/${project.id}`}
					data-sveltekit-preload-data="hover"
					onpointerenter={() => (preload = true)}
				>
					Explore
				</a>
			{/if}
		</div>
	</div>
</li>
