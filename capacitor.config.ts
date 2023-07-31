import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.pokeghost.book',
  appName: 'PokeBook',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
