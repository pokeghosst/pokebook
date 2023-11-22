import { loadTranslations } from '$lib/translations';
import { Preferences } from '@capacitor/preferences';
import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

/** @type { import('@sveltejs/kit').Load } */
export const load = async () => {
	const lang = (await Preferences.get({ key: 'active_language' })).value || 'en';

	loadTranslations(lang);

	return { lang };
};
