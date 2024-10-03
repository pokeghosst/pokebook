<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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
	import { goto } from '$app/navigation';

	import { Preferences } from '@capacitor/preferences';

	import { t } from '$lib/translations';
	import { isStorageProvider } from '$lib/enums/StorageProvider';
	import toast from 'svelte-french-toast';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';

	onMount(async () => {
		const provider = $page.params.provider;

		if (!isStorageProvider(provider))
			toast.error($t('errors.noStorageProvider'), {
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			});

		const code = $page.url.searchParams.get('code');

		if (code) {
			const callbackResponse = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/${provider}/callback`, {
				headers: {
					Authorization: code,
					'Content-type': 'application/json'
				},
				method: 'POST'
			});
			switch (callbackResponse.status) {
				case 200: {
					const callbackResponseJson = await callbackResponse.json();
					await Preferences.set({
						key: `${provider}_access_token`,
						value: callbackResponseJson.accessToken
					});
					await Preferences.set({
						key: `${provider}_access_token_expiration`,
						value: callbackResponseJson.accessTokenExpiration
					});
					await Preferences.set({
						key: `${provider}_refresh_token_id`,
						value: callbackResponseJson.refreshTokenId
					});
					goto(`/settings?auth=${provider}&status=ok`);
					break;
				}
				case 401:
					goto(`/settings?auth=${provider}&status=authorizationError`);
					break;
				default:
					goto(`/settings?auth=${provider}&status=unknownError`);
			}
		} else {
			toast.error('errors.callbackCodeNotFound', {
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			});
		}
	});
</script>

<p style="text-align: center;">{$t('workspace.waitForAuthorization')}</p>
