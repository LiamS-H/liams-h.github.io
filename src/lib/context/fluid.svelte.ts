import { setContext, getContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export interface FluidRectObj {
	x: number;
	y: number;
	w: number;
	h: number;
	radius?: number;
	color?: number;
}

export type FluidRects = Map<string, FluidRectObj | null>;

export class FluidState {
	text = $state('');
	smokeColor = $state(0);
	rectMap = $state<FluidRects>(new SvelteMap());

	registerText(new_text: string) {
		this.text = new_text;
	}

	changeColor(new_color: number) {
		this.smokeColor = new_color;
	}

	registerBound<T extends { x: number; y: number; width: number; height: number }>(
		bounds: T | null,
		id: string,
		color?: number,
		borderRadius?: number
	) {
		if (!bounds) {
			this.rectMap.delete(id);
			return;
		}
		const rect = {
			x: bounds.x,
			y: bounds.y,
			w: bounds.width,
			h: bounds.height,
			color,
			radius: borderRadius
		};
		this.rectMap.set(id, rect);
	}
}

const CONTEXT_KEY = Symbol('fluid-context');

export function setFluidContext() {
	const state = new FluidState();
	return setContext(CONTEXT_KEY, state);
}

export function useFluidContext() {
	const context = getContext<FluidState>(CONTEXT_KEY);
	if (!context) throw new Error('useFluidContext must be used within a provider');
	return context;
}
