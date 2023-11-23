<script lang="ts">
	import { t } from '$lib/translations';
	import { navMenuIcons } from '$lib/constants/NavMenuIcons';
	import { navMenuItems } from '$lib/constants/NavMenuItems';
	import { footerLinks } from '$lib/constants/FooterLinks';
	import { isSidebarOpen } from '../lib/stores/isSidebarOpen';
	import { Router, Link } from 'svelte-navigator';
</script>

<div class="sidebar-nav-wrapper">
	<div
		class={`sidebar-close-area ${$isSidebarOpen === 'true' ? 'sidebar-nav--open' : ''}`}
		on:click={() => ($isSidebarOpen = 'false')}
		on:keydown
	/>
	<div class={`sidebar ${$isSidebarOpen === 'true' ? 'sidebar-nav--open' : ''}`}>
		<div class="sidebar-nav-items">
			<Router>
				{#each navMenuItems as item, index (navMenuItems[index])}
					<Link to={item.url} replace>
						<div class="list-item">
							<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d={navMenuIcons[index].icon} />
							</svg>
							{$t(item.label)}
						</div></Link
					>
				{/each}
			</Router>
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
