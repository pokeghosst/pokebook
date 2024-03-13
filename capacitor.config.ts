import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'org.pokeghost.book3',
	appName: 'PokeBook',
	webDir: 'build',
	server: {
		androidScheme: 'https',
		hostname: 'book3.pokeghost.org'
	},
	plugins: {
		CapacitorHttp: {
			enabled: true
		}
	}
};

export default config;
