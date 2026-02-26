import { useFluidContext } from '$lib/context/fluid.svelte';
import { NoGpuStore } from '$lib/context/no-gpu-store';
import { constrainRects as constrainRect } from '$lib/utils/constraint';
import type { Action } from 'svelte/action';

export const registerSolid: Action<
	HTMLElement,
	{ id: string; color?: number; inner?: number; parent?: HTMLElement; radius?: number }
> = (node, params) => {
	let current_params = params;
	const fluid = useFluidContext();
	const controller = new AbortController();
	NoGpuStore.subscribe((noGpu) => {
		if (!noGpu) return;
		node.style.backgroundColor = 'black';
		if (params.radius) {
			node.style.borderRadius = `${params.radius}px`;
		}
		if (params.color) {
			node.style.outline = `${params.inner}px solid var(--color-color-${params.color})`;
			node.style.outlineOffset = `-${params.inner}px`;
		} else {
			node.style.outline = `none`;
		}
	});

	const update = (new_params: typeof params) => {
		const { id, color, inner, parent, radius = 8 } = new_params;

		if (current_params.id !== id) {
			fluid.registerBound(null, current_params.id);
			fluid.registerBound(null, current_params.id + '-inner');
		}

		current_params = new_params;
		const rect = node.getBoundingClientRect();
		const pRect = (parent || node.parentElement)?.getBoundingClientRect();
		if (pRect) constrainRect(rect, pRect);
		fluid.registerBound(rect, id, color, radius);
		if (!inner) return;
		const iRect = {
			x: rect.x + inner,
			y: rect.y + inner,
			height: rect.height - 2 * inner,
			width: rect.width - 2 * inner
		};
		if (pRect) constrainRect(iRect, pRect);
		fluid.registerBound(iRect, id + '-inner', undefined, Math.max(0, radius - inner));
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
