import { useFluidContext } from '@/lib/context/fluid.svelte';
import type { Action } from 'svelte/action';

export const registerSolid: Action<HTMLElement, { id: string }> = (node, { id }) => {
	const fluid = useFluidContext();

	const observer = new ResizeObserver(() => {
		console.log('test');
		const rect = node.getBoundingClientRect();
		fluid.registerBound(rect, id);
	});

	observer.observe(node);

	return {
		destroy: () => {
			observer.disconnect();
		}
	};
};
