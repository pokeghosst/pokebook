<script>
	import { poemStorage, poemNameStorage } from '../stores/poemStore.js';
</script>

<div class="notebook h-screen">
	<div
		class="top text-white leading-[50px] pl-5 font-bold overflow-hidden dark:bg-stone-900 dark:text-stone-100"
		contenteditable="true"
		bind:textContent={$poemNameStorage}
	/>
	<div class="w-full">
		<textarea bind:value={$poemStorage} class="paper h-screen" />
	</div>
</div>
