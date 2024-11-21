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

import { createContext, useContext, type ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

import { tauriStorage } from "@solid-primitives/storage/tauri";
import { makePersisted } from "@solid-primitives/storage";

const storage = window.__TAURI_INTERNALS__ ? tauriStorage() : localStorage;

const preferencesInit = {
  isFullWidthPad: false,
  isSidebarOpen: true,
  isNightMode: false,
  writingPadState: "[0,1]",
  poemPadJustification: "left",
  // TODO: make it camel case later
  storage_mode: "local",
  currentDayTheme: "neo-day",
  currentNightTheme: "neo-night",
};

type PreferencesType = typeof preferencesInit;

type PreferencesContextType<T extends Record<string, any>> = [
  preferences: T,
  setPreference: (key: keyof T, value: any) => void,
];

export const PreferencesContext =
  createContext<PreferencesContextType<PreferencesType>>();

export const PreferencesProvider: ParentComponent = (props) => {
  const [preferences, setPreferences] = makePersisted(
    createStore(preferencesInit),
    {
      name: "pokebook_preferences",
      storage,
    }
  );

  return (
    <PreferencesContext.Provider value={[preferences, setPreferences]}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
};
