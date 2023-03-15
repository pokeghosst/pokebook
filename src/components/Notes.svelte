<script>
	import { noteStorage } from '../stores/poemStore.js';
</script>

<div class="notebook h-screen">
	<div class="top text-white leading-[50px] pl-5 font-bold dark:bg-[#f7f3ec] dark:text-[#333333]">Notes</div>
	<div class="w-full">
		<textarea bind:value={$noteStorage} class="paper h-screen" />
	</div>
</div>
