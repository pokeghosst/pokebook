import { dev } from '$app/environment';
import i18n, { type Config } from 'sveltekit-i18n';
import lang from './lang.json';

export const defaultLocale = 'en';

const config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	fallbackLocale: 'en',
	translations: {
		en: { lang },
		es: { lang },
		ru: { lang }
	},
	loaders: [
		// en
		{ locale: 'en', key: 'about', loader: async () => (await import('./en/about.json')).default },
		{ locale: 'en', key: 'errors', loader: async () => (await import('./en/errors.json')).default },
		{ locale: 'en', key: 'hotkeys', loader: async () => (await import('./en/hotkeys.json')).default },
		{ locale: 'en', key: 'menu', loader: async () => (await import('./en/menu.json')).default },
		{ locale: 'en',	key: 'settings', loader: async () => (await import('./en/settings.json')).default },
		{ locale: 'en', key: 'themes', loader: async () => (await import('./en/themes.json')).default },
		{ locale: 'en', key: 'toasts', loader: async () => (await import('./en/toasts.json')).default },
		{ locale: 'en', key: 'workspace', loader: async () => (await import('./en/workspace.json')).default },
		// es
		{ locale: 'es', key: 'about', loader: async () => (await import('./es/about.json')).default },
		{ locale: 'es', key: 'errors', loader: async () => (await import('./es/errors.json')).default },
		{ locale: 'es', key: 'hotkeys', loader: async () => (await import('./es/hotkeys.json')).default },
		{ locale: 'es', key: 'menu', loader: async () => (await import('./es/menu.json')).default },
		{ locale: 'es',	key: 'settings', loader: async () => (await import('./es/settings.json')).default },
		{ locale: 'es', key: 'themes', loader: async () => (await import('./es/themes.json')).default },
		{ locale: 'es', key: 'toasts', loader: async () => (await import('./es/toasts.json')).default },
		{ locale: 'es', key: 'workspace', loader: async () => (await import('./es/workspace.json')).default },
		// ru
		{ locale: 'ru', key: 'about', loader: async () => (await import('./ru/about.json')).default },
		{ locale: 'ru', key: 'errors', loader: async () => (await import('./ru/errors.json')).default },
		{ locale: 'ru', key: 'hotkeys', loader: async () => (await import('./ru/hotkeys.json')).default },
		{ locale: 'ru', key: 'menu', loader: async () => (await import('./ru/menu.json')).default },
		{ locale: 'ru',	key: 'settings', loader: async () => (await import('./ru/settings.json')).default },
		{ locale: 'ru', key: 'themes', loader: async () => (await import('./ru/themes.json')).default },
		{ locale: 'ru', key: 'toasts', loader: async () => (await import('./ru/toasts.json')).default }
	]
} satisfies Config;

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
