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

import { z } from "zod";

export const poemSchema = z.object({
  name: z.string().nonempty("Name is required"),
  text: z.string().nonempty("Text is required"),
  note: z.string().nonempty("Note is required"),
});

export const poemFileSchema = z.object({
  name: z.string().nonempty("Name is required"),
  uri: z.string().nonempty("URI is required"),
  timestamp: z.string(),
});

export const manifestResponseSchema = z.object({
  manifest: z.string().min(1, "Manifest cannot be empty"),
});

export const poemRecordSchema = z.object({
  id: z.string().nonempty("ID is required"),
  name: z.string().nonempty("Name is required"),
  text: z.string().nonempty("Text is required"),
  note: z.string().nonempty("Note is required"),
  snippet: z.string().nonempty("Snippet is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
  remoteId: z.string().optional(),
  syncState: z.string().nonempty("Sync state is required"),
});

export type Poem = z.infer<typeof poemSchema>;
export type PoemFile = z.infer<typeof poemFileSchema>;
export type ManifestResponse = z.infer<typeof manifestResponseSchema>;
export type PoemRecord = z.infer<typeof poemRecordSchema>;
export type PoemListItem = Pick<
  PoemRecord,
  "id" | "name" | "snippet" | "createdAt" | "updatedAt"
>;
