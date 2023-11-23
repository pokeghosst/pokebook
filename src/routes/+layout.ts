import { browser } from '$app/environment';
import { loadTranslations } from '$lib/translations';
import { Preferences } from '@capacitor/preferences';
import '../sass/main.scss';

export const prerender = false;
export const ssr = false;

export const load = async () => {
	const lang = browser ? (await Preferences.get({ key: 'active_language' })).value ?? 'en' : 'en';

	loadTranslations(lang);
};
