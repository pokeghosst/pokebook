import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapterStatic({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: true
		}),
		alias: { 'lib/': './src/lib/' }
	}
};

export default config;
