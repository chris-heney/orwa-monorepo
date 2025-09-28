/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CreateParams,
    DataProvider,
    GetListParams,
    RaRecord,
    UpdateManyParams,
    UpdateParams,
  } from 'react-admin'
  
  export interface IRaFile {
    id: number
    rawFile: File
    src: string
    title: string
  }
  
  export interface IPopulationOption {
    [key: string]: string
  }
  
  export interface IStrapiGraphqlError {
    message: string
    extensions: {
      error: {
        name: string
        message: string
        details: {
          [key: string]: string
            | number
            | boolean
            | IStrapiRecord
            | null
            | (
              string
              | number
              | boolean
              | IStrapiRecord
            )[]
        }
      }
    }
  }
  
  export interface IStrapiAttributes {
    [key: string]: any
  }
  
  export interface IStrapiRecord {
    id: number
    attributes: IStrapiAttributes
    meta: {
      availableLocales: string[]
    }
  }
  
  export interface IStrapiRestError {
    status: string
    name: string
    message: string
    details: string
  }
  
  export interface IStrapiRestPagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
  
  export interface IStrapiPayload {
    data: IStrapiRecord | IStrapiRecord[]
    error?: IStrapiRestError
    meta?: {
      pagination: IStrapiRestPagination
    }
  }
  
  export interface IStrapiRestResponse {
    status: number
    headers: Headers
    body: string
    json: IStrapiPayload 
  }
  
  export interface IStrapiRolePayload {
    role : {
    createdAt: string
    description: string
    id: number
    name: string
    nb_users: number
    type: string
    updatedAt: string
    }
  }
  
  export interface IStrapiGraphqlClient {
    (
      query: string,
      variables?: Record<
        string,
        string
        | number
        | boolean
        | null
        | (
          string
          | number
          | boolean
        )[]
      >
    ): Promise<IStrapiRestResponse>
  }
  
  export interface IStrapiRestClientOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: string
    // body: IStrapiPayload
    // body?: IStrapiRecord | Record<'data', UpdateManyParams>
    headers?: Headers
  }
  
  export interface IStrapiRestClient {
    (
      url: string,
      options?: IStrapiRestClientOptions
    ): Promise<IStrapiRestResponse>
  }
  
  export interface IStrapiDataProviderFactoryOptions {
    endpoint: string
    type: 'graphql' | 'rest'
  }
  
  export interface IMultimedia {
    [key: string]: any
  }
  
  export interface IStrapiDataProviderFactory {
  
    // TODO: Entertain the possiblity of using URL type
    endpoint: string
    type: 'graphql' | 'rest'
  
    init(): DataProvider
    restProvider(): DataProvider
    // @TODO: Implement this:
    // graphProvider(): DataProvider
  
    buildPopulationQueryString: (
      populationOptions: IPopulationOption[]
    ) => string
  
    // Strapi > React Admin
    formatResponseRA: (
      object: IStrapiRecord
    ) => RaRecord
    formatResponseRaw: (
      object: IStrapiRecord
    ) => RaRecord
  
    // React Admin > Strapi
    convertRaParamsToStrapiParams: (
      params: GetListParams
    ) => any
    raToStrapiObj: (
      record: CreateParams | UpdateParams | UpdateManyParams
    ) => string
  
    separateMultimedia: (
      object: IMultimedia
    ) => {
      multimedia: IMultimedia | null
      data: IMultimedia
    }
  }
  
  export type FilterValue = string | number | boolean | string[] | number[] | boolean[];
  