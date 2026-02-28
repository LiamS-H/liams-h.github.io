import type { Handle } from '@sveltejs/kit';
import css from './app.css?inline';
import { MEGRIM_BASE64 } from './lib/assets/Megrim/inlined';

export const handle: Handle = async ({ event, resolve }) => {
	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			const fontFace = `
@font-face {
    font-family: 'Megrim';
    src: url('${MEGRIM_BASE64}') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}`;
			const styleTag = `<style>${css}\n${fontFace}</style>`;
			const inlined = html.replace('<head>', `<head>${styleTag}`);

			return inlined;
		}
	});
};
