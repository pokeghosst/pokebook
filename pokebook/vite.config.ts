import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
	plugins: [
		sveltekit(),
		babel({
			apply: 'serve',
			babelConfig: {
				babelrc: false,
				configFile: false,
				plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]]
			}
		})
	],
	build: {
		target: 'es2015'
	}
});
