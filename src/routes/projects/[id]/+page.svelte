<script lang="ts">
	import Language from '$lib/components/language.svelte';
	import Technology from '$lib/components/technology.svelte';
	import TransparentLink from '$lib/components/transparent-link.svelte';
	import type { PageData } from './$types';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
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
	const prev = $derived(index === 0 ? null : project_ids[index - 1]);

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
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#each images as image}
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
	class="h-[calc(100%-150px)] md:h-[calc(100%-90px)] lg:h-[calc(100%-130px)] text-white pt-14 md:px-14 px-4 overflow-y-auto
                    mask-[linear-gradient(to_top,transparent,black_10%,black_90%,transparent)]
                    [webkit-mask:linear-gradient(to_top,transparent,black_10%,black_90%,transparent)]
            "
	style={activeImage ? 'overflow:hidden; scrollbar-gutter:stable;' : undefined}
>
	<div class="max-w-4xl mx-auto">
		<div class="w-full flex flex-wrap items-center">
			<div use:registerSolid={{ id: `${title}-title` }} class="p-4 w-fit">
				<h1
					class={`font-bold bg-clip-text text-transparent ${gradients[colorNum]} animate-gradient-swirl text-4xl`}
				>
					{title}
				</h1>
			</div>
			<div class="flex grow flex-wrap justify-between">
				<div class="flex felx-wrap gap-4">
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

		<div class="p-2 flex flex-wrap gap-x-4 gap-y-2">
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each languages as language}
				<Language lang={language} />
			{/each}

			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each technologies as technology}
				<Technology tech={technology} />
			{/each}
		</div>

		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each intro.description as line, index}
			<div
				use:registerSolid={{ id: `${title}-description-${index}`, parent }}
				class="p-4 w-fit"
				id={`${title}-intro`}
			>
				{line}
			</div>
		{/each}

		<div class="mt-10 sm:mt-4 flex flex-col md:flex-row gap-10 sm:gap-4">
			<div class="flex flex-col gap-10 sm:gap-4">
				<!-- eslint-disable-next-line svelte/require-each-key -->
				{#each paragraphs as paragraph, index}
					<div use:registerSolid={{ id: `${title}-paragraph-${index}`, parent }} class="p-4 w-fit">
						{paragraph}
					</div>
				{/each}
			</div>
			<div class="flex grow flex-col gap-10 sm:gap-4 w-full md:max-w-70">
				<!-- eslint-disable-next-line svelte/require-each-key -->
				{#each images as image, index}
					<button
						aria-label={`enlarge-img-${image.alt}`}
						onclick={() => (activeImage = image)}
						use:registerSolid={{ id: `${title}-img-${index}`, parent }}
						class="w-full"
					>
						<enhanced:img src={image.src} alt={image.alt} />
					</button>
				{/each}
			</div>
		</div>
		<div class="h-64 md:h-0"></div>
	</div>
</div>

{#if activeImage}
	<dialog
		class="fixed inset-0 w-full h-full px-4 md:px-8 lg:px-20 flex justify-center items-center backdrop-blur-md bg-transparent z-10"
		onclick={() => (activeImage = null)}
	>
		<div class="relative flex max-h-full max-w-full rounded-md">
			<img src={activeImage.src} alt={activeImage.alt} />
			<button
				use:autoFocus
				class="absolute -right-2 -top-2 bg-color-0 h-6 w-6 rounded-full"
				onclick={() => (activeImage = null)}
			>
				<span class="white">X</span>
			</button>
		</div>
	</dialog>
{/if}
