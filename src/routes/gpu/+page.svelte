<script lang="ts">
	import { registerSolid } from '$lib/actions/solid.svelte';
	import InternalLink from '$lib/components/internal-link.svelte';
	import { NoGpuStore } from '$lib/context/no-gpu-store';

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

<div class="flex h-full w-full items-center justify-center pb-28 text-white md:pb-18 lg:pb-22">
	{#if GPU}
		<div class="flex flex-col items-center p-4" use:registerSolid={{ id: 'yes-gpu' }}>
			<h1 class="text-2xl font-bold">Graphics Card Detected</h1>
			<InternalLink href="/">Go Home</InternalLink>
		</div>
	{:else}
		<div class="w-sm bg-black p-2 md:w-lg md:p-4">
			<h1 class="pt-2 text-3xl font-bold md:text-4xl">TLDR - Open In Chrome</h1>
			<h1 class="pt-2 text-2xl font-bold">No Graphics Card Detected</h1>
			<p>
				This Website creates a fluid simulation using WebGPU. What you are seeing right now is a <strong
					>fallback that doesn't compare</strong
				> to the full site.
			</p>
			<h1 class="pt-2 text-2xl font-bold">Troubleshooting</h1>
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
					<ul class="-pl-8 list-disc">
						<li>Chrome - May 2023: default on all platforms</li>
						<li>
							Safari - Sep 2025: default on macOS 26 Tahoe<br />
							<span class="text-white/60 italic"
								>on mobile Settings &gt Apps &gt Safari &gt Advanced &gt Feature Flags;
								<br />
								on mac Settings &gt Advanced &gt Show features for web developers; Settings &gt Feature
								Flags &gt WebGPU;
							</span>
						</li>
						<li>
							Firefox - Nov 2025: default on Mac, Windows <br />
							<span class="text-white/60 italic"
								>on mobile go to about:config; dom.webgpu.enabled=true;
							</span>
						</li>
					</ul>
				</li>
			</ol>
		</div>
	{/if}
</div>
