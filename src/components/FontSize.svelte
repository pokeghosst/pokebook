<script lang="ts">
	import { fontSize } from '$lib/state.svelte';
	import Minus from 'lucide-svelte/icons/minus';
	import Plus from 'lucide-svelte/icons/plus';

	function incrementFont() {
		fontSize.value++;
	}

	function decrementFont() {
		fontSize.value--;
	}
</script>

<div class="button-group">
	<button class="button" onclick={decrementFont}><Minus /></button><span class="button"
		>{fontSize.value}px</span
	><button class="button" onclick={incrementFont}><Plus /></button>
</div>
