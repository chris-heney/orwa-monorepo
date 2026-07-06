import { ReactElement } from 'react';
export type FilterOperator = {
    label: string;
    value: string;
    input?: (props: FilterOperatorProps) => ReactElement;
};
export type FilterOperatorProps = {
    className?: string;
    operator: string;
    source: string;
    label?: string | ReactElement;
};
export type FilterDefinition = {
    label?: string | ReactElement;
    operators: FilterOperator[];
    input?: (props: FilterOperatorProps) => ReactElement;
};
export type FiltersConfig = Record<string, FilterDefinition>;
//# sourceMappingURL=types.d.ts.map