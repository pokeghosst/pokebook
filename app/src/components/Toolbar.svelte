<script lang="ts">
	import appState from '$lib/AppState.svelte';
	import { padFonts } from '$lib/constants/PadFonts';
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

	function updateWritingPadFont(value: string) {
		appState.value = { writingPadFont: value };
	}
</script>

<div class="toolbar-menu">
	<div class="button-group">
		<button
			onclick={() => (appState.value = { poemPadJustification: 'left' })}
			class={`button ${appState.value.poemPadJustification === 'left' ? 'active' : ''}`}
		>
			<AlignLeft />
		</button>
		<button
			onclick={() => (appState.value = { poemPadJustification: 'center' })}
			class={`button ${appState.value.poemPadJustification === 'center' ? 'active' : ''}`}
		>
			<AlignCenter />
		</button>
		<button
			onclick={() => (appState.value = { poemPadJustification: 'right' })}
			class={`button ${appState.value.poemPadJustification === 'right' ? 'active' : ''}`}
		>
			<AlignRight />
		</button>
	</div>
	<div class="settings-select">
		<select
			bind:value={() => appState.value.writingPadFont, updateWritingPadFont}
			style="margin: 0; min-width: 130px;"
		>
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
