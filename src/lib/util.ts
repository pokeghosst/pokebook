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

export function debounceWithState<T extends unknown[], R>(
	callback: (...args: T) => Promise<R>,
	delay: number
) {
	let timeoutTimer: ReturnType<typeof setTimeout>;
	let isPending = false;
	let isExecuting = false;

	const debouncedFn = (...args: T): Promise<R> => {
		clearTimeout(timeoutTimer);
		isPending = true;

		return new Promise((resolve, reject) => {
			timeoutTimer = setTimeout(async () => {
				isPending = false;
				isExecuting = true;

				try {
					const result = await callback(...args);
					isExecuting = false;
					resolve(result);
				} catch (error) {
					isExecuting = false;
					reject(error);
				}
			}, delay);
		});
	};

	debouncedFn.isBusy = () => isPending || isExecuting;

	return debouncedFn;
}
