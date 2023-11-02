<script>
	import { t } from '$lib/translations';
	import { PUBLIC_POKEBOOK_WEB_VERSION } from '$env/static/public';

	const footerItems = [
		{
			href: '/privacy',
			target: '_self',
			text: $t('menu.privacy')
		},
		{
			href: '/terms',
			target: '_self',
			text: $t('menu.tos')
		},
		{
			href: '/support',
			target: '_self',
			text: $t('menu.support')
		},
		{
			href: 'https://github.com/pokegh0st/pokebook',
			target: '_blank',
			text: $t('menu.sourceCode')
		}
	];
</script>

<div class="footer">
	<ul>
		<li>{PUBLIC_POKEBOOK_WEB_VERSION}</li>
		{#each footerItems as item}
			<li><a href={item.href} target={item.target}>{item.text}</a></li>
		{/each}
	</ul>
</div>
