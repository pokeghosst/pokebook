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

export const poemRecordSchema = z.object({
  id: z.string().nonempty("ID is required"),
  name: z.string().nonempty("Name is required"),
  text: z.string().nonempty("Text is required"),
  note: z.string().nonempty("Note is required"),
  snippet: z.string().nonempty("Snippet is required"),
  createdAt: z.number(),
  updatedAt: z.number(),
  remoteId: z.string().optional(),
  syncState: z.string().nonempty("Sync state is required"),
  syncStateHash: z.string().nonempty("Sync state hash is required"),
});

export const remoteFileListItemSchema = z.object({
  fileId: z.string().nonempty("File ID is required"),
  fileName: z.string().nonempty("File name is required"),
  syncStateHash: z.string().nonempty("Sync state hash is required"),
});

export type Poem = z.infer<typeof poemSchema>;
export type PoemRecord = z.infer<typeof poemRecordSchema>;
export type PoemListItem = Pick<
  PoemRecord,
  | "id"
  | "name"
  | "snippet"
  | "createdAt"
  | "updatedAt"
  | "remoteId"
  | "syncStateHash"
>;
export type RemoteFileListItem = z.infer<typeof remoteFileListItemSchema>;
