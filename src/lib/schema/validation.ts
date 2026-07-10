/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2026 Pokeghost.

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

export type Infer<S> = {
	[K in keyof S]: S[K] extends 'string'
		? string
		: S[K] extends 'number'
			? number
			: S[K] extends 'boolean'
				? boolean
				: never;
};

export function validate<S extends object>(obj: unknown, schema: S): obj is Infer<S> {
	if (typeof obj !== 'object' || obj === null) return false;

	return Object.entries(schema).every(([key, type]) => typeof Reflect.get(obj, key) === type);
}
