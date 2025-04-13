import { browser } from '$app/environment';
import { loadTranslations } from '$lib/translations';

import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

export const load = async () => {
	if (browser) {
		const { default: appState } = await import('$lib/AppState.svelte');

		if (!appState.value.activeLanguage)
			appState.value = { activeLanguage: navigator.language.split('-')[0] };

		loadTranslations(appState.value.activeLanguage);
	}
};
