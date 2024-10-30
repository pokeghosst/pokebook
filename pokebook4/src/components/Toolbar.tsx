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

import { For, type Component } from "solid-js";

import { usePreferences } from "./PreferencesProvider";

import type { ToolbarItem } from "@lib/types";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-solid";
import { Dynamic } from "solid-js/web";

const Toolbar: Component<{ actions: ToolbarItem[] }> = (props) => {
  const [pref, setPref] = usePreferences();

  return (
    <div class="toolbar-menu">
      <div class="button-group">
        <button
          onClick={() => setPref("poemPadJustification", "left")}
          class="button"
          classList={{ active: pref.poemPadJustification === "left" }}
        >
          <AlignLeft />
        </button>
        <button
          onClick={() => setPref("poemPadJustification", "center")}
          class="button"
          classList={{ active: pref.poemPadJustification === "center" }}
        >
          <AlignCenter />
        </button>
        <button
          onClick={() => setPref("poemPadJustification", "right")}
          class="button"
          classList={{ active: pref.poemPadJustification === "right" }}
        >
          <AlignRight />
        </button>
      </div>
      <For each={props.actions}>
        {(action) => (
          <button class="button" onClick={() => action.action()}>
            <Dynamic component={action.icon} />
            {action.label}
          </button>
        )}
      </For>
    </div>
  );
};

export default Toolbar;
