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

import { createSignal, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePreferences } from "../contexts/PreferencesProvider";

import { ArrowRightLeft, ChevronsLeftRight } from "lucide-solid";

const Workspace: Component<{ notepads: Component[] }> = (props) => {
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const [pref, setPref] = usePreferences();
  const padState = () => JSON.parse(pref.writingPadState);

  function togglePoemPad() {
    setPref(
      "isFullWidthPad",
      pref.isFullWidthPad === "true" ? "false" : "true"
    );
  }

  // TODO: Make transition animation smoother
  function swapViews() {
    setIsTransitioning(true);
    setTimeout(function () {
      const state = JSON.parse(pref.writingPadState);
      [state[0], state[1]] = [state[1], state[0]];
      setPref("writingPadState", JSON.stringify(state));
      setIsTransitioning(false);
    }, 300);
  }

  return (
    <div
      class="workspace"
      classList={{
        "l-full-width": pref.isFullWidthPad === "true",
        transitioning: isTransitioning(),
      }}
    >
      <div class="notebook-container">
        <div class="notebook-container-toolbar">
          <button onclick={togglePoemPad}>
            <ChevronsLeftRight class="round-button" />
          </button>
          <button onClick={swapViews}>
            <ArrowRightLeft class="round-button" />
          </button>
        </div>
        <Dynamic component={props.notepads[padState()[0]]} />
      </div>
      <div class="notebook-container">
        <Dynamic component={props.notepads[padState()[1]]} />
      </div>
    </div>
  );
};

export default Workspace;
