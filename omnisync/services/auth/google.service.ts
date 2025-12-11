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
import { serverUrl } from "../..";
import { env } from "../../config/env";
import { GoogleError } from "../../errors/GoogleError";
import CloudToken from "../../models/CloudToken";
import { isNonEmptyString, isNumber } from "../../util";

export function getGAuthUrl() {
  return getOAuth2Client().generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: true,
    prompt: "consent",
  });
}

export async function processCallback(code: string): Promise<CloudToken> {
  const { tokens } = await getOAuth2Client().getToken(code);
  const { refresh_token, access_token, expiry_date } = tokens;

  if (
    !isNonEmptyString(refresh_token) ||
    !isNonEmptyString(access_token) ||
    !isNumber(expiry_date)
  ) {
    throw new GoogleError({
      name: "GOOGLE_CALLBACK_MISSING_TOKEN",
      message: "Could not construct tokens from callback code",
    });
  }

  return new CloudToken(refresh_token, access_token, expiry_date);
}

function getOAuth2Client() {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    serverUrl + "google/callback"
  );
}
