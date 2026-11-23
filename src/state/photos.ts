import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Ваші фото страв. Зберігаються лише на цьому пристрої (IndexedDB:
 * localStorage для зображень замалий) і нікуди не надсилаються.
 * У резервну копію (текст) не входять — вона була б завеликою.
 */

const DB_NAME = 'gotuyu-sam-photos';
const STORE = 'photos';

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB недоступна'));
        return;
      }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }).catch((e) => {
      dbPromise = null; // наступного разу спробуємо знову
      throw e;
    });
  }
  return dbPromise;
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise<T>((resolve, reject) => {
    const t = d.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

// ── Підписка: щоб мініатюри всюди оновлювались одразу ───────────────

const subs = new Set<() => void>();
let version = 0;
let ids = new Set<string>();
let idsLoaded = false;

function emit() {
  version++;
  subs.forEach((f) => f());
}

function subscribe(f: () => void) {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}

const getVersion = () => version;

async function loadIds() {
  idsLoaded = true;
  try {
    ids = new Set((await run<IDBValidKey[]>('readonly', (s) => s.getAllKeys())).map(String));
  } catch {
    ids = new Set();
  }
  emit();
}

// ── API ─────────────────────────────────────────────────────────────

export function getOwnPhoto(id: string): Promise<Blob | undefined> {
  return run<Blob | undefined>('readonly', (s) => s.get(id));
}

export async function saveOwnPhoto(id: string, blob: Blob): Promise<void> {
  await run('readwrite', (s) => s.put(blob, id));
  ids = new Set(ids).add(id);
  emit();
}

export async function deleteOwnPhoto(id: string): Promise<void> {
  await run('readwrite', (s) => s.delete(id));
  ids = new Set(ids);
  ids.delete(id);
  emit();
}

export async function clearOwnPhotos(): Promise<void> {
  try {
    await run('readwrite', (s) => s.clear());
  } catch {
    /* сховища немає — нічого стирати */
  }
  ids = new Set();
  emit();
}

/** id рецептів, до яких є ваше фото. */
export function useOwnPhotoIds(): Set<string> {
  useSyncExternalStore(subscribe, getVersion);
  useEffect(() => {
    if (!idsLoaded) void loadIds();
  }, []);
  return ids;
}

/** Адреса вашого фото страви (object URL) або null. */
export function useOwnPhoto(id: string, enabled = true): string | null {
  const v = useSyncExternalStore(subscribe, getVersion);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setUrl(null);
      return;
    }
    let alive = true;
    let made: string | null = null;
    getOwnPhoto(id)
      .then((b) => {
        if (!alive) return;
        made = b ? URL.createObjectURL(b) : null;
        setUrl(made);
      })
      .catch(() => alive && setUrl(null));
    return () => {
      alive = false;
      if (made) URL.revokeObjectURL(made);
    };
  }, [id, enabled, v]);
  return url;
}

/**
 * Зменшує фото з камери до ~1280 px по довшій стороні (JPEG),
 * з урахуванням повороту з EXIF.
 */
export async function preparePhoto(file: Blob, max = 1280, quality = 0.82): Promise<Blob> {
  let src: ImageBitmap | HTMLImageElement;
  let w: number;
  let h: number;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    src = bmp;
    w = bmp.width;
    h = bmp.height;
  } catch {
    const img = await loadImage(file);
    src = img;
    w = img.naturalWidth;
    h = img.naturalHeight;
  }
  if (!w || !h) throw new Error('Порожнє зображення');
  const k = Math.min(1, max / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * k);
  canvas.height = Math.round(h * k);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas недоступний');
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  if ('close' in src) src.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Не вдалося стиснути фото'))), 'image/jpeg', quality),
  );
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Не вдалося відкрити зображення'));
    };
    img.src = url;
  });
}
