import { dev } from '$app/environment';
import i18n from 'sveltekit-i18n';
import en from './en';
import es from './es';
import ja from './ja';
import lang from './lang';

const config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	fallbackLocale: 'en',
	translations: {
		en: { ...en, lang },
		ja: { ...ja, lang },
		es: { ...es, lang }
	}
};

export const { t, loading, loadTranslations } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
