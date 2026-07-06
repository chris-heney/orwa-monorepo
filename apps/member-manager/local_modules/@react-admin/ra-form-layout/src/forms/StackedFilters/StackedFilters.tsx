import * as React from 'react';
import { MouseEvent, useCallback, useState } from 'react';
import {
    ButtonProps,
    Button as RaButton,
    useListContext,
    useTranslate,
} from 'react-admin';
import {
    Badge,
    BadgeProps,
    Box,
    Popover,
    PopoverProps,
    styled,
    SxProps,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import clsx from 'clsx';
import { FiltersConfig } from './types';
import {
    StackedFiltersForm,
    StackedFiltersFormProps,
} from './StackedFiltersForm';

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
export const StackedFilters = (props: StackedFiltersProps) => {
    const {
        BadgeProps,
        ButtonProps,
        className,
        config,
        PopoverProps,
        StackedFiltersFormProps,
        sx,
    } = props;
    const translate = useTranslate();
    const { filterValues } = useListContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handlePopoverClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const handlePopoverOpen = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        },
        [setAnchorEl]
    );

    return (
        <Root className={clsx(StackedFiltersClasses.root, className)} sx={sx}>
            <Badge
                badgeContent={Object.keys(filterValues).length}
                color="secondary"
                id="filters-badge"
                {...BadgeProps}
            >
                <RaButton
                    onClick={handlePopoverOpen}
                    size="small"
                    label={translate(
                        'ra-form-layout.filters.filters_button_label',
                        {
                            _: 'Filters',
                        }
                    )}
                    aria-describedby="filters-badge"
                    {...ButtonProps}
                >
                    <FilterListIcon />
                </RaButton>
            </Badge>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                {...PopoverProps}
            >
                <Box
                    className={StackedFiltersClasses.formContainer}
                    minWidth={theme => theme.breakpoints.values.sm}
                    p={1}
                >
                    <StackedFiltersForm
                        config={config}
                        onFiltersApplied={handlePopoverClose}
                        {...StackedFiltersFormProps}
                    />
                </Box>
            </Popover>
        </Root>
    );
};

export type StackedFiltersProps = {
    BadgeProps?: Partial<BadgeProps>;
    ButtonProps?: Partial<ButtonProps>;
    className?: string;
    config: FiltersConfig;
    PopoverProps?: Partial<PopoverProps>;
    StackedFiltersFormProps?: Partial<StackedFiltersFormProps>;
    sx?: SxProps;
};

const PREFIX = 'RaStackedFilters';

export const StackedFiltersClasses = {
    root: `${PREFIX}-root`,
    popover: `${PREFIX}-popover`,
    formContainer: `${PREFIX}-form-container`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props: any, styles) => styles.root,
})(() => ({}));
