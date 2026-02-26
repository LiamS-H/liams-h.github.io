import { tick } from 'svelte';

export function blurMirror(node: HTMLElement) {
	const main = node.closest('main') ?? document.querySelector('main');
	if (!main) throw new Error('blurMirror: no <main> found');

	const mirror = document.createElement('div');
	mirror.className =
		'fixed pointer-events-none rounded-full z-0 will-change-transform top-0 left-0 overflow-hidden';

	const glass = document.createElement('div');
	glass.className =
		'absolute -inset-4 backdrop-blur-3xl [mask-image:radial-gradient(closest-side,transparent_40%,black_75%)]';
	// 'absolute -inset-4 mask-image:radial-gradient(closest-side,transparent_40%,black_100%)';

	mirror.appendChild(glass);
	main.prepend(mirror);

	let rafId: number;
	let lastX = -1;
	let lastY = -1;
	let lastW = -1;
	let lastH = -1;

	function sync() {
		const r = node.getBoundingClientRect();
		if (r.width !== lastW || r.height !== lastH) {
			lastW = r.width;
			lastH = r.height;
			mirror.style.width = `${r.width}px`;
			mirror.style.height = `${r.height}px`;
		}
		if (r.left !== lastX || r.top !== lastY) {
			lastX = r.left;
			lastY = r.top;
			mirror.style.transform = `translate(${r.left}px, ${r.top}px)`;
		}
	}

	function update() {
		sync();
		rafId = requestAnimationFrame(update);
	}

	tick().then(sync);
	rafId = requestAnimationFrame(update);

	return {
		destroy() {
			cancelAnimationFrame(rafId);
			mirror.remove();
		}
	};
}

export function blurMirrorStatic(node: HTMLElement) {
	const main = node.closest('main') ?? document.querySelector('main');
	if (!main) throw new Error('blurMirror: no <main> found');

	const mirror = document.createElement('div');
	mirror.className =
		'fixed pointer-events-none rounded-full z-0 will-change-transform top-0 left-0 overflow-hidden';

	const glass = document.createElement('div');
	glass.className =
		'absolute -inset-4 backdrop-blur-3xl [mask-image:radial-gradient(closest-side,transparent_40%,black_75%)]';
	// 'absolute -inset-4 mask-image:radial-gradient(closest-side,transparent_40%,black_100%)';

	mirror.appendChild(glass);
	main.prepend(mirror);

	let lastX = -1;
	let lastY = -1;
	let lastW = -1;
	let lastH = -1;

	function sync() {
		const r = node.getBoundingClientRect();
		if (r.width !== lastW || r.height !== lastH) {
			lastW = r.width;
			lastH = r.height;
			mirror.style.width = `${r.width}px`;
			mirror.style.height = `${r.height}px`;
		}
		if (r.left !== lastX || r.top !== lastY) {
			lastX = r.left;
			lastY = r.top;
			mirror.style.transform = `translate(${r.left}px, ${r.top}px)`;
		}
	}

	tick().then(sync);

	return {
		destroy() {
			mirror.remove();
		}
	};
}
