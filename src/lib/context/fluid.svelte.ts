import { setContext, getContext } from 'svelte';
import type { Simulator } from '@/lib/components/fluid/sim';

class FluidState {
	text = $state('');
	color = $state(0);

	constructor(private sim: () => Simulator) {}

	registerText = (new_text: string) => {
		this.sim().updateText(new_text);
	};

	changeColor = (new_color: number) => {
		this.sim().changeColor(new_color);
	};

	registerBound = (bounds: DOMRect | null, id: string, color?: number) => {
		const rect = bounds
			? {
					x: bounds.x,
					y: bounds.y,
					w: bounds.width,
					h: bounds.height,
					color
				}
			: null;
		console.log(rect);
		this.sim().registerRectangle(rect, id);
	};
}

const CONTEXT_KEY = Symbol('fluid-context');

export function setFluidContext(sim: () => Simulator) {
	const state = new FluidState(sim);
	return setContext(CONTEXT_KEY, state);
}

export function useFluidContext() {
	const context = getContext<FluidState>(CONTEXT_KEY);
	if (!context) throw new Error('useFluidContext must be used within a provider');
	return context;
}
