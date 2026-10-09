import { CatchUpAnalysis } from '../types';

export interface SavedSession {
  id: string;
  title: string;
  context: string;
  createdAt: number;
  messageCount: number;
  actionCount: number;
  decisionCount: number;
  analysis: CatchUpAnalysis;
}

const DB_NAME = 'MissIQ_LocalDB';
const DB_VERSION = 1;
const STORE_NAME = 'conversation_history';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSessionToLocalDB(analysis: CatchUpAnalysis, context: string = 'general'): Promise<string> {
  try {
    const db = await openDB();
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const title = analysis.summary.keyThemes[0] || `Catch-up (${analysis.summary.totalMessagesCount} messages)`;

    const record: SavedSession = {
      id,
      title,
      context,
      createdAt: Date.now(),
      messageCount: analysis.summary.totalMessagesCount,
      actionCount: analysis.actionItems.length,
      decisionCount: analysis.decisions.length,
      analysis,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save skipped:', err);
    return '';
  }
}

export async function getSavedSessions(): Promise<SavedSession[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = req.result as SavedSession[];
        // Sort descending by created date
        results.sort((a, b) => b.createdAt - a.createdAt);
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function deleteSessionFromDB(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

export async function clearAllLocalSessions(): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}
