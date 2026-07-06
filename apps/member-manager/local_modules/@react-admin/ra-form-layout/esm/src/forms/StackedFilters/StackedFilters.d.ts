import * as React from 'react';
import { ButtonProps } from 'react-admin';
import { BadgeProps, PopoverProps, SxProps } from '@mui/material';
import { FiltersConfig } from './types';
import { StackedFiltersFormProps } from './StackedFiltersForm';
/**
 * An alternative to the <Filter> component that add the concept of operator and displays the filters form in a popover.
 * @example
 * import { CreateButton,List, NumberInput, TopToolbar } from 'react-admin';
 * import { StackedFilters, FiltersConfig, textFilter, numberFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';
 * import { MyNumberRangeInput } from './MyNumberRangeInput';
 *
 * const postListFilters: FiltersConfig = {
 *     title: textFilter(),
 *     views: numberFilter(),
 *     tag_ids: referenceFilter({ reference: 'tags' }),
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
 * const PostListToolbar = () => (
 *     <TopToolbar>
 *         <CreateButton />
 *         <StackedFilters config={postListFilters} />
 *     </TopToolbar>
 * );
 * const PostList = () => (
 *     <List actions={<PostListToolbar />}>
 *         ...
 *     </List>
 * );
 * @param props
 * @param props.config {FilterConfig} The filters configuration.
 * @returns A filter element for a <List>.
 */
export declare const StackedFilters: (props: StackedFiltersProps) => React.JSX.Element;
export type StackedFiltersProps = {
    BadgeProps?: Partial<BadgeProps>;
    ButtonProps?: Partial<ButtonProps>;
    className?: string;
    config: FiltersConfig;
    PopoverProps?: Partial<PopoverProps>;
    StackedFiltersFormProps?: Partial<StackedFiltersFormProps>;
    sx?: SxProps;
};
export declare const StackedFiltersClasses: {
    root: string;
    popover: string;
    formContainer: string;
};
//# sourceMappingURL=StackedFilters.d.ts.map