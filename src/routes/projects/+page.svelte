<script lang="ts">
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { onMount, tick } from 'svelte';
	import { routes } from '$lib/data/routes';
	import { project_ids } from '$lib/data/projects';
	import ProjectCard from './project-card.svelte';

	const fluid = useFluidContext();

	let behavior: ScrollBehavior = $state('instant');
	let activeIndex: number = $state(0);
	let carouselEl: HTMLUListElement;
	let scrollTimeout: ReturnType<typeof setTimeout>;

	function updateActiveState() {
		if (!carouselEl) return;

		const containerCenter = carouselEl.scrollLeft + carouselEl.offsetWidth / 2;

		let i = 0;

		for (const child of Array.from(carouselEl.children)) {
			if (child.tagName === 'LI') {
				const card = child as HTMLLIElement;
				const cardCenter = card.offsetLeft - 128.5 + card.offsetWidth / 2;
				const distance = Math.abs(containerCenter - cardCenter);

				if (distance == 0) {
					activeIndex = i;
					sessionStorage.setItem('carousel_index', i.toString());
					return;
				}
				i += 1;
			}
		}
	}

	function scroll(direction: -1 | 1, wrap = true) {
		if (wrap) {
			activeIndex = (project_ids.length + activeIndex + direction) % project_ids.length;
		} else {
			activeIndex = Math.max(0, Math.min(activeIndex + direction, project_ids.length - 1));
		}
		sessionStorage.setItem('carousel_index', activeIndex.toString());
	}

	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(routes[2].color);

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

<div class="relative h-full flex flex-col justify-center px-10 md:px-32">
	<button
		class="absolute left-4 top-1/2 lg:top-2/3 lg:-translate-x-14 lg:left-1/2 z-10 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
		onclick={() => scroll(-1)}
		aria-label="Scroll left"
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
	<div class="flex flex-col-reverse justify-center">
		<ul
			bind:this={carouselEl}
			class="h-fit gap-8 md:gap-24 flex flex-row items-center overflow-x-auto snap-x snap-mandatory md:snap-normal
                    mask-[]
                    [webkit-mask:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
			style="scrollbar-width: none;"
		>
			<div class="min-w-[40%] h-full"></div>
			{#each project_ids as id, i}
				<ProjectCard {id} active={activeIndex === i} {behavior} />
			{/each}
			<div class="min-w-[40%] h-full"></div>
		</ul>
	</div>
	<button
		class="absolute right-4 top-1/2 z-10 lg:top-2/3 lg:left-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
		onclick={() => scroll(1)}
		aria-label="Scroll right"
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
