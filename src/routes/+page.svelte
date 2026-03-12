<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

<script lang="ts">
	import { sharePoem } from '$lib/actions/sharePoem';
	import { Preferences } from '$lib/plugins/Preferences';
	import type { OnlyNote, OnlyPoem } from '$lib/schema/poem.schema';
	import { savePoem } from '$lib/services/poem.service';
	import { t } from '$lib/translations';
	import type { InputChangeEvent, InputChangeHandler, ToolbarItem } from '$lib/types';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import hotkeys from 'hotkeys-js';
	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import { onDestroy, onMount, setContext } from 'svelte';
	import toast from 'svelte-french-toast';
	import Workspace from '../components/Workspace.svelte';

	let thinking = $state(true);

	let poem = $state<OnlyPoem>({ name: '', text: '' });
	let note = $state<OnlyNote>({ note: '' });

	setContext('poem', poem);
	setContext('note', note);
	setContext<[InputChangeHandler<HTMLInputElement>, InputChangeHandler<HTMLTextAreaElement>]>(
		'poemHandlers',
		[handleNameChange, handleTextChange]
	);
	setContext('noteHandler', handleNoteChange);

	onMount(async () => {
		hotkeys.filter = function () {
			return true;
		};
		hotkeys('ctrl+shift+n, command+shift+n', function () {
			stashPoem();
			return false;
		});

		const [name_, text_, note_] = await Promise.all([
			Preferences.get({ key: 'draft_poem_name' }),
			Preferences.get({ key: 'draft_poem_text' }),
			Preferences.get({ key: 'draft_poem_note' })
		]);

		poem.name = name_.value ?? 'Unnamed';
		poem.text = text_.value ?? '';
		note.note = note_.value ?? '';

		thinking = false;
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+shift+n, command+shift+n');
	});

	async function handleNameChange(e: InputChangeEvent<HTMLInputElement>) {
		poem.name = e.currentTarget.value;
		await Preferences.set({ key: 'draft_poem_name', value: poem.name });
	}

	async function handleTextChange(e: InputChangeEvent<HTMLTextAreaElement>) {
		poem.text = e.currentTarget.value;
		await Preferences.set({ key: 'draft_poem_text', value: poem.text });
	}

	async function handleNoteChange(e: InputChangeEvent<HTMLInputElement>) {
		note.note = e.currentTarget.value;
		await Preferences.set({ key: 'draft_poem_note', value: note.note });
	}

	async function stashPoem() {
		try {
			await toast.promise(
				savePoem({ ...poem, ...note }),
				{
					loading: `${$t('toasts.savingPoem')}`,
					success: `${$t('toasts.poemSaved')}`,
					error: `${$t('errors.poemSaveError')}`
				},
				{
					position: GLOBAL_TOAST_POSITION,
					style: GLOBAL_TOAST_STYLE
				}
			);
			// clearDraftPoem();
		} catch (e) {
			console.log(e);
			if (e instanceof Error)
				toast.error($t(e.message), {
					position: GLOBAL_TOAST_POSITION,
					style: GLOBAL_TOAST_STYLE
				});
		}
	}

	function forgetDraft() {
		if (confirm($t('toasts.forgetConfirm'))) {
			clearDraftPoem();
		}
	}

	function clearDraftPoem() {
		Preferences.set({ key: 'draft_poem_name', value: '' });
		Preferences.set({ key: 'draft_poem_text', value: '' });
		Preferences.set({ key: 'draft_poem_note', value: '' });

		poem.name = '';
		poem.text = '';
		note.note = '';
	}

	let isPoemNotEmpty = $derived(poem.name && poem.text);
	let actions = $derived([
		{ icon: Save, action: stashPoem, label: $t('workspace.savePoem'), disabled: !isPoemNotEmpty },
		{
			icon: Share2,
			action: () => sharePoem(poem.name, poem.text, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem'),
			disabled: !isPoemNotEmpty
		},
		{ icon: Trash2, action: forgetDraft, label: $t('workspace.forgetPoem') }
	] satisfies ToolbarItem[]);
</script>

{#if thinking}
	<div class="placeholder-text-wrapper">
		<p>Loading...</p>
	</div>
{:else}
	<Workspace {actions} />
{/if}
