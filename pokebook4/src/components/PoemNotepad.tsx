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

import type { PoemPadProps } from "@lib/types";
import type { Component } from "solid-js";

import { usePreferences } from "../contexts/PreferencesProvider";

import Paper from "./Paper";

const PoemNotepad: Component<PoemPadProps> = (props) => {
  const [pref, setPref] = usePreferences();

  return (
    <div class="notebook">
      <div class="notebook-header">
        <input
          type="text"
          // TODO: Don't forget to sanitize this
          value={props.title}
          onInput={props.titleInputHandler}
          placeholder="Unnamed"
        ></input>
      </div>
      <Paper
        justification={pref.poemPadJustification}
        text={props.text}
        inputHandler={props.inputHandler}
      />
    </div>
  );
};

export default PoemNotepad;
