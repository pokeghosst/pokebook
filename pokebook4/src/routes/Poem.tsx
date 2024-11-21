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

import {
  createEffect,
  createResource,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";

import { useParams } from "@solidjs/router";

import { Filesystem } from "@lib/plugins/Filesystem";

import type { PoemEntity, ToolbarItem } from "@lib/types";
import { type Component } from "solid-js";

import NoteNotepad from "@components/NoteNotepad";
import PoemNotepad from "@components/PoemNotepad";
import Toolbar from "@components/Toolbar";
import Workspace from "@components/Workspace";

const Poem = () => {
  const params = useParams();
  const [loading, setLoading] = createSignal(true);
  const [poem, setPoem] = createStore({} as PoemEntity);

  onMount(async () => {
    const poemFile = (await Filesystem.readFile({ path: `/${params.id}.json` }))
      .data;
    setPoem(JSON.parse(poemFile as string) as PoemEntity);
    setLoading(false);
  });

  createEffect(() => {
    console.log("current poem state", JSON.stringify(poem));
    Filesystem.writeFile({
      path: `/${params.id}.tmp.json`,
      data: JSON.stringify(poem),
    });
  });

  const actions: ToolbarItem[] = [];

  const poemNotepad: Component = () => (
    <PoemNotepad
      title={poem.name}
      text={poem.text}
      titleInputHandler={(e) => setPoem("name", e.currentTarget.value)}
      inputHandler={(e) => setPoem("text", e.currentTarget.value)}
    />
  );
  const noteNotepad: Component = () => (
    <NoteNotepad
      text={poem.note}
      inputHandler={(e) => setPoem("note", e.currentTarget.value)}
    />
  );

  return (
    <Show when={!loading()} fallback={<div>Loading...</div>}>
      <div class="toolbar">
        <Toolbar actions={actions} />
      </div>
      <Workspace notepads={[poemNotepad, noteNotepad]} />
    </Show>
  );
};

export default Poem;
