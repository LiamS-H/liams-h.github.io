<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, linear,  } from 'svelte/easing';

	const visits = new Tween(0, {
		duration: 10000,
		easing: linear
	});

	const uniqueVisits = new Tween(0, {
		duration: 10000, 
		easing: linear
	});

	onMount(async () => {
		visits.set(10);
		uniqueVisits.set(10);

		const [visitsRes, uniqueVisitsRes] = await Promise.all([
			fetch('https://abacus.jasoncameron.dev/get/liams-h.github.io/visits'),
			fetch('https://abacus.jasoncameron.dev/get/liams-h.github.io/unique-visits')
		]);

		const visitsData = await visitsRes.json();
		const uniqueVisitsData = await uniqueVisitsRes.json();

		await Promise.all([
			visits.set(visitsData.value, { duration: 1000, easing: cubicOut }), 
			uniqueVisits.set(uniqueVisitsData.value, { duration: 1000, easing: cubicOut })
		]);
	});
</script>

<div class="flex h-full flex-col items-center justify-center gap-8 text-neutral-100">
	<h1 class="text-4xl font-light tracking-widest uppercase opacity-80">Analytics</h1>

	<div class="grid grid-cols-2 gap-12 text-center">
		<div class="flex flex-col gap-2">
			<span class="text-6xl font-thin tabular-nums">{Math.round(visits.current)}</span>
			<span class="text-sm tracking-widest uppercase opacity-60">Total Views</span>
		</div>
		
		<div class="flex flex-col gap-2">
			<span class="text-6xl font-thin tabular-nums">{Math.round(uniqueVisits.current*10)/10}</span>
			<span class="text-sm tracking-widest uppercase opacity-60">Unique Visitors</span>
		</div>
	</div>
</div>
