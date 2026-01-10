<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { onMount } from 'svelte';
	import { routes } from '$lib/data/routes';
	import { project_ids } from '$lib/data/projects';
	import ProjectCard from './project-card.svelte';

	const fluid = useFluidContext();

	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(routes[2].color);
	});
</script>

<div class="h-full px-16 md:px-32 flex flex-col justify-center">
	<div class="flex flex-col-reverse justify-center">
		<ul
			class="h-fit gap-8 md:gap-24 flex flex-row items-center overflow-x-auto snap-x snap-mandatory md:snap-normal
                    mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]
                    [webkit-mask:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
		>
			<div class="min-w-[40%] h-full"></div>
			{#each project_ids as id}
				<ProjectCard {id} active={false} />
			{/each}
			<div class="min-w-[40%] h-full"></div>
		</ul>
	</div>
</div>
