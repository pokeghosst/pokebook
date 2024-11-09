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

import { Match, Switch, type Component } from "solid-js";
import { usePoemList } from "../contexts/PoemListProvider";

const Stash: Component = () => {
  const [list] = usePoemList();

  return (
    <Switch>
      <Match when={list.poems.length > 0}>
        <div class="poem-list">
          {list.poems.map((poem) => (
            <div class="list-item">
              <a href="#">
                <div class="list-poem">
                  <p class="list-poem-name">{poem.name}</p>
                  <p class="list-poem-snippet">{poem.poemSnippet}</p>
                </div>
              </a>
              <div>
                {new Intl.DateTimeFormat("en-US").format(
                  new Date(poem.createdAt)
                )}
              </div>
            </div>
          ))}
        </div>
      </Match>
      <Match when={list.poems.length === 0}>
        <div class="placeholder-text-wrapper">
          Your stage is ready and the spotlight's on, but the verses are yet to
          bloom.
        </div>
      </Match>
    </Switch>
  );
};

export default Stash;
