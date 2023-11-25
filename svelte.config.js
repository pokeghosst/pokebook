import dotenv from 'dotenv';

dotenv.config();

import adapterStatic from '@sveltejs/adapter-static';
import adapteVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

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
				: adapteVercel(),
		alias: { 'lib/': './src/lib/' }
	}
};

export default config;
