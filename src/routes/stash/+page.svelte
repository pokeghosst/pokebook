<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';
	import { Preferences } from '@capacitor/preferences';
	import { Filesystem, Directory } from '@capacitor/filesystem';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';

	let poems = [];
	let thinking = false;
	let storageMode = null;

	onMount(async () => {
		const storageModePref = await Preferences.get({ key: 'storage_mode' });
		storageMode = storageModePref.value || 'local';

		Preferences.remove({
			key: 'current_poem_uri'
		});

		switch (storageMode) {
			case 'gdrive':
				thinking = true;
				try {
					poems = await loadPoemsFromDrive();
					console.log(poems);
					thinking = false;
					break;
				} catch (e) {
					try {
						if (files.errorData.error == 'invalid_grant') {
							alert("There's an issue with your credentials. Please, log out and log in again!");
						}
					} catch (err) {
						alert(
							'Uh-oh! We messed up big time. Show this to Poke:\n' +
								e +
								'\n' +
								JSON.stringify(files) +
								'\nTimestamp: ' +
								Date.now()
						);
					}
					break;
				}
			case 'local':
				const storedFiles = await Filesystem.readdir({
					path: 'poems',
					directory: Directory.Data
				});
				poems = storedFiles.files.sort((a,b) => b.ctime - a.ctime);
				break;
		}
	});

	async function loadPoemsFromDrive() {
		const options = {
			url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem`
		};
		const response = await CapacitorHttp.request({ ...options, method: 'GET' });
		if (response.status != 200) {
			return {
				code: response.status
			};
		} else {
			return response.data.files;
		}
	}

	function openPoem(poem) {
		console.log(poem);
		if (storageMode == 'gdrive') {
			Preferences.set({
				key: 'gdrive_poem_id',
				value: poem.id
			});
		} else {
			Preferences.set({
				key: 'current_poem_uri',
				value: poem.uri
			});
		}
		goto('/stash/poem', { replaceState: false });
	}
</script>

<div class="poem-list mt-5 flex flex-col w-11/12 md:w-7/12 mx-auto">
	<div class="overflow-x-auto">
		<div class="inline-block min-w-full">
			<div class="overflow-hidden">
				<table class="min-w-full text-left table-fixed">
					<tbody>
						{#if thinking}
							<div class="pt-10 flex items-center justify-center">
								<Skeleton>
									<rect width="100%" height="20" x="0" y="0" rx="5" ry="5" />
									<rect width="100%" height="20" x="0" y="45" rx="5" ry="5" />
									<rect width="100%" height="20" x="0" y="85" rx="5" ry="5" />
									<rect width="100%" height="20" x="0" y="125" rx="5" ry="5" />
								</Skeleton>
							</div>
						{:else if poems}
							{#if poems.length == 0}
								<div
									class="flex justify-center items-center mt-12 text-center"
									id="poem-list-placeholder"
								>
									Your stage is ready and the spotlight's on, but the verses are yet to bloom.
								</div>
							{:else}
								{#each poems as poem}
									{#if poem.name.split('_')[3] == null}
										<tr class="border-b">
											<button on:click={openPoem(poem)}
												><td
													class="w-10/12 whitespace-nowrap py-4 underline decoration-dotted decoration-1 hover:no-underline"
													>{poem.name.split('_')[0]}</td
												></button
											>
											<td class="w-1/12 whitespace-nowrap pl-6 py-4 text-right"
												>{new Date(poem.name.split('_')[1]).toLocaleDateString('en-US', {
													weekday: 'short',
													year: 'numeric',
													month: 'short',
													day: 'numeric'
												})}</td
											>
										</tr>
									{/if}
								{/each}
							{/if}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
