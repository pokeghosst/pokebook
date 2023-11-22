import { loadTranslations } from '$lib/translations';
import '../sass/main.scss';

export const prerender = true;
export const ssr = false;

/** @type { import('@sveltejs/kit').Load } */
export const load = async () => {
	const lang = 'en'

	loadTranslations(lang);

	return { lang };
};
