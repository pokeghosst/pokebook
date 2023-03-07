<script>
	import { liveQuery } from 'dexie';
	import { db } from '../../stores/db';
	import { browser } from '$app/environment';

	let poems = liveQuery(() => (browser ? db.poems.reverse().toArray() : []));
</script>

<div class="flex flex-col w-7/12 mx-auto">
	<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
			<div class="overflow-hidden">
				<table class="min-w-full text-left table-fixed">
					<tbody>
						{#if $poems}
							<tr><th /></tr>
							{#each $poems as poem (poem.id)}
								<tr class="border-b bg-white dark:border-neutral-500 dark:bg-neutral-700">
									<a href="/stash/{poem.id}"
										><td
											class="w-10/12 whitespace-nowrap px-6 py-4 underline decoration-dotted hover:no-underline"
											>{poem.name}</td
										></a
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
