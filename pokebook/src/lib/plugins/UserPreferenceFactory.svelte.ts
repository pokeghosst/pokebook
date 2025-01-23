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

import { Preferences } from './Preferences';

class UserPreference<T> {
	private _key: string;
	private _value: T | null = null;
	private _defaultValue: T;

	constructor(key: string, defaultValue: T) {
		this._key = key;
		this._defaultValue = defaultValue;
	}

	public async initialize() {
		const currentValue = (await Preferences.get({ key: this._key })).value;
		this._value = currentValue ? JSON.parse(currentValue) : this._defaultValue;
	}

	public set value(v: T) {
		this._value = v;
		Preferences.set({ key: this._key, value: JSON.stringify(v) });
	}

	public get value(): T {
		return this._value ?? this._defaultValue;
	}
}

class UserPreferenceFactory {
	static async create<T>(key: string, defaultValue: T) {
		const pref = new UserPreference<T>(key, defaultValue);
		pref.initialize();
		return pref;
	}
}

const writingPadsState = await UserPreferenceFactory.create('notebook_positions', ['poem', 'note']);
const isFullWidthPad = await UserPreferenceFactory.create('full_width_pad', false);
const notebookFont = await UserPreferenceFactory.create('notebook_font', 'halogen');

export { writingPadsState, isFullWidthPad, notebookFont };
