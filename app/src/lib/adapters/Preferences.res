/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

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

@val external globalThis: {..} = "globalThis"

let getWindow = () => globalThis["window"]->Nullable.toOption

let hasWindow = () => getWindow()->Option.isSome

let isTauri = () =>
  switch getWindow() {
  | None => false
  | Some(win) => win["__TAURI_INTERNALS__"]->Nullable.toOption->Option.isSome
  }

let loadPreferencesWeb = async () => {
  await import(PreferencesWeb.plugin)
}

let implPromise: ref<option<promise<PreferencesPlugin.t>>> = ref(None)

let loadImpl = (): promise<PreferencesPlugin.t> =>
  switch implPromise.contents {
  | Some(p) => p
  | None =>
    let p = if !hasWindow() {
      Promise.reject(Failure("Preferences: window is not available (SSR import?)"))
    } else if isTauri() {
      Promise.reject(Failure("Preferences: Tauri adapter not implemented"))
    } else {
      loadPreferencesWeb()
    }
    implPromise := Some(p)
    p
  }

let withImpl = f => loadImpl()->Promise.then(f)

@genType
let api: PreferencesPlugin.t = {
  get: opts => withImpl(impl => impl.get(opts)),
  set: opts => withImpl(impl => impl.set(opts)),
  remove: opts => withImpl(impl => impl.remove(opts)),
  clear: () => withImpl(impl => impl.clear()),
}
