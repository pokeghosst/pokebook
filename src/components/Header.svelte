<script>
	import { onMount } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import { useMediaQuery } from 'svelte-breakpoints';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faMoon, faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
	import { pokehelp } from '../stores/pokehelp.js';
	import Burger from './Burger.svelte';

	const isMobile = useMediaQuery('(max-width: 488px)');

	let darkMode = null;
	let dayTheme = null;
	let nightTheme = null;

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

	onMount(async () => {
		const dayThemePref = await Preferences.get({ key: 'day_theme' });
		dayTheme = dayThemePref.value || 'vanilla';
		const nightThemePref = await Preferences.get({ key: 'night_theme' });
		nightTheme = nightThemePref.value || 'chocolate';
		const darkModePref = await Preferences.get({ key: 'dark_mode' });
		darkMode = darkModePref.value || '';
	});

	function toggleDarkMode() {
		darkMode == 'dark' ? (darkMode = '') : (darkMode = 'dark');
		document.documentElement.classList.toggle('dark');
		document.documentElement.classList.toggle(nightTheme);
		document.documentElement.classList.toggle(dayTheme);
	}

	function togglePokeHelp() {
		$pokehelp == 'true' ? pokehelp.update(() => 'false') : pokehelp.update(() => 'true');
	}
</script>

<div class="w-11/12 mx-auto mt-5 text-center md:text-left" id="header-menu">
	{#if $isMobile}
		<Burger />
	{/if}
	<div class="md:pr-5">
		<a href="/"><h1 class="mx-auto text-4xl" id="logo-text">Poke!Book</h1></a>
	</div>
	{#if !$isMobile}
		<ul
			class="inline-flex items-center mx-auto pt-5 pr-5 md:pt-0 md:leading-[60px] md:align-bottom"
		>
			<li class="pr-5">
				<a href="/markov" class="underline decoration-dotted decoration-1 hover:no-underline block"
					>PokeMarkov</a
				>
			</li>
			<li class="pr-5">
				<a href="/stash" class="underline decoration-dotted decoration-1 hover:no-underline block"
					>Poem Stash</a
				>
			</li>
			<li class="pr-5">
				<a
					href="/settings"
					class="underline decoration-dotted decoration-1 hover:no-underline block">Settings</a
				>
			</li>
		</ul>
	{/if}
	<button class="absolute right-14 top-8 p-2" id="pencil" on:click={() => togglePokeHelp()}
		><FontAwesomeIcon icon={faHeartCirclePlus} class="text-2xl" />
	</button>
	<button class="absolute right-6 top-8 p-2" id="moon" on:click={() => toggleDarkMode()}
		><FontAwesomeIcon icon={faMoon} class="text-2xl" /></button
	>
</div>
