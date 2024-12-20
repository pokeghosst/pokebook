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

import type { NotepadProps } from "@lib/types";

const Paper: Component<NotepadProps> = (props) => {
  return (
    <textarea
      class={`paper ${props.justification}`}
      classList={props.classList}
      onInput={props.inputHandler}
      value={props.text}
    ></textarea>
  );
};

export default Paper;
