<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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
	import { openModal } from 'svelte-modals';

	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';

	import Modal from './Modal.svelte';
	import HotkeysModal from './HotkeysModal.svelte';
	import AboutModal from './AboutModal.svelte';

	import { navMenuIcons } from '$lib/constants/NavMenuIcons';
	import { navMenuItems } from '$lib/constants/NavMenuItems';

	import { t } from '$lib/translations';

	function handleSidebarItemClick() {
		if (window.innerWidth < 1024) {
			$isSidebarOpen = 'false';
		}
	}

	let sidebarNavOpenClass = '';

	$: $isSidebarOpen === 'true'
		? (sidebarNavOpenClass = 'sidebar-nav--open')
		: (sidebarNavOpenClass = '');
</script>

<div class="sidebar-nav-wrapper">
	<div
		class="sidebar-close-area {sidebarNavOpenClass}"
		on:click={() => ($isSidebarOpen = 'false')}
		on:keydown
	/>
	<div class="sidebar {sidebarNavOpenClass}">
		<div class="sidebar-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a href={item.url} on:click={() => handleSidebarItemClick()}>
					<div class="list-item">
						<svg fill="currentColor" viewBox="0 0 24 24">
							<path d={navMenuIcons[index].icon} />
						</svg>
						{$t(item.label)}
					</div>
				</a>
			{/each}
		</div>
		<div class="sidebar-footer">
			<button
				on:click={() => openModal(Modal, { title: $t('workspace.hotkeys'), content: HotkeysModal })}
				>{$t('menu.shortcuts')}</button
			>
			<ul>
				<li>
					<button on:click={() => openModal(Modal, { content: AboutModal })}
						>{$t('menu.about')}</button
					>
				</li>
			</ul>
		</div>
	</div>
</div>
