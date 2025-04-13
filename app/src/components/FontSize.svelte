<script lang="ts">
	import appState from '$lib/AppState.svelte';

	import Minus from 'lucide-svelte/icons/minus';
	import Plus from 'lucide-svelte/icons/plus';

	function incrementFont() {
		appState.value = { writingPadFontSize: appState.value.writingPadFontSize + 1 };
	}

	function decrementFont() {
		appState.value = { writingPadFontSize: appState.value.writingPadFontSize - 1 };
	}
</script>

<div class="button-group">
	<button class="button" on:click={decrementFont}><Minus /></button><span class="button"
		>{appState.value.writingPadFontSize}px</span
	><button class="button" on:click={incrementFont}><Plus /></button>
</div>
