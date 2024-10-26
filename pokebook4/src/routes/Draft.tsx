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

import PoemPad from "@components/PoemPad";
import { createPersistentStore } from "@lib/hooks/createPersistentStore";

const Draft: Component = () => {
  const draftPoemInit = {
    title: "Unnamed",
    content: "init",
    note: "",
  };

  /*
   ~Just keep this in mind for now and revise when Tauri is implemented~
   This shouldn't be a big problem considering we're using local storage for stores,
   But since the operation is async, this may possibly cause a delay between the initial value
   and the value retrieved from Preferences plugin. If long enough, this may cause an issue when
   the user starts writing (unaware that the value hasn't been retrieved yet) and then their value
   is overwritten by whatever was retrieved from the Preferences. Again, this isn't a likely problem,
   but may become one. In this case, we should add a value check (e.g. init with null or undefined)
   and render once the store is populated.
  */
  const [draftPoem, setDraftPoem] = createPersistentStore(draftPoemInit);

  return (
    <>
      <PoemPad
        title={draftPoem.title}
        text={draftPoem.content}
        titleInputHandler={(e) => setDraftPoem("title", e.currentTarget.value)}
        inputHandler={(e) => setDraftPoem("content", e.currentTarget.value)}
      />
      {/* <Notepad
        value={draftPoem.note}
        inputHandler={(e) => setDraftPoem("note", e.currentTarget.value)}
      /> */}
    </>
  );
};

export default Draft;
