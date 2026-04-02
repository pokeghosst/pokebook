/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025-2026 Pokeghost.

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

import type { ThemeMode } from './constants/themeModes';
import { Preferences } from './plugins/Preferences';
import type { Poem } from './schema/poem.schema';

interface State {
	active_language: string;
	day_theme: string;
	full_width_pad: boolean;
	sidebar_open: boolean;
	night_theme: string;
	poem_justification: string;
	pokehelp_active: boolean;
	theme_mode: ThemeMode;
	writing_pads_state: [number, number];
	notebook_font: string;
	notebook_font_size: number;
	safe_to_close: boolean;
	current_poem_uri: string;

	poem: Poem;
}

function safeParse<T>(value: string) {
	try {
		return JSON.parse(value) as T;
	} catch {
		return value as T;
	}
}

function usePreferences<K extends keyof State>(key: K, defaultValue: State[K]) {
	let value = $state<State[K]>(defaultValue);

	Preferences.get({ key }).then(({ value: stored }) => {
		if (stored !== null) value = safeParse(stored);
	});

	return {
		get value() {
			return value;
		},
		set value(v: State[K]) {
			value = v;
			Preferences.set({ key, value: JSON.stringify(v) });
		}
	};
}

export const activeLanguage = usePreferences('active_language', 'en');
export const dayTheme = usePreferences('day_theme', 'neo-day');
export const fullWidthPad = usePreferences('full_width_pad', false);
export const sidebarOpen = usePreferences('sidebar_open', false);
export const nightTheme = usePreferences('night_theme', 'neo-night');
export const justification = usePreferences('poem_justification', 'left');
export const pokehelp = usePreferences('pokehelp_active', false);
export const themeMode = usePreferences('theme_mode', 'auto');
export const padPositions = usePreferences('writing_pads_state', [0, 1]);
export const font = usePreferences('notebook_font', 'halogen');
export const fontSize = usePreferences('notebook_font_size', 16);
export const safeToClose = usePreferences('safe_to_close', true);
export const currentPoemUri = usePreferences('current_poem_uri', '');
