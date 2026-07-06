import * as React from 'react';
import { ReactElement } from 'react';
import { DatagridRowProps, Identifier, RaRecord, TransformData, UpdateParams } from 'react-admin';
import { UseMutationOptions } from 'react-query';
declare const EditableRow: (props: EditableRowProps) => React.JSX.Element;
export interface EditableRowProps<RecordType extends RaRecord = any> extends DatagridRowProps {
    form: ReactElement;
    id?: Identifier;
    record?: RaRecord;
    [key: string]: any;
    mutationOptions?: UseMutationOptions<RecordType, unknown, UpdateParams<RecordType>>;
    transform?: TransformData;
}
export declare const DatagridRowClasses: {
    td: string;
};
export default EditableRow;
//# sourceMappingURL=EditableDatagridRow.d.ts.map