<script>
	import { poemStorage, poemNameStorage } from '../stores/poemStore.js';
</script>

<div class="notebook h-full">
	<div
		class="top text-white leading-[50px] pl-5 font-bold overflow-hidden"
		contenteditable="true"
		bind:textContent={$poemNameStorage}
	/>
	<div class="w-full h-5/6">
		<textarea bind:value={$poemStorage} class="paper h-full" />
	</div>
</div>
