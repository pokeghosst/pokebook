<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2025 Pokeghost.

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
	import { onDestroy, onMount, setContext } from 'svelte';

	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';

	import {
		draftPoemBodyStore,
		draftPoemNameStore,
		draftPoemNoteStore
	} from '$lib/stores/poemDraft';

	import { sharePoem } from '$lib/actions/sharePoem';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Workspace from '../components/Workspace.svelte';

	import type { ToolbarItem } from '$lib/types';
	import type { Poem } from '@pokebook/shared';
	import type { PageProps } from './$types';

	import { putDraftPoem, savePoem } from '$lib/service/poems.service';
	import { handleInput } from '$lib/util';

	let { data }: PageProps = $props();

	const poem: Poem = data;

	function handlePoemNameChange(event: Event) {
		const name = handleInput(event.target as HTMLInputElement);
		putDraftPoem({ name });
	}

	function handlePoemTextChange(event: InputEvent) {
		const text = handleInput(event.target as HTMLTextAreaElement);
		putDraftPoem({ text });
	}

	function handlePoemNoteChange(event: InputEvent) {
		const note = handleInput(event.target as HTMLTextAreaElement);
		putDraftPoem({ note });
	}

	setContext('poemNameChangeHandler', handlePoemNameChange);
	setContext('poemTextChangeHandler', handlePoemTextChange);
	setContext('poemNoteChangeHandler', handlePoemNoteChange);

	const toolbarActions: ToolbarItem[] = [
		{ icon: Save, action: stashPoem, label: $t('workspace.savePoem') },
		{ icon: Trash2, action: forgetDraft, label: $t('workspace.forgetPoem') },
		{
			icon: Share2,
			action: () =>
				sharePoem($draftPoemNameStore, $draftPoemBodyStore, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem')
		}
	];

	onMount(async () => {
		hotkeys.filter = function () {
			return true;
		};
		hotkeys('ctrl+shift+n, command+shift+n', function () {
			stashPoem();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+shift+n, command+shift+n');
	});

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && $draftPoemBodyStore !== '') {
			try {
				await toast.promise(
					savePoem({
						name: $draftPoemNameStore,
						text: $draftPoemBodyStore,
						note: $draftPoemNoteStore
					}),
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
				clearDraftPoem();
			} catch (e) {
				console.log(e);
				if (e instanceof Error)
					toast.error($t(e.message), {
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					});
			}
		} else {
			toast(`☝️🤓 ${$t('toasts.cannotSaveEmptyPoem')}`, {
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
		draftPoemNameStore.set('');
		draftPoemBodyStore.set('');
		draftPoemNoteStore.set('');
	}
</script>

<Workspace
	poem={{ name: poem.name, text: poem.text }}
	note={{ note: poem.note }}
	{toolbarActions}
/>
