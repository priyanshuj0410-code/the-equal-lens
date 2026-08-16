// The reels library: recorded clips persisted in IndexedDB, so a child's takes survive a
// reload without a byte ever leaving the machine. Raw IndexedDB rather than a dependency;
// the store is one object shape and three operations.

export type Reel = {
  id: string;
  createdAt: number;
  mime: string;
  blob: Blob;
  poster: string; // small JPEG data URL captured at record stop
};

const DB = "equal-lens-reels";
const STORE = "clips";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = run(t.objectStore(STORE));
        let result: T;
        req.onsuccess = () => {
          result = req.result;
        };
        // Settle on the transaction, not the request: oncomplete means durably committed,
        // and onabort covers request errors and commit-time aborts (quota) alike.
        t.oncomplete = () => {
          db.close();
          resolve(result);
        };
        t.onabort = () => {
          db.close();
          reject(t.error ?? req.error ?? new DOMException("Transaction aborted", "AbortError"));
        };
      }),
  );
}

export async function saveReel(reel: Reel): Promise<void> {
  await tx("readwrite", (s) => s.put(reel));
}

export async function listReels(): Promise<Reel[]> {
  const all = await tx<Reel[]>("readonly", (s) => s.getAll() as IDBRequest<Reel[]>);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteReel(id: string): Promise<void> {
  await tx("readwrite", (s) => s.delete(id));
}

export function reelDate(reel: Reel): string {
  return new Date(reel.createdAt).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
