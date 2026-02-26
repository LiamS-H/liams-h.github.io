<script lang="ts">
	import Language from '$lib/components/language.svelte';
	import Technology from '$lib/components/technology.svelte';
	import TransparentLink from '$lib/components/transparent-link.svelte';
	import type { PageData } from './$types';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { registerSolid } from '$lib/actions/solid.svelte';
	import { gradients } from '$lib/utils/colors';
	import { project_ids, projects } from '$lib/data/projects';
	import { afterNavigate } from '$app/navigation';
	import { autoFocus } from '$lib/actions/autofocus';

	const { data }: { data: PageData } = $props();

	const {
		id,
		title,
		liveLink,
		githubLink,
		technologies,
		languages,
		paragraphs,
		images,
		colorNum,
		intro
	} = $derived(data.project);

	const index = $derived(project_ids.indexOf(id));
	const next = $derived.by(() => {
		let next_index = index + 1;
		while (projects[project_ids[next_index]].paragraphs.length === 0) {
			next_index = (next_index + 1) % project_ids.length;
		}
		return project_ids[next_index];
	});
	// const prev = $derived(index === 0 ? null : project_ids[index - 1]);

	let activeImage = $state<null | { src: string; alt: string }>(null);

	const fluid = useFluidContext();
	let parent: HTMLDivElement | undefined = $state();

	afterNavigate(() => {
		fluid.registerText('');
		fluid.changeColor(colorNum);
	});
</script>

<svelte:head>
	<title>{title} - LiamS-H</title>
	{#each images as image (image.src)}
		<link rel="preload" href={image.src} as="image" />
	{/each}
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		console.log(e.key);
		if (e.key === 'Escape') {
			activeImage = null;
		}
	}}
/>

<div
	bind:this={parent}
	class="h-[calc(100%-150px)] overflow-y-auto mask-[linear-gradient(to_top,transparent,black_10%,black_90%,transparent)] px-4 pt-14 text-white [webkit-mask:linear-gradient(to_top,transparent,black_10%,black_90%,transparent)] md:h-[calc(100%-90px)] md:px-14 lg:h-[calc(100%-130px)]"
	style={activeImage ? 'overflow:hidden; scrollbar-gutter:stable;' : undefined}
>
	<div class="mx-auto max-w-4xl">
		<div class="flex w-full flex-wrap items-center">
			<div use:registerSolid={{ id: `${title}-title`, parent, radius: 20 }} class="w-fit p-4">
				<h1
					class={`bg-clip-text font-bold text-transparent ${gradients[colorNum]} animate-gradient-swirl text-4xl`}
				>
					{title}
				</h1>
			</div>
			<div class="mt-2 flex grow flex-wrap justify-between md:mt-0 md:ml-2">
				<div class="felx-wrap flex gap-4">
					{#if githubLink}
						<TransparentLink href={githubLink}>Github</TransparentLink>
					{/if}

					{#if liveLink}
						<TransparentLink href={liveLink}>Website</TransparentLink>
					{/if}
				</div>
				<!-- {#if prev}
					<div class="flex flex-wrap gap-4">
						<TransparentLink href={`/projects/${prev}`}>Prev</TransparentLink>
					</div>
				{/if} -->
				<div class="flex flex-wrap gap-4">
					<TransparentLink href={`/projects/${next}`}>Next</TransparentLink>
				</div>
			</div>
		</div>

		<div class="flex flex-wrap gap-x-4 gap-y-2 p-2">
			{#each languages as language (language)}
				<Language lang={language} />
			{/each}

			{#each technologies as technology (technology)}
				<Technology tech={technology} />
			{/each}
		</div>

		{#each intro.description as line, index (`${id}-${index}`)}
			<div
				use:registerSolid={{ id: `${title}-description-${index}`, parent, radius: 8 }}
				class="w-fit p-4"
				id={`${title}-intro`}
			>
				{line}
			</div>
		{/each}

		<div class="mt-10 flex flex-col gap-10 sm:mt-4 sm:gap-4 md:flex-row">
			<div class="flex flex-col gap-10 sm:gap-4">
				{#each paragraphs as paragraph, index (`${id}-${index}`)}
					<div
						use:registerSolid={{ id: `${title}-paragraph-${index}`, parent, radius: 8 }}
						class="w-fit p-4"
					>
						{paragraph}
					</div>
				{/each}
			</div>
			<div class="flex w-full grow flex-col gap-10 sm:gap-4 md:max-w-70">
				{#each images as image, index (image.src)}
					<button
						aria-label={`enlarge-img-${image.alt}`}
						onclick={() => (activeImage = image)}
						use:registerSolid={{ id: `${title}-img-${index}`, parent, radius: 8 }}
						class="group relative w-full"
					>
						<enhanced:img
							class="rounded-xl transition-opacity hover:opacity-20"
							src={image.src}
							alt={image.alt}
						/>
						<span
							class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100"
							>View</span
						>
					</button>
				{/each}
			</div>
		</div>
		<div class="h-64 md:h-0"></div>
	</div>
</div>

{#if activeImage}
	<dialog
		class="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-transparent px-4 backdrop-blur-md md:px-8 lg:px-20"
		onclick={() => (activeImage = null)}
	>
		<div class="relative flex max-h-full max-w-full rounded-md">
			<img src={activeImage.src} alt={activeImage.alt} />
			<button
				use:autoFocus
				class="bg-color-0 absolute -top-2 -right-2 h-6 w-6 rounded-full"
				onclick={() => (activeImage = null)}
			>
				<span class="white">X</span>
			</button>
		</div>
	</dialog>
{/if}
