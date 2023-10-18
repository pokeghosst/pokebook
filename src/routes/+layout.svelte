<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import { onMount, setContext } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import { loadTranslations } from '$lib/translations';
	import { activeLang } from '../stores/lang';

	const translationPromise = loadTranslations($activeLang);
	setContext('translationPromise', translationPromise);

	$: {
		const translationPromise = loadTranslations($activeLang);
		setContext('translationPromise', translationPromise);
	}

	onMount(async () => {
		const darkModePref = await Preferences.get({ key: 'dark_mode' });
		const darkMode = darkModePref.value || '';

		if (darkMode != '') {
			const nightThemePref = await Preferences.get({ key: 'night_theme' });
			const nightTheme = nightThemePref.value || 'chocolate';
			document.documentElement.classList.add(darkMode);
			document.documentElement.classList.add(nightTheme);
		} else {
			const dayThemePref = await Preferences.get({ key: 'day_theme' });
			const dayTheme = dayThemePref.value || 'vanilla';
			document.documentElement.classList.add(dayTheme);
		}
	});
</script>

<div class="flex flex-col min-h-screen">
	<main class="flex-1">
		<Header />
		<slot />
	</main>

	<footer class="py-4">
		<Footer />
	</footer>
</div>
