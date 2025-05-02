<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2025 Pokeghost.

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
	import { onMount } from 'svelte';

	import { listPoems } from '$lib/services/poems.service';
	import { t } from '$lib/translations';
	import { sync } from '$lib/services/cloud-sync.service';

	import { RefreshCcw } from 'lucide-svelte';

	import type { PoemListItem } from '@pokebook/shared';

	const FALLBACK_DELAY_MS = 150;

	let poemListPromise: Promise<(PoemListItem & { unsavedChanges: boolean })[]>;
	let showFallback = false;
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY_MS);

		poemListPromise = listPoems();

		return () => clearTimeout(fallbackTimeout);
	});
</script>

<div class="refresh-wrapper">
	<button class="button" on:click={sync}>Sync <RefreshCcw /></button>
</div>

{#await poemListPromise}
	{#if showFallback}
		<div class="placeholder-text-wrapper">
			<p>Loading...</p>
		</div>
	{/if}
{:then poems}
	{#if poems && poems.length > 0}
		<div class="poem-list">
			{#each poems.sort((a, b) => b.updatedAt - a.updatedAt) as poem (poem.id)}
				<div class="list-item">
					<a href="/poems/{poem.id}">
						<div class="list-poem">
							<p class="list-poem-name">
								{poem.name}
								{#if poem.unsavedChanges}
									({$t('workspace.unsavedChanges')})
								{/if}
							</p>
							<p class="list-poem-snippet">{poem.snippet}</p>
						</div>
						<div>{new Date(poem.updatedAt).toLocaleDateString()}</div>
					</a>
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
