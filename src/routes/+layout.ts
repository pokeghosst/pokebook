import { browser } from '$app/environment';

import { Preferences } from '@capacitor/preferences';

import { loadTranslations } from '$lib/translations';

import { activeLanguage } from '$lib/stores/activeLanguage';

import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

export const load = async () => {
	let currentLanguageValue = (await Preferences.get({ key: 'active_language' })).value;

	console.log(currentLanguageValue);

	if (!currentLanguageValue) {
		const localeLanguage = navigator.language.split('-')[0];
		console.log(navigator.language);
		activeLanguage.set(localeLanguage);
		currentLanguageValue = localeLanguage;
	}

	activeLanguage.subscribe((value) => {
		loadTranslations(value);
	});
};
