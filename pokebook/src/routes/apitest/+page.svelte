<script lang="ts">
	import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';

	async function handleManifestRequest() {
		const result = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
			credentials: 'include'
		});

		if (result.status === 404) {
			console.log('manifest missing, gotta upload one')
		} else {
			const json = await result.json();
			console.log(json);
		}

	}
</script>

<button onclick={handleManifestRequest} class="button">Request manifest</button>
