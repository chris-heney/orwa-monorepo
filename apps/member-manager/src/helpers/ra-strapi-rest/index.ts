/**
 * @module ra-strapi-rest
 * @category react-admin
 * @subcategory Data Provider
 * @author Marcos
 * @author Chris
 * @license MIT
 * @version 1.1.0
 * @description This is a custom data provider for react-admin that works with Strapi.
 * It is based on the default data provider for react-admin, and is intended
 * to be used with the Strapi provider for react-admin.
 * @see react-admin/src/dataProvider/*.ts
 * @see ra-core/src/types.ts
 */

import {
  fetchUtils,
  DataProvider,
  GET_LIST,
  GET_ONE,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  GetListParams,
  CreateParams,
  UpdateParams,
  GetOneParams,
  GetManyParams,
  DeleteParams,
  GetManyReferenceParams,
  RaRecord,
  UpdateManyParams,
  Identifier,
  Options,
} from 'react-admin'
  
export const SingleType = 'SingleType'
  
  interface IStrapiDataProvider extends DataProvider {
    adjustQueryForStrapi: (params: GetListParams
      | CreateParams
      | UpdateParams
      | GetOneParams
      | GetManyParams
      | GetManyReferenceParams
      | DeleteParams) => string
  
    getUploadFieldNames: (data: any) => string[]
    handleFileUpload: (type: string, resource: string, params: any) => Promise<any>
    formatResponseForRa: (input: RaRecord | RaRecord[], populate?: boolean) => any
    convertHTTPResponse: (response: any, type: string, params: any) => any
    processRequest: (url: string, options?: any) => Promise<any>
  }
  
const strapiRestProvider = (apiUrl: string, httpClient = fetchUtils.fetchJson): IStrapiDataProvider => {
  /**
     * Adjusts the query parameters for Strapi, including sorting, filtering, and pagination.
     * @param params - The input parameters containing pagination, sorting, filtering, target, and ID data.
     * @returns A query string for Strapi with the adjusted parameters.
     */
  const adjustQueryForStrapi = (
    params: GetListParams
        | CreateParams
        | UpdateParams
        | GetOneParams
        | GetManyParams
        | GetManyReferenceParams
        | DeleteParams
  ): string => {
    // Handle SORTING
    const s = params.sort
    const sort =
        s.field === '' ? 'sort=updated_at:desc' : `sort=${s.field}:${s.order.toLowerCase()}`
  
    // Handle FILTER
    const f = params.filter
    const filters = []
  
    for (const key in f) {
      if (key === 'q' && f[key] !== '') {
        filters.push(`_q=${f[key]}`)
      } else {
        // Check if the filter value is an array (e.g., for regions)
        if (Array.isArray(f[key])) {
          for (const value of f[key]) {
            filters.push(`filters[${key}][]=${value}`)
          }
        } else {
          filters.push(`filters[${key}]_or=${f[key]}`)
        }
      }
    }
  
    if (params.id && params.target && params.target.indexOf('_id') !== -1) {
      const target = params.target.substring(0, params.target.length - 3)
      filters.push(`filters[${target}]_eq=${params.id}`)
    }
  
    // Handle PAGINATION
    const { page, perPage } = params.pagination
    const start = (page - 1) * perPage
    const pagination = `pagination[start]=${start}&pagination[limit]=${perPage}`
  
    return `${sort}&${filters.join('&')}&${pagination}`
  }
  
  
  const getUploadFieldNames = (data: any): string[] => {
    if (!data || typeof data !== 'object') return []
    const hasRawFile = (value: any): boolean => {
      return (
        value &&
          typeof value === 'object' &&
          ('rawFile' in value ||
            (Array.isArray(value) && value.some(hasRawFile))
             || Object.values(value).some(hasRawFile))
      )
    }
    // console.log('data', data)
    // console.log('has raw file', Object.keys(data).filter((key: any) => {
    //   return hasRawFile(data[key])
    // }))
    return Object.keys(data).filter((key: any) => {
      return hasRawFile(data[key])
    })
  }
  
  /**
     * Handles file uploads and data updates for a given resource.
     * @param type - The operation type, either UPDATE or a different value for creating new resources.
     * @param resource - The target resource for the file upload or data update.
     * @param params - The parameters containing the data to be uploaded or updated.
     * @returns The processed response from the server, converted to the appropriate format.
     */
  const handleFileUpload = async (type: string, resource: string, params: any) => {
    // console.log('handle file upload', type, resource, params)
    const id = type === UPDATE ? `/${params.id}` : ''
    const url = `${apiUrl}/${resource}${params.id == SingleType ? '' : id}`
    const requestMethod = type === UPDATE ? 'PUT' : 'POST'
    const formData = new FormData()
    const uploadFieldNames = getUploadFieldNames(params.data)
  
    const { created_at, updated_at, createdAt, updatedAt, ...data } = params.data
  
    uploadFieldNames.forEach((fieldName) => {
      const fieldData = Array.isArray(params.data[fieldName])
        ? params.data[fieldName]
        : [params.data[fieldName]]
      data[fieldName] = fieldData.reduce((acc: any, item: any) => {
        item.rawFile instanceof File
          ? formData.append(`files.${fieldName}`, item.rawFile)
          : acc.push(item.id || item._id)
        return acc
      }, [])
    })
  
    formData.append('data', JSON.stringify(data))
  
    const response = await processRequest(url, { method: requestMethod, body: formData })
    // console.log('response', response)
    return convertHTTPResponse(response, type, params)
  }
  
  /**
     * Formats the response from Strapi to react-admin compatible data
     * @param input - The input data to be formatted.
     * @returns The formatted input, either as a single object or an array of objects.
     */
  const formatResponseForRa = (input: RaRecord | RaRecord[], populate = false): any => {
  
    if (populate){
      return Array.isArray(input) ? input.map(formatResponseForDevelopers) : [formatResponseForDevelopers(input)][0]
    }
  
    if (!input || input.length === 0) return input
  
    const processItem = (item: RaRecord) => {
  
      const json = { id: item.id, ...item.attributes }
  
      for (const key in json) {
        const { data } = json[key] || {}
  
        const isArray = Array.isArray(data)
        const isObject = typeof data?.attributes === 'object' ? (
          Object.keys(data?.attributes).length > 0 ? true : false
        ) : false
  
        const isMime = data && (data[0]?.attributes?.mime || data.attributes?.mime)
        if (!data || (isArray && data[0]?.length === 0)) continue
        const processUrl = (url: string) => `${apiUrl.replace(/\/api$/, '')}${url}`
  
        if (isArray && isMime) {
          json[key] = data.map(({ id, attributes }) => ({
            id,
            ...attributes,
            url: processUrl(attributes.url),
          }))
          continue
        }
  
        if (!isArray && isMime) {
          json[key] = { id: data.id, ...data.attributes, url: processUrl(data.attributes.url) }
          continue
        }
          
        if (isObject && populate) {
          for (const key2 in data.attributes) {
            json[key][key2] = data.attributes[key2]
          }
          continue
        }
  
        json[key] = isArray ? data.map(({ id }) => id) : data.id.toString()
      }
        
      return json
    }
  
    return Array.isArray(input) ? input.map(processItem) : [processItem(input)][0]
  }
  
  const formatResponseForDevelopers = (record: RaRecord) => {
  
    const { id } = record
  
    // Flatten the record
    const jsonRecord: RaRecord = { id }
  
    for (const key in record.attributes) {
  
      if (typeof record.attributes[key] !== 'object'){
        jsonRecord[key] = record.attributes[key]
        continue
      }
  
      // data should have id and attributes
      const { data } = record.attributes[key] || {}
      if (!data) continue
  
      // Has Many Relationship:
      const isArray = Array.isArray(data)
        
      // Single Type Relationship:
      const isObject = typeof data?.attributes === 'object' ? (
        Object.keys(data?.attributes).length > 0 ? true : false
      ) : false
  
      if (!isArray && !isObject) {
        jsonRecord[key] = data.id.toString()
        continue
      }
  
      if (isObject) {
        jsonRecord[key] = formatResponseForDevelopers(data)
        continue
      }
  
      if (isArray) {
        jsonRecord[key] = data.map(formatResponseForDevelopers)
        continue
      }
  
      // Old Way: (this should never happen technically)
      jsonRecord[key] = data.id.toString()
    }
  
    return jsonRecord
  }
  
  
  
  const convertHTTPResponse = (
    response: any,
    type: string,
    params: GetListParams
        | CreateParams
        | UpdateParams
        | GetOneParams
        | GetManyParams
        | GetManyReferenceParams
        | DeleteParams
  ): any => {
  
    const { json } = response
    const populate = params?.meta?.populate || false
    const raData = formatResponseForRa(json.data, populate)
  
    switch (type) {
    case GET_ONE:
      return { data: raData }
    case GET_LIST:
    case GET_MANY_REFERENCE:
      return {
        data: Array.isArray(raData) ? raData : [],
        total: json.meta?.pagination?.total || 0,
      }
    case CREATE:
      return { data: { ...(params as CreateParams).data, id: raData.id } }
    case DELETE:
      return { data: { id: null } }
    default:
      return { data: raData }
    }
  }
  
  const processRequest = async (url: string, options = {}) => {
    const separator = url.includes('?') ? '&' : '?'
    return httpClient(`${url}${separator}populate=*`, options)
  }
  
  return {
    getList: async (resource: string, params: GetListParams) => {
      const url = `${apiUrl}/${resource}?${adjustQueryForStrapi(params)}`
      const res = await processRequest(url, {})
      return convertHTTPResponse(res, GET_LIST, params)
    },
  
    getOne: async (resource: string, params: GetOneParams) => {
      const isSingleType = params.id === SingleType
      const url = `${apiUrl}/${resource}${isSingleType ? '' : '/' + params.id}`
      const res = await processRequest(url, {})
      return convertHTTPResponse(res, GET_ONE, params)
    },
  
    getMany: async (resource: string, params: GetManyParams) => {
      if (params.ids.length === 0) return { data: [] }
      const ids = params.ids.filter(
        (i: Identifier | RaRecord) => !(typeof i === 'object' && Object.prototype.hasOwnProperty.call(i, 'data') && i.data === null)
      )
  
      const responses = await Promise.all(
        ids.map((i: Identifier | RaRecord) => {
          return processRequest(`${apiUrl}/${resource}/${(i as RaRecord).id || (i as RaRecord)._id || i}`, {
            method: 'GET',
  
          })
        })
      )
      return {
        data: responses.map((response) => formatResponseForRa(response.json.data)),
      }
    },
  
    getManyReference: async (resource: string, params: GetManyReferenceParams) => {
      const url = `${apiUrl}/${resource}?${adjustQueryForStrapi({ params })}`
      const res = await processRequest(url, {})
      return convertHTTPResponse(res, GET_MANY_REFERENCE, params)
    },
  
    update: async (resource: string, params: UpdateParams) => {
  
      if (getUploadFieldNames(params.data).length > 0)
        return await handleFileUpload(UPDATE, resource, params)
  
      const isSingleType = params.id === SingleType
      const url = `${apiUrl}/${resource}${isSingleType ? '' : '/' + params.id}`
      const options: Options = {}
  
      options.method = 'PUT'
      // Omit created_at/updated_at(RDS) and createdAt/updatedAt(Mongo) in request body
      // const { created_at, updated_at, createdAt, updatedAt, ...data } = params.data
  
      const { ...data } = params.data
  
      options.body = JSON.stringify({ data: { ...data } })

      // console.log('update', url, options)
  
      const res = await processRequest(url, options)  
      return convertHTTPResponse(res, UPDATE, params)
    },
  
    updateMany: async <UpdateManyResult>(resource: string, params: UpdateManyParams) => {
  
      const responses = await Promise.all(
  
        params.ids.map((id: Identifier) => {
          // Omit created_at/updated_at(RDS) and createdAt/updatedAt(Mongo) in request body
          // const { created_at, updated_at, createdAt, updatedAt, ...data } = params.data
  
          const { ...data } = params.data
  
          return processRequest(`${apiUrl}/${resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data }),
          }) as UpdateManyResult
        })
  
      )
      return {
        data: responses.map((response) => formatResponseForRa(response.json.data)),
      }
    },
  
    create: async <CreateResult>(resource: string, params: CreateParams) => {
      if (getUploadFieldNames(params.data).length > 0)
        return await handleFileUpload(CREATE, resource, params)
  
      const url = `${apiUrl}/${resource}`
      const res = await processRequest(url, {
        method: 'POST',
        body: JSON.stringify({ data: { ...params.data } }),
      })
      return convertHTTPResponse(res, CREATE, { data: params.data }) as CreateResult
    },
  
    delete: async <DeleteResult>(resource: string, { id }: RaRecord) => {
      const url = `${apiUrl}/${resource}${id === SingleType ? '' : `/${id}`}`
      const res = await processRequest(url, { method: 'DELETE' })
      return convertHTTPResponse(res, DELETE, { id }) as DeleteResult
    },
  
    deleteMany: async <DeleteManyResult>(resource: string, { ids }) => {
      const data = await Promise.all(
        ids.map(async (id: number) => {
          const response = await processRequest(`${apiUrl}/${resource}/${id}`, {
            method: 'DELETE',
          })
          return formatResponseForRa(response?.json.data)
        })
      )
      return { data } as DeleteManyResult
    },
  }
}
  
export default strapiRestProvider