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
	import { t } from '$lib/translations';

	import { PUBLIC_POKEBOOK_VERSION_NAME, PUBLIC_POKEBOOK_VERSION_NUMBER } from '$env/static/public';

	const socialPlatforms = [
		{
			url: 'mailto:me@pokeghost.org',
			title: 'about.mail',
			handle: 'me@pokeghost.org'
		},
		{
			url: 'https://codeberg.org/pokeghost/pokebook',
			title: 'about.contribute',
			handle: 'codeberg.org'
		},
		{
			url: 'https://discord.gg/XfwmEHwa2k',
			title: 'about.discord',
			handle: 'Poke!Suite'
		},
		{
			url: 'https://nixnet.social/pokeghost',
			title: 'about.fediverse',
			handle: '@pokeghost'
		},
		{
			url: 'https://www.buymeacoffee.com/pokegh0st',
			title: 'about.support',
			handle: 'buymeacoffee.com'
		}
	];
</script>

<div class="modal-about">
	<div class="about-top">
		<h1>Poke!Book</h1>
		<small>Version {PUBLIC_POKEBOOK_VERSION_NUMBER} - "{PUBLIC_POKEBOOK_VERSION_NAME}"</small>
	</div>
	<ul class="about-links">
		{#each socialPlatforms as platform}
			<li>
				<a href={platform.url} target="_blank">
					<span class="about-links-title">{$t(platform.title)}</span><br />
					{platform.handle}
				</a>
			</li>
		{/each}
	</ul>
	<div class="about-bottom">
		<p>
			<a href="https://getbook.pokeghost.org/privacy">{$t('about.privacy')}</a>
			| <a href="https://getbook.pokeghost.org/terms">{$t('about.terms')}</a>
		</p>
		<p>© 2023-2024 Pokeghost</p>
	</div>
</div>
