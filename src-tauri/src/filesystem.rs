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

use std::fs::{self, File};
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;
use tauri::ipc::Response;
use tauri::AppHandle;
use tauri::Manager;

#[tauri::command]
pub fn read_file(path: String) -> Response {
    let data = match std::fs::read(path) {
        Ok(file) => file,
        _ => return Response::new(vec![]),
    };

    tauri::ipc::Response::new(data)
}

fn get_file_path(app: AppHandle, path: String) -> Result<PathBuf, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    Ok(app_dir.join(path))
}

#[tauri::command]
pub fn write_file(app: AppHandle, path: String, data: String) -> Result<String, String> {
    let file_path = get_file_path(app, path)?;
    fs::create_dir_all(file_path.parent().unwrap_or(Path::new("."))).map_err(|e| e.to_string())?;

    let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
    file.write_all(data.as_bytes()).map_err(|e| e.to_string())?;

    Ok(file_path.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn is_file_exists(app: AppHandle, path: String) -> Result<bool, String> {
    let file_path = get_file_path(app, path)?;
    let p = Path::new(&file_path);

    println!(
        "Incoming path... {} exists? {}",
        file_path.display(),
        p.exists()
    );

    Ok(p.exists())
}

#[tauri::command]
pub fn mkdir(path: String) -> Result<(), String> {
    fs::create_dir(path).map_err(|e| e.to_string())
}
