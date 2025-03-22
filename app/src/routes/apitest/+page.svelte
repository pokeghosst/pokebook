<script lang="ts">
	import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';
	import { poemManager } from '$lib/service/PoemManager.svelte';

	async function handleManifestRequest() {
		const manifestResult = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
			credentials: 'include'
		});

		if (manifestResult.status === 404) {
			console.log('manifest missing, gotta upload one')
			const encodedManifest = await poemManager.retrieveEncodedManifestContents();
			
			await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
				credentials: 'include',
				method: 'PUT',
				body: encodedManifest
			});
		} else {
			const json = await manifestResult.json();
			console.log(json);
		}

	}
</script>

<button onclick={handleManifestRequest} class="button">Request manifest</button>
