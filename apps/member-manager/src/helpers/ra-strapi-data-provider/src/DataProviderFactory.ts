/**
 * @module ra-strapi-rest
 * @author Chris Heney <chris.heney@gmail.com>
 * @category react-admin
 * @subcategory Data Provider
 * @license MIT
 * @version 1.1.0
 * @description This is a custom data provider for react-admin that works with
 * Strapi. It is based on the default data provider for react-admin, and is
 * intended to be used with the Strapi provider for react-admin.
 * @supports React Admin 3.0.0
 * @supports Strapi 4.19.1
 * @see react-admin/src/dataProvider/*.ts
 * @see ra-core/src/types.ts
 */

import {
  RaRecord,
  DataProvider,
  GetListParams,
  UpdateParams,
  UpdateManyParams,
  CreateParams,
  Identifier,
} from "react-admin";
import {
  IStrapiDataProviderFactory,
  IStrapiDataProviderFactoryOptions,
  IPopulationOption,
  IStrapiRecord,
  IStrapiAttributes,
  IMultimedia,
  IRaFile,
} from "./types";
import httpClient from "./httpClient";
import qs from "qs";
import { StrapiFormattedFile } from "../../../modules/grant-manager/types";
import { serializePopulateQuery } from "./serializePopulateQuery";
import {
  convertRaParamsToStrapiParams as serializeRaListParams,
  isDocumentId as isStrapiDocumentId,
} from "./serializeStrapiFilters";
import { sanitizeStrapiWritePayload } from "./sanitizeStrapiWritePayload";

/**
 * Data FLow:
 *
 * # Conditions passed as parameter meta
 * - raw
 * - populate
 *
 * # Incoming Data
 * - GetList / GetMany / GetManyReference / GetOne (Flow):
 *   - All: Build GET URL + Query String (populate, GetList: filters, sort, pagination)
 *   - All: Send Request
 *   - GetList / GetMany / GetManyReference: Loop Response (map)
 *   - All: Format Response
 *     - All: Raw Response
 *     - All: RA Response
 *   - All: Return Response
 *
 * # Outgoing Data
 * - Create / Update / UpdateMany (Flow):
 *   - All: Build POST/PUT URL & Headers
 *   - All: Format Request
 *
 * - Delete
 *   - Build Delete URL
 */

// @TODO: Investigate how this is used:

// Add debounce utility to prevent multiple rapid requests
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: any[]) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};

// Simple in-memory cache for GET requests
class RequestCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number = 30000; // 30 seconds cache TTL by default

  constructor(ttl?: number) {
    if (ttl) this.ttl = ttl;
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(pattern: RegExp): void {
    // Convert iterator to array to avoid TypeScript error
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

class StrapiDataProviderFactory implements IStrapiDataProviderFactory {
  public endpoint;
  public type;
  private cache: RequestCache;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor(options: IStrapiDataProviderFactoryOptions) {
    const { endpoint, type, cacheTTL } = options;

    this.endpoint = endpoint;
    this.type = type;
    this.cache = new RequestCache(cacheTTL);

    return this;
  }

  init() {
    switch (this.type) {
      // @TODO: Implement this:
      // case 'graphql':
      //   return this.graphProvider()
      case "rest":
        return this.restProvider();
      default:
        throw new Error("Invalid Strapi data provider type");
    }
  }

  getUploadFieldNames = (data: any): string[] => {
    if (!data || typeof data !== "object") return [];
    const hasRawFile = (value: any): boolean => {
      return (
        value &&
        typeof value === "object" &&
        ("rawFile" in value ||
          (Array.isArray(value) && value.some(hasRawFile)) ||
          Object.values(value).some(hasRawFile))
      );
    };

    return Object.keys(data).filter((key: any) => {
      return hasRawFile(data[key]);
    });
  };

  /** Strapi 5 documentIds are opaque strings; numeric entity ids are digits-only. */
  private isDocumentId = (id: Identifier | undefined | null): boolean =>
    isStrapiDocumentId(id);

  /**
   * Stable RA id for Strapi 5 Draft & Publish: draft/published rows share a
   * documentId but churn numeric `id` on every publish. Prefer documentId so
   * edit URLs and getOne stay valid across saves.
   *
   * Also applied recursively to nested populated content-type records so
   * relation objects expose the same id/entityId shape as top-level rows.
   */
  private withStableId = (data: RaRecord): RaRecord => {
    if (data == null) return data;
    if (typeof data.documentId === "string" && data.documentId) {
      // Keep the numeric DB id for filters/relations that still use it
      // (conference dashboard filters, numeric-id-compat middleware).
      const rawId = data.id;
      const entityId =
        typeof rawId === "number"
          ? rawId
          : typeof rawId === "string" && /^\d+$/.test(rawId)
            ? parseInt(rawId, 10)
            : typeof (data as unknown as { entityId?: number }).entityId ===
                "number"
              ? (data as unknown as { entityId: number }).entityId
              : undefined;
      return {
        ...data,
        id: data.documentId,
        ...(entityId != null && !Number.isNaN(entityId) ? { entityId } : {}),
      };
    }
    return data;
  };

  /**
   * Catch for useEditController: after withStableId, `data.id` is usually the
   * documentId, but callers may still request by numeric PK (legacy filters,
   * hardcoded defaults, stale RaStore). React-admin throws if they differ.
   * Keep the id the client asked for; entityId/documentId stay on the record.
   */
  private alignRecordId = (
    data: RaRecord,
    requestedId: Identifier | undefined
  ): RaRecord => {
    if (requestedId == null || data == null) return data;
    if (String(data.id) === String(requestedId)) return data;
    return { ...data, id: requestedId };
  };

  /** True for upload/media entries — do not remap their numeric ids. */
  private isMediaRecord = (value: Record<string, unknown>): boolean =>
    value.mime != null || value.url != null || value.formats != null;

  /**
   * Deep-copy a Strapi 5 flat record and withStableId every nested object that
   * looks like a content-type row (has documentId, is not media).
   */
  private stabilizeNestedRecords = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => this.stabilizeNestedRecords(item));
    }
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const copy: Record<string, unknown> = {};
      for (const key of Object.keys(obj)) {
        copy[key] = this.stabilizeNestedRecords(obj[key]);
      }
      if (
        typeof copy.documentId === "string" &&
        copy.documentId &&
        !this.isMediaRecord(copy)
      ) {
        return this.withStableId(copy as RaRecord);
      }
      return copy;
    }
    return value;
  };

  /**
   * Relation reference value for writes/inputs.
   * Content-type relations: prefer documentId (D&P-stable).
   * Upload/media entries: keep numeric id (upload plugin + body rewrite).
   */
  private relationRefId = (item: {
    id: Identifier;
    documentId?: string;
    mime?: string;
    url?: string;
    formats?: unknown;
  }): Identifier => {
    const isMedia =
      item.mime != null || item.url != null || item.formats != null;
    if (
      !isMedia &&
      typeof item.documentId === "string" &&
      item.documentId
    ) {
      return item.documentId;
    }
    return typeof item.id === "number"
      ? item.id
      : parseInt(String(item.id), 10);
  };

  /**
   * Provides React Admin compatible response from Strapi response. Handles: Single Relationship, Has Many
   * Relationship, Component, Repeatable Component and Multimedia.
   *
   * @param record IStrapiRecord Raw Strapi Data Response Object
   * @returns RaRecord
   */
  formatResponseRA = (record: IStrapiRecord): RaRecord => {
    // Strapi 5: records are flat ({ id, documentId, ...fields }), relations are
    // flat objects/arrays with their own numeric id (no .data / .attributes nesting).
    //
    // IMPORTANT: relations and media entries carry a `documentId`; component
    // (repeater) fields do NOT. Collapse relations/media to stable documentId
    // (fallback numeric id). Components must stay flat objects.
    if (record && !record.attributes) {
      const raRecord: RaRecord = { ...(record as unknown as RaRecord) };

      const isRelationOrMedia = (item: any) =>
        item &&
        typeof item === "object" &&
        item.id !== undefined &&
        item.id !== null &&
        item.documentId !== undefined;

      for (const key in raRecord) {
        const value = raRecord[key];
        if (value && typeof value === "object") {
          // Single relation / media object -> stable id
          if (!Array.isArray(value) && isRelationOrMedia(value)) {
            raRecord[key] = this.relationRefId(value);
            continue;
          }
          // Has-many relation / multi-media -> array of stable ids
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(isRelationOrMedia)
          ) {
            raRecord[key] = value.map((item: { id: Identifier; documentId?: string }) =>
              this.relationRefId(item)
            );
            continue;
          }
        }
      }

      return this.withStableId(raRecord);
    }

    // Strapi 4 fallback: { id, attributes: { field, relation: { data: {...} } } }
    const raRecord: RaRecord = { id: record.id };

    for (const key in record.attributes) {
      // Relationship or Image
      if (typeof record.attributes[key] === "object") {
        // Handle Extracting URL from Image: NOTE: This worked for get ... but caused error on update.
        // if (Array.isArray(record.attributes[key]?.data) && record.attributes[key]?.data[0]?.attributes?.mime) {
        //   raRecord[key] = `${this.endpoint.replace(/\/api$/, '')}${record.attributes[key]?.data[0]?.attributes?.url}`
        //   continue
        // }

        // Handle Extracting ID from Single Type Relationship (or single component)
        // @note: The only difference between a single type relationship and a single component, is that
        // the single relationship will have an attributes object, and the single component will be flat.
        if (record.attributes[key]?.data?.id) {
          raRecord[key] = parseInt(record.attributes[key].data.id as string);
          continue;
        }

        // Handle Extracting IDs from Has Many Relationship
        if (Array.isArray(record.attributes[key]?.data)) {
          raRecord[key] = record.attributes[key].data.map(
            (object: { id: Identifier }) => parseInt(object.id as string)
          );
          continue;
        }

        // Handle Extracting ID from Repeatable Component
        // if (Array.isArray(record.attributes[key])) {
        //   raRecord[key] = record.attributes[key].map((object: {id: Identifier}) => parseInt(object.id as string))
        //   continue
        // }
      }

      // All other fields
      raRecord[key] = record.attributes[key];
    }

    return raRecord;
  };

  /**
   * Format the nested response:
   * Before:
   * data
   * @param record IStrapiRecord Raw Strapi Data Response Object
   * @returns
   */
  formatResponseRaw = (record: IStrapiRecord): RaRecord => {
    // Strapi 5: records are already flat and populated relations are flat
    // objects/arrays. Stabilize documentId → id (and entityId) at every level.
    if (record && !record.attributes) {
      return this.stabilizeNestedRecords(record) as RaRecord;
    }

    // Strapi 4 fallback
    const { id } = record;

    // Flatten the record
    const jsonRecord: RaRecord = { id };

    for (const key in record.attributes) {
      if (typeof record.attributes[key] !== "object") {
        jsonRecord[key] = record.attributes[key];
        continue;
      }

      // data should have id and attributes
      const { data } = record.attributes[key] || {};
      if (!data) continue;

      // Has Many Relationship:
      const isArray = Array.isArray(data);

      // Single Type Relationship:
      const isObject =
        typeof data?.attributes === "object"
          ? Object.keys(data?.attributes).length > 0
            ? true
            : false
          : false;

      if (!isArray && !isObject) {
        jsonRecord[key] = data.id.toString();
        continue;
      }

      if (isObject) {
        jsonRecord[key] = this.formatResponseRaw(data);
        continue;
      }

      if (isArray) {
        jsonRecord[key] = data.map(this.formatResponseRaw);
        continue;
      }

      // ...this should never happen technically
      jsonRecord[key] = data.id.toString();
    }

    return jsonRecord;
  };

  /**
   * Population Options are used to populate relationships in the response.
   * @note This will not return a React Admin compatible response ... it is used
   * to reduce the number of requests to the server, and facilitate more complex
   * interfaces.
   *
   * @param populationOptions
   * @returns string
   */
  buildPopulationQueryString = (
    populationOptions: IPopulationOption[] | Record<string, unknown>,
    customFilter?: string
  ): string => serializePopulateQuery(populationOptions, customFilter);

  /**
   * Strapi 5 write-body sanitizer. See sanitizeStrapiWritePayload.ts for the
   * relation vs repeater vs media vs many-to-many shape rules.
   */
  sanitizeRaRecordForStrapi = (object: RaRecord): IStrapiAttributes =>
    sanitizeStrapiWritePayload(object as Record<string, unknown>);

  /**
   * React Admin Params for filtering, sorting, and pagination converted to Strapi.
   *
   * @param params - The input parameters containing pagination, sorting, filtering, target, and ID data.
   * @returns A query string for Strapi with the adjusted parameters.
   */
  /**
   * React Admin list params → Strapi query string.
   * DocumentId-shaped filter leaves become filters[rel][documentId]=… so
   * call sites can pass record.id after withStableId without empty results.
   */
  convertRaParamsToStrapiParams = (params: GetListParams): string =>
    serializeRaListParams(params);
  /**
   * Turn React Admin params in Strapi equivalent request body.
   * @param {Object} params React Admin params
   * @returns {Object} Equivalent body to add in request body.
   */
  raToStrapiObj = (
    params: CreateParams | UpdateParams | UpdateManyParams
  ): string => {
    const { data, multimedia } = this.separateMultimedia(params.data);
    const SKIP_MULTIMEDIA = true; // just to debug

    // console.log("raToStrapiObj:", data, multimedia);

    if (multimedia && !SKIP_MULTIMEDIA) {
      const formData = new FormData();

      for (const key in multimedia) {
        if (Object.prototype.hasOwnProperty.call(multimedia, key)) {
          const element = multimedia[key];

          if (Array.isArray(element)) {
            const elementIds: number[] = [];

            element.forEach((f: IRaFile) => {
              f.rawFile instanceof File
                ? formData.append(`files.${key}`, f.rawFile, f.title)
                : elementIds.push(f.id);
            });
            data[key] = elementIds;
          }

          if (
            !Array.isArray(element) &&
            !(element.rawFile instanceof File) &&
            Object.prototype.hasOwnProperty.call(data, key)
          ) {
            data[key] = [element.id];
          }

          if (!Array.isArray(element) && element.rawFile instanceof File) {
            formData.append(`files.${key}`, element.rawFile, element.title);
          }
        }
      }

      formData.append(
        "data",
        JSON.stringify(this.sanitizeRaRecordForStrapi(data as RaRecord))
      );

      return JSON.stringify(formData);
    }

    return JSON.stringify({
      data: this.sanitizeRaRecordForStrapi(data as RaRecord),
    });
  };

  /**
   * Separate an object in multimedia files and data
   * @param object React admin object
   * @returns
   */

  separateMultimedia = (object: IMultimedia) => {
    let data: IMultimedia = {};
    let multimedia: IMultimedia | null = {};

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        if (element?.rawFile) {
          multimedia = { ...multimedia, [key]: element };
        } else if (
          Array.isArray(element) &&
          (element[0]?.mime || element[0]?.rawFile)
        ) {
          multimedia = { ...multimedia, [key]: element };
        } else {
          data = { ...data, [key]: element };
        }
      }
    }

    if (Object.keys(multimedia).length === 0) {
      multimedia = null;
    }

    return { data, multimedia };
  };

  /*
  @TODO: Implement Graph Provider
  graphProvider(): DataProvider {
    return {
      getList: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      getOne: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      getMany: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      getManyReference: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      update: (
        resource,
        params
      ) => {
        console.log('resource:', resource)
        console.log('params:', params)
      },
      updateMany: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      create: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      delete: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      },
      deleteMany: (
        resource,
        params
      ) => {
        // console.log('resource:', resource)
        // console.log('params:', params)
      }
    } as DataProvider
  }
  */

  /**
   * Strapi 5 removed entry-embedded uploads (multipart `files.<field>` on
   * content endpoints). Upload raw files to /api/upload first and merge the
   * returned file ids into the JSON payload, preserving already-stored files.
   */
  private prepareWritePayload = async (rawData: Record<string, any>) => {
    const uploadFieldNames = this.getUploadFieldNames(rawData);
    const data: Record<string, any> = { ...rawData };

    for (const fieldName of uploadFieldNames) {
      const isArrayField = Array.isArray(rawData[fieldName]);
      const items = isArrayField ? rawData[fieldName] : [rawData[fieldName]];
      const fileIds: number[] = [];

      for (const item of items) {
        if (item && item.rawFile instanceof File) {
          const formData = new FormData();
          formData.append("files", item.rawFile, item.title || item.name);
          const { json } = await httpClient(
            `${this.endpoint.replace(/\/api$/, "")}/api/upload`,
            { method: "POST", body: formData } as any
          );
          const uploaded = Array.isArray(json) ? json : [json];
          uploaded.forEach((file: { id: number }) => fileIds.push(file.id));
        } else if (item && typeof item === "object" && item.id !== undefined) {
          // Already-stored file kept in the input
          fileIds.push(item.id);
        } else if (typeof item === "number") {
          fileIds.push(item);
        }
      }

      data[fieldName] = isArrayField ? fileIds : fileIds[0] ?? null;
    }

    return this.sanitizeRaRecordForStrapi(data as RaRecord);
  };

  // Add method to handle simultaneous identical requests
  private async executeRequest(key: string, requestFn: () => Promise<any>): Promise<any> {
    // Check if this exact request is already in progress
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    // Create new request and store it
    const request = requestFn();
    this.pendingRequests.set(key, request);
    
    try {
      const result = await request;
      return result;
    } finally {
      // Clean up after request completes (success or error)
      this.pendingRequests.delete(key);
    }
  }

  restProvider(): DataProvider {
    return {
      getList: async (resource, params) => {
        const { populate = [], raw } = params?.meta || {
          populate: [],
          raw: false,
        };

        // Build URL & Query String
        const queryString = this.convertRaParamsToStrapiParams(params);
        const populateString = this.buildPopulationQueryString(populate);
        const url = `${this.endpoint}/${resource}?${populateString}&${queryString}`;
        
        // Check cache first
        const cacheKey = `getList:${raw ? "raw" : "ra"}:${url}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
          return cached;
        }

        // Execute request with deduplication
        const result = await this.executeRequest(cacheKey, async () => {
          const { json } = await httpClient(url, {});

          const data =
            resource === "users-permissions/roles"
              ? (json as any).roles
              : resource === "users"
              ? json
              : raw
              ? (json.data as IStrapiRecord[]).map(this.formatResponseRaw)
              : (json.data as IStrapiRecord[]).map(this.formatResponseRA);

          return {
            data,
            total: json.meta?.pagination?.total ?? 0,
          };
        });
        
        // Cache the result
        this.cache.set(cacheKey, result);
        return result;
      },

      getOne: async (resource, params) => {
        const {
          populate = [],
          raw,
          customFilter,
        } = params?.meta || {
          populate: [],
          raw: false,
          customeFilter: null,
        };

        const populateString = this.buildPopulationQueryString(populate, customFilter);
        const url = `${this.endpoint}/${resource}/${params.id}?${populateString}`;
        
        // Check cache first
        const cacheKey = `getOne:${raw ? "raw" : "ra"}:${url}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
          return cached;
        }

        // Execute request with deduplication
        const result = await this.executeRequest(cacheKey, async () => {
          const { json } = await httpClient(url);

          // users-permissions still keys routes by numeric id — do not swap in documentId.
          if (resource === "users") {
            return { data: json };
          }

          const data = raw
            ? this.formatResponseRaw(json.data as IStrapiRecord)
            : this.formatResponseRA(json.data as IStrapiRecord);

          // Align after withStableId so numeric getOne (legacy Edit ids) still
          // satisfies useEditController's id === requested check.
          return { data: this.alignRecordId(data, params.id) };
        });
        
        // Cache the result
        this.cache.set(cacheKey, result);
        return result;
      },

      getMany: async (resource, params) => {
        const operator = params.meta?.operator ?? "$in";
        const documentIds = params.ids.filter((id) =>
          this.isDocumentId(id)
        ) as string[];
        const numericIds = params.ids
          .filter(
            (id) =>
              typeof id === "number" ||
              (typeof id === "string" && /^\d+$/.test(id))
          )
          .map((id) => (typeof id === "number" ? id : Number(id)));

        if (documentIds.length === 0 && numericIds.length === 0) {
          return { data: [], total: 0 };
        }

        // Prefer documentId filters when present (D&P-stable); else numeric id.
        const query = {
          filters:
            documentIds.length > 0
              ? { documentId: { [operator]: documentIds } }
              : { id: { [operator]: numericIds } },
        };

        const queryStringify = qs.stringify(query, {
          encodeValuesOnly: true,
        });

        const {
          populate = [],
          raw = false,
          image = false,
        } = typeof params?.meta === "undefined"
          ? {
              populate: [],
              raw: false,
              image: false,
            }
          : params.meta;

        const populateString = this.buildPopulationQueryString(populate);
        const url = `${this.endpoint}/${resource}?${populateString}&${queryStringify}`;
        
        // Check cache first
        const cacheKey = `getMany:${raw ? "raw" : "ra"}:${image ? "img" : "std"}:${url}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
          return cached;
        }

        // Execute request with deduplication
        const result = await this.executeRequest(cacheKey, async () => {
          const { json } = await httpClient(url);

          const data = image
            ? JSON.parse(JSON.stringify(json)).map((img: RaRecord) => ({
                ...img,
                url: `${this.endpoint.replace(/\/api$/, "")}${img.url}`,
              }))
            : raw
            ? (json.data as IStrapiRecord[]).map(this.formatResponseRaw)
            : (json.data as IStrapiRecord[]).map(this.formatResponseRA);

          return {
            data,
            total: json.meta?.pagination?.total ?? 0,
          };
        });
        
        // Cache the result
        this.cache.set(cacheKey, result);
        return result;
      },

      getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query = {
          sort: JSON.stringify([field, order]),
          range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
          filter: JSON.stringify({
            ...params.filter,
            [params.target]: params.id,
          }),
        };

        const queryStringify = qs.stringify(query, {
          encodeValuesOnly: true,
        });

        const { populate = [], raw } = params?.meta || {
          populate: [],
          raw: false,
        };

        const populateString = this.buildPopulationQueryString(populate);
        const url = `${this.endpoint}/${resource}?${populateString}&${queryStringify}`;
        
        // Check cache first
        const cacheKey = `getManyReference:${raw ? "raw" : "ra"}:${url}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
          return cached;
        }

        // Execute request with deduplication
        const result = await this.executeRequest(cacheKey, async () => {
          const { json } = await httpClient(url, {});

          const data = raw
            ? (json.data as IStrapiRecord[]).map(this.formatResponseRaw)
            : (json.data as IStrapiRecord[]).map(this.formatResponseRA);

          return {
            data,
            total: json.meta?.pagination?.total ?? 0,
          };
        });
        
        // Cache the result
        this.cache.set(cacheKey, result);
        return result;
      },

      update: async (resource, params) => {
        // Strapi 5 omits relation/media fields from write responses unless the
        // write itself requests populate. react-admin merges this response into
        // the cached record and resets the form from it, so a bare response
        // makes relation inputs revert to their pre-save values (and a
        // follow-up save then wipes them). populate=* restores v4 behavior.
        //
        // When addressing by documentId, pin status=published so admin saves
        // update the live version (default Document Service write is draft).
        const statusQs = this.isDocumentId(params.id)
          ? "&status=published"
          : "";
        const url = `${this.endpoint}/${resource}/${params.id}?populate=*${statusQs}`;
        const requestKey = `update:${resource}:${params.id}`;

        // Invalidate cache for this resource
        this.cache.invalidate(new RegExp(`^(getOne|getList|getMany|getManyReference):.*${resource}`));

        // Process and optimize the update request
        return this.executeRequest(requestKey, async () => {
          // Strapi 5 rejects multipart writes ("Missing data payload"):
          // upload new files first, then send a plain JSON body.
          const payload = await this.prepareWritePayload(
            params.data as Record<string, any>
          );

          const { json } = await httpClient(url, {
            method: "PUT",
            body: JSON.stringify({ data: payload }),
          });

          return {
            data: this.alignRecordId(
              this.withStableId(
                this.formatResponseRA(json.data as IStrapiRecord)
              ),
              params.id
            ),
          };
        });
      },

      updateMany: async (resource, params) => {
        // Invalidate cache for this resource
        this.cache.invalidate(new RegExp(`^(getOne|getList|getMany|getManyReference):.*${resource}`));

        const payload = await this.prepareWritePayload(
          params.data as Record<string, any>
        );

        // Process updates in parallel with a concurrency limit
        const batchSize = 5; // Process 5 updates at a time
        const results = [];
        
        for (let i = 0; i < params.ids.length; i += batchSize) {
          const batch = params.ids.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (id) => {
              const statusQs = this.isDocumentId(id) ? "&status=published" : "";
              const url = `${this.endpoint}/${resource}/${id}?populate=*${statusQs}`;
              const requestKey = `updateMany:${resource}:${id}`;
              
              return this.executeRequest(requestKey, async () => {
                const { json } = await httpClient(url, {
                  method: "PUT",
                  body: JSON.stringify({ data: payload }),
                });
                return (json.data as IStrapiRecord).id;
              });
            })
          );
          results.push(...batchResults);
        }

        return { data: results };
      },

      create: async (resource, params) => {
        // populate=* for the same reason as update(): Strapi 5 write responses
        // omit relations unless populated, which breaks post-create hydration.
        const url = `${this.endpoint}/${resource}?populate=*`;
        const requestKey = `create:${resource}`;
        
        // Invalidate cache for this resource
        this.cache.invalidate(new RegExp(`^(getList|getMany|getManyReference):.*${resource}`));

        return this.executeRequest(requestKey, async () => {
          // Strapi 5 rejects multipart writes: upload files first, send JSON.
          const payload = await this.prepareWritePayload(
            params.data as Record<string, any>
          );

          const { json } = await httpClient(url, {
            method: "POST",
            body: JSON.stringify({ data: payload }),
          });

          const data = this.formatResponseRA(json.data as IStrapiRecord);

          return { data };
        });
      },

      delete: async (resource, params) => {
        const url = `${this.endpoint}/${resource}/${params.id}`;
        const requestKey = `delete:${resource}:${params.id}`;
        
        // Invalidate cache for this resource
        this.cache.invalidate(new RegExp(`^(getOne|getList|getMany|getManyReference):.*${resource}`));

        return this.executeRequest(requestKey, async () => {
          // Strapi 5 DELETE returns 204 with an empty body
          await httpClient(url, {
            method: "DELETE",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });

          return { data: { id: params.id } };
        });
      },

      deleteMany: async (resource, params) => {
        // Invalidate cache for this resource
        this.cache.invalidate(new RegExp(`^(getOne|getList|getMany|getManyReference):.*${resource}`));

        // Process deletes in parallel with a concurrency limit
        const batchSize = 5; // Process 5 deletes at a time
        const results = [];
        
        for (let i = 0; i < params.ids.length; i += batchSize) {
          const batch = params.ids.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (id) => {
              const url = `${this.endpoint}/${resource}/${id}`;
              const requestKey = `deleteMany:${resource}:${id}`;
              
              return this.executeRequest(requestKey, async () => {
                // Strapi 5 DELETE returns 204 with an empty body
                await httpClient(url, {
                  method: "DELETE",
                  headers: new Headers({
                    "Content-Type": "text/plain",
                  }),
                });

                return id;
              });
            })
          );
          results.push(...batchResults);
        }

        return { data: results };
      },
    } as DataProvider;
  }
}

export default StrapiDataProviderFactory;
