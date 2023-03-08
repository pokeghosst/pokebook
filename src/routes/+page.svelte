<script>
	import { count, countFromFile, info } from 'letter-count';
	import { poemStorage, noteStorage, poemNameStorage } from '../stores/poemStore.js';
	
</script>

<div class="notebook-container w-11/12 h-screen md:columns-2 mx-auto mt-5">
	<div class="notebook h-full">
		<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
		<div class="w-full h-5/6">
			<textarea bind:value={$noteStorage} class="paper h-full" />
		</div>
	</div>
	<div class="notebook h-full">
		<div class="top text-white leading-[50px] pl-5 font-bold overflow-scroll" contenteditable="true" bind:textContent={$poemNameStorage}></div>
		<div class="w-full h-5/6">
			<textarea bind:value={$poemStorage} class="paper h-full" />
		</div>
	</div>
</div>
