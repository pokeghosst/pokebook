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
	import { closeModal } from 'svelte-modals';

	import { t } from '$lib/translations';

	const socialPlatforms = [
		{
			url: 'mailto:support@pokeghost.org',
			title: 'about.mail',
			handle: 'support@pokeghost.org'
		},
		{
			url: 'https://pokeghost.substack.com/subscribe',
			title: 'about.blog',
			handle: 'Substack'
		},
		{
			url: 'https://github.com/pokeghosst/pokebook',
			title: 'about.contribute',
			handle: 'GitHub'
		},
		{
			url: 'https://discord.gg/XfwmEHwa2k',
			title: 'about.discord',
			handle: 'Poke!Suite'
		},
		{
			url: 'https://www.buymeacoffee.com/pokegh0st',
			title: 'about.support',
			handle: 'Buy Me a Coffee'
		}
	];
</script>

<div class="modal-about">
	<div class="about-top">
		<h1>Poke!Book</h1>
		<small>{$t('about.version')} 3.1 - "Carrot Cake"</small>
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
			<a href="/privacy" on:click={closeModal}>{$t('about.privacy')}</a>
			| <a href="/terms" on:click={closeModal}>{$t('about.terms')}</a>
		</p>
		<p>© {new Date().getFullYear()} Pokeghost</p>
	</div>
</div>
