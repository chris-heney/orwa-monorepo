interface CachedFile {
  id: string;
  file: File;
  timestamp: number;
  fieldName: string;
  facilityId: string;
}

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  timestamp: number;
  fieldName: string;
  facilityId: string;
}

const DB_NAME = 'GrantApplicationFileCache';
const DB_VERSION = 1;
const STORE_NAME = 'files';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
const CACHE_EXPIRY_DAYS = 30;

class FileCache {
  private db: IDBDatabase | null = null;

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('fieldName', 'fieldName');
        }
      };
    });
  }

  async saveFile(file: File, fieldName: string, facilityId: string): Promise<string> {
    if (file.size > MAX_FILE_SIZE) {
      console.warn(`File ${file.name} is too large (${file.size} bytes). Skipping cache.`);
      return '';
    }

    try {
      const db = await this.initDB();
      const id = `${fieldName}_${facilityId}_${file.name}_${Date.now()}`;
      
      const cachedFile: CachedFile = {
        id,
        file,
        timestamp: Date.now(),
        fieldName,
        facilityId,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(cachedFile);

        request.onsuccess = () => resolve(id);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Failed to save file to cache:', error);
      return '';
    }
  }

  async getFile(id: string): Promise<File | null> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          const result = request.result as CachedFile | undefined;
          if (result && this.isFileValid(result)) {
            resolve(result.file);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Failed to get file from cache:', error);
      return null;
    }
  }

  async saveFiles(files: File[], fieldName: string, facilityId: string): Promise<string[]> {
    const promises = files.map(file => this.saveFile(file, fieldName, facilityId));
    const results = await Promise.all(promises);
    return results.filter(id => id !== ''); // Remove failed saves
  }

  async getFiles(ids: string[]): Promise<File[]> {
    const promises = ids.map(id => this.getFile(id));
    const results = await Promise.all(promises);
    return results.filter((file): file is File => file !== null);
  }

  private isFileValid(cachedFile: CachedFile): boolean {
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return (now - cachedFile.timestamp) < expiryTime;
  }

  async cleanExpiredFiles(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      const now = Date.now();
      const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      const expiredBefore = now - expiryTime;
      
      const range = IDBKeyRange.upperBound(expiredBefore);
      const request = index.openCursor(range);
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Failed to clean expired files:', error);
    }
  }

  async getFileMetadata(): Promise<FileMetadata[]> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const files = request.result as CachedFile[];
          const metadata = files
            .filter(file => this.isFileValid(file))
            .map(file => ({
              id: file.id,
              name: file.file.name,
              size: file.file.size,
              type: file.file.type,
              timestamp: file.timestamp,
              fieldName: file.fieldName,
              facilityId: file.facilityId,
            }));
          resolve(metadata);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Failed to get file metadata:', error);
      return [];
    }
  }

  async clearCache(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.clear();
    } catch (error) {
      console.warn('Failed to clear file cache:', error);
    }
  }
}

export const fileCache = new FileCache(); 