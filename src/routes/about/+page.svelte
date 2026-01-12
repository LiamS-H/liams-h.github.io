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
	onMount(() => {
		fluid.registerText('');
		fluid.changeColor(routes[1].color);
	});
</script>

<svelte:head>
	<title>About - LiamS-H</title>
</svelte:head>

<div
	class="h-full flex flex-col justify-center overflow-x-auto
                    mask-[linear-gradient(to_top,transparent,black_20%,black_80%,transparent)]
                    [webkit-mask:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
>
	<div class="max-w-4xl mx-auto pt-10 sm:p-4">
		<div
			class="flex flex-col p-4 m-1 bg-black text-white"
			use:registerSolid={{ id: 'about-header' }}
		>
			<p class="text-lg leading-relaxed">
				<span class="text-4xl">
					Hi, I'm{' '}
					<span
						class="bg-linear-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-bold"
					>
						Liam Stelly-Hawkes
					</span>
					.
					<br />
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
		<div class="flex flex-wrap gap-x-3 mb-4 sm:mb-0">
			<TransparentLink href="https://github.com/LiamS-H">Github</TransparentLink>
			<TransparentLink href="https://www.linkedin.com/in/lstelly-hawkes/">LinkedIn</TransparentLink>
			<TransparentLink href="mailto:liamsh@gmail.com">liamsh@gmail.com</TransparentLink>
		</div>
	</div>
	<div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 cursor-default">
		<div class="min-w-56">
			<h2 class="text-2xl text-white font-bold flex items-center">Languages</h2>

			<ul>
				{#each language_list as name}
					<LanguageItem {name} />
				{/each}
			</ul>
		</div>
		<div class="w-full min-h-100">
			<h2 class="text-2xl text-white font-bold flex items-center">Technologies</h2>

			<ul class="mt-2 flex flex-wrap gap-2">
				{#each technology_list as tech (tech)}
					<Technology {tech} />
				{/each}
			</ul>
		</div>
	</div>
</div>
