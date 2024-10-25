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

import type { Component, JSX } from "solid-js";

import WritingPad from "../components/WritingPad";
import { createPersistentSignal } from "../hooks/createPersistentSignal";

const Draft: Component = () => {
  const [draftPoemContent, setDraftPoemContent] = createPersistentSignal(
    "draft_poem_text",
    ""
  );
  const [draftPoemName, setDraftPoemName] = createPersistentSignal(
    "draft_poem_name",
    ""
  );
  const [draftPoemNote, setDraftPoemNote] = createPersistentSignal(
    "draft_poem_note",
    ""
  );

  const handleDraftPoemInput: JSX.EventHandler<
    HTMLTextAreaElement,
    InputEvent
  > = (event) => {
    setDraftPoemContent(event.currentTarget.value);
  };

  const handleDraftPoemNameInput: JSX.EventHandler<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    setDraftPoemName(event.currentTarget.value);
  };

  const handleDraftNoteInput: JSX.EventHandler<
    HTMLTextAreaElement,
    InputEvent
  > = (event) => {
    setDraftPoemNote(event.currentTarget.value);
  };

  return (
    <>
      <input
        type="text"
        value={draftPoemName()}
        onInput={handleDraftPoemNameInput}
      />
      <WritingPad
        value={draftPoemContent}
        inputHandler={handleDraftPoemInput}
      />
      <WritingPad value={draftPoemNote} inputHandler={handleDraftNoteInput} />
    </>
  );
};

export default Draft;
