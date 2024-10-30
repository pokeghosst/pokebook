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

import type { Component } from "solid-js";
import { createStore } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";
import { tauriStorage } from "@solid-primitives/storage/tauri";

import NoteNotepad from "@components/NoteNotepad";
import PoemNotepad from "@components/PoemNotepad";
import Workspace from "@components/Workspace";

const Draft: Component = () => {
  const draftPoemInit = {
    title: "Unnamed",
    content: "",
    note: "",
  };

  const storage = window.__TAURI_INTERNALS__ ? tauriStorage() : localStorage;

  const [draftPoem, setDraftPoem] = makePersisted(createStore(draftPoemInit), {
    name: "pokebook_draft",
    storage,
  });

  const draftPoemNotepad: Component = () => (
    <PoemNotepad
      title={draftPoem.title}
      text={draftPoem.content}
      titleInputHandler={(e) => setDraftPoem("title", e.currentTarget.value)}
      inputHandler={(e) => setDraftPoem("content", e.currentTarget.value)}
    />
  );
  const draftNoteNotepad: Component = () => (
    <NoteNotepad
      text={draftPoem.note}
      inputHandler={(e) => setDraftPoem("note", e.currentTarget.value)}
    />
  );
  return (
    <>
      <Workspace notepads={[draftPoemNotepad, draftNoteNotepad]} />
    </>
  );
};

export default Draft;
