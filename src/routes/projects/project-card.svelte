<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { type ProjectID, projects } from '$lib/data/projects';

	const { id, active }: { id: ProjectID; active: boolean } = $props();
	const project = projects[(() => id)()];
</script>

<li
	class="w-60 min-w-60 h-60 min-h-60 mx-4 p-4 text-white flex flex-col justify-between snap-center"
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
			<a href={project.liveLink}> Visit Site </a>
		{:else if project.githubLink}
			<a href={project.liveLink}> Github </a>
		{/if}
		<a href={`/projects/${project.id}`} data-sveltekit-preload-data="hover"> Explore </a>
	</div>
</li>
