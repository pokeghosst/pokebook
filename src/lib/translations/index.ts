import { dev } from '$app/environment';
import i18n from 'sveltekit-i18n';
import en from './en';
import es from './es';
import ja from './ja';
import lang from './lang';

/** @type {import("sveltekit-i18n").Config} */
const config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	translations: {
		en: { ...en, lang },
		ja: { ...ja, lang },
		es: { ...es, lang }
	}
};

export const { t, loading, loadTranslations } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
