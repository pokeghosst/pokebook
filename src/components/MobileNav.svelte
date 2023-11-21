<script>
	import { t } from '$lib/translations';
	import { navMenuIcons } from '$lib/constants/NavMenuIcons';
	import { navMenuItems } from '$lib/constants/NavMenuItems';
	import { footerLinks } from '$lib/constants/FooterLinks';

	import BurgerMenu from './svg/BurgerMenu.svelte';

	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<div class="mobile-nav-wrapper">
	<button on:click={toggleMenu}>
		<BurgerMenu />
	</button>
	<div
		class={`mobile-nav-close-area ${menuOpen ? 'mobile-nav--open' : ''}`}
		on:click={closeMenu}
		on:keydown
	/>
	<div class={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}>
		<div class="mobile-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a
					href={item.url}
					target={item.external === true ? '_blank' : '_self'}
					rel={item.external === true ? 'noreferrer' : ''}
					on:click={closeMenu}
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
		<div class="mobile-nav-footer">
			<ul>
				{#each footerLinks as link}
					<li><a href={link.url} on:click={closeMenu}>{$t(link.label)}</a></li>
				{/each}
			</ul>
		</div>
	</div>
</div>
