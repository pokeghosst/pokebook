import { Preferences } from '$lib/plugins/Preferences';

import { loadTranslations } from '$lib/translations';

import { activeLanguage } from '$lib/stores/activeLanguage';

import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

export const load = async () => {
	let currentLanguageValue = (await Preferences.get({ key: 'active_language' })).value;

	if (!currentLanguageValue) {
		const localeLanguage = navigator.language.split('-')[0];
		activeLanguage.set(localeLanguage);
		currentLanguageValue = localeLanguage;
	}

	activeLanguage.subscribe((value) => {
		loadTranslations(value);
	});
};
