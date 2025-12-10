/*
@pokebook/omnisync -- Syncing backend for PokeBook
Copyright (C) 2025 Pokeghost.

omnisync is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

omnisync is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { google } from "googleapis";
import { env } from "../../config/env";
import { serverUrl } from "../..";

export function getGAuthUrl() {
  return getOAuth2Client().generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: true,
    prompt: "consent",
  });
}

function getOAuth2Client() {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    serverUrl + "google/callback"
  );
}
