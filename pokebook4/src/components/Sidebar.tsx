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
import { Dynamic } from "solid-js/web";

import { usePreferences } from "../contexts/PreferencesProvider";

import { LibraryBig, Settings, SquarePen } from "lucide-solid";

const navMenuItems = [
  {
    icon: SquarePen,
    label: "Draft",
    url: "/",
  },
  {
    icon: LibraryBig,
    label: "Poems",
    url: "/stash",
  },
  {
    icon: Settings,
    label: "Settings",
    url: "/settings",
  },
];

const Sidebar: Component = () => {
  const [pref, setPref] = usePreferences();

  function closeSidebar() {
    setPref("isSidebarOpen", "false");
  }

  return (
    <div class="sidebar-nav-wrapper">
      <div
        class="sidebar-close-area"
        classList={{ "sidebar-nav--open": pref.isSidebarOpen === "true" }}
        onclick={closeSidebar}
        role="button"
        tabIndex="0"
      ></div>
      <div
        class="sidebar"
        classList={{ "sidebar-nav--open": pref.isSidebarOpen === "true" }}
      >
        <div class="sidebar-nav-items">
          <For each={navMenuItems}>
            {(item) => (
              <a href={item.url}>
                <div class="list-item">
                  <Dynamic component={item.icon} />
                  {item.label}
                </div>
              </a>
            )}
          </For>
        </div>
        <div class="sidebar-footer">
          <button>Keyboard Shortcuts</button>
          <ul>
            <li>
              <button>About & Feedback</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
