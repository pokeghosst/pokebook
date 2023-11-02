import { dev } from '$app/environment';
import i18n from 'sveltekit-i18n';
import en from './en';
import es from './es';
import ja from './ja';
import lang from './lang';

export const defaultLocale = 'en';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	translations: {
		en: { ...en, lang },
		ja: { ...ja, lang },
		es: { ...es, lang }
	}
	// loaders: [
	// 	{
	// 		locale: 'en',
	// 		key: 'menu',
	// 		loader: async () => (await import('./en/menu.json')).default
	// 	},
	// 	{
	// 		locale: 'en',
	// 		key: 'workspace',
	// 		loader: async () => (await import('./en/workspace.json')).default
	// 	},
	// 	{
	// 		locale: 'en',
	// 		key: 'popups',
	// 		loader: async () => (await import('./en/popups.json')).default
	// 	},
	// 	{
	// 		locale: 'en',
	// 		key: 'settings',
	// 		loader: async () => (await import('./en/settings.json')).default
	// 	},
	// 	{
	// 		locale: 'en',
	// 		key: 'themes',
	// 		loader: async () => (await import('./en/themes.json')).default
	// 	},
	// 	{
	// 		locale: 'ja',
	// 		key: 'menu',
	// 		loader: async () => (await import('./ja/menu.json')).default
	// 	},
	// 	{
	// 		locale: 'ja',
	// 		key: 'workspace',
	// 		loader: async () => (await import('./ja/workspace.json')).default
	// 	},
	// 	{
	// 		locale: 'ja',
	// 		key: 'popups',
	// 		loader: async () => (await import('./ja/popups.json')).default
	// 	},
	// 	{
	// 		locale: 'ja',
	// 		key: 'settings',
	// 		loader: async () => (await import('./ja/settings.json')).default
	// 	},
	// 	{
	// 		locale: 'ja',
	// 		key: 'themes',
	// 		loader: async () => (await import('./ja/themes.json')).default
	// 	},
	// 	{
	// 		locale: 'es',
	// 		key: 'menu',
	// 		loader: async () => (await import('./es/menu.json')).default
	// 	},
	// 	{
	// 		locale: 'es',
	// 		key: 'workspace',
	// 		loader: async () => (await import('./es/workspace.json')).default
	// 	},
	// 	{
	// 		locale: 'es',
	// 		key: 'popups',
	// 		loader: async () => (await import('./es/popups.json')).default
	// 	},
	// 	{
	// 		locale: 'es',
	// 		key: 'settings',
	// 		loader: async () => (await import('./es/settings.json')).default
	// 	},
	// 	{
	// 		locale: 'es',
	// 		key: 'themes',
	// 		loader: async () => (await import('./es/themes.json')).default
	// 	}
	// ]
};

export const {
	t,
	loading,
	locales,
	locale,
	translations,
	loadTranslations,
	addTranslations,
	setLocale,
	setRoute
} = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
