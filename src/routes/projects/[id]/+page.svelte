<script lang="ts">
	import Language from '$lib/components/language.svelte';
	import Technology from '$lib/components/technology.svelte';
	import TransparentButton from '$lib/components/transparent-link.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { gradients } from '$lib/utils/colors';

	const { data }: { data: PageData } = $props();

	const {
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

	const fluid = useFluidContext();
	let parent: HTMLDivElement | undefined = $state();

	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(colorNum);
	});
</script>

<svelte:head>
	<title>{title} - LiamS-H</title>
</svelte:head>

<div
	bind:this={parent}
	class="h-[calc(100%-150px)] md:h-[calc(100%-90px)] lg:h-[calc(100%-130px)] text-white pt-10 px-14 overflow-y-auto
                    mask-[linear-gradient(to_top,transparent,black_10%,black_90%,transparent)]
                    [webkit-mask:linear-gradient(to_top,transparent,black_10%,black_90%,transparent)]
            "
>
	<div class="max-w-4xl mx-auto px-4 flex flex-col gap-4">
		<div class="flex flex-wrap items-center gap-4">
			<div use:registerSolid={{ id: `${title}-title` }} class="p-4 w-fit">
				<h1
					class={`font-bold bg-clip-text text-transparent ${gradients[colorNum]} animate-gradient-swirl text-4xl`}
				>
					{title}
				</h1>
			</div>
			{#if githubLink}
				<TransparentButton href={githubLink}>Github</TransparentButton>
			{/if}

			{#if liveLink}
				<TransparentButton href={liveLink}>Visit Site</TransparentButton>
			{/if}
		</div>

		<div class="flex flex-wrap gap-x-4 gap-y-2">
			{#each languages as language}
				<Language lang={language} />
			{/each}

			{#each technologies as technology}
				<Technology tech={technology} />
			{/each}
		</div>

		{#each intro.description as line, index}
			<div
				use:registerSolid={{ id: `${title}-description-${index}`, parent }}
				class="p-4 w-fit"
				id={`${title}-intro`}
			>
				{line}
			</div>
		{/each}

		<div class="flex flex-col md:flex-row gap-10 sm:gap-4">
			<div class="flex flex-col gap-10 sm:gap-4">
				{#each paragraphs as paragraph, index}
					<div use:registerSolid={{ id: `${title}-paragraph-${index}`, parent }} class="p-4 w-fit">
						{paragraph}
					</div>
				{/each}
			</div>
			<div class="flex grow flex-col gap-10 sm:gap-4 w-full md:max-w-70">
				{#each images as image, index}
					<div use:registerSolid={{ id: `${title}-img-${index}`, parent }} class="w-full">
						<enhanced:img src={image.src} alt={image.alt} />
					</div>
				{/each}
			</div>
		</div>
		<div class="h-64 md:h-0"></div>
	</div>
</div>
