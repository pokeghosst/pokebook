import Dexie, { type EntityTable } from "dexie";

import { FilesystemFile } from "./FilesystemPlugin";

import type { PoemCacheRecord } from "@lib/types";

export class Database extends Dexie {
  public files!: EntityTable<FilesystemFile, "path">;
  public poemCache!: EntityTable<PoemCacheRecord, "cacheId">;

  private static instance: Database;

  private constructor() {
    super("PokeBook");
    this.version(1).stores({
      files: "path, content, ctime, mtime",
      poemCache:
        "++cacheId, name, createdAt, modifiedAt, poemSnippet, unsavedChanges",
    });

    this.files = this.table("files");
    this.poemCache = this.table("poemCache");
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const database = Database.getInstance();

export default database;
