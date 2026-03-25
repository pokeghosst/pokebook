import { Preferences } from '$lib/plugins/Preferences';
import { activeLanguage } from '$lib/stores/activeLanguage';
import { loadTranslations } from '$lib/translations';
import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

// TODO: Refactor this when new store is done
export const load = async () => {
	let currentLanguageValue = (await Preferences.get({ key: 'active_language' })).value;

	if (!currentLanguageValue) {
		const localeLanguage = navigator.language.split('-')[0];
		activeLanguage.set(localeLanguage);
		currentLanguageValue = localeLanguage;
	}

	await loadTranslations(currentLanguageValue);

	activeLanguage.subscribe(async (value) => {
		await loadTranslations(value);
	});
};
