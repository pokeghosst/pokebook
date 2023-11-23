<script lang="ts">
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';

	import { footerLinks } from '$lib/constants/FooterLinks';
	import { navMenuIcons } from '$lib/constants/NavMenuIcons';
	import { navMenuItems } from '$lib/constants/NavMenuItems';

	import { t } from '$lib/translations';
</script>

<div class="sidebar-nav-wrapper">
	<div
		class={`sidebar-close-area ${$isSidebarOpen === 'true' ? 'sidebar-nav--open' : ''}`}
		on:click={() => ($isSidebarOpen = 'false')}
		on:keydown
	/>
	<div class={`sidebar ${$isSidebarOpen === 'true' ? 'sidebar-nav--open' : ''}`}>
		<div class="sidebar-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a href={item.url}>
					<div class="list-item">
						<svg fill="currentColor" viewBox="0 0 24 24">
							<path d={navMenuIcons[index].icon} />
						</svg>
						{$t(item.label)}
					</div></a
				>
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
