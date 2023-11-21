<script>
	import { t } from '$lib/translations';
	import { footerLinks } from '$lib/constants/FooterLinks';
</script>

<div class="footer">
	<ul>
		{#each footerLinks as item}
			<li><a href={item.url} target="_blank" rel="noreferrer">{$t(item.label)}</a></li>
		{/each}
	</ul>
</div>
