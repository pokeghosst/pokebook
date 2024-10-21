/* eslint-disable prefer-const */
import { Preferences } from '../plugins/Preferences';

let draftPoemTitle: string = $state(
	(await Preferences.get({ key: 'draft_poem_name' })).value || 'Unnamed'
);
let draftPoemText: string = $state((await Preferences.get({ key: 'draft_poem_text' })).value || '');
let draftPoemNote: string = $state((await Preferences.get({ key: 'draft_poem_note' })).value || '');

export { draftPoemTitle, draftPoemText, draftPoemNote };
