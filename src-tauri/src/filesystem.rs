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

use std::fs::File;
use std::io::prelude::*;
use tauri::AppHandle;

#[derive(serde::Deserialize)]
pub enum Encoding {
    #[serde(rename = "utf8")]
    Utf8,
    #[serde(rename = "ascii")]
    Ascii,
    #[serde(rename = "utf16")]
    Utf16,
}

// #[tauri::command]
// pub fn read_file(
//     app: AppHandle,
//     path: String,
//     encoding: Option<Encoding>,
//     offset: Option<u64>,
//     length: Option<usize>,
// ) -> Result<String, String> {
//     Ok()
// }

#[tauri::command]
pub fn write_file(
    app: AppHandle,
    path: String,
    data: String,
    encoding: Option<Encoding>,
    recursive: Option<bool>,
) -> Result<String, String> {
    let mut file = File::create("foo.txt").map_err(|e| e.to_string())?;
    file.write_all(b"Hello, world!")
        .map_err(|e| e.to_string())?;

    print!("Wrote file...");

    Ok(String::from("foo.txt"))
}
