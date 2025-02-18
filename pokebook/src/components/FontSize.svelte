<script lang="ts">
	import { writingPadFontSize } from '$lib/stores/writingPadFontSize';

	import Plus from 'lucide-svelte/icons/plus';
	import Minus from 'lucide-svelte/icons/minus';

	function incrementFont() {
		$writingPadFontSize = (parseInt($writingPadFontSize) + 1).toString();
	}

	function decrementFont() {
		$writingPadFontSize = (parseInt($writingPadFontSize) - 1).toString();
	}
</script>

<div class="button-group">
	<button class="button" on:click={decrementFont}><Minus /></button><span class="button"
		>{$writingPadFontSize}px</span
	><button class="button" on:click={incrementFont}><Plus /></button>
</div>
