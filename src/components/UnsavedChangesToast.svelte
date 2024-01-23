<script lang="ts">
	import toast_ from 'svelte-french-toast';
	import type { Toast } from 'svelte-french-toast';

	import { t } from '$lib/translations';

	import { discardFunction, saveFunction } from '$lib/stores/poemFunctionsStore';

	export let toast: Toast;

	// let dismissAction: () => void;
</script>

<div class="toast-contents">
	<p>You may have unsaved changes here. Save or discard them before proceeding.</p>
	<button
		on:click={() => {
			toast_.dismiss(toast.id);
			$saveFunction();
		}}
		class="action-button action-button--primary">{$t('toasts.buttons.saveChanges')}</button
	>
	<button
		on:click={() => {
			toast_.dismiss(toast.id);
			$discardFunction();
		}}
		class="action-button action-button--secondary">{$t('toasts.buttons.discardChanges')}</button
	>
</div>

