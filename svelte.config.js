import dotenv from 'dotenv';

dotenv.config();

import adapterStatic from '@sveltejs/adapter-static';
import adapterAuto from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter:
			process.env.ADAPTER === 'static'
				? adapterStatic({
						pages: 'build',
						assets: 'build',
						fallback: null,
						precompress: false,
						strict: false
				  })
				: adapterAuto(),
		alias: { 'lib/': './src/lib/' }
	}
};

export default config;
