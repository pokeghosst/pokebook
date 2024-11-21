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

import { Eclipse, Menu, PencilRuler } from "lucide-solid";

import { usePreferences } from "../contexts/PreferencesProvider";

import type { Component } from "solid-js";
import { effect } from "solid-js/web";

const Header: Component = () => {
  const [pref, setPref] = usePreferences();

  function toggleSidebar() {
    setPref("isSidebarOpen", !pref.isSidebarOpen);
  }

  function toggleNightMode() {
    setPref("isNightMode", !pref.isNightMode);
  }

  // Something tells me doing this is stinky but I don't want to dig through CSS architecture so let's leave it as a legacy plug
  effect(() => {
    document.documentElement.className = pref.isNightMode
      ? pref.currentNightTheme
      : pref.currentDayTheme;
  });

  return (
    <div class="header-nav-wrapper">
      <button onClick={toggleSidebar}>
        <Menu />
      </button>
      <div class="header-icons">
        <button>
          <PencilRuler strokeWidth={1.7} />
        </button>
        <button onClick={toggleNightMode}>
          <Eclipse strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
};

export default Header;
