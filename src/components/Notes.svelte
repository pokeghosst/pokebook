<script>
	import { noteStorage } from '../stores/poemStore.js';
</script>

<div class="notebook h-full">
	<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
	<div class="w-full h-5/6">
		<textarea bind:value={$noteStorage} class="paper h-full" />
	</div>
</div>
