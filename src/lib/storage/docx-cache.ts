"use client";

import Dexie, { type Table } from "dexie";

const CACHE_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface CacheEntry {
  submissionId: string;
  blob: Blob;
  timestamp: number;
}

class DocxCacheDB extends Dexie {
  cache!: Table<CacheEntry, string>;

  constructor() {
    super("docxCacheDB");
    this.version(1).stores({
      cache: "submissionId", // submissionId is the primary key
    });
  }
}

let dbInstance: DocxCacheDB | null = null;

function getDB(): DocxCacheDB {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is not available in server environment");
  }

  if (!dbInstance) {
    dbInstance = new DocxCacheDB();
  }

  return dbInstance;
}

export async function saveDocxToCache(submissionId: string, docxBlob: Blob): Promise<void> {
  try {
    const db = getDB();
    const entry: CacheEntry = {
      submissionId,
      blob: docxBlob,
      timestamp: Date.now(),
    };

    await db.cache.put(entry);
  } catch (error) {
    console.error("Error saving DOCX to cache:", error);
    // Don't throw - caching is optional
  }
}

export async function getDocxFromCache(submissionId: string): Promise<Blob | null> {
  try {
    const db = getDB();
    const entry = await db.cache.get(submissionId);

    if (!entry) {
      return null;
    }

    // Check if entry is expired
    const age = Date.now() - entry.timestamp;
    if (age > CACHE_EXPIRATION_MS) {
      // Entry expired, delete it
      await db.cache.delete(submissionId);
      return null;
    }

    return entry.blob;
  } catch (error) {
    console.error("Error getting DOCX from cache:", error);
    return null;
  }
}

export async function clearExpiredCache(): Promise<void> {
  try {
    const db = getDB();
    const now = Date.now();

    // Get all entries
    const allEntries = await db.cache.toArray();

    // Delete expired entries
    const expiredIds = allEntries
      .filter((entry) => now - entry.timestamp > CACHE_EXPIRATION_MS)
      .map((entry) => entry.submissionId);

    if (expiredIds.length > 0) {
      await db.cache.bulkDelete(expiredIds);
    }
  } catch (error) {
    console.error("Error clearing expired cache:", error);
  }
}
