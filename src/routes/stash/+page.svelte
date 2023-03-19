<script>
	import { liveQuery } from 'dexie';
	import { db } from '../../stores/db';
	import { browser } from '$app/environment';
	import { currentPoem } from '../../stores/poemId';
	import { goto } from '$app/navigation';

	let poems = liveQuery(() => (browser ? db.poems.reverse().toArray() : []));

	function openPoem(id) {
		currentPoem.set(id);
		goto('/stash/poem', { replaceState: false })
	}
</script>

<div class="flex flex-col w-11/12 md:w-7/12 mx-auto">
	<div class="overflow-x-auto">
		<div class="inline-block min-w-full">
			<div class="overflow-hidden">
				<table class="min-w-full text-left table-fixed">
					<tbody>
						{#if $poems}
							<tr><th /></tr>
							{#each $poems as poem (poem.id)}
								<tr class="border-b bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-b-stone-100">
									<button on:click={openPoem(poem.id)}
										><td
											class="w-10/12 whitespace-nowrap py-4 underline decoration-dotted hover:no-underline"
											>{poem.name}</td
										></button
									>
									<td class="w-1/12 whitespace-nowrap px-6 py-4 text-right"
										>{new Date(poem.timestamp).toLocaleDateString('en-US', {
											weekday: 'short',
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}</td
									>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
