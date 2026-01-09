import { useFluidContext } from '$lib/context/fluid.svelte';
import type { Action } from 'svelte/action';

export const registerSolid: Action<HTMLElement, { id: string; color?: number; inner?: number }> = (
	node,
	{ id, color, inner }
) => {
	const fluid = useFluidContext();

	const getId = () => id;
	const getColor = () => color;
	const getInner = () => inner;

	const controller = new AbortController();

	const update = () => {
		const rect = node.getBoundingClientRect();
		const id = getId();
		fluid.registerBound(rect, id, getColor());
		const inner = getInner();
		if (!inner) return;
		fluid.registerBound(
			{
				x: rect.x + inner,
				y: rect.y + inner,
				height: rect.height - 2 * inner,
				width: rect.width - 2 * inner
			},
			id + '-inner'
		);
	};

	const observer = new ResizeObserver(update);
	observer.observe(node);
	window.addEventListener('scroll', update, {
		capture: true,
		passive: true,
		signal: controller.signal
	});
	window.addEventListener('resize', update, { passive: true, signal: controller.signal });

	return {
		update,
		destroy: () => {
			observer.disconnect();
			fluid.registerBound(null, getId());
			controller.abort();
		}
	};
};
