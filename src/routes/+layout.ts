import { Preferences } from '$lib/plugins/Preferences';
import { activeLanguage } from '$lib/state.svelte';
import { loadTranslations } from '$lib/translations';
import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

export const load = async () => {
	let currentLanguageValue = activeLanguage.value;

	if (!currentLanguageValue) {
		const localeLanguage = navigator.language.split('-')[0];
		activeLanguage.value = localeLanguage;
		currentLanguageValue = localeLanguage;
	}

	await loadTranslations(currentLanguageValue);
};
