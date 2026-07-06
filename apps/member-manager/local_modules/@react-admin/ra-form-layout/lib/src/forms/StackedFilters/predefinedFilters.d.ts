import * as React from 'react';
import { CommonInputProps } from 'react-admin';
import { FilterDefinition } from './types';
/**
 * Get a filter definition for a text field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { textFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    title: textFilter(),
 * };
 *
 * @example With custom operators
 * import { textFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    title: textFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'q'].
 * @returns A filter definition for a text field.
 */
export declare const textFilter: ({ operators: includedOperators, }?: {
    operators?: ('eq' | 'neq' | 'q')[];
}) => FilterDefinition;
/**
 * Get a filter definition for a numeric field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { numberFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    views: numberFilter(),
 * };
 *
 * @example With custom operators
 * import { numberFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    views: numberFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'gt', 'lt'].
 * @returns A filter definition for a numeric field.
 */
export declare const numberFilter: ({ operators: includedOperators, }?: {
    operators?: ('eq' | 'neq' | 'gt' | 'lt')[];
}) => FilterDefinition;
/**
 * Get a filter definition for a date field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { dateFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    published_at: dateFilter(),
 * };
 *
 * @example With custom operators
 * import { dateFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    published_at: dateFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'gt', 'lt'].
 * @returns A filter definition for a date field.
 */
export declare const dateFilter: ({ operators: includedOperators, }?: {
    operators?: ('eq' | 'neq' | 'gt' | 'lt')[];
}) => FilterDefinition;
/**
 * Get a filter definition for a boolean field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { booleanFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    published: booleanFilter(),
 * };
 *
 * @returns A filter definition for a boolean field.
 */
export declare const booleanFilter: () => FilterDefinition;
/**
 * Get a filter definition for a choices field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter(),
 * };
 *
 * @example With custom operators
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'eq_any', 'neq_any'].
 * @returns A filter definition for a choices field.
 */
export declare const choicesFilter: ({ operators: includedOperators, choices, optionText, optionValue, }: {
    operators?: ('eq' | 'neq' | 'eq_any' | 'neq_any')[];
    choices: any[];
    optionText?: string;
    optionValue?: string;
}) => {
    operators: any[];
    input: (props: CommonInputProps) => React.JSX.Element;
};
/**
 * Get a filter definition for a choices field to use in a <StackedFilters> component.
 * @example Basic usage
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter(),
 * };
 *
 * @example With custom operators
 * import { selectFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: selectFilter({ operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'eq_any', 'neq_any'].
 * @returns A filter definition for a choices field.
 */
export declare const choicesArrayFilter: ({ operators: includedOperators, choices, optionText, optionValue, }: {
    operators?: ('inc' | 'inc_any' | 'ninc_any')[];
    choices: any[];
    optionText?: string;
    optionValue?: string;
}) => {
    operators: any[];
    input: (props: CommonInputProps) => React.JSX.Element;
};
/**
 * Get a filter definition for a choices field through references to use in a <StackedFilters> component.
 * @example Basic usage
 * import { referenceFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: referenceFilter({ reference: 'tags' }),
 * };
 *
 * @example With custom operators
 * import { referenceFilter } from '@react-admin/ra-form-layout';
 * const PostListFilters: FiltersConfig = {
 *    tags: referenceFilter({ reference: 'tags', operators: ['eq', 'neq'] }),
 * };
 * @param options
 * @param options.operators The operators to include in the filter. Defaults to ['eq', 'neq', 'eq_any', 'neq_any'].
 * @returns A filter definition for a choices field through references.
 */
export declare const referenceFilter: ({ operators: includedOperators, reference, optionText, }: {
    operators?: ('eq' | 'neq' | 'eq_any' | 'neq_any')[];
    reference: string;
    optionText?: string;
}) => {
    operators: any[];
    input: ({ source, ...props }: CommonInputProps) => React.JSX.Element;
};
//# sourceMappingURL=predefinedFilters.d.ts.map