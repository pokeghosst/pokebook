import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			devOptions: {
				enabled: true
			},
			manifest: {
				name: 'Poke!Book',
				short_name: 'Poke!Book',
				description: 'The ultimate digital notebook for writing poetry.',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#bbad5d',
				scope: '/',
				icons: [
					{
						src: '/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						purpose: 'maskable',
						sizes: '192x192',
						src: 'maskable_icon_x192.png',
						type: 'image/png'
					},
					{
						purpose: 'maskable',
						sizes: '512x512',
						src: 'maskable_icon_x512.png',
						type: 'image/png'
					}
				]
			},
			manifestFilename: 'manifest.json'
		}),
		devtoolsJson()
	],
	server: {
		watch: {
			ignored: ['**/src-tauri/**']
		}
	}
});
