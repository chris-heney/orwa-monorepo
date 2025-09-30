interface SavedFormData {
  data: Record<string, any>;
  timestamp: number;
  stepIndex: number;
}

interface FileCacheReference {
  cacheId: string;
  title: string;
  timestamp: number;
}

const FORM_STORAGE_KEY = 'grant_application_form_data';

// File field names that should be excluded from persistence
const FILE_FIELDS = [
  'proposals',
  'uploaded_engineering_report', 
  'uploaded_notice_of_violation',
  'uploaded_additional_files',
  'consent_order'
];

const cleanDataForStorage = (data: Record<string, any>): Record<string, any> => {
  const cleanedData = { ...data };
  
  // Convert file fields to cache references
  FILE_FIELDS.forEach(field => {
    if (cleanedData[field]) {
      if (Array.isArray(cleanedData[field])) {
        // Handle array of files
        cleanedData[field] = cleanedData[field]
          .filter((file: any) => file?.cacheId) // Only keep files with cache IDs
          .map((file: any) => ({
            cacheId: file.cacheId,
            title: file.title,
            timestamp: Date.now()
          } as FileCacheReference));
      } else if (cleanedData[field]?.cacheId) {
        // Handle single file
        cleanedData[field] = {
          cacheId: cleanedData[field].cacheId,
          title: cleanedData[field].title,
          timestamp: Date.now()
        } as FileCacheReference;
      } else {
        // Remove files without cache IDs
        delete cleanedData[field];
      }
    }
  });
  
  return cleanedData;
};

export const saveFormData = (formData: Record<string, any>, stepIndex: number): void => {
  try {
    const cleanedData = cleanDataForStorage(formData);
    const dataToSave: SavedFormData = {
      data: cleanedData,
      timestamp: Date.now(),
      stepIndex,
    };
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
};

export const getSavedFormData = (): SavedFormData | null => {
  try {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (!savedData) return null;
    
    const parsedData = JSON.parse(savedData) as SavedFormData;
    
    // Check if data is older than 30 days (30 * 24 * 60 * 60 * 1000 ms)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - parsedData.timestamp > thirtyDaysInMs;
    
    if (isExpired) {
      clearSavedFormData();
      return null;
    }
    
    return parsedData;
  } catch (error) {
    console.warn('Failed to retrieve form data from localStorage:', error);
    return null;
  }
};

export const clearSavedFormData = (): void => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error);
  }
};

export const formatSavedDataTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getExcludedFileFields = (): string[] => {
  return [...FILE_FIELDS];
};

export const hasFileFields = (data: Record<string, any>): boolean => {
  return FILE_FIELDS.some(field => data[field] && (
    Array.isArray(data[field]) ? data[field].length > 0 : Boolean(data[field])
  ));
};

export const restoreFilesFromCache = async (data: Record<string, any>): Promise<Record<string, any>> => {
  const { fileCache } = await import('./fileCache');
  const restoredData = { ...data };
  
  for (const field of FILE_FIELDS) {
    if (restoredData[field]) {
      if (Array.isArray(restoredData[field])) {
        // Handle array of file cache references
        const cacheRefs = restoredData[field] as FileCacheReference[];
        const restoredFiles = [];
        
        for (const ref of cacheRefs) {
          const cachedFile = await fileCache.getFile(ref.cacheId);
          if (cachedFile) {
            restoredFiles.push({
              rawFile: cachedFile,
              src: URL.createObjectURL(cachedFile),
              title: ref.title,
              cacheId: ref.cacheId
            });
          }
        }
        
        restoredData[field] = restoredFiles;
      } else {
        // Handle single file cache reference
        const ref = restoredData[field] as FileCacheReference;
        const cachedFile = await fileCache.getFile(ref.cacheId);
        
        if (cachedFile) {
          restoredData[field] = {
            rawFile: cachedFile,
            src: URL.createObjectURL(cachedFile),
            title: ref.title,
            cacheId: ref.cacheId
          };
        } else {
          delete restoredData[field];
        }
      }
    }
  }
  
  return restoredData;
}; 