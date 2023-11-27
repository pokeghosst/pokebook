<script lang="ts">
	import { onMount } from 'svelte';

	import { Preferences } from '@capacitor/preferences';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const searchParams = browser && $page.url.searchParams;

	let message = '';

	onMount(async () => {
		if (searchParams) {
			const code = searchParams.get('code');
			if (code) {
				const response = await fetch('/api/drive/callback', {
					method: 'POST',
					body: JSON.stringify({ code }),
					headers: {
						'content-type': 'application/json'
					}
				});
				const result = await response.json();
				await Preferences.set({
					key: 'google_access_token',
					value: result.accessToken
				});
				await Preferences.set({
					key: 'google_access_token_expiration',
					value: result.expiration
				});
			}
		}
	});
</script>

<div>
	{message}
</div>
