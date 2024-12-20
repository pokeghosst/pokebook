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

import { lazy } from "solid-js";
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";

import { PreferencesProvider } from "./contexts/PreferencesProvider";

import App from "./App";

import "./sass/main.scss";

import { PoemListProvider } from "./contexts/PoemListProvider";
const Draft = lazy(() => import("./routes/Draft"));
const Stash = lazy(() => import("./routes/Stash"));
const Poem = lazy(() => import("./routes/Poem"));
const Settings = lazy(() => import("./routes/Settings"));

render(
  () => (
    <PreferencesProvider>
      <PoemListProvider>
        <Router root={App}>
          <Route path="/" component={Draft} />
          <Route path="/poems" component={Stash} />
          <Route path="/poem/:id" component={Poem} />
          <Route path="/settings" component={Settings} />
        </Router>
      </PoemListProvider>
    </PreferencesProvider>
  ),
  document.getElementById("root") as HTMLElement
);
