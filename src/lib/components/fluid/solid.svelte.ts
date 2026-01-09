import { useFluidContext } from '$lib/context/fluid.svelte';
import type { Action } from 'svelte/action';

export const registerSolid: Action<HTMLElement, { id: string; color?: number; inner?: number }> = (
	node,
	params
) => {
	const fluid = useFluidContext();

	const controller = new AbortController();

	const update = ({ id, color, inner }: typeof params) => {
		const rect = node.getBoundingClientRect();
		fluid.registerBound(rect, id, color);
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

	const observer = new ResizeObserver(() => update(params));
	observer.observe(node);
	window.addEventListener('scroll', () => update(params), {
		capture: true,
		passive: true,
		signal: controller.signal
	});
	window.addEventListener('resize', () => update(params), {
		passive: true,
		signal: controller.signal
	});

	return {
		update,
		destroy: () => {
			observer.disconnect();
			fluid.registerBound(null, params.id);
			controller.abort();
		}
	};
};
