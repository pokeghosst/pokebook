<script>
	import { getContext } from 'svelte';
	import { t } from '$lib/translations';

	let translationPromise = getContext('translationPromise');
</script>

{#if translationPromise != null}
	<div
		class="fixed flex items-center justify-center top-0 left-0 right-0 bottom-0 z-50 bg-stone-700 bg-opacity-50"
	>
		<h1 class="text-white text-xl text-center">{$t('popups.thingsAreHappening')}</h1>
	</div>
{/if}
