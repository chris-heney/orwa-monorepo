/* eslint-disable react/display-name */
import * as React from 'react';
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    BooleanInput,
    CommonInputProps,
    DateInput,
    NumberInput,
    ReferenceArrayInput,
    ReferenceInput,
    SelectArrayInput,
    SelectInput,
    TextInput,
    useTranslate,
} from 'react-admin';
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
export const textFilter = (
    {
        operators: includedOperators = ['eq', 'neq', 'q'],
    }: {
        operators?: ('eq' | 'neq' | 'q')[];
    } = { operators: ['eq', 'neq', 'q'] }
): FilterDefinition => {
    // eslint-disable-next-line array-callback-return
    const operators = includedOperators.map(operator => {
        switch (operator) {
            case 'eq':
                return {
                    value: 'eq',
                    label: 'ra-form-layout.filters.operators.eq',
                };
            case 'neq':
                return {
                    value: 'neq',
                    label: 'ra-form-layout.filters.operators.neq',
                };
            case 'q':
                return {
                    value: 'q',
                    label: 'ra-form-layout.filters.operators.q',
                };
        }
    });
    return {
        operators,
        input: (props: CommonInputProps) => (
            <TextInput sx={{ flex: 1 }} helperText={false} {...props} />
        ),
    };
};

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
export const numberFilter = (
    {
        operators: includedOperators = ['eq', 'neq', 'gt', 'lt'],
    }: {
        operators?: ('eq' | 'neq' | 'gt' | 'lt')[];
    } = { operators: ['eq', 'neq', 'gt', 'lt'] }
): FilterDefinition => {
    // eslint-disable-next-line array-callback-return
    const operators = includedOperators.map(operator => {
        switch (operator) {
            case 'eq':
                return {
                    value: 'eq',
                    label: 'ra-form-layout.filters.operators.eq',
                };
            case 'neq':
                return {
                    value: 'neq',
                    label: 'ra-form-layout.filters.operators.neq',
                };
            case 'gt':
                return {
                    value: 'gt',
                    label: 'ra-form-layout.filters.operators.gt',
                };
            case 'lt':
                return {
                    value: 'lt',
                    label: 'ra-form-layout.filters.operators.lt',
                };
        }
    });
    return {
        operators,
        input: (props: CommonInputProps) => (
            <NumberInput sx={{ flex: 1 }} helperText={false} {...props} />
        ),
    };
};

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
export const dateFilter = (
    {
        operators: includedOperators = ['eq', 'neq', 'gt', 'lt'],
    }: {
        operators?: ('eq' | 'neq' | 'gt' | 'lt')[];
    } = { operators: ['eq', 'neq', 'gt', 'lt'] }
): FilterDefinition => {
    // eslint-disable-next-line array-callback-return
    const operators = includedOperators.map(operator => {
        switch (operator) {
            case 'eq':
                return {
                    value: 'eq',
                    label: 'ra-form-layout.filters.operators.eq',
                };
            case 'neq':
                return {
                    value: 'neq',
                    label: 'ra-form-layout.filters.operators.neq',
                };
            case 'gt':
                return {
                    value: 'gt',
                    label: 'ra-form-layout.filters.operators.gt',
                };
            case 'lt':
                return {
                    value: 'lt',
                    label: 'ra-form-layout.filters.operators.lt',
                };
        }
    });
    return {
        operators,
        input: (props: CommonInputProps) => (
            <DateInput sx={{ flex: 1 }} helperText={false} {...props} />
        ),
    };
};

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
export const booleanFilter = (): FilterDefinition => {
    return {
        operators: [
            { value: 'eq', label: 'ra-form-layout.filters.operators.eq' },
        ],
        // Here we don't want to apply the default label
        input: ({ label, ...props }: CommonInputProps) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const translate = useTranslate();
            return (
                <BooleanInput
                    sx={{ flex: 1 }}
                    label={translate(
                        'ra-form-layout.filters.operators.boolean',
                        {
                            _: 'Is true',
                        }
                    )}
                    helperText={false}
                    {...props}
                />
            );
        },
    };
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
export const choicesFilter = ({
    operators: includedOperators = ['eq', 'neq', 'eq_any', 'neq_any'],
    choices,
    optionText,
    optionValue,
}: {
    operators?: ('eq' | 'neq' | 'eq_any' | 'neq_any')[];
    choices: any[];
    optionText?: string;
    optionValue?: string;
}) => {
    const operators = [];

    if (includedOperators.includes('eq')) {
        operators.push({
            value: 'eq',
            label: 'ra-form-layout.filters.operators.eq',
        });
    }
    if (includedOperators.includes('neq')) {
        operators.push({
            value: 'neq',
            label: 'ra-form-layout.filters.operators.neq',
        });
    }
    if (includedOperators.includes('eq_any')) {
        operators.push({
            value: 'eq_any',
            label: 'ra-form-layout.filters.operators.eq_any',
            input: (props: CommonInputProps) => (
                <SelectArrayInput
                    choices={choices}
                    optionText={optionText}
                    optionValue={optionValue}
                    helperText={false}
                    {...props}
                />
            ),
        });
    }
    if (includedOperators.includes('neq_any')) {
        operators.push({
            value: 'neq_any',
            label: 'ra-form-layout.filters.operators.neq_any',
            input: (props: CommonInputProps) => (
                <SelectArrayInput
                    choices={choices}
                    optionText={optionText}
                    optionValue={optionValue}
                    helperText={false}
                    {...props}
                />
            ),
        });
    }

    return {
        operators,
        input: (props: CommonInputProps) => (
            <SelectInput
                choices={choices}
                optionText={optionText}
                optionValue={optionValue}
                helperText={false}
                {...props}
            />
        ),
    };
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
export const choicesArrayFilter = ({
    operators: includedOperators = ['inc', 'inc_any', 'ninc_any'],
    choices,
    optionText,
    optionValue,
}: {
    operators?: ('inc' | 'inc_any' | 'ninc_any')[];
    choices: any[];
    optionText?: string;
    optionValue?: string;
}) => {
    const operators = [];

    if (includedOperators.includes('inc')) {
        operators.push({
            value: 'inc',
            label: 'ra-form-layout.filters.operators.inc',
        });
    }
    if (includedOperators.includes('inc_any')) {
        operators.push({
            value: 'inc_any',
            label: 'ra-form-layout.filters.operators.inc_any',
        });
    }
    if (includedOperators.includes('ninc_any')) {
        operators.push({
            value: 'ninc_any',
            label: 'ra-form-layout.filters.operators.ninc_any',
        });
    }

    return {
        operators,
        input: (props: CommonInputProps) => (
            <SelectArrayInput
                choices={choices}
                optionText={optionText}
                optionValue={optionValue}
                helperText={false}
                {...props}
            />
        ),
    };
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
export const referenceFilter = ({
    operators: includedOperators = ['eq', 'neq', 'eq_any', 'neq_any'],
    reference,
    optionText,
}: {
    operators?: ('eq' | 'neq' | 'eq_any' | 'neq_any')[];
    reference: string;
    optionText?: string;
}) => {
    const operators = [];

    if (includedOperators.includes('eq')) {
        operators.push({
            value: 'eq',
            label: 'ra-form-layout.filters.operators.eq',
        });
    }
    if (includedOperators.includes('neq')) {
        operators.push({
            value: 'neq',
            label: 'ra-form-layout.filters.operators.neq',
        });
    }
    if (includedOperators.includes('eq_any')) {
        operators.push({
            value: 'eq_any',
            label: 'ra-form-layout.filters.operators.eq_any',
            input: ({ source, ...props }: CommonInputProps) => (
                <ReferenceArrayInput source={source} reference={reference}>
                    <AutocompleteArrayInput
                        optionText={optionText}
                        sx={{ flexBasis: '100%' }}
                        helperText={false}
                        {...props}
                    />
                </ReferenceArrayInput>
            ),
        });
    }
    if (includedOperators.includes('neq_any')) {
        operators.push({
            value: 'neq_any',
            label: 'ra-form-layout.filters.operators.neq_any',
            input: ({ source, ...props }: CommonInputProps) => (
                <ReferenceArrayInput source={source} reference={reference}>
                    <AutocompleteArrayInput
                        optionText={optionText}
                        sx={{ flexBasis: '100%' }}
                        helperText={false}
                        {...props}
                    />
                </ReferenceArrayInput>
            ),
        });
    }

    return {
        operators,
        input: ({ source, ...props }: CommonInputProps) => (
            <ReferenceInput source={source} reference={reference}>
                <AutocompleteInput
                    optionText={optionText}
                    helperText={false}
                    {...props}
                />
            </ReferenceInput>
        ),
    };
};
