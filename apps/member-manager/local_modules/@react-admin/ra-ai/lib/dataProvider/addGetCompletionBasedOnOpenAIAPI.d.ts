import { DataProvider } from 'react-admin';
import { GetCompletionParams } from './useGetCompletion';
/**
 * Add a getCompletion method to the dataProvider based on the OpenAI API
 * @see https://beta.openai.com/docs/api-reference/completions/create
 *
 * The method expects the OpenAI API key to be stored in the localStorage under the key 'ra-ai.openai-api-key'.
 * It's up to you to store the key in the localStorage (e.g. in authProvider.login()) and to remove it (e.g. in authProvider.logout())
 *
 * The getCompletion method will call the OpenAI completion API with the passed prompt
 *
 * @example
 * const dataProvider = addGetCompletionBasedOnOpenAIAPI({
 *    dataProvider: restDataProvider,
 * });
 * dataProvider
 *   .getCompletion('lorem ipsum dolor')
 *   .then(({ data }) => {
 *      console.log(data); // 'sit amet'
 *   });
 *
 * @returns DataProvider
 */
export declare const addGetCompletionBasedOnOpenAIAPI: ({ dataProvider, endpoint, defaultParams, httpClient, }: {
    dataProvider: DataProvider;
    endpoint?: string;
    defaultParams?: any;
    httpClient?: (url: string, options?: any) => Promise<any>;
}) => {
    getCompletion: (parameters?: GetCompletionParams) => Promise<{
        data: any;
    }>;
    getList: <RecordType extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetListParams) => Promise<import("react-admin").GetListResult<RecordType>>;
    getOne: <RecordType_1 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetOneParams<RecordType_1>) => Promise<import("react-admin").GetOneResult<RecordType_1>>;
    getMany: <RecordType_2 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetManyParams) => Promise<import("react-admin").GetManyResult<RecordType_2>>;
    getManyReference: <RecordType_3 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetManyReferenceParams) => Promise<import("react-admin").GetManyReferenceResult<RecordType_3>>;
    update: <RecordType_4 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").UpdateParams<any>) => Promise<import("react-admin").UpdateResult<RecordType_4>>;
    updateMany: <RecordType_5 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").UpdateManyParams<any>) => Promise<import("react-admin").UpdateManyResult<RecordType_5>>;
    create: <RecordType_6 extends Omit<import("react-admin").RaRecord<import("react-admin").Identifier>, "id"> = any, ResultRecordType extends import("react-admin").RaRecord<import("react-admin").Identifier> = RecordType_6 & {
        id: import("react-admin").Identifier;
    }>(resource: string, params: import("react-admin").CreateParams<any>) => Promise<import("react-admin").CreateResult<ResultRecordType>>;
    delete: <RecordType_7 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").DeleteParams<RecordType_7>) => Promise<import("react-admin").DeleteResult<RecordType_7>>;
    deleteMany: <RecordType_8 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").DeleteManyParams<RecordType_8>) => Promise<import("react-admin").DeleteManyResult<RecordType_8>>;
};
//# sourceMappingURL=addGetCompletionBasedOnOpenAIAPI.d.ts.map