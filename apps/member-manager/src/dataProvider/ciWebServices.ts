import { stringify } from 'query-string';
import { DataProvider } from 'react-admin';
import { config } from '../config';

const apiUrl = config.VITE_API_URL;

interface Params {
    pagination?: {
        page: number;
        perPage: number;
    };
    sort?: {
        field: string;
        order: string;
    };
    filter?: any;
}

interface StrapiRecord {
    id: number | string;
    [key: string]: any;
}

// Utility function to transform relationships for React Admin
const transformRelationships = (data: any): any => {
    if (!data) return data;

    const transformed = { ...data };

    // Loop through all properties
    Object.entries(data).forEach(([key, value]) => {
        // If it's an array and contains objects with IDs, transform to array of IDs
        if (
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === 'object' &&
            'id' in value[0]
        ) {
            transformed[key] = value.map(
                (item: { id: number | string }) => item.id
            );
        }
        // If it's a single object with an ID, transform to just the ID
        else if (value && typeof value === 'object' && 'id' in value) {
            transformed[key] = value.id;
        }
    });

    return transformed;
};

const buildQuery = (params: Params): string => {
    const queryParts: string[] = [];

    // Handle filters
    if (params.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Handle array values like ids for $in operator
                value.forEach(val => {
                    queryParts.push(`filters[${key}][$in]=${val}`);
                });
            } else if (typeof value === 'object' && value !== null) {
                // Handle nested filters
                Object.entries(value).forEach(([operator, operatorValue]) => {
                    if (Array.isArray(operatorValue)) {
                        operatorValue.forEach(val => {
                            queryParts.push(
                                `filters[${key}][${operator}]=${val}`
                            );
                        });
                    } else {
                        queryParts.push(
                            `filters[${key}][${operator}]=${operatorValue}`
                        );
                    }
                });
            } else {
                // Handle simple equality filters
                queryParts.push(`filters[${key}]=${value}`);
            }
        });
    }

    // Handle pagination
    if (params.pagination) {
        const { page, perPage } = params.pagination;
        queryParts.push(`page=${page}`);
        queryParts.push(`pageSize=${perPage}`);
    }

    // Handle sorting
    if (params.sort) {
        const { field, order } = params.sort;
        queryParts.push(`sort=${field}:${order.toLowerCase()}`);
    }

    return queryParts.join('&');
};

const cache: { [key: string]: any } = {};

// Export cache clearing function for manual cache invalidation
export const clearResourceCache = (resource: string) => {
    Object.keys(cache).forEach(key => {
        if (key.startsWith(`${resource}_`)) {
            delete cache[key];
        }
    });
};

// Helper function to detect if a value is a file object
const isFileObject = (value: any): boolean => {
    return value && 
           typeof value === 'object' && 
           (value.rawFile || value.src) && 
           value.title;
};

// Ensure bucket and nested folders exist by progressively creating folder prefixes
const ensureBucketAndFolders = async (bucketName: string, folderPath?: string) => {
    if (!bucketName) return;
    if (!folderPath) {
        // Creating the bucket is handled inside the folders API as well; no-op here
        return;
    }
    const segments = folderPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    let acc = '';
    for (const seg of segments) {
        acc = acc ? `${acc}/${seg}` : seg;
        await fetch(`${config.VITE_ASSET_API_URL}/folders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ bucketName, folderPath: acc }),
        }).catch(() => undefined); // idempotent; ignore race/errors for existing folders
    }
};

// Parse a bucket spec that may include a nested path like "organization/Acme/logos"
const parseBucketAndFolder = (spec: string, explicitFolderPath?: string): { bucket: string; folderPath?: string } => {
    if (!spec) return { bucket: 'default' };
    if (explicitFolderPath) return { bucket: spec, folderPath: explicitFolderPath };
    const cleaned = spec.replace(/^\/+|\/+$/g, '');
    const parts = cleaned.split('/');
    if (parts.length === 1) return { bucket: parts[0] };
    const [bucket, ...rest] = parts;
    return { bucket, folderPath: rest.join('/') };
};

// Helper function to upload a file and return the ID
const uploadFileToContent = async (fileData: any, bucketSpec: string = 'default', folderPath?: string): Promise<number> => {
    if (!fileData.rawFile) {
        throw new Error('No file data found');
    }

    // Create a File object from the raw file data
    let file: File;
    
    if (fileData.rawFile instanceof File) {
        file = fileData.rawFile;
    } else if (fileData.rawFile.path) {
        // If we have a path, we need to fetch the file content
        const response = await fetch(fileData.src);
        const blob = await response.blob();
        file = new File([blob], fileData.title, { type: blob.type });
    } else {
        throw new Error('Unable to process file data');
    }

    // Determine bucket/folder from spec
    const { bucket, folderPath: derived } = parseBucketAndFolder(bucketSpec, folderPath);

    // Ensure bucket and folders exist (also creates DB folder records)
    await ensureBucketAndFolders(bucket, derived);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketName', bucket);
    formData.append('description', '');
    formData.append('tags', JSON.stringify([]));
    if (derived) formData.append('folderPath', derived);

    const response = await fetch(`${config.VITE_ASSET_API_URL}/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`File upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.id;
};

// Helper function to process payload and upload files
const processFilesInPayload = async (data: any): Promise<any> => {
    const processedData = { ...data };
    
    // Look for file fields in the payload
    for (const [key, value] of Object.entries(data)) {
        if (isFileObject(value)) {
            try {
                // Determine bucket name based on field name or use default
                let bucketName = 'default';
                if (key.toLowerCase().includes('logo')) {
                    bucketName = 'logos';
                } else if (key.toLowerCase().includes('image')) {
                    bucketName = 'images';
                } else if (key.toLowerCase().includes('document')) {
                    bucketName = 'documents';
                }

                console.log("value", value);
                
                console.log(`Uploading file for field ${key} to bucket ${bucketName}`);
                const fileId = await uploadFileToContent(value, bucketName);
                processedData[key] = fileId;
                console.log(`File uploaded successfully, ID: ${fileId}`);
            } catch (error) {
                console.error(`Failed to upload file for field ${key}:`, error);
                throw new Error(`Failed to upload file for ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
    
    return processedData;
};

const ciwsDataProvider: DataProvider = {
    getList: (resource, params) => {
        if (!params.pagination) {
            throw new Error('Pagination is required');
        }

        // Special handling for deck/steps/available endpoint
        if (resource === 'deck/steps/available') {
            const url = `${apiUrl.replace('/api/v1', '')}/deck/steps/available`;
            return fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(response => {
                    return {
                        data: response.data || [],
                        total: response.data?.length || 0,
                    };
                });
        }

        const queryString = buildQuery({
            pagination: params.pagination,
            sort: params.sort,
            filter: params.filter,
        });

        // Add populate if it exists in meta
        const populate = params.meta?.populate;
        const raw = params.meta?.raw;
        const publish = params.meta?.publish as string[] | undefined;
        const populateQuery = populate ? `&populate=${populate}` : '';
        const publishQuery = Array.isArray(publish)
            ? publish
                  .map(t => `&publish[]=${encodeURIComponent(t)}`)
                  .join('')
            : '';

        const url = `${apiUrl}/${resource}?${queryString}${populateQuery}${publishQuery}`;
        const cacheKey = `${resource}_list_${queryString}${populateQuery}${publishQuery}`;

        if (cache[cacheKey]) {
            return Promise.resolve(cache[cacheKey]);
        }

        return fetch(url)
            .then(response => response.json())
            .then(response => {
                // Ensure data is always an array
                const data = Array.isArray(response.data)
                    ? response.data
                    : [response.data].filter(Boolean);

                // Transform relationships in each item
                const transformedData = raw
                    ? data
                    : data.map((item: StrapiRecord) =>
                          transformRelationships(item)
                      );

                const result = {
                    data: transformedData,
                    total: response.meta?.pagination?.total || data.length,
                };
                cache[cacheKey] = result;
                return result;
            });
    },

    getOne: (resource, params) => {
        // Add populate/publish if it exists in meta
        const populate = params.meta?.populate;
        const publish = params.meta?.publish as string[] | undefined;
        const populateQuery = populate ? `?populate=${populate}` : '';
        const publishQuery = Array.isArray(publish)
            ? `${populateQuery ? '&' : '?'}${publish
                  .map(t => `publish[]=${encodeURIComponent(t)}`)
                  .join('&')}`
            : '';
        const raw = params.meta?.raw;

        const url = `${apiUrl}/${resource}/${params.id}${populateQuery}${publishQuery}`;
        const cacheKey = `${resource}_one_${params.id}${populateQuery}${publishQuery}`;

        if (cache[cacheKey]) {
            return Promise.resolve(cache[cacheKey]);
        }

        return fetch(url)
            .then(response => response.json())
            .then(response => {
                const data = Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;

                // Transform relationships
                const transformedData = raw
                    ? data
                    : transformRelationships(data);

                const result = { data: transformedData };
                cache[cacheKey] = result;
                return result;
            });
    },

    getMany: (resource, params) => {
        // Extract just the IDs from the params, handling both simple IDs and objects with id property
        const ids = params.ids
            .map((idOrObject: string | number | { id: string | number }) => {
                if (typeof idOrObject === 'object' && idOrObject !== null) {
                    return idOrObject.id;
                }
                return idOrObject;
            })
            .filter((id): id is string | number => id !== undefined);

        // Build the filter string manually to ensure proper format
        const filterStr = ids.map(id => `filters[id][$in]=${id}`).join('&');

        // Add populate if it exists in meta
        const populate = params.meta?.populate;
        const publish = params.meta?.publish as string[] | undefined;
        const populateQuery = populate ? `&populate=${populate}` : '';
        const publishQuery = Array.isArray(publish)
            ? publish
                  .map(t => `&publish[]=${encodeURIComponent(t)}`)
                  .join('')
            : '';

        const url = `${apiUrl}/${resource}?${filterStr}${populateQuery}${publishQuery}`;
        const cacheKey = `${resource}_many_${JSON.stringify(
            ids
        )}${populateQuery}${publishQuery}`;

        if (cache[cacheKey]) {
            return Promise.resolve(cache[cacheKey]);
        }

        return fetch(url)
            .then(response => response.json())
            .then(response => {
                // Ensure data is always an array
                const data = Array.isArray(response.data)
                    ? response.data
                    : [response.data].filter(Boolean);

                // Transform relationships in each item
                const transformedData = data.map((item: StrapiRecord) =>
                    transformRelationships(item)
                );

                const result = { data: transformedData };
                cache[cacheKey] = result;
                return result;
            });
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        // Build query parameters manually
        const queryParts = [];

        // Add target filter
        queryParts.push(`filters[${params.target}]=${params.id}`);

        // Add pagination
        queryParts.push(`page=${page}`);
        queryParts.push(`pageSize=${perPage}`);

        // Add sorting
        queryParts.push(`sort=${field}:${order.toLowerCase()}`);

        // Add additional filters
        if (Object.keys(params.filter).length > 0) {
            Object.entries(params.filter).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v =>
                        queryParts.push(`filters[${key}][$in][]=${v}`)
                    );
                } else {
                    queryParts.push(`filters[${key}]=${value}`);
                }
            });
        }

        // Add populate if it exists in meta
        const populate = params.meta?.populate;
        const publish = params.meta?.publish as string[] | undefined;
        if (populate) {
            queryParts.push(`populate=${populate}`);
        } else {
            queryParts.push('populate=*');
        }
        if (Array.isArray(publish)) {
            publish.forEach(t => queryParts.push(`publish[]=${encodeURIComponent(t)}`));
        }

        const url = `${apiUrl}/${resource}?${queryParts.join('&')}`;
        const cacheKey = `${resource}_manyReference_${queryParts.join('&')}`;

        if (cache[cacheKey]) {
            return Promise.resolve(cache[cacheKey]);
        }

        return fetch(url)
            .then(response => response.json())
            .then(response => {
                // Ensure data is always an array
                const data = Array.isArray(response.data)
                    ? response.data
                    : [response.data].filter(Boolean);
                const result = {
                    data,
                    total: response.meta?.pagination?.total || data.length,
                };
                cache[cacheKey] = result;
                return result;
            });
    },

    update: async (resource, params) => {
        const publish = params.meta?.publish as string[] | undefined;
        const publishQuery = Array.isArray(publish)
            ? `?${publish.map(t => `publish[]=${encodeURIComponent(t)}`).join('&')}`
            : '';
        const url = `${apiUrl}/${resource}/${params.id}${publishQuery}`;

        try {
            // Process files in the payload first
            const processedData = await processFilesInPayload(params.data);

            console.log('processedData', processedData);

            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(processedData),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });

            if (!response.ok) {
                const error = await response.json();
                // Properly throw the error with all details
                const errorMessage = error.error?.message || error.message || 'Unknown error';
                const errorObj = new Error(errorMessage);
                // Add custom properties to the error object
                Object.assign(errorObj, {
                    details: error.error?.details,
                    status: response.status,
                });
                throw errorObj;
            }

            const { data } = await response.json();
            
            // Clear cache for this resource
            Object.keys(cache).forEach(key => {
                if (key.startsWith(`${resource}_`)) {
                    delete cache[key];
                }
            });
            
            return { data: { id: data.id, ...data } };
        } catch (error) {
            console.error('Update operation failed:', error);
            throw error;
        }
    },

    updateMany: (resource, params) => {
        const cleanedData = params.data;
        const query = {
            filters: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(cleanedData),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
            .then(response => response.json())
            .then(({ data }) => {
                // Invalidate cache for this resource
                Object.keys(cache).forEach(key => {
                    if (key.startsWith(`${resource}_`)) {
                        delete cache[key];
                    }
                });
                return { data };
            });
    },

    create: async (resource, params) => {
        const publish = params.meta?.publish as string[] | undefined;
        const publishQuery = Array.isArray(publish)
            ? `?${publish.map(t => `publish[]=${encodeURIComponent(t)}`).join('&')}`
            : '';
        const url = `${apiUrl}/${resource}${publishQuery}`;

        try {
            // Process files in the payload first
            const processedData = await processFilesInPayload(params.data);

            // Make the API request with processed data
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(processedData),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });

            if (!response.ok) {
                const error = await response.json();
                const errorMessage = error.error || error.message || 'Request failed';
                throw new Error(errorMessage);
            }

            const { data } = await response.json();
            
            // Clear cache for this resource
            Object.keys(cache).forEach(key => {
                if (key.startsWith(`${resource}_`)) {
                    delete cache[key];
                }
            });
            
            return { data: { id: data.id, ...data } };
        } catch (error) {
            console.error('Create operation failed:', error);
            throw error;
        }
    },

    delete: (resource, params) => {
        const publish = params.meta?.publish as string[] | undefined;
        const publishQuery = Array.isArray(publish)
            ? `?${publish.map(t => `publish[]=${encodeURIComponent(t)}`).join('&')}`
            : '';
        const url = `${apiUrl}/${resource}/${params.id}${publishQuery}`;
        return fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message);
                    });
                }
                return response
                    .text()
                    .then(text => (text ? JSON.parse(text) : {}));
            })
            .then(data => {
                // Invalidate cache for this resource
                Object.keys(cache).forEach(key => {
                    if (key.startsWith(`${resource}_`)) {
                        delete cache[key];
                    }
                });
                return { data };
            });
    },

    deleteMany: (resource, params) => {
        const query = {
            filters: JSON.stringify({ id: params.ids }),
        };
        const publish = params.meta?.publish as string[] | undefined;
        const publishQuery = Array.isArray(publish)
            ? `&${publish.map(t => `publish[]=${encodeURIComponent(t)}`).join('&')}`
            : '';
        const url = `${apiUrl}/${resource}/bulk-delete?${stringify(query)}${publishQuery}`;
        return fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message);
                    });
                }
                return response
                    .text()
                    .then(text => (text ? JSON.parse(text) : {}));
            })
            .then(({ data }) => {
                // Invalidate cache for this resource
                Object.keys(cache).forEach(key => {
                    if (key.startsWith(`${resource}_`)) {
                        delete cache[key];
                    }
                });
                return { data };
            });
    },

    subscribe: (resource: any, params: any) => {
        const url = `${apiUrl}/${resource}/subscribe`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
            .then(response => response.json())
            .then(data => ({ data }));
    },
};

export default ciwsDataProvider;
