import dotenv from 'dotenv';

dotenv.config();

import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';
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
				: adapterNode(),
		alias: { 'lib/': './src/lib/' }
	}
};

export default config;
