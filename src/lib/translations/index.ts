import { dev } from '$app/environment';
import i18n from 'sveltekit-i18n';
import en from './en';
import es from './es';
import ru from './ru'
import lang from './lang';

const config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	fallbackLocale: 'en',
	translations: {
		en: { ...en, lang },
		ru: { ...ru, lang },
		es: { ...es, lang }
	}
};

export const { t, loading, loadTranslations } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
