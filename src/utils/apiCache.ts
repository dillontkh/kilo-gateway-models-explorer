interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const DEFAULT_TTL = 3600000;

export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
  }
}

export function clearCache(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
  }
}

export function isCacheValid(key: string, ttl: number = DEFAULT_TTL): boolean {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return false;

    const entry: CacheEntry<unknown> = JSON.parse(cached);
    const age = Date.now() - entry.timestamp;
    return age < ttl;
  } catch {
    return false;
  }
}
