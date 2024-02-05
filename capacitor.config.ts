import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'org.pokeghost.book',
	appName: 'PokeBook',
	webDir: 'build',
	server: {
		androidScheme: 'https',
		hostname: 'book.pokeghost.org'
	},
	plugins: {
		CapacitorHttp: {
			enabled: true
		}
	}
};

export default config;
