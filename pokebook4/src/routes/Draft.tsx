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

import { createStore } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";
import { tauriStorage } from "@solid-primitives/storage/tauri";

import type { ToolbarItem } from "@lib/types";
import type { Component } from "solid-js";

import { FilePlus2 } from "lucide-solid";

import NoteNotepad from "@components/NoteNotepad";
import PoemNotepad from "@components/PoemNotepad";
import Toolbar from "@components/Toolbar";
import Workspace from "@components/Workspace";
import toast from "solid-toast";
import PoemManager from "@lib/plugins/PoemManager";

const Draft: Component = () => {
  const storage = window.__TAURI_INTERNALS__ ? tauriStorage() : localStorage;

  const [draftPoem, setDraftPoem] = makePersisted(
    createStore({
      title: "Unnamed",
      content: "",
      note: "",
    }),
    {
      name: "pokebook_draft",
      storage,
    }
  );

  const actions: ToolbarItem[] = [
    {
      icon: FilePlus2,
      action: async () => {
        await toast.promise(
          PoemManager.save({
            name: draftPoem.title,
            text: draftPoem.content,
            note: draftPoem.note,
          }),
          {
            loading: "loading",
            success: "saved",
            error: "error",
          }
        );
      },
      label: "Save",
    },
  ];

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
      <div class="toolbar">
        <Toolbar actions={actions} />
      </div>
      <Workspace notepads={[draftPoemNotepad, draftNoteNotepad]} />
    </>
  );
};

export default Draft;
