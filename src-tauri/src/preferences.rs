/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2026 Pokeghost.

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

use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub fn get_from_store(app: AppHandle, key: String) -> Result<Option<String>, String> {
    let store = app.store("pokebook.json").map_err(|e| e.to_string())?;

    Ok(store.get(key).and_then(|v| v.as_str().map(String::from)))
}

#[tauri::command]
pub fn set_to_store(app: AppHandle, key: String, value: String) -> Result<(), String> {
    let store = app.store("pokebook.json").map_err(|e| e.to_string())?;
    store.set(key, value);

    Ok(())
}

#[tauri::command]
pub fn delete_key_in_store(app: AppHandle, key: String) -> Result<(), String> {
    let store = app.store("pokebook.json").map_err(|e| e.to_string())?;

    store.delete(key);

    Ok(())
}

#[tauri::command]
pub fn clear_store(app: AppHandle) -> Result<(), String> {
    let store = app.store("pokebook.json").map_err(|e| e.to_string())?;

    store.clear();

    Ok(())
}
