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
  doc: z.instanceof(Uint8Array<ArrayBufferLike>),
});

export const poemMetaSchema = z.object({
  id: z.string().nonempty("ID is required"),
  name: z.string().nonempty("Name is required"),
  snippet: z.string().nonempty("Snippet is required"),
  createdAt: z.number(),
  updatedAt: z.number(),
  remoteId: z.string().optional(),
});

export const remoteFileListItemSchema = z.object({
  fileId: z.string().nonempty("File ID is required"),
  fileName: z.string().nonempty("File name is required"),
  syncStateHash: z.string().nonempty("Sync state hash is required"),
  stateVector: z.string().nonempty("State vector is required"),
});

// Sync operation schemas
export const clientDocumentMetadataSchema = z.object({
  documentId: z.string().nonempty("Document ID is required"),
  stateVector: z.string().nonempty("State vector is required"),
});

export const syncPlanResponseSchema = z.object({
  newRemoteDocuments: z.array(
    z.object({
      documentId: z.string(),
      fileId: z.string(),
      metadata: z.object({
        name: z.string(),
        snippet: z.string(),
        createdAt: z.number(),
        updatedAt: z.number(),
      }),
    })
  ),
  newLocalDocuments: z.array(
    z.object({
      documentId: z.string(),
    })
  ),
  documentsToSync: z.array(
    z.object({
      documentId: z.string(),
      localVector: z.string(),
      serverVector: z.string(),
      fileId: z.string(),
    })
  ),
});

export const pushUpdateSchema = z.object({
  documentId: z.string().nonempty("Document ID is required"),
  update: z.string().nonempty("Update is required"),
  newVector: z.string().nonempty("New vector is required"),
});

export const pullRequestSchema = z.object({
  documentId: z.string().nonempty("Document ID is required"),
  clientVector: z.string().nonempty("Client vector is required"),
});

export const exchangeUpdatesRequestSchema = z.object({
  pushUpdates: z.array(pushUpdateSchema),
  pullRequests: z.array(pullRequestSchema),
});

export const exchangeUpdatesResponseSchema = z.object({
  pullUpdates: z.array(
    z.object({
      documentId: z.string(),
      update: z.string(),
      newVector: z.string(),
    })
  ),
});

export const createDocumentRequestSchema = z.object({
  documentId: z.string().nonempty("Document ID is required"),
  initialState: z.string().nonempty("Initial state is required"),
  stateVector: z.string().nonempty("State vector is required"),
  metadata: z.object({
    name: z.string(),
    snippet: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
});

export type Poem = z.infer<typeof poemSchema>;
export type PoemRecord = z.infer<typeof poemRecordSchema>;
export type PoemMeta = z.infer<typeof poemMetaSchema>;
export type RemoteFileListItem = z.infer<typeof remoteFileListItemSchema>;
export type ClientDocumentMetadata = z.infer<
  typeof clientDocumentMetadataSchema
>;
export type SyncPlanResponse = z.infer<typeof syncPlanResponseSchema>;
export type PushUpdate = z.infer<typeof pushUpdateSchema>;
export type PullRequest = z.infer<typeof pullRequestSchema>;
export type ExchangeUpdatesRequest = z.infer<
  typeof exchangeUpdatesRequestSchema
>;
export type ExchangeUpdatesResponse = z.infer<
  typeof exchangeUpdatesResponseSchema
>;
export type CreateDocumentRequest = z.infer<typeof createDocumentRequestSchema>;

export { PoemDoc } from "./models/PoemDoc";
