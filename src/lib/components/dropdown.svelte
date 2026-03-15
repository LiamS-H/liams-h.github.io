<script lang="ts">
	import { blurMirror } from '$lib/actions/blurMirror';

	let {
		value = $bindable(),
		options
	}: {
		value: string;
		options: readonly string[];
	} = $props();

	let open = $state(false);

	function select(option: string) {
		value = option;
		open = false;
	}

	// Close on click outside
	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				open = false;
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class="relative min-w-36" use:clickOutside>
	<button
		class="flex w-full cursor-pointer items-center justify-between gap-4 px-3 py-1.5 text-white"
		onclick={() => (open = !open)}
		use:blurMirror
	>
		<span class="font-medium">{value}</span>
		<span class="text-[10px]">▼</span>
	</button>

	{#if open}
		<div
			class="absolute top-full left-0 z-50 mt-2 flex w-full flex-col overflow-hidden rounded-md bg-black/90 backdrop-blur-xl"
		>
			{#each options as option (option)}
				<button
					class="px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
					onclick={() => select(option)}
				>
					{option}
				</button>
			{/each}
		</div>
	{/if}
</div>
