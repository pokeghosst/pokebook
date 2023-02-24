<script>
	import { count, countFromFile, info } from 'letter-count';
	import { poemStorage, noteStorage } from '../stores/poemStore.js';
	import { onMount } from 'svelte';

</script>

<div class="w-11/12 h-screen columns-2 mx-auto mt-5">
	<div class="top" />
	<div class="w-full h-5/6">
		<textarea bind:value={$noteStorage} class="paper h-full" />
	</div>
	<div class="top" />
	<div class="w-full h-5/6">
		<textarea bind:value={$poemStorage} class="paper h-full" />
	</div>
</div>
