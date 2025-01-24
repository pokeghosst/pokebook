/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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

import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export interface PoemFileEntity {
	name: string;
	poemUri: string;
	createdAt: string;
	modifiedAt: string;
}
export interface PoemEntity {
	name: string;
	text: string;
	note: string;
}

export interface WorkspaceProps {
	poemProp: Omit<PoemEntity, 'note'>;
	noteProp: Pick<PoemEntity, 'note'>;
}

export interface PoemCacheRecord {
	cacheId?: number;
	poemId: string;
	name: string;
	createdAt: number;
	modifiedAt: number;
	poemSnippet: string;
	unsavedChanges: boolean;
}

export type MenuItem = { icon: ComponentType<Icon>; label: string; url: string };

export type ToolbarItem = { icon: ComponentType<Icon>; action: () => void; label: string };
