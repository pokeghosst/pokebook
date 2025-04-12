<script lang="ts">
	import { padFonts } from '$lib/constants/PadFonts';
	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { writingPadFont } from '$lib/stores/writingPadFont';
	import { t } from '$lib/translations';
	import { getContext } from 'svelte';

	import AlignCenter from 'lucide-svelte/icons/align-center';
	import AlignLeft from 'lucide-svelte/icons/align-left';
	import AlignRight from 'lucide-svelte/icons/align-right';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import FontSize from './FontSize.svelte';

	import type { ToolbarItem } from '$lib/types';

	let { actions }: { actions: ToolbarItem[] } = $props();
	let unsavedChanges = getContext('unsavedChanges');
</script>

<div class="toolbar-menu">
	<div class="button-group">
		<button
			onclick={() => ($poemPadJustification = 'left')}
			class={`button ${$poemPadJustification === 'left' ? 'active' : ''}`}
		>
			<AlignLeft />
		</button>
		<button
			onclick={() => ($poemPadJustification = 'center')}
			class={`button ${$poemPadJustification === 'center' ? 'active' : ''}`}
		>
			<AlignCenter />
		</button>
		<button
			onclick={() => ($poemPadJustification = 'right')}
			class={`button ${$poemPadJustification === 'right' ? 'active' : ''}`}
		>
			<AlignRight />
		</button>
	</div>
	<div class="settings-select">
		<select bind:value={$writingPadFont} style="margin: 0; min-width: 130px;">
			{#each padFonts as option}
				<option value={option.value}>
					{option.label}
				</option>
			{/each}
		</select>
		<div class="settings-select-chevron-wrapper" style="margin-top: -5px">
			<ChevronDown />
		</div>
	</div>
	<FontSize />
	{#each actions as action}
		<button onclick={() => action.action()} class="button">
			<action.icon />
			{action.label}
		</button>
	{/each}
	{#if unsavedChanges}
		{$t('workspace.unsavedChanges')}
	{/if}
</div>
