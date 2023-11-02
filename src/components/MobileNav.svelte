<script>
	import { PUBLIC_POKEBOOK_WEB_VERSION } from '$env/static/public';
	import { t } from '$lib/translations';

	let menuOpen = false;

	const menuItems = [
		{
			icon: 'M21.707,5.565,18.435,2.293a1,1,0,0,0-1.414,0L3.93,15.384a.991.991,0,0,0-.242.39l-1.636,4.91A1,1,0,0,0,3,22a.987.987,0,0,0,.316-.052l4.91-1.636a.991.991,0,0,0,.39-.242L21.707,6.979A1,1,0,0,0,21.707,5.565ZM7.369,18.489l-2.788.93.93-2.788,8.943-8.944,1.859,1.859ZM17.728,8.132l-1.86-1.86,1.86-1.858,1.858,1.858Z',
			label: $t('menu.draft'),
			url: '/'
		},
		{
			icon: 'M4,23H20a1,1,0,0,0,1-1V10a1,1,0,0,0-1-1H4a1,1,0,0,0-1,1V22A1,1,0,0,0,4,23ZM5,11H19V21H5Zm11,4v2a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v1h4V15a1,1,0,0,1,2,0ZM6,5H18a1,1,0,0,1,0,2H6A1,1,0,0,1,6,5ZM8,3A1,1,0,0,1,8,1h8a1,1,0,0,1,0,2Z',
			label: $t('menu.stash'),
			url: '/stash'
		},
		{
			icon: 'M12,16a4,4,0,1,0-4-4A4,4,0,0,0,12,16Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,12,10ZM3.5,12.877l-1,.579a2,2,0,0,0-.733,2.732l1.489,2.578A2,2,0,0,0,5.99,19.5L7,18.916a1.006,1.006,0,0,1,1.008.011.992.992,0,0,1,.495.857V21a2,2,0,0,0,2,2h3a2,2,0,0,0,2-2V19.782a1.009,1.009,0,0,1,1.5-.866l1.009.582a2,2,0,0,0,2.732-.732l1.488-2.578a2,2,0,0,0-.733-2.732l-1-.579a1.007,1.007,0,0,1-.5-.89,1,1,0,0,1,.5-.864l1-.579a2,2,0,0,0,.733-2.732L20.742,5.234A2,2,0,0,0,18.01,4.5L17,5.083a1.008,1.008,0,0,1-1.5-.867V3a2,2,0,0,0-2-2h-3a2,2,0,0,0-2,2V4.294a.854.854,0,0,1-.428.74l-.154.089a.864.864,0,0,1-.854,0L5.99,4.5a2,2,0,0,0-2.733.732L1.769,7.813A2,2,0,0,0,2.5,10.544l1,.578a1.011,1.011,0,0,1,.5.891A.994.994,0,0,1,3.5,12.877Zm1-3.487-1-.578L4.99,6.234l1.074.62a2.86,2.86,0,0,0,2.85,0l.154-.088A2.863,2.863,0,0,0,10.5,4.294V3h3V4.216a3.008,3.008,0,0,0,4.5,2.6l1.007-.582L20.5,8.812l-1,.578a3.024,3.024,0,0,0,0,5.219l1,.579h0l-1.488,2.578L18,17.184a3.008,3.008,0,0,0-4.5,2.6V21h-3V19.784a3.006,3.006,0,0,0-4.5-2.6l-1.007.582L3.5,15.188l1-.579a3.024,3.024,0,0,0,0-5.219Z',
			label: $t('menu.settings'),
			url: '/settings'
		},
		{
			icon: 'M4,11A3,3,0,0,0,7,8V6A3,3,0,0,0,1,6V8A3,3,0,0,0,4,11ZM3,6A1,1,0,0,1,5,6V8A1,1,0,0,1,3,8ZM19,6a3,3,0,0,0-6,0V8a3,3,0,0,0,6,0ZM17,8a1,1,0,0,1-2,0V6a1,1,0,0,1,2,0Zm-7,3a1,1,0,0,1-1-1V4a1,1,0,0,1,2,0v6A1,1,0,0,1,10,11ZM23,4v6a1,1,0,0,1-2,0V4a1,1,0,0,1,2,0ZM7,18V16a3,3,0,0,0-6,0v2a3,3,0,0,0,6,0ZM3,18V16a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Zm6,0a3,3,0,0,0,6,0V16a3,3,0,0,0-6,0Zm2-2a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Zm12-2v6a1,1,0,0,1-2,0V14a1,1,0,0,1,2,0Zm-5-1a1,1,0,0,1,1,1v6a1,1,0,0,1-2,0V14A1,1,0,0,1,18,13Z',
			label: $t('menu.markov'),
			url: '/markov'
		}
	];
	const links = [
		{ label: $t('menu.privacy'), url: '/privacy' },
		{ label: $t('menu.tos'), url: '/terms' },
		{ label: $t('menu.support'), url: '/support' }
	];

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

</script>

<div class="z-50 flex">
	<button class="focus:outline-none lg:hidden self-center" on:click={toggleMenu} id="burger-button">
		<svg stroke="currentColor" width="24px" height="24px" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	</button>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class={`fixed bg-transparent top-0 h-full transition-transform duration-200 transform ${
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		}`}
		style="width: 100%; left: 0"
		on:click={closeMenu}
	/>
	<div
		class={`fixed top-0 h-full transition-transform duration-200 transform ${
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		}`}
		id="burger-bar"
		style="width: 80%; right: 0"
	>
		<div class="mt-10" />
		{#each menuItems as menuItem}
			<a href={menuItem.url} on:click={closeMenu}>
				<div class="poem-list__item w-full p-4 text-left flex">
					<svg
						fill="currentColor"
						width="800px"
						height="800px"
						viewBox="0 0 24 24"
						class="w-5 h-5 mr-2"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d={menuItem.icon} />
					</svg>
					{menuItem.label}
				</div></a
			>
		{/each}
		<div class="absolute bottom-5 left-5 text-left">
			{#each links as link}
				<a
					href={link.url}
					class="underline decoration-dotted decoration-1 hover:no-underline"
					on:click={closeMenu}>{link.label}</a
				><br />
			{/each}
			<p class="mt-3 text-sm">{PUBLIC_POKEBOOK_WEB_VERSION}</p>
		</div>
	</div>
</div>
