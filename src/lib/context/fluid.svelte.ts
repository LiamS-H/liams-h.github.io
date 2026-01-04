import { setContext, getContext } from 'svelte';
import type { FluidRect, FluidRectObj, FluidRects } from '@/lib/components/fluid/sim';
import type { Simulator } from '@/lib/components/fluid/sim';

class FluidState {
	text = $state('');
	color = $state(0);
	rectMap = new Map<string, FluidRectObj>(); // Map is fine here if it doesn't need to be reactive

	constructor(private sim: () => Simulator) {}

	registerBound = (bounds: DOMRect | null, id: string) => {
		if (!bounds) {
			this.rectMap.delete(id);
			return;
		}
		const vh = window.visualViewport?.height || window.innerHeight;
		const vw = window.visualViewport?.width || window.innerWidth;

		this.rectMap.set(id, {
			x: bounds.x / vw,
			y: (vh - bounds.height - bounds.y) / vh,
			w: bounds.width / vw,
			h: bounds.height / vh
		});
	};

	registerText = (new_text: string) => {
		this.sim().updateText(new_text);
	};

	changeColor = (new_color: number) => {
		if (new_color === this.color) return;
		this.color = new_color;
		this.sim().changeColor(new_color);
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
