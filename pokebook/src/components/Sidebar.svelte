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
	import { run, createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { openModal } from 'svelte-modals';

	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';

	import AboutModal from './AboutModal.svelte';
	import HotkeysModal from './HotkeysModal.svelte';
	import Modal from './Modal.svelte';

	import { navMenuItems } from '$lib/constants/NavMenuItems';

	import { t } from '$lib/translations';

	function handleSidebarItemClick() {
		if (window.innerWidth < 1024) {
			$isSidebarOpen = 'false';
		}
	}

	let sidebarNavOpenClass = $state('');

	run(() => {
		$isSidebarOpen === 'true'
			? (sidebarNavOpenClass = 'sidebar-nav--open')
			: (sidebarNavOpenClass = '');
	});
</script>

<div class="sidebar-nav-wrapper">
	<div
		class="sidebar-close-area {sidebarNavOpenClass}"
		onclick={() => ($isSidebarOpen = 'false')}
		onkeydown={bubble('keydown')}
		role="button"
		tabindex="0"
	></div>
	<div class="sidebar {sidebarNavOpenClass}">
		<div class="sidebar-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a href={item.url} onclick={() => handleSidebarItemClick()}>
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
