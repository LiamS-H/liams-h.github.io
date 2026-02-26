<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { onMount, tick } from 'svelte';
	import { routes } from '$lib/data/routes';
	import { project_ids } from '$lib/data/projects';
	import ProjectCard from './project-card.svelte';
	import { afterNavigate } from '$app/navigation';
	import { blurMirror } from '$lib/actions/blurMirror';

	const fluid = useFluidContext();

	let behavior: ScrollBehavior = $state('instant');
	let activeIndex: number = $state(0);
	let carouselEl: HTMLUListElement | undefined = $state();
	let scrollTimeout: ReturnType<typeof setTimeout>;
	// const activeProject = $derived(projects[project_ids[activeIndex]]);

	function updateActiveState() {
		if (!carouselEl) return;

		const containerCenter = carouselEl.scrollLeft + carouselEl.offsetWidth / 2;

		let i = 0;
		let min = Infinity;
		let new_index: number = -1;
		for (const child of Array.from(carouselEl.children)) {
			if (child.tagName === 'LI') {
				const card = child as HTMLLIElement;
				const cardCenter = card.offsetLeft + card.offsetWidth / 2;
				const distance = Math.abs(containerCenter - cardCenter);

				if (distance < min) {
					new_index = i;
					min = distance;
				}
				i += 1;
			}
		}
		if (new_index != -1) {
			activeIndex = new_index;
			sessionStorage.setItem('carousel_index', activeIndex.toString());
		}
	}

	function scrollTo(index: number) {
		activeIndex = index;
		sessionStorage.setItem('carousel_index', activeIndex.toString());
	}

	function scroll(direction: -1 | 1, wrap = true) {
		if (wrap) {
			scrollTo((project_ids.length + activeIndex + direction) % project_ids.length);
		} else {
			scrollTo(Math.max(0, Math.min(activeIndex + direction, project_ids.length - 1)));
		}
	}

	afterNavigate(() => {
		fluid.registerText('');
		fluid.changeColor(routes[2].color);
	});

	onMount(() => {
		activeIndex = Number(sessionStorage.getItem('carousel_index'));
		const controller = new AbortController();

		window.addEventListener(
			'wheel',
			(e: WheelEvent) => {
				scroll(0 < e.deltaY ? 1 : -1, false);
			},
			{ passive: true, signal: controller.signal }
		);
		window.addEventListener(
			'scroll',
			() => {
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(updateActiveState, 50);
			},
			{
				passive: true,
				signal: controller.signal,
				capture: true
			}
		);

		tick().then(() => (behavior = 'smooth'));

		return () => {
			controller.abort();
			clearTimeout(scrollTimeout);
		};
	});
</script>

<svelte:head>
	<title>Projects - LiamS-H</title>
</svelte:head>

<div class="relative flex h-full flex-col justify-center px-10 md:px-32">
	<div class="absolute bottom-2/3 left-1/2 flex -translate-x-1/2 flex-col gap-2">
		<!-- <ul class="flex flex-wrap justify-center">
			{#each activeProject.technologies as tech (tech)}
				<Technology {tech} />
			{/each}
		</ul>
		<ul class="flex flex-wrap justify-center">
			{#each activeProject.languages as lang (lang)}
				<Language {lang} />
			{/each}
		</ul> -->
	</div>

	<div class="flex flex-col-reverse justify-center">
		<ul
			bind:this={carouselEl}
			class="flex h-fit snap-x snap-mandatory flex-row items-center gap-8 overflow-x-auto mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] [webkit-mask:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]
                    md:snap-normal
                    md:gap-24"
			style="scrollbar-width: none;"
		>
			<div class="h-full min-w-[40%]"></div>
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each project_ids as id, i (id)}
				<ProjectCard {id} active={activeIndex === i} {behavior} />
			{/each}
			<div class="h-full min-w-[40%]"></div>
		</ul>
	</div>
</div>
<div
	class="absolute top-[calc(50%+154px)] z-10 flex w-full justify-around md:justify-center md:gap-20"
>
	<button
		class="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white active:bg-purple-700/20"
		onclick={() => scroll(-1)}
		aria-label="Scroll left"
		use:blurMirror
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-12 w-12"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1.5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
		</svg>
	</button>
	<div class="flex md:hidden">
		{#each project_ids as id, i (id)}
			<button class="p-3" aria-label={`Scroll to project ${id}`} onclick={() => scrollTo(i)}>
				<div
					class={`h-4 w-4 rounded-full ${activeIndex == i ? 'bg-white/80' : 'bg-white/30'}`}
				></div>
			</button>
		{/each}
	</div>
	<button
		class="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white active:bg-purple-700/20"
		onclick={() => scroll(1)}
		aria-label="Scroll right"
		use:blurMirror
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-12 w-12"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1.5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</button>
</div>
