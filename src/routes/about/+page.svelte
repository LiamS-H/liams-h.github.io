<script lang="ts">
	import { registerSolid } from '$lib/actions/solid.svelte';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { language_list } from '$lib/data/languages';
	import { routes } from '$lib/data/routes';
	import { onMount } from 'svelte';
	import LanguageItem from './language-item.svelte';
	import { technology_list } from '$lib/data/technologies';
	import Technology from '$lib/components/technology.svelte';
	import TransparentLink from '$lib/components/transparent-link.svelte';
	import InternalLink from '$lib/components/internal-link.svelte';
	import { project_ids } from '$lib/data/projects';
	import ReadMore from './read-more.svelte';

	const fluid = useFluidContext();

	let parent: HTMLElement | undefined = $state();
	let infoOpen = $state(false);

	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(routes[1].color);
	});
</script>

<svelte:head>
	<title>About - LiamS-H</title>
</svelte:head>

<div
	class="h-[calc(100%-150px)] overflow-y-auto mask-[linear-gradient(to_top,transparent,black_5%,black_90%,transparent)] px-4 [webkit-mask:linear-gradient(to_right,transparent,black_5%,black_90%,transparent)] md:flex md:h-[calc(100%-90px)] md:flex-col md:px-0
                    md:pt-30
                    lg:h-[calc(100%-130px)]"
	bind:this={parent}
>
	<div class="mx-auto max-w-4xl pt-10 sm:p-4">
		<div
			class="m-1 flex flex-col p-4 text-white"
			use:registerSolid={{ id: 'about-header', parent }}
		>
			<p class="relative text-lg leading-relaxed">
				<span class="absolute top-0 right-0 rounded-sm bg-white px-3 text-black">
					Sacramento, CA
				</span>
				<span class="text-4xl">
					Hi, I'm
					<span
						class="-mr-2 block bg-linear-to-r from-blue-500 to-green-500 bg-clip-text text-4xl font-bold text-transparent md:inline"
					>
						Liam Stelly-Hawkes
						<br />
					</span>
				</span>
				I have a
				<span
					class="bg-linear-to-r from-pink-500 to-orange-500 bg-clip-text font-bold text-transparent"
				>
					Software Engineering Degree
				</span>
				and all the tools you need so I can
				<span
					class="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent"
				>
					hit the ground running.
				</span>
			</p>
			<!-- <button
                        className="mx-auto mt-2 py-1 px-2 rounded-md shadow-lg  w-fit h-fit transition-all duration-500 shadow-cyan-300 text-cyan-100 hover:text-cyan-400 hover:shadow-cyan-600"
                        onClick={() =>
                            setBioOpen((o) => {
                                if (o) changeColor(0);
                                else changeColor(3);
                                return !o;
                            })
                        }
                    >
                        {bioOpen ? "Read Less" : "Read More"}
                    </button> -->
		</div>
		<div class="flex flex-col-reverse items-center justify-between md:flex-row">
			<div class="-mx-4 mt-2 mb-4 flex flex-wrap gap-x-1 sm:mb-0">
				<TransparentLink href="https://github.com/LiamS-H">Github</TransparentLink>
				<TransparentLink href="https://www.linkedin.com/in/lstelly-hawkes/"
					>LinkedIn</TransparentLink
				>
				<TransparentLink href="mailto:liamsh@gmail.com">liamsh@gmail.com</TransparentLink>
			</div>
			<ReadMore {infoOpen} toggleInfo={() => (infoOpen = !infoOpen)} />
		</div>
	</div>
	{#if infoOpen}
		<div class="mx-auto flex max-w-4xl flex-col gap-4 px-4 text-white md:w-3xl md:px-10 lg:w-4xl">
			<div
				class="mr-auto max-w-xl px-4 py-3 text-justify"
				use:registerSolid={{ id: 'about-1', parent, inner: 4, color: 3 }}
			>
				I specialize in Typescript, Rust, and Python, but the last 3 years I've also been chasing my
				other passion working as a whitewater rafting and outdoor guide. A river is a special place
				and it brings me great joy to see eddies and vortices wrap around the elements on this page.
				Hydrodynamics is not usually a concern when working on a site layout, but here we are!
			</div>

			<div
				class="ml-auto max-w-xl px-4 py-3 text-justify"
				use:registerSolid={{ id: 'about-2', parent, inner: 4, color: 3 }}
			>
				My personal projects over the last few years have all followed a similar suit, being mostly
				practical and related to things Im interested in at the time. My recent fixation has been a
				little ecosystem of projects related to Magic The Gathering; this culminated in a
				<InternalLink href={`/projects/${project_ids[0]}`}>table-top simulator</InternalLink>
				that I constantly improve, and use to play Magic with my friends a few nights a week.
			</div>

			<div
				class="max-w-fit p-4 px-4"
				use:registerSolid={{ id: 'about-3', parent, inner: 4, color: 3 }}
			>
				While I currently live near Sacramento, CA, I'm happy to relocate. <strong
					>Looking at SF</strong
				>.
			</div>
		</div>
	{:else}
		<div class="mx-auto flex max-w-4xl cursor-default flex-col gap-12 md:flex-row">
			<div class="min-w-56">
				<h2 class="mb-4 flex items-center text-2xl font-bold text-white">Languages</h2>

				<ul>
					<!-- eslint-disable-next-line svelte/require-each-key -->
					{#each language_list as name}
						<LanguageItem {name} {parent} />
					{/each}
				</ul>
			</div>
			<div class="min-h-100 w-full">
				<h2 class="mb-4 flex items-center text-2xl font-bold text-white">Technologies</h2>

				<ul class="mt-5 flex flex-wrap gap-2">
					<!-- eslint-disable-next-line svelte/require-each-key -->
					{#each technology_list as tech}
						<Technology {tech} {parent} />
					{/each}
				</ul>
			</div>
		</div>
	{/if}
	<div class="h-40 md:h-0"></div>
</div>
