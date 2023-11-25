<script lang="ts">
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';

	import { footerLinks } from '$lib/constants/FooterLinks';
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
			<ul>
				{#each footerLinks as link}
					<li><a href={link.url}>{$t(link.label)}</a></li>
				{/each}
			</ul>
		</div>
	</div>
</div>
