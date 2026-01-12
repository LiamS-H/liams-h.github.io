<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { language_list, languages } from '$lib/data/languages';
	import { routes } from '$lib/data/routes';
	import { gradient_hover, gradients } from '$lib/utils/colors';
	import { onMount } from 'svelte';
	import LanguageItem from './language-item.svelte';
	import { technologies, technology_list } from '$lib/data/technologies';
	import Technology from '$lib/components/technology.svelte';
	import TransparentLink from '$lib/components/transparent-link.svelte';

	const fluid = useFluidContext();

	let parent: HTMLElement | undefined = $state();

	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(routes[1].color);
	});
</script>

<svelte:head>
	<title>About - LiamS-H</title>
</svelte:head>

<div
	class="h-[calc(100%-150px)] md:h-[calc(100%-90px)] lg:h-[calc(100%-130px)] md:flex md:flex-col md:justify-center px-4 md:px-0 overflow-y-auto
                    mask-[linear-gradient(to_top,transparent,black_5%,black_90%,transparent)]
                    [webkit-mask:linear-gradient(to_right,transparent,black_5%,black_90%,transparent)]"
	bind:this={parent}
>
	<div class="max-w-4xl mx-auto pt-10 sm:p-4">
		<div
			class="flex flex-col p-4 m-1 bg-black text-white"
			use:registerSolid={{ id: 'about-header', parent }}
		>
			<p class="text-lg relative leading-relaxed">
				<span class="absolute top-0 right-0 bg-white/20 px-2 rounded-sm text-white/70">
					Sacramento, CA
				</span>
				<span class="text-4xl">
					Hi, I'm{' '}
					<span
						class="block md:inline text-4xl bg-linear-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-bold -mr-2"
					>
						Liam Stelly-Hawkes
						<br />
					</span>
				</span>
				I have a{' '}
				<span
					class="bg-linear-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold"
				>
					Software Engineering Degree
				</span>{' '}
				and all the tools you need so I can{' '}
				<span
					class="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold"
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
		<div class="flex flex-wrap gap-x-1 -mx-4 mb-4 sm:mb-0">
			<TransparentLink href="https://github.com/LiamS-H">Github</TransparentLink>
			<TransparentLink href="https://www.linkedin.com/in/lstelly-hawkes/">LinkedIn</TransparentLink>
			<TransparentLink href="mailto:liamsh@gmail.com">liamsh@gmail.com</TransparentLink>
		</div>
	</div>
	<div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 cursor-default">
		<div class="min-w-56">
			<h2 class="text-2xl mb-4 text-white font-bold flex items-center">Languages</h2>

			<ul>
				{#each language_list as name}
					<LanguageItem {name} {parent} />
				{/each}
			</ul>
		</div>
		<div class="w-full min-h-100">
			<h2 class="text-2xl mb-4 text-white font-bold flex items-center">Technologies</h2>

			<ul class="mt-5 flex flex-wrap gap-2">
				{#each technology_list as tech (tech)}
					<Technology {tech} {parent} />
				{/each}
			</ul>
		</div>
	</div>
	<div class="h-64 md:h-0"></div>
</div>
