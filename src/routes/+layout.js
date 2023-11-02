import { loadTranslations } from '$lib/translations';

export const prerender = true;
export const ssr = true;

/** @type { import('@sveltejs/kit').Load } */
export const load = async ({ url }) => {

	const lang = 'en';

  loadTranslations(lang)

	return { lang };
};
