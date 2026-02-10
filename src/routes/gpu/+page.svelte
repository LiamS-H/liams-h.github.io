<script lang="ts">
	import { registerSolid } from '$lib/components/fluid/solid.svelte';
	import { NoGpuStore } from '$lib/context/nogpu-store';

	let GPU = $state(false);

	NoGpuStore.subscribe((noGPU) => {
		if (!noGPU) {
			GPU = true;
		}
	});
</script>

<svelte:head>
	{#if GPU}
		<title>HasGPU - LiamS-H</title>
	{:else}
		<title>NoGPU - LiamS-H</title>
	{/if}
</svelte:head>

<div class="flex w-full h-full justify-center items-center pb-28 md:pb-18 lg:pb-22 text-white">
	{#if GPU}
		<div class="p-4 flex flex-col items-center" use:registerSolid={{ id: 'yes-gpu' }}>
			<h1 class="text-2xl font-bold">Graphics Card Detected</h1>
			<a
				href="/"
				class="text-xl bg-size-[200%_200%] bg-left transition-all duration-300 hover:bg-right bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-purple-600"
				>Go Home</a
			>
		</div>
	{:else}
		<div class="w-sm md:w-lg p-2 md:p-4 bg-black">
			<h1 class="text-3xl md:text-4xl pt-2 font-bold">TLDR - Open In Chrome</h1>
			<h1 class="text-2xl pt-2 font-bold">No Graphics Card Detected</h1>
			<p>
				This Website creates a fluid simulation using WebGPU. What you are seeing right now is a <strong
					>fallback that doesn't compare</strong
				> to the full site.
			</p>
			<h1 class="text-2xl pt-2 font-bold">Troubleshooting</h1>
			<ol class="list-decimal pl-8">
				<li>
					<strong>You don't have a graphics card </strong>
					<p>
						Then this message is expected, but I highly recommend opening on a device that does!
					</p>
				</li>
				<li>
					<strong>Your browser doesn't have WebGPU</strong>
					<p>
						Most major browser versions support WebGPU, but some don't have it enabled by default.
					</p>
					<ul class="list-disc -pl-8">
						<li>Chrome - May 2023: default on all platforms</li>
						<li>
							Safari - Sep 2025: default on macOS 26 Tahoe<br />
							<span class="italic text-white/60"
								>on mobile Settings &gt Apps &gt Safari &gt Advanced &gt Feature Flags;
								<br />
								on mac Settings &gt Advanced &gt Show features for web developers; Settings &gt Feature
								Flags &gt WebGPU;
							</span>
						</li>
						<li>
							Firefox - Nov 2025: default on Mac, Windows <br />
							<span class="italic text-white/60"
								>on mobile go to about:config; dom.webgpu.enabled=true;
							</span>
						</li>
					</ul>
				</li>
			</ol>
		</div>
	{/if}
</div>
