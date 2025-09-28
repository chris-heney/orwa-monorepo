// /**
//  * @module ra-strapi-rest
//  * @author Chris Heney <chris.heney@gmail.com>
//  * @category react-admin
//  * @subcategory Data Provider
//  * @license MIT
//  * @version 1.1.0
//  * @description This is a custom data provider for react-admin that works with
//  * Strapi. It is based on the default data provider for react-admin, and is
//  * intended to be used with the Strapi provider for react-admin.
//  * @supports React Admin 3.0.0
//  * @supports Strapi 4.19.1
//  * @see react-admin/src/dataProvider/*.ts
//  * @see ra-core/src/types.ts
//  */

// import {
//     RaRecord,
//     DataProvider,
//     GetListParams,
//     UpdateParams,
//     UpdateManyParams,
//     CreateParams,
//     Identifier,
//   } from "react-admin";
//   import {
//     IStrapiDataProviderFactory,
//     IStrapiDataProviderFactoryOptions,
//     IPopulationOption,
//     IStrapiRecord,
//     IStrapiAttributes,
//     IMultimedia,
//     IRaFile,
//   } from "./types";
//   import httpClient from "./httpClient";
//   import qs from "qs";
//   import { StrapiFormattedFile } from "../../../modules/grant-manager/types";
//   import { FilterOperator } from "@react-admin/ra-form-layout";
  
//   /**
//    * Data FLow:
//    *
//    * # Conditions passed as parameter meta
//    * - raw
//    * - populate
//    *
//    * # Incoming Data
//    * - GetList / GetMany / GetManyReference / GetOne (Flow):
//    *   - All: Build GET URL + Query String (populate, GetList: filters, sort, pagination)
//    *   - All: Send Request
//    *   - GetList / GetMany / GetManyReference: Loop Response (map)
//    *   - All: Format Response
//    *     - All: Raw Response
//    *     - All: RA Response
//    *   - All: Return Response
//    *
//    * # Outgoing Data
//    * - Create / Update / UpdateMany (Flow):
//    *   - All: Build POST/PUT URL & Headers
//    *   - All: Format Request
//    *
//    * - Delete
//    *   - Build Delete URL
//    */
  
//   // @TODO: Investigate how this is used:
  
//   class StrapiDataProviderFactory implements IStrapiDataProviderFactory {
//     public endpoint;
//     public type;
  
//     constructor(options: IStrapiDataProviderFactoryOptions) {
//       const { endpoint, type } = options;
  
//       this.endpoint = endpoint;
//       this.type = type;
  
//       return this;
//     }
  
//     init() {
//       switch (this.type) {
//         // @TODO: Implement this:
//         // case 'graphql':
//         //   return this.graphProvider()
//         case "rest":
//           return this.restProvider();
//         default:
//           throw new Error("Invalid Strapi data provider type");
//       }
//     }
  
//     getUploadFieldNames = (data: any): string[] => {
//       if (!data || typeof data !== "object") return [];
//       const hasRawFile = (value: any): boolean => {
//         return (
//           value &&
//           typeof value === "object" &&
//           ("rawFile" in value ||
//             (Array.isArray(value) && value.some(hasRawFile)) ||
//             Object.values(value).some(hasRawFile))
//         );
//       };
  
//       return Object.keys(data).filter((key: any) => {
//         return hasRawFile(data[key]);
//       });
//     };
  
//     /**
//      * Provides React Admin compatible response from Strapi response. Handles: Single Relationship, Has Many
//      * Relationship, Component, Repeatable Component and Multimedia.
//      *
//      * @param record IStrapiRecord Raw Strapi Data Response Object
//      * @returns RaRecord
//      */
//     formatResponseRA = (record: IStrapiRecord): RaRecord => {
//       const raRecord: RaRecord = { id: record.id };
  
//       for (const key in record.attributes) {
//         // Relationship or Image
//         if (typeof record.attributes[key] === "object") {
//           // Handle Extracting URL from Image: NOTE: This worked for get ... but caused error on update.
//           // if (Array.isArray(record.attributes[key]?.data) && record.attributes[key]?.data[0]?.attributes?.mime) {
//           //   raRecord[key] = `${this.endpoint.replace(/\/api$/, '')}${record.attributes[key]?.data[0]?.attributes?.url}`
//           //   continue
//           // }
  
//           // Handle Extracting ID from Single Type Relationship (or single component)
//           // @note: The only difference between a single type relationship and a single component, is that
//           // the single relationship will have an attributes object, and the single component will be flat.
//           if (record.attributes[key]?.data?.id) {
//             raRecord[key] = parseInt(record.attributes[key].data.id as string);
//             continue;
//           }
  
//           // Handle Extracting IDs from Has Many Relationship
//           if (Array.isArray(record.attributes[key]?.data)) {
//             raRecord[key] = record.attributes[key].data.map(
//               (object: { id: Identifier }) => parseInt(object.id as string)
//             );
//             continue;
//           }
  
//           // Handle Extracting ID from Repeatable Component
//           // if (Array.isArray(record.attributes[key])) {
//           //   raRecord[key] = record.attributes[key].map((object: {id: Identifier}) => parseInt(object.id as string))
//           //   continue
//           // }
//         }
  
//         // All other fields
//         raRecord[key] = record.attributes[key];
//       }
  
//       return raRecord;
//     };
  
//     /**
//      * Format the nested response:
//      * Before:
//      * data
//      * @param record IStrapiRecord Raw Strapi Data Response Object
//      * @returns
//      */
//     formatResponseRaw = (record: IStrapiRecord) => {
//       const { id } = record;
  
//       // Flatten the record
//       const jsonRecord: RaRecord = { id };
  
//       for (const key in record.attributes) {
//         if (typeof record.attributes[key] !== "object") {
//           jsonRecord[key] = record.attributes[key];
//           continue;
//         }
  
//         // data should have id and attributes
//         const { data } = record.attributes[key] || {};
//         if (!data) continue;
  
//         // Has Many Relationship:
//         const isArray = Array.isArray(data);
  
//         // Single Type Relationship:
//         const isObject =
//           typeof data?.attributes === "object"
//             ? Object.keys(data?.attributes).length > 0
//               ? true
//               : false
//             : false;
  
//         if (!isArray && !isObject) {
//           jsonRecord[key] = data.id.toString();
//           continue;
//         }
  
//         if (isObject) {
//           jsonRecord[key] = this.formatResponseRaw(data);
//           continue;
//         }
  
//         if (isArray) {
//           jsonRecord[key] = data.map(this.formatResponseRaw);
//           continue;
//         }
  
//         // ...this should never happen technically
//         jsonRecord[key] = data.id.toString();
//       }
  
//       return jsonRecord;
//     };
  
//     /**
//      * Population Options are used to populate relationships in the response.
//      * @note This will not return a React Admin compatible response ... it is used
//      * to reduce the number of requests to the server, and facilitate more complex
//      * interfaces.
//      *
//      * @param populationOptions
//      * @returns string
//      */
//     buildPopulationQueryString = (
//       populationOptions: IPopulationOption[],
//       customFilter?: string
//     ): string => {
//       const queryString = [];
  
//       // If a custom filter is provided, use it directly
//       if (customFilter) {
//         queryString.push(customFilter);
//         return queryString.join("&");
//       }
  
//       for (const key in populationOptions) {
//         const option = populationOptions[key];
  
//         if (Array.isArray(option.children)) {
//           for (const childOption of option.children) {
//             queryString.push(
//               `populate[${key}][${childOption.field}]=${
//                 childOption.children
//                   ? this.buildPopulationQueryString(childOption)
//                   : ""
//               }`
//             );
//           }
//         } else {
//           queryString.push(`populate[${key}]='${option}'`);
//         }
//       }
  
//       return queryString.length ? queryString.join("&") : "populate=*";
//     };
  
//     /**
//      * Ensures there is no empty string in the object.
//      *
//      * @param {Object} object React Admin data object
//      * @returns {Object} Strapi object
//      */
  
//     sanitizeRaRecordForStrapi = (object: RaRecord): IStrapiAttributes => {
//       const newObject: Partial<RaRecord> = {};
//       const components: string[] = ["stages"];
  
//       Object.keys(object).forEach((key) => {
//         const newValue = object[key] === "" ? null : object[key];
  
//         if (components.includes(key)) {
//           newObject[key] = { data: newValue };
//         } else {
//           newObject[key] = newValue;
//         }
//       });
  
//       return newObject;
//     };
  
//     /**
//      * React Admin Params for filtering, sorting, and pagination converted to Strapi.
//      *
//      * @param params - The input parameters containing pagination, sorting, filtering, target, and ID data.
//      * @returns A query string for Strapi with the adjusted parameters.
//      */
//     convertRaParamsToStrapiParams = (params: GetListParams): string => {
//       const { sort: s, filter: f, pagination } = params;
    
//       // 🔹 Handle SORTING
//       const sort = s?.field
//         ? `sort=${encodeURIComponent(s.field)}:${s.order.toLowerCase()}`
//         : "sort=updated_at:desc";
    
//       // 🔹 Handle FILTERING
//       const filters: string[] = [];
    
//       const buildFilterQuery = (key: string, value: any, prefix = `filters`) => {
//         if (key === "q" && typeof value === "string" && value) {
//           // 🔹 Handle full-text search
//           filters.push(`_q=${encodeURIComponent(value)}`);
//           return;
//         }
    
//         if (typeof value === "object" && value !== null) {
//           Object.entries(value).forEach(([operator, opValue]) => {
//             if (operator === "$null") {
//               filters.push(`${prefix}[${key}][$null]=true`);
//             } else if (["$in", "$nin"].includes(operator) && Array.isArray(opValue)) {
//               opValue.forEach((v) =>
//                 filters.push(`${prefix}[${key}][${operator}][]=${encodeURIComponent(v)}`)
//               );
//             } else if (["$lt", "$lte", "$gt", "$gte"].includes(operator)) {
//               filters.push(`${prefix}[${key}][${operator}]=${encodeURIComponent(opValue as string)}`);
//             } else if (operator === "$between" && Array.isArray(opValue)) {
//               filters.push(
//                 `${prefix}[${key}][$between][0]=${encodeURIComponent(opValue[0])}`,
//                 `${prefix}[${key}][$between][1]=${encodeURIComponent(opValue[1])}`
//               );
//             } else {
//               filters.push(`${prefix}[${key}][${operator}]=${encodeURIComponent(opValue as string)}`);
//             }
//           });
//         } else {
//           filters.push(`${prefix}[${key}]=${encodeURIComponent(value)}`);
//         }
//       };
    
//       // 🔹 Handle `$or` and `$and` queries properly
//       if ("$or" in f && Array.isArray(f.$or)) {
//         f.$or.forEach((orCondition: any, index: number) => {
//           Object.entries(orCondition).forEach(([key, value]) => {
//             buildFilterQuery(key, value, `filters[$or][${index}]`);
//           });
//         });
//       } else if ("$and" in f && Array.isArray(f.$and)) {
//         f.$and.forEach((andCondition: any, index: number) => {
//           Object.entries(andCondition).forEach(([key, value]) => {
//             buildFilterQuery(key, value, `filters[$and][${index}]`);
//           });
//         });
//       } else {
//         Object.entries(f).forEach(([key, value]) => {
//           buildFilterQuery(key, value);
//         });
//       }
    
//       // 🔹 Handle PAGINATION
//       const start = (pagination.page - 1) * pagination.perPage;
//       const paginationParams = `pagination[start]=${start}&pagination[limit]=${pagination.perPage}`;
    
//       // 🔹 Construct the final query string
//       return [sort, ...filters, paginationParams].join("&");
//     };
//     /**
//      * Turn React Admin params in Strapi equivalent request body.
//      * @param {Object} params React Admin params
//      * @returns {Object} Equivalent body to add in request body.
//      */
//     raToStrapiObj = (
//       params: CreateParams | UpdateParams | UpdateManyParams
//     ): string => {
//       const { data, multimedia } = this.separateMultimedia(params.data);
//       const SKIP_MULTIMEDIA = true; // just to debug
  
//       // console.log("raToStrapiObj:", data, multimedia);
  
//       if (multimedia && !SKIP_MULTIMEDIA) {
//         const formData = new FormData();
  
//         for (const key in multimedia) {
//           if (Object.prototype.hasOwnProperty.call(multimedia, key)) {
//             const element = multimedia[key];
  
//             if (Array.isArray(element)) {
//               const elementIds: number[] = [];
  
//               element.forEach((f: IRaFile) => {
//                 f.rawFile instanceof File
//                   ? formData.append(`files.${key}`, f.rawFile, f.title)
//                   : elementIds.push(f.id);
//               });
//               data[key] = elementIds;
//             }
  
//             if (
//               !Array.isArray(element) &&
//               !(element.rawFile instanceof File) &&
//               Object.prototype.hasOwnProperty.call(data, key)
//             ) {
//               data[key] = [element.id];
//             }
  
//             if (!Array.isArray(element) && element.rawFile instanceof File) {
//               formData.append(`files.${key}`, element.rawFile, element.title);
//             }
//           }
//         }
  
//         formData.append(
//           "data",
//           JSON.stringify(this.sanitizeRaRecordForStrapi(data as RaRecord))
//         );
  
//         return JSON.stringify(formData);
//       }
  
//       return JSON.stringify({
//         data: this.sanitizeRaRecordForStrapi(data as RaRecord),
//       });
//     };
  
//     /**
//      * Separate an object in multimedia files and data
//      * @param object React admin object
//      * @returns
//      */
  
//     separateMultimedia = (object: IMultimedia) => {
//       let data: IMultimedia = {};
//       let multimedia: IMultimedia | null = {};
  
//       for (const key in object) {
//         if (Object.prototype.hasOwnProperty.call(object, key)) {
//           const element = object[key];
//           if (element?.rawFile) {
//             multimedia = { ...multimedia, [key]: element };
//           } else if (
//             Array.isArray(element) &&
//             (element[0]?.mime || element[0]?.rawFile)
//           ) {
//             multimedia = { ...multimedia, [key]: element };
//           } else {
//             data = { ...data, [key]: element };
//           }
//         }
//       }
  
//       if (Object.keys(multimedia).length === 0) {
//         multimedia = null;
//       }
  
//       return { data, multimedia };
//     };
  
//     /*
//     @TODO: Implement Graph Provider
//     graphProvider(): DataProvider {
//       return {
//         getList: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         getOne: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         getMany: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         getManyReference: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         update: (
//           resource,
//           params
//         ) => {
//           console.log('resource:', resource)
//           console.log('params:', params)
//         },
//         updateMany: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         create: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         delete: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         },
//         deleteMany: (
//           resource,
//           params
//         ) => {
//           // console.log('resource:', resource)
//           // console.log('params:', params)
//         }
//       } as DataProvider
//     }
//     */
  
//     restProvider(): DataProvider {
//       return {
//         getList: async (resource, params) => {
//           const { populate = [], raw } = params?.meta || {
//             populate: [],
//             raw: false,
//           };
//           // Build URL & Query String
//           const url = `${
//             this.endpoint
//           }/${resource}?${this.buildPopulationQueryString(
//             populate
//           )}&${this.convertRaParamsToStrapiParams(params)}`;
  
//           const { json } = await httpClient(url, {});
  
//           const data =
//             resource === "users-permissions/roles"
//               ? (json as any).roles
//               : resource === "users"
//               ? json
//               : raw
//               ? (json.data as IStrapiRecord[]).map(this.formatResponseRaw)
//               : (json.data as IStrapiRecord[]).map(this.formatResponseRA);
  
//           return {
//             data,
//             total: json.meta?.pagination?.total ?? 0,
//           };
//         },
  
//         getOne: async (resource, params) => {
//           const {
//             populate = [],
//             raw,
//             customFilter,
//           } = params?.meta || {
//             populate: [],
//             raw: false,
//             customeFilter: null,
//           };
  
//           const url = `${this.endpoint}/${resource}/${
//             params.id
//           }?${this.buildPopulationQueryString(populate, customFilter)}`;
  
//           const { json } = await httpClient(url);
  
//           // console.log(`PAYLOAD: getOne-${resource}-response-before:`, json)
//           // console.log("json", json)
  
//           const data =
//             resource === "users"
//               ? json
//               : raw
//               ? this.formatResponseRaw(json.data as IStrapiRecord)
//               : this.formatResponseRA(json.data as IStrapiRecord);
  
//           // console.log(`PAYLOAD: getOne-${resource}-response-after:`, data)
  
//           return { data };
//         },
  
//         getMany: async (resource, params) => {
//           // only get the integers and skip other types of data
//           const ids = params.ids.filter(
//             (id) => typeof id === "number"
//           ) as number[];
//           // const ids = params.ids.map((id) => parseInt(id as string))
//           // @TODO: Consider using the convertRaParamsToStrapiParams function here (so as to not duplicate code or forget about sorting, filtering, and pagination)
  
//           // console.log(`getMany-query-${resource}:`, ids, params)
//           if (ids.length === 0) return { data: [], total: 0 };
//           const operator = params.meta?.operator ?? "$in";
//           const query = {
//             filters: {
//               id: {
//                 [operator]: ids,
//               },
//             },
//           };
  
//           const queryStringify = qs.stringify(query, {
//             encodeValuesOnly: true,
//           });
  
//           const {
//             populate = [],
//             raw = false,
//             image = false,
//           } = typeof params?.meta === "undefined"
//             ? {
//                 populate: [],
//                 raw: false,
//                 image: false,
//               }
//             : params.meta;
  
//           const url = `${
//             this.endpoint
//           }/${resource}?${this.buildPopulationQueryString(
//             populate
//           )}&${queryStringify}`;
  
//           // console.log(`PAYLOAD: getMany-${resource}-request:`, url, params)
  
//           const { json } = await httpClient(url);
  
//           // console.log(`PAYLOAD: getMany-${resource}-response-before:`, json)
  
//           const data = image
//             ? // @TODO: CHange IStrapiRecord to IStrapiDataRecord[] and add IStrapiImageRecord[]
//               JSON.parse(JSON.stringify(json)).map((img: RaRecord) => ({
//                 ...img,
//                 url: `${this.endpoint.replace(/\/api$/, "")}${img.url}`,
//               }))
//             : raw
//             ? (json.data as IStrapiRecord[]).map(this.formatResponseRaw)
//             : (json.data as IStrapiRecord[]).map(this.formatResponseRA);
  
//           // console.log(`PAYLOAD: getMany-${resource}-response-after:`, data)
  
//           return {
//             data,
//             total: json.meta?.pagination?.total ?? 0,
//           };
//         },
  
//         getManyReference: async (resource, params) => {
//           const { page, perPage } = params.pagination;
//           const { field, order } = params.sort;
  
//           const query = {
//             sort: JSON.stringify([field, order]),
//             range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
//             filter: JSON.stringify({
//               ...params.filter,
//               [params.target]: params.id,
//             }),
//           };
  
//           const queryStringify = qs.stringify(query, {
//             encodeValuesOnly: true,
//           });
  
//           const { populate = [], raw } = params?.meta || {
//             populate: [],
//             raw: false,
//           };
  
//           const url = `${
//             this.endpoint
//           }/${resource}?${this.buildPopulationQueryString(
//             populate
//           )}&${queryStringify}`;
  
//           const { json } = await httpClient(url, {});
  
//           // console.log(`PAYLOAD: getManyReference-${resource}-response-before:`, json)
  
//           const data = raw
//             ? (json.data as IStrapiRecord[]).map(this.formatResponseRaw)
//             : (json.data as IStrapiRecord[]).map(this.formatResponseRA);
  
//           // console.log(`PAYLOAD: getManyReference-${resource}-response-after:`, json)
  
//           return {
//             data,
//             total: json.meta?.pagination?.total ?? 0,
//           };
//         },
  
//         update: async (resource, params) => {
//           const url = `${this.endpoint}/${resource}/${params.id}`;
  
//           // Separate the file fields from other data
//           const uploadFieldNames = this.getUploadFieldNames(params.data);
//           const formData = new FormData();
//           const sanitizedData = this.sanitizeRaRecordForStrapi(
//             params.data as RaRecord
//           );
  
//           // console.log("update Data Pre Transform:", params);
  
//           // Append non-file data to formData
//           formData.append("data", JSON.stringify(sanitizedData));
  
//           // Append files to formData
//           uploadFieldNames.forEach((fieldName) => {
//             const fieldData = Array.isArray(params.data[fieldName])
//               ? params.data[fieldName]
//               : [params.data[fieldName]];
  
//             fieldData.forEach((file: StrapiFormattedFile) => {
//               if (file.rawFile instanceof File) {
//                 formData.append(
//                   `files.${fieldName}`,
//                   file.rawFile,
//                   file.title || file.name
//                 );
//               }
//             });
//           });
  
//           const options = {
//             method: "PUT",
//             body: formData,
//           };
  
//           const { json } = await httpClient(url, options as any);
  
//           // Format response
//           const data = this.formatResponseRA(json.data as IStrapiRecord);
//           return { data };
//         },
  
//         updateMany: async (resource, params) => {
//           return {
//             data: (
//               await Promise.all(
//                 params.ids.map((id) => {
//                   const url = `${this.endpoint}/${resource}/${id}`;
  
//                   // console.log(`getList (${resource}) Request Data Pre Transform:`, params)
  
//                   const body = this.raToStrapiObj(params);
  
//                   // console.log(`PAYLOAD: getList-${resource})-request-after:`, params)
  
//                   // console.log('updateMany Data Post Transform:', body)
  
//                   return httpClient(url, {
//                     method: "PUT",
//                     body,
//                   });
//                 })
//               )
//             ).map(({ json }) => {
//               return (json.data as IStrapiRecord).id;
//             }),
//           };
//         },
  
//         create: async (resource, params) => {
//           const url = `${this.endpoint}/${resource}`;
  
//           // console.log(`create-${resource}-request-before:`, params);
  
//           const paramsData = { ...params.data };
  
//           // console.log(`create-${resource}-request-after:`, paramsData);
  
//           const uploadFieldNames = this.getUploadFieldNames(params.data);
  
//           const formData = new FormData();
//           // if (uploadFieldNames.length > 0) {
//           //   uploadFieldNames.forEach((fieldName) => {
//           //     const fieldData = Array.isArray(params.data[fieldName])
//           //       ? params.data[fieldName]
//           //       : [params.data[fieldName]];
//           //     paramsData[fieldName] = fieldData.reduce((acc: any, item: any) => {
//           //       if (item.rawFile instanceof File) {
//           //         formData.append(`files.${fieldName}`, item.rawFile);
//           //       } else {
//           //         acc.push(item.id || item._id);
//           //       }
//           //       return acc;
//           //     }, []);
//           //   });
//           // }
  
//           formData.append("data", JSON.stringify(paramsData));
  
//           // console.log("form");
  
//           // Create options object with explicit types
//           const options = {
//             method: "POST",
//             body: formData,
//           };
  
//           // console.log(`create-${resource}-request-options:`, options);
  
//           const { json } = await httpClient(url, options as any);
  
//           const data = this.formatResponseRA(json.data as IStrapiRecord);
  
//           return { data };
//         },
  
//         delete: (resource, params) =>
//           httpClient(`${this.endpoint}/${resource}/${params.id}`, {
//             method: "DELETE",
//             headers: new Headers({
//               "Content-Type": "text/plain",
//             }),
//           }).then(({ json }) => ({
//             data: json,
//           })),
  
//         deleteMany: (resource, params) =>
//           Promise.all(
//             params.ids.map((id) =>
//               httpClient(`${this.endpoint}/${resource}/${id}`, {
//                 method: "DELETE",
//                 headers: new Headers({
//                   "Content-Type": "text/plain",
//                 }),
//               })
//             )
//           ).then((responses) => ({
//             data: responses.map(({ json }) => (json.data as IStrapiRecord).id),
//           })),
//       } as DataProvider;
//     }
//   }
  
//   export default StrapiDataProviderFactory;
  