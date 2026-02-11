import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			glsl({ minify: mode !== 'development' }),
			tailwindcss(),
			enhancedImages(),
			sveltekit(),
			devtoolsJson()
		]
	};
});
