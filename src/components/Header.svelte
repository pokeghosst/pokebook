<script>
	import { getContext } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import { useMediaQuery } from 'svelte-breakpoints';
	import { t } from '$lib/translations';
	import { pokehelp } from '../stores/pokehelp.js';
	import Burger from './Burger.svelte';

	const isMobile = useMediaQuery('(max-width: 640px)');

	let darkMode = null;
	let dayTheme = null;
	let nightTheme = null;

	let translationPromise = getContext('translationPromise');

	$: if (darkMode != null) {
		Preferences.set({
			key: 'dark_mode',
			value: darkMode
		});
	}

	$: if (pokehelp != null) {
		Preferences.set({
			key: 'poke_help',
			value: pokehelp
		});
	}

	async function toggleDarkMode() {
		document.documentElement.className = '';
		await loadThemePref();
		if (darkMode == 'dark') {
			darkMode = '';
			document.documentElement.classList.add(dayTheme);
			StatusBar.setStyle({ style: Style.Light }).catch(() => {});
		} else {
			darkMode = 'dark';
			document.documentElement.classList.add(darkMode);
			document.documentElement.classList.add(nightTheme);
			StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
		}
	}

	function togglePokeHelp() {
		$pokehelp == 'true' ? pokehelp.update(() => 'false') : pokehelp.update(() => 'true');
	}

	async function loadThemePref() {
		const dayThemePref = await Preferences.get({ key: 'day_theme' });
		dayTheme = dayThemePref.value || 'vanilla';
		const nightThemePref = await Preferences.get({ key: 'night_theme' });
		nightTheme = nightThemePref.value || 'chocolate';
		const darkModePref = await Preferences.get({ key: 'dark_mode' });
		darkMode = darkModePref.value || '';
	}
</script>

{#if translationPromise != null}
	<div class="w-11/12 mx-auto mt-5 text-center md:text-left" id="header-menu">
		<div class="flex items-center justify-between mb-6 md:mb-10">
			{#if $isMobile}
				<Burger />
			{/if}
			<a href="/"><h1 class="text-4xl -mr-[28px]" id="logo-text">{$t('menu.logo')}</h1></a>
			{#if !$isMobile}
				<div class="">
					<ul class="flex">
						<li class="pr-5">
							<a
								href="/stash"
								class="underline decoration-dotted decoration-1 hover:no-underline block"
								>{$t('menu.stash')}</a
							>
						</li>
						<li class="pr-5">
							<a
								href="/settings"
								class="underline decoration-dotted decoration-1 hover:no-underline block"
								>{$t('menu.settings')}</a
							>
						</li>
						<li class="pr-5">
							<a
								href="/markov"
								class="underline decoration-dotted decoration-1 hover:no-underline block"
								>{$t('menu.markov')}</a
							>
						</li>
					</ul>
				</div>
			{/if}
			<div class="flex mt-1">
				<button class="mr-3" id="pencil" on:click={() => togglePokeHelp()}>
					<svg
						fill="currentColor"
						width="24px"
						height="24px"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2,23h8a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1H2A1,1,0,0,0,1,2V22A1,1,0,0,0,2,23ZM9,3V21H3V19H6a1,1,0,0,0,0-2H3V15H6a1,1,0,0,0,0-2H3V11H6A1,1,0,0,0,6,9H3V7H6A1,1,0,0,0,6,5H3V3ZM23,17V2a1,1,0,0,0-1-1H16a1,1,0,0,0-1,1V17a1,1,0,0,0,.143.515l3,5a1,1,0,0,0,1.714,0l3-5A1,1,0,0,0,23,17ZM21,3V5H17V3ZM19,20.056l-2-3.333V7h4v9.723Z"
						/>
					</svg>
				</button>
				<button class="" id="moon" on:click={() => toggleDarkMode()}>
					<svg
						fill="currentColor"
						width="24px"
						height="24px"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3,11.985A9.811,9.811,0,0,0,12.569,22a9.528,9.528,0,0,0,8.309-5.059,1,1,0,0,0-.947-1.477l-.11.008c-.131.01-.263.02-.4.02a7.811,7.811,0,0,1-7.569-8.015,8.378,8.378,0,0,1,1.016-4A1,1,0,0,0,11.923,2,9.855,9.855,0,0,0,3,11.985Zm7.343-7.652a10.382,10.382,0,0,0-.488,3.144A9.89,9.89,0,0,0,18.137,17.4,7.4,7.4,0,0,1,12.569,20,7.811,7.811,0,0,1,5,11.985,7.992,7.992,0,0,1,10.343,4.333Z"
						/>
					</svg></button
				>
			</div>
		</div>
	</div>
{/if}
