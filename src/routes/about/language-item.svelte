<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { languages, type Language } from '$lib/data/languages';
	import { gradient_hover } from '$lib/utils/colors';

	const { name, parent }: { name: Language; parent?: HTMLElement } = $props();
	const lang = $derived(languages[name]);
</script>

<li
	class={`p-2 flex items-center max-w-50 md:max-w-md group transition-all duration-300 text-white hover:text-transparent bg-clip-text ${gradient_hover[lang.colorNum]}`}
>
	<div
		class="w-4 h-4 mt-1 mr-2"
		use:registerSolid={{ id: name, color: lang.colorNum, inner: 2, parent }}
	></div>
	<span class="font-medium">{name}</span>
	<span class="ml-auto text-gray-300 text-sm">{lang.years} years</span>
</li>
