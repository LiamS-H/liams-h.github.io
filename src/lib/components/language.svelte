<script lang="ts">
	import { languages, type Language } from '$lib/data/languages';
	import { colors } from '$lib/utils/colors';
	import { registerSolid } from '../actions/solid.svelte';
	import { page } from '$app/state';

	const { lang, parent }: { lang: Language; parent?: HTMLElement } = $props();
	const { colorNum } = $derived(languages[lang]);
</script>

<div
	use:registerSolid={{ id: ` ${page.url}-${lang}`, color: colorNum, inner: 4, parent }}
	class={`px-3 pt-1 pb-1.5 ${colors[colorNum]}`}
>
	{lang}
</div>
