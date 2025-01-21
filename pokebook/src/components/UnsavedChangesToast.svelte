<script lang="ts">
	import toast_ from 'svelte-french-toast';
	import type { Toast } from 'svelte-french-toast';

	import { t } from '$lib/translations';

	import { discardFunction, saveFunction } from '$lib/stores/poemFunctionsStore';

	interface Props {
		toast: Toast; // let dismissAction: () => void;
	}

	let { toast }: Props = $props();

	
</script>

<div class="toast-contents">
	<p>{$t('toasts.unsavedChanges')}</p>
	<button
		onclick={() => {
			toast_.dismiss(toast.id);
			$saveFunction();
		}}
		class="action-button action-button--primary">{$t('toasts.buttons.saveChanges')}</button
	>
	<button
		onclick={() => {
			toast_.dismiss(toast.id);
			$discardFunction();
		}}
		class="action-button action-button--secondary">{$t('toasts.buttons.discardChanges')}</button
	>
</div>

