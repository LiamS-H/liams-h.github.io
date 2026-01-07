import { useFluidContext } from '@/lib/context/fluid.svelte';
import type { Action } from 'svelte/action';

export const registerSolid: Action<HTMLElement, { id: string; color?: number }> = (
	node,
	{ id, color }
) => {
	const fluid = useFluidContext();

	const getId = () => id;
	const getColor = () => color;

	const { signal, abort } = new AbortController();

	const update = () => {
		const rect = node.getBoundingClientRect();
		fluid.registerBound(rect, getId(), getColor());
	};

	const observer = new ResizeObserver(update);
	observer.observe(node);
	window.addEventListener('scroll', update, { capture: true, passive: true, signal });
	window.addEventListener('resize', update, { passive: true, signal });

	return {
		update,
		destroy: () => {
			observer.disconnect();
			fluid.registerBound(null, getId());
			abort();
		}
	};
};
