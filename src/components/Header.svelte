<script>
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faMoon, faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
	import { darkMode, dayTheme, nightTheme } from '../stores/mode.js';
	import { pokehelp } from '../stores/pokehelp.js';

	function toggleDarkMode() {
		$darkMode == 'dark' ? darkMode.update(() => '') : darkMode.update(() => 'dark');
		document.documentElement.classList.toggle('dark');
		document.documentElement.classList.toggle($nightTheme);
		document.documentElement.classList.toggle($dayTheme);
	}

	function togglePokeHelp() {
		$pokehelp == 'true' ? pokehelp.update(() => 'false') : pokehelp.update(() => 'true');
	}
</script>

<div class="w-11/12 mx-auto mt-5 text-center md:text-left" id="header-menu">
	<div class="md:pr-5 md:inline-block">
		<a href="/"><img alt="Poke!Book" id="logo" src="/logo.png" class="mx-auto w-[200px] opacity-80" /></a>
	</div>
	<ul class="inline-flex items-center mx-auto pt-5 pr-5 md:pt-0 md:leading-[60px] md:align-bottom">
		<li class="pr-5">
			<a href="/markov" class="underline decoration-dotted hover:no-underline block">PokeMarkov</a>
		</li>
		<li class="pr-5">
			<a href="/stash" class="underline decoration-dotted hover:no-underline block">Poem Stash</a>
		</li>
		<li class="pr-5">
			<a href="/settings" class="underline decoration-dotted hover:no-underline block">Settings</a>
		</li>
		<li>
			<a href="https://www.buymeacoffee.com/pokegh0st" target="_blank" rel="noreferrer" class="block"
				><span class="underline decoration-dotted hover:no-underline">Donate</span>
				<span class="text-xs align-sub">(pwease?)</span></a
			>
		</li>
	</ul>
	<button class="absolute right-14 top-6 p-2" id="pencil" on:click={() => togglePokeHelp()}
		><FontAwesomeIcon icon={faHeartCirclePlus} class="text-2xl" />
	</button>
	<button class="absolute right-6 top-6 p-2" id="moon" on:click={() => toggleDarkMode()}
		><FontAwesomeIcon icon={faMoon} class="text-2xl" /></button
	>
</div>
