<script>
	import { poemStorage, noteStorage, poemNameStorage } from '../stores/poemStore.js';
	import { db } from '../stores/db.js';

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
				poemNameStorage.update(() => "Unnamed");
			} catch (e) {
				console.log(e);
			}
		}
	}
</script>

<div class="w-11/12 mx-auto mt-5 text-center md:text-left">
	<div class="pr-5 md:inline-block">
		<a href="/"><img alt="Poke!Book" src="/logo.png" style="width: 200px" class="mx-auto" /></a>
	</div>
	<ul class="inline-flex items-center mx-auto pt-5 md:pt-0 md:leading-[60px] md:align-bottom">
		<li class="pr-5 underline decoration-dotted hover:no-underline block">
			<a href="/" on:click={() => stashPoem()}>Save and add new	</a>
		</li>
		<li>
			<a href="/stash" class="underline decoration-dotted hover:no-underline block">Poem stash</a>
		</li>
	</ul>
</div>
