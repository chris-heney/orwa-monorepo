import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import {
    useArrayInput,
    useListContext,
    useSimpleFormIterator,
    useTranslate,
} from 'react-admin';
import { Button, Stack, styled, SxProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/ClearAll';
import FilterIcon from '@mui/icons-material/Filter';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { getListFiltersFromFormValues } from './getListFiltersFromFormValues';

export const StackedFiltersFormActions = (props: StackedFiltersFormActions) => {
    const { className, onFiltersApplied, sx } = props;
    const { filterValues, setFilters } = useListContext();
    const translate = useTranslate();
    const { add } = useSimpleFormIterator();
    const { remove } = useArrayInput();
    const { getFieldState, getValues } = useFormContext();
    const filterFieldState = getFieldState('filters');

    const hadFilters = useRef(false);

    const disableApply = useMemo(() => {
        const filters = getListFiltersFromFormValues(getValues().filters);
        const hasFilters = Object.keys(filters).length > 0;
        const isDirty = filterFieldState.isDirty;
        // If users remove the last filter, the form is not dirty and the field might not be dirty as well
        // so we need to check whether the form had filters before and still enable the apply button in this case
        const disableApply = !isDirty && (!hasFilters || !hadFilters.current);
        hadFilters.current = hasFilters;
        return disableApply;
    }, [filterFieldState, getValues]);

    const addFilter = useCallback(() => {
        add();
    }, [add]);

    const handleClearFilters = useCallback(() => {
        // calling the replace method would probably be better
        // but it doesn't work for some reason
        // See https://react-hook-form.com/docs/usefieldarray
        remove(); // Clear the filter ArrayInput
        add(); // Add en empty filter so that the form is not empty
        setFilters({}, {}, false); // Clear the list filters
        if (onFiltersApplied && typeof onFiltersApplied === 'function') {
            onFiltersApplied();
        }
    }, [add, onFiltersApplied, remove, setFilters]);

    return (
        <Root
            className={clsx(StackedFiltersActionsClasses.root, className)}
            gap={1}
            flexDirection="row"
            justifyContent="space-between"
            sx={sx}
        >
            <Button
                className={StackedFiltersActionsClasses.addFilterButton}
                disableElevation
                onClick={addFilter}
                startIcon={<AddIcon />}
                size="small"
            >
                {translate('ra.action.add_filter', {
                    _: 'Add filter',
                })}
            </Button>
            <Stack gap={1} flexDirection="row">
                {Object.keys(filterValues).length > 0 && (
                    <Button
                        className={
                            StackedFiltersActionsClasses.removeFiltersButton
                        }
                        disableElevation
                        onClick={handleClearFilters}
                        startIcon={<ClearIcon />}
                        size="small"
                    >
                        {translate(
                            'ra-form-layout.filters.remove_all_filters',
                            {
                                _: 'Remove all filters',
                            }
                        )}
                    </Button>
                )}
                <Button
                    className={StackedFiltersActionsClasses.applyButton}
                    disableElevation
                    type="submit"
                    startIcon={<FilterIcon />}
                    size="small"
                    disabled={disableApply}
                >
                    {translate('ra-form-layout.filters.apply_filters', {
                        _: 'Apply',
                    })}
                </Button>
            </Stack>
        </Root>
    );
};

// eslint-disable-next-line no-redeclare
export interface StackedFiltersFormActions {
    className?: string;
    onFiltersApplied?: () => void;
    sx?: SxProps;
}

const PREFIX = 'RaStackedFiltersActions';

export const StackedFiltersActionsClasses = {
    root: `${PREFIX}-root`,
    addFilterButton: `${PREFIX}-addFilterButton`,
    removeFiltersButton: `${PREFIX}-removeFiltersButton`,
    applyButton: `${PREFIX}-applyButton`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (props: any, styles) => styles.root,
})(() => ({}));
