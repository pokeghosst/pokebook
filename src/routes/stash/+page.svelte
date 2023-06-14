<script>
	import { db } from '../../stores/db';
	import { currentPoem } from '../../stores/poemId';
	import { goto } from '$app/navigation';
	import { storageMode } from '../../stores/storage';
	import { onMount } from 'svelte';
	import { refreshCode } from '../../stores/refreshCode';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';

	let poems = [];
	let thinking = false;

	onMount(async () => {
		switch ($storageMode) {
			case 'gdrive':
				thinking = true;
				const tokenExpiryDate = JSON.parse($refreshCode).expiry_date;
				if (Date.now() > tokenExpiryDate) {
					alert('Heads up! Your session expired, log out and log in again!');
					break;
				}
				let poemsTmp = [];
				const files = await loadPoemsFromDrive();
				try {
					files.forEach((file) => {
						if (file.name.split('_')[2] == null) {
							poemsTmp.push({
								id: file.id,
								name: file.name.split('_')[0],
								timestamp: parseInt(file.name.split('_')[1])
							});
						}
					});
					poems = poemsTmp;
					thinking = false;
					break;
				} catch (e) {
					try {
						if (files.errorData.error == 'invalid_grant') {
							alert("There's an issue with your credentials. Please, log out and log in again!");
						}
					} catch (err) {
						alert("Uh-oh! We messed up big time. Show this to Poke:\n" + e + "\n" + JSON.stringify(files) + "\nTimestamp: " + Date.now());
					}
					break;
				}
			case 'local':
				db.poems
					.reverse()
					.toArray()
					.then((objects) => {
						poems = objects;
					})
					.catch((error) => {
						console.error(error);
					});
				break;
		}
	});

	async function loadPoemsFromDrive() {		
		const auth = JSON.parse($refreshCode);
		const response = await fetch('/api/gdrive/stash', {
			method: 'POST',
			body: JSON.stringify({
				refreshToken: auth.access_token
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		if (response.status != 200) {
			return {
				message: response.statusText,
				code: response.status
			};
		} else {
			return response.json();
		}
	}

	function openPoem(id) {
		currentPoem.set(id);
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
								<div class="flex justify-center items-center mt-12 text-center text-zinc-700" id="poem-list-placeholder">
									Your stage is ready and the spotlight's on, but the verses are yet to bloom
								</div>
							{:else}
								{#each poems as poem (poem.id)}
									<tr class="border-b">
										<button on:click={openPoem(poem.id)}
											><td
												class="w-10/12 whitespace-nowrap py-4 underline decoration-dotted decoration-1 hover:no-underline"
												>{poem.name}</td
											></button
										>
										<td class="w-1/12 whitespace-nowrap pl-6 py-4 text-right"
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
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
