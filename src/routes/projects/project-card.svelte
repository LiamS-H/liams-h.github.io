<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { type ProjectID, projects } from '$lib/data/projects';
	import { gradients } from '$lib/utils/colors';

	const { id, active }: { id: ProjectID; active: boolean } = $props();
	const project = projects[(() => id)()];
</script>

<li
	class={`1w-60 min-w-60 h-60 min-h-60 mx-4 p-4 text-transparent bg-clip-text ${gradients[project.colorNum]} animate-gradient-swirl flex flex-col justify-between snap-center`}
	use:registerSolid={{
		id: `project-card-${id}`,
		color: project.colorNum,
		inner: 4
	}}
>
	<h1 class="text-4xl pt-2 text-[2.15rem]">{project.title}</h1>
	<p>{project.intro.summary}</p>
	<i>{project.intro.hook}</i>
	<div class="flex align-middle justify-center flex-row space-x-4">
		{#if project.liveLink}
			<a
				class="bg-linear-to-r from-pink-500 to-purple-600 bg-size-[200%_200%] bg-left hover:bg-right transition-all duration-300 text-transparent bg-clip-text"
				href={project.liveLink}
			>
				Visit Site
			</a>
		{:else if project.githubLink}
			<a href={project.liveLink}> Github </a>
		{/if}
		<a
			class="text-transparent bg-linear-to-r from-color-3 to-color-2 bg-size-[300%_100%] bg-left hover:bg-right transition-all duration-1500 bg-clip-text"
			href={`/projects/${project.id}`}
			data-sveltekit-preload-data="hover"
		>
			Explore
		</a>
	</div>
</li>
