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

export function makeProxy<T extends object>(implResolver: () => Promise<T>): T {
	let implCache: T | null = null;
	let resolvePromise: Promise<T> | null = null;

	return new Proxy({} as T, {
		get(_, prop) {
			return async (...args: unknown[]) => {
				if (implCache) {
					const method = implCache[prop as keyof T];
					if (typeof method === 'function') {
						return method.apply(implCache, args);
					} else {
						throw new Error(`Method ${String(prop)} does not exist on implementation`);
					}
				}

				if (resolvePromise) {
					implCache = await resolvePromise;
				} else {
					resolvePromise = implResolver();
					implCache = await resolvePromise;
				}

				const method = implCache[prop as keyof T];
				if (typeof method === 'function') {
					return method.apply(implCache, args);
				} else {
					throw new Error(`Method ${String(prop)} does not exist on implementation`);
				}
			};
		}
	});
}
