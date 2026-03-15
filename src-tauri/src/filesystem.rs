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

use serde::Serialize;
use std::fs::{self, File};
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;
use std::time::UNIX_EPOCH;
use tauri::ipc::Response;
use tauri::AppHandle;
use tauri::Manager;

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub ctime: u64,
    pub uri: String,
}

#[tauri::command]
pub fn read_file(app: AppHandle, path: String) -> Result<Response, String> {
    let file_path = get_file_path(&app, path)?;
    let data = std::fs::read(&file_path).map_err(|e| e.to_string())?;

    Ok(tauri::ipc::Response::new(data))
}

#[tauri::command]
pub fn write_file(app: AppHandle, path: String, data: String) -> Result<String, String> {
    let file_path = get_file_path(&app, path)?;
    fs::create_dir_all(file_path.parent().unwrap_or(Path::new("."))).map_err(|e| e.to_string())?;

    let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
    file.write_all(data.as_bytes()).map_err(|e| e.to_string())?;

    Ok(file_path.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn is_file_exists(app: AppHandle, path: String) -> Result<bool, String> {
    let file_path = get_file_path(&app, path)?;
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

#[tauri::command]
pub fn readdir(app: AppHandle, path: String) -> Result<Vec<FileEntry>, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir_path = app_dir.join(&path);

    let entries = fs::read_dir(&dir_path).map_err(|e| e.to_string())?;
    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;

        let name = entry.file_name().to_string_lossy().into_owned();
        let full_path = entry.path().to_string_lossy().into_owned();
        let ctime = metadata
            .created()
            .map_err(|e| e.to_string())?
            .duration_since(UNIX_EPOCH)
            .map_err(|e| e.to_string())?
            .as_secs();

        files.push(FileEntry {
            name,
            ctime,
            uri: full_path,
        });
    }

    Ok(files)
}

#[tauri::command]
pub fn rename_file(app: AppHandle, from: String, to: String) -> Result<(), String> {
    let old = get_file_path(&app, from)?;
    let new = get_file_path(&app, to)?;
    fs::rename(old, new).map_err(|e| e.to_string())
}

fn get_file_path(app: &AppHandle, path: String) -> Result<PathBuf, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    Ok(app_dir.join(path))
}
