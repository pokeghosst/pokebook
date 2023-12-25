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
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import { Preferences } from '@capacitor/preferences';
	import { goto } from '$app/navigation';

	const searchParams = browser && $page.url.searchParams;

	onMount(async () => {
		if (searchParams) {
			const code = searchParams.get('code');
			if (code) {
				const response = await fetch('/api/dropbox/callback', {
					headers: {
						Authorization: code,
						'content-type': 'application/json'
					},
					method: 'POST'
				});
				switch (response.status) {
					case 200: {
						const result = await response.json();
						await Preferences.set({
							key: 'dropbox_access_token',
							value: result.accessToken
						});
						await Preferences.set({
							key: 'dropbox_access_token_expiration',
							value: result.expiration
						});
						await Preferences.set({
							key: 'dropbox_refresh_token_id',
							value: result.refreshTokenId
						});
						goto('/settings?auth=dropbox&status=ok');
						break;
					}
					case 401:
						goto('/settings?auth=dropbox&status=authorizationError');
						break;
					default:
						goto('/settings?auth=dropbox&status=unknownError');
				}
			}
		}
	});
</script>
