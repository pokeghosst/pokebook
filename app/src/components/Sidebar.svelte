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

	import appState from '$lib/AppState.svelte';
	import { navMenuItems } from '$lib/constants/NavMenuItems';
	import { t } from '$lib/translations';

	import AboutModal from './AboutModal.svelte';
	import HotkeysModal from './HotkeysModal.svelte';
	import Modal from './Modal.svelte';

	let sidebarNavOpenClass = $derived(appState.value.sidebarOpen ? 'sidebar-nav--open' : '');

	function handleSidebarItemClick() {
		if (window.innerWidth < 1024) {
			appState.value.sidebarOpen = false;
		}
	}

	function closeSidebar() {
		appState.value.sidebarOpen = false;
	}
</script>

<div class="sidebar-nav-wrapper">
	<div
		class="sidebar-close-area {sidebarNavOpenClass}"
		onclick={closeSidebar}
		onkeydown={closeSidebar}
		role="button"
		tabindex="0"
	></div>
	<div class="sidebar {sidebarNavOpenClass}">
		<div class="sidebar-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a href={item.url} onclick={handleSidebarItemClick}>
					<div class="list-item">
						<item.icon />
						{$t(item.label)}
					</div>
				</a>
			{/each}
		</div>
		<div class="sidebar-footer">
			<button
				onclick={() => openModal(Modal, { title: $t('workspace.hotkeys'), content: HotkeysModal })}
				>{$t('menu.shortcuts')}</button
			>
			<ul>
				<li>
					<button onclick={() => openModal(Modal, { content: AboutModal })}
						>{$t('menu.about')}</button
					>
				</li>
			</ul>
		</div>
	</div>
</div>
