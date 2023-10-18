<script>
	import { goto } from '$app/navigation';
	import { onMount, getContext } from 'svelte';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';
	import { Preferences } from '@capacitor/preferences';
	import { Filesystem, Directory } from '@capacitor/filesystem';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';
	import { t } from '$lib/translations';

	let poems = [];
	let thinking = false;
	let storageMode = null;

	let translationPromise = getContext('translationPromise');

	onMount(async () => {
		await translationPromise;
		const storageModePref = await Preferences.get({ key: 'storage_mode' });
		storageMode = storageModePref.value || 'local';

		Preferences.remove({
			key: 'current_poem_uri'
		});

		switch (storageMode) {
			case 'gdrive':
				thinking = true;
				const response = await loadPoemsFromDrive();
				switch (response.status) {
					case 200:
						poems = response.data.files;
						break;
					case 401:
						alert($t('popups.unauthorized'));
						break;
					default:
						alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
						break;
				}
				thinking = false;
				break;
			case 'local':
				const storedFiles = await Filesystem.readdir({
					path: 'poems',
					directory: Directory.Data
				});
				poems = storedFiles.files.sort((a, b) => b.ctime - a.ctime);
				break;
		}
	});

	async function loadPoemsFromDrive() {
		const gDriveUuidPref = await Preferences.get({ key: 'gdrive_uuid' });
		const options = {
			url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem`,
			headers: {
				Authorization: gDriveUuidPref.value
			}
		};
		const response = await CapacitorHttp.request({ ...options, method: 'GET' });
		return response;
	}

	function openPoem(poem) {
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
								<div class="poem-list__item w-full">
									<button on:click={openPoem(poem)} class="w-full flex justify-between p-5">
										<div>{poem.name.split('_')[0]}</div>
										<div class="">
											{new Date(poem.name.split('_')[1]).toLocaleDateString('en-US', {
												weekday: 'short',
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</div>
									</button>
								</div>
							{/if}
						{/each}
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>
