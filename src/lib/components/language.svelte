<script lang="ts">
	import { languages, type Language } from '$lib/data/languages';
	import { registerSolid } from './fluid/solid.svelte';

	const { lang }: { lang: Language } = $props();
	const { colorNum } = $derived(languages[lang]);
</script>

<div use:registerSolid={{ id: `${lang}`, color: colorNum, inner: 4 }} class="px-3 pt-1 pb-1.5">
	{lang}
</div>
