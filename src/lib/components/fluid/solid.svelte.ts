import { useFluidContext } from '$lib/context/fluid.svelte';
import { constrainRects as constrainRect } from '$lib/utils/constraint';
import type { Action } from 'svelte/action';

export const registerSolid: Action<
	HTMLElement,
	{ id: string; color?: number; inner?: number; parent?: HTMLElement }
> = (node, params) => {
	const fluid = useFluidContext();
	let current_params = params;

	const controller = new AbortController();

	const update = (new_params: typeof params) => {
		const { id, color, inner, parent } = new_params;
		current_params = new_params;
		const rect = node.getBoundingClientRect();
		const pRect = (parent || node.parentElement)?.getBoundingClientRect();
		if (pRect) constrainRect(rect, pRect);
		fluid.registerBound(rect, id, color);
		if (!inner) return;
		const iRect = {
			x: rect.x + inner,
			y: rect.y + inner,
			height: rect.height - 2 * inner,
			width: rect.width - 2 * inner
		};
		if (pRect) constrainRect(iRect, pRect);
		fluid.registerBound(iRect, id + '-inner');
	};

	const observer = new ResizeObserver(() => update(current_params));
	observer.observe(node);
	window.addEventListener('scroll', () => update(current_params), {
		capture: true,
		passive: true,
		signal: controller.signal
	});
	window.addEventListener('resize', () => update(current_params), {
		passive: true,
		signal: controller.signal
	});

	return {
		update,
		destroy: () => {
			observer.disconnect();
			fluid.registerBound(null, current_params.id);
			fluid.registerBound(null, current_params.id + '-inner');
			controller.abort();
		}
	};
};
