/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

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
*/

import { Preferences } from './plugins/Preferences';

interface State {
	darkModeEnabled: boolean;
	pokeHelpEnabled: boolean;
	sidebarOpen: boolean;
	padFullWidth: boolean;
	dayTheme: string;
	nightTheme: string;
	activeLanguage: string;
	poemPadJustification: string;
	padPositions: ('poem' | 'note')[];
	writingPadFont: string;
	writingPadFontSize: number;
}

const defaultState: State = {
	darkModeEnabled: false,
	pokeHelpEnabled: false,
	sidebarOpen: true,
	padFullWidth: false,
	dayTheme: 'neo-day',
	nightTheme: 'neo-night',
	activeLanguage: '',
	poemPadJustification: 'left',
	padPositions: ['poem', 'note'],
	writingPadFont: 'halogen',
	writingPadFontSize: 16
};

const stateFromPreferences: Partial<State> = JSON.parse(
	(await Preferences.get({ key: 'pokebook_state' })).value ?? '{}'
);

function createState(stateToSet: State) {
	let value: State = $state(stateToSet);

	return {
		get value(): State {
			return value;
		},
		set value(stateToSet: Partial<State>) {
			value = { ...value, ...stateToSet };
			(async () => {
				Preferences.set({ key: 'pokebook_state', value: JSON.stringify(value) });
			})();
		}
	};
}

const appState = createState({ ...defaultState, ...stateFromPreferences });
export default appState;
