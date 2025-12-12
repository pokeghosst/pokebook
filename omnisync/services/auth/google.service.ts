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

import { randomUUIDv5, redis } from "bun";
import { GaxiosError } from "gaxios";
import type { Credentials } from "google-auth-library";
import { google } from "googleapis";
import { serverUrl } from "../..";
import { env } from "../../config/env";
import { GoogleError } from "../../errors/GoogleError";
import GoogleTokens from "../../models/GoogleTokens";
import { isNonEmptyString, isNumber } from "../../util";
import type { RequireNonNull } from "../../util/types";
import { RedisError } from "../../errors/RedisError";

type CallbackTokens = RequireNonNull<
  Credentials,
  "refresh_token" | "access_token" | "expiry_date"
>;

export function getGAuthUrl() {
  return getOAuth2Client().generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: true,
    prompt: "consent",
  });
}

export async function processCallback(code: string): Promise<string> {
  let tokens: Credentials;

  try {
    ({ tokens } = await getOAuth2Client().getToken(code));
  } catch (e: unknown) {
    mapCallbackError(e);
  }

  assertCallbackTokens(tokens);

  try {
    const sessionId = randomUUIDv5("book4.pokeghost.org", "url");
    await storeTokens(tokens, sessionId);

    return sessionId;
  } catch (e: unknown) {
    // Test and handle Redis errors
    throw new RedisError({
      name: "REDIS_UNKNOWN_ERROR",
      message: "Unknown Redis error occurred",
      cause: e,
    });
  }
}

async function storeTokens(tokens: CallbackTokens, sessionId: string) {
  const googleTokens = new GoogleTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expiry_date,
  });

  await redis.set(`google:${sessionId}`, googleTokens.stringify());
}

function assertCallbackTokens(
  tokens: Credentials
): asserts tokens is CallbackTokens {
  const { refresh_token, access_token, expiry_date } = tokens;

  if (
    !isNonEmptyString(refresh_token) ||
    !isNonEmptyString(access_token) ||
    !isNumber(expiry_date)
  ) {
    throw new GoogleError({
      name: "GOOGLE_CALLBACK_MISSING_TOKEN",
      message: "Could not construct required tokens from callback code",
    });
  }
}

function mapCallbackError(e: unknown): never {
  if (e instanceof GaxiosError) {
    const errorShort = e.response?.data?.error;

    switch (errorShort) {
      case "invalid_grant":
        throw new GoogleError({
          name: "GOOGLE_CALLBACK_INVALID_GRANT",
          message:
            "Google credentials for constructing a token are missing or expired",
          cause: e,
        });

      default:
        throw new GoogleError({
          name: "GOOGLE_CALLBACK_GAXIOS_UNKNOWN_ERROR",
          message:
            "Unknown error in Gaxios when processing Google callback token",
          cause: e,
        });
    }
  }

  throw new GoogleError({
    name: "GOOGLE_CALLBACK_UNKNOWN_ERROR",
    message: "Unknown error when processing Google callback token",
    cause: e,
  });
}

function getOAuth2Client() {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    serverUrl + "google/callback"
  );
}
