<script>
	import { onMount, afterUpdate } from 'svelte';
	import { poemStorage, noteStorage } from '../stores/poemStore.js';
	import { db } from '../stores/db.js';

	async function stashPoem() {
		console.log('Stashing poem');
		try {
			await db.poems.add({
				note: $noteStorage,
				poem: $poemStorage,
				timestamp: Date.now()
			});
			noteStorage.update(() => '');
			poemStorage.update(() => '');
		} catch (e) {
			console.log(e);
		}
	}
</script>

<div class="w-11/12 mx-auto mt-5">
	<ul class="inline-flex items-center">
		<li class="pr-5">
			<a href="/"><img alt="Poke!Book" src="/logo.png" style="width: 200px" /></a>
		</li>
		<li class="pr-5 underline decoration-dotted hover:no-underline block"><a href="/" on:click={() => stashPoem()}>New poem</a></li>
		<li><a href="/stash" class="underline decoration-dotted hover:no-underline block">Poem stash</a></li>
	</ul>
</div>
