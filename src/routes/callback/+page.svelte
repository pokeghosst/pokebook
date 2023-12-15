<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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
				console.log(result);
				await Preferences.set({
					key: 'google_access_token',
					value: result.accessToken
				});
				await Preferences.set({
					key: 'google_access_token_expiration',
					value: result.expiration
				});
				await Preferences.set({
					key: 'google_refresh_token_id',
					value: result.refreshTokenId
				});
			}
		}
	});
</script>

<div>
	{message}
</div>
