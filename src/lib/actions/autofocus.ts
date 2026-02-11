import type { Action } from 'svelte/action';

export const autoFocus: Action<HTMLButtonElement> = (node) => {
	const previouslyFocused = document.activeElement;

	const target = (node.querySelector('[autofocus]') as HTMLElement) || node;

	target.focus();

	return {
		destroy() {
			(previouslyFocused as HTMLElement)?.focus();
		}
	};
};
