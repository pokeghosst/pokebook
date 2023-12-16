<script lang="ts">
	import toast_ from 'svelte-french-toast';
	import type { Toast } from 'svelte-french-toast';

	import { discardFunction, saveFunction } from '$lib/stores/poemFunctionsStore';

	export let toast: Toast;

	// let dismissAction: () => void;
</script>

<div>
	<p>You may have unsaved changes here. Save or discard them before proceeding.</p>
	<button
		on:click={() => {
			toast_.dismiss(toast.id);
			$saveFunction();
		}}
		class="action-button action-button--primary">Save them!</button
	>
	<button
		on:click={() => {
			toast_.dismiss(toast.id);
			$discardFunction();
		}}
		class="action-button action-button--secondary">Discard, I don't care!</button
	>
</div>

<style>
	div p {
		margin-bottom: 1rem;
		text-align: center;
	}
</style>
