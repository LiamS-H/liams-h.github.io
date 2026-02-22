<script lang="ts">
	import { registerSolid } from '$lib/actions/solid.svelte';
	import { useFluidContext } from '$lib/context/fluid.svelte';
	import { languages, type Language } from '$lib/data/languages';
	import { routes } from '$lib/data/routes';
	import { gradient_hover } from '$lib/utils/colors';
	const fluid = useFluidContext();

	const { name, parent }: { name: Language; parent?: HTMLElement } = $props();
	const lang = $derived(languages[name]);
</script>

<li
	class={`group flex max-w-50 items-center bg-clip-text p-2 text-white transition-all duration-300 hover:text-transparent md:max-w-md ${gradient_hover[lang.colorNum]}`}
	onmouseenter={() => fluid.changeColor(lang.colorNum)}
	onmouseleave={() => fluid.changeColor(routes[1].color)}
>
	<div
		class="mt-1 mr-2 h-4 w-4"
		use:registerSolid={{ id: name, color: lang.colorNum, inner: 2, parent }}
	></div>
	<span class="font-medium">{name}</span>
	<span class="ml-auto text-sm text-gray-300">{lang.years} years</span>
</li>
