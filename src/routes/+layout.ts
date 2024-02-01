import { browser } from '$app/environment';

import { Preferences } from '@capacitor/preferences';

import { loadTranslations } from '$lib/translations';

import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

export const load = async () => {
	const lang = browser
		? (await Preferences.get({ key: 'active_language' })).value ?? navigator.language.split('-')[0]
		: 'en';

	loadTranslations(lang);
};
