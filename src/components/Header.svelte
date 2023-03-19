<script>
	import { poemStorage, noteStorage, poemNameStorage } from '../stores/poemStore.js';
	import { db } from '../stores/db.js';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faMoon } from '@fortawesome/free-solid-svg-icons';
	import { darkMode } from '../stores/mode.js';
	

	async function stashPoem() {
		if ($poemStorage != '' || $noteStorage != '' || $poemNameStorage != '') {
			try {
				await db.poems.add({
					note: $noteStorage,
					poem: $poemStorage,
					name: $poemNameStorage,
					timestamp: Date.now()
				});
				noteStorage.update(() => '');
				poemStorage.update(() => '');
				poemNameStorage.update(() => 'Unnamed');
			} catch (e) {
				console.log(e);
			}
		location.reload();
		}
	}

	function toggleDarkMode() {
		$darkMode == 'dark' ? darkMode.update(() => '') : darkMode.update(() => 'dark');
		document.documentElement.classList.toggle('dark');
	}
</script>

<div class="w-11/12 mx-auto mt-5 text-center md:text-left dark:text-stone-100">
	<div class="md:pr-5 md:inline-block">
		<a href="/"><img alt="Poke!Book" src="/logo.png" class="mx-auto w-[200px] opacity-80" /></a>
	</div>
	<ul class="inline-flex items-center mx-auto pt-5 pr-5 md:pt-0 md:leading-[60px] md:align-bottom">
		<li class="pr-5 underline decoration-dotted hover:no-underline block">
			<a href="/" on:click={() => stashPoem()}>Save and add new</a>
		</li>
		<li>
			<a href="/stash" class="underline decoration-dotted hover:no-underline block">Poem stash</a>
		</li>
	</ul>

	<button class="absolute right-6 top-6 p-2" on:click={() => toggleDarkMode()}
		><FontAwesomeIcon icon={faMoon} class="text-[#333333] text-2xl dark:text-stone-100" /></button
	>
</div>
