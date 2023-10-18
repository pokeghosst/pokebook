<script>
	import { getContext } from 'svelte';
	import { t } from '$lib/translations';
	import { PUBLIC_POKEBOOK_WEB_VERSION } from '$env/static/public';

	let translationPromise = getContext('translationPromise');
</script>

<div class="footer text-center">
	{#if translationPromise != null}
		<p>
			{PUBLIC_POKEBOOK_WEB_VERSION} ·
			<a href="/privacy" class="underline decoration-dotted decoration-1 hover:no-underline"
				>{$t('menu.privacy')}</a
			>
			·
			<a href="/terms" class="underline decoration-dotted decoration-1 hover:no-underline"
				>{$t('menu.tos')}</a
			>
			·
			<a href="/support" class="underline decoration-dotted decoration-1 hover:no-underline"
				>{$t('menu.support')}</a
			>
			·
			<a
				href="https://github.com/pokegh0st/pokebook"
				class="underline decoration-dotted decoration-1 hover:no-underline"
				target="_blank"
				rel="noreferrer">{$t('menu.sourceCode')}</a
			>
		</p>
	{/if}
</div>
