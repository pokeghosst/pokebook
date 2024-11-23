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

import { createSignal, For, type Component } from "solid-js";

import { usePreferences } from "../contexts/PreferencesProvider";
import { usePoemList } from "../contexts/PoemListProvider";

import { LibraryBig, Settings, SquarePen } from "lucide-solid";
import RelativeTime from "./RelativeTime";

const navMenuItems = [
  {
    icon: SquarePen,
    label: "Draft",
    url: "/",
  },
  {
    icon: LibraryBig,
    label: "Poems",
    url: "/poems",
  },
  {
    icon: Settings,
    label: "Settings",
    url: "/settings",
  },
];

const Sidebar: Component = () => {
  const [pref, setPref] = usePreferences();
  const [poemList] = usePoemList();

  return (
    <div class="sidebar-nav-wrapper">
      <div
        class="sidebar"
        classList={{
          "sidebar-nav--open": pref.isSidebarOpen,
        }}
      >
        <div class="sidebar-nav-items">
          <div class="poem-list">
            <For each={poemList.poems}>
              {(poem) => (
                <div class="list-item">
                  <a
                    href={`/poem/${poem.poemId}`}
                    onclick={() => {
                      setPref("isSidebarOpen", false);
                    }}
                  >
                    <div class="list-poem">
                      <p class="list-poem-name">{poem.name}</p>
                      <p class="list-poem-snippet">{poem.poemSnippet}</p>
                    </div>
                    <div>
                      <RelativeTime date={poem.createdAt} />
                    </div>
                  </a>
                </div>
              )}
            </For>
          </div>
          {/* <For each={navMenuItems}>
            {(item) => (
              <a href={item.url}>
                <div class="list-item">
                  <Dynamic component={item.icon} />
                </div>
              </a>
            )}
          </For> */}
        </div>
        {/* <div class="sidebar-footer">
          <button>Keyboard Shortcuts</button>
          <ul>
            <li>
              <button>About & Feedback</button>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
