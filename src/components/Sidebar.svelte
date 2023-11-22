<script>
	import { t } from '$lib/translations';
	import { navMenuIcons } from '$lib/constants/NavMenuIcons';
	import { navMenuItems } from '$lib/constants/NavMenuItems';
	import { footerLinks } from '$lib/constants/FooterLinks';
	import { isSidebarOpen } from '../lib/stores/isSidebarOpen';
</script>

<div class="sidebar-nav-wrapper">
	<div class={`sidebar ${$isSidebarOpen === 'true' ? 'sidebar-nav--open' : ''}`}>
		<div class="sidebar-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a
					href={item.url}
					target={item.external === true ? '_blank' : '_self'}
					rel={item.external === true ? 'noreferrer' : ''}
				>
					<div class="list-item">
						<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
