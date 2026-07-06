import * as React from 'react';
import { SxProps } from '@mui/material';
import { FiltersConfig } from './types';
/**
 * An alternative to the <Filter> component that add the concept of operator.
 * It allows users to apply an operator with a value to multiple fields.
 *
 * @example
 * import { List, NumberInput } from 'react-admin';
 * import { StackedFilters, FiltersConfig, textFilter, numberFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';
 * import { MyNumberRangeInput } from './MyNumberRangeInput';
 *
 * const PostListFilters: FiltersConfig = {
 *     title: textFilter(),
 *     views: numberFilter(),
 *     tags: referenceFilter({ reference: 'tags' }),
 *     published: booleanFilter(),
 *     note: {
 *         operators: [
 *            { value: 'eq', label: 'Equals' },
 *            { value: 'neq', label: 'Not Equals' },
 *            { value: 'between', label: 'Between', input: ({ source }) => <MyNumberRangeInput source={source} /> },
 *         ],
 *         input: ({ source }) => <NumberInput source={source} />,
 *     }
 * };
 * const PostList = (props) => (
 *    <ListBase {...props}>
 *       <Accordion>
 *           <AccordionSummary
 *               expandIcon={<ExpandMoreIcon />}
 *               aria-controls="filters-panel-content"
 *               id="filters-panel-header"
 *           >
 *               <Typography>Filters</Typography>
 *           </AccordionSummary>
 *           <AccordionDetails>
 *               <StackedFiltersForm config={PostListFilters} />
 *           </AccordionDetails>
 *       </Accordion>
 *       ...
 *     </ListBase>
 * );
 * @param props
 * @param props.config {FilterConfig} The filters configuration.
 * @param props.onFiltersApplied Callback function called after the filters have been applied.
 * @returns A filter form for a <List>.
 */
export declare const StackedFiltersForm: (props: StackedFiltersFormProps) => React.JSX.Element;
export interface StackedFiltersFormProps {
    className?: string;
    config: FiltersConfig;
    onFiltersApplied?: () => void;
    sx?: SxProps;
}
export declare const StackedFiltersFormClasses: {
    root: string;
    sourceInput: string;
    operatorInput: string;
    valueInput: string;
};
//# sourceMappingURL=StackedFiltersForm.d.ts.map