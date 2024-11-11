/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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

import { createEffect, createResource, Show } from "solid-js";

import { useParams } from "@solidjs/router";

import { Filesystem } from "@lib/plugins/Filesystem";

import type { PoemEntity, ToolbarItem } from "@lib/types";
import { type Component } from "solid-js";

import NoteNotepad from "@components/NoteNotepad";
import PoemNotepad from "@components/PoemNotepad";
import Toolbar from "@components/Toolbar";
import Workspace from "@components/Workspace";

const fetchPoem = async (id: string) =>
  (await Filesystem.readFile({ path: `/${id}.json` })).data;
const Poem = () => {
  const params = useParams();
  const [poem] = createResource(params.id, fetchPoem);

  const parsedPoem = () =>
    poem() ? (JSON.parse(poem() as string) as PoemEntity) : ({} as PoemEntity);

  const actions: ToolbarItem[] = [];

  const poemNotepad: Component = () => (
    <PoemNotepad
      title={parsedPoem().name}
      text={parsedPoem().text}
      titleInputHandler={(e) => {}}
      inputHandler={(e) => {}}
    />
  );
  const noteNotepad: Component = () => (
    <NoteNotepad text={parsedPoem().note} inputHandler={(e) => {}} />
  );

  return (
    <Show when={poem()}>
      <div class="toolbar">
        <Toolbar actions={actions} />
      </div>
      <Workspace notepads={[poemNotepad, noteNotepad]} />
    </Show>
  );
};

export default Poem;
