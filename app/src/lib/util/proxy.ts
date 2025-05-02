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

/* eslint-disable @typescript-eslint/no-explicit-any */
export function makeProxy<T>(getImplementationFn: () => Promise<any>): T {
	return new Proxy(
		{},
		{
			get(_, prop) {
				return async (...args: unknown[]) => {
					const impl = await getImplementationFn();
					const method = impl[prop];
					if (typeof method === 'function') {
						return method.apply(impl, args);
					} else {
						throw new Error(`Method ${String(prop)} does not exist on implementation`);
					}
				};
			}
		}
	) as T;
}
