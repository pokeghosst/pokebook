<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentPoemUri } from '$lib/stores/currentPoem';
	import { t } from '$lib/translations';
	import type { PoemMeta } from '$lib/schema/manifest.schema';
	import { listPoems } from '$lib/services/poem.service';
	import { onMount } from 'svelte';

	const FALLBACK_DELAY_MS = 100;

	let cachedPoems: Promise<PoemMeta[]> = $state();
	let showFallback = $state(false);
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY_MS);

		cachedPoems = listPoems();

		return () => clearTimeout(fallbackTimeout);
	});

	async function goToPoem(poemUri: string) {
		$currentPoemUri = poemUri;
		await goto('/stash/poem');
	}
</script>

{#await cachedPoems}
	{#if showFallback}
		<div class="placeholder-text-wrapper">
			<p>Loading...</p>
		</div>
	{/if}
{:then cacheRecords}
	{#if cacheRecords && cacheRecords.length > 0}
		<div class="poem-list">
			{#each cacheRecords as record}
				<div class="list-item">
					<button onclick={() => goToPoem(record.id)}>
						<div class="list-poem">
							<p class="list-poem-name">
								{record.name}{record.unsavedChanges ? ` (${$t('workspace.unsaved')})` : ''}
							</p>
							<p class="list-poem-snippet">{record.poemSnippet}</p>
						</div>
						<div>{new Intl.DateTimeFormat('en-US').format(new Date(record.timestamp))}</div>
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<div class="placeholder-text-wrapper">
			{$t('workspace.emptyPoemList')}
		</div>
	{/if}
{:catch error}
	<div class="placeholder-text-wrapper">
		{$t(error.message)}
	</div>
{/await}
