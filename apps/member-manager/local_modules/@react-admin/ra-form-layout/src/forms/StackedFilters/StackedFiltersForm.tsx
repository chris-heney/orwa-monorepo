import * as React from 'react';
import { useCallback, useEffect } from 'react';
import {
    ArrayInput,
    AutocompleteInput,
    AutocompleteInputProps,
    ButtonProps,
    CommonInputProps,
    Form,
    FormDataConsumer,
    IconButtonWithTooltip,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    useListContext,
    useResourceContext,
    useSimpleFormIterator,
    useSimpleFormIteratorItem,
    useTranslate,
    useTranslateLabel,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { styled, SxProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';
import { getListFiltersFromFormValues } from './getListFiltersFromFormValues';
import { getFormValuesFromListFilters } from './getFormValuesFromListFilters';
import { FilterOperator, FiltersConfig } from './types';
import { StackedFiltersFormActions } from './StackedFiltersActions';

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
export const StackedFiltersForm = (props: StackedFiltersFormProps) => {
    const { className, config, onFiltersApplied, sx } = props;
    const translate = useTranslate();
    const { filterValues, setFilters } = useListContext();

    const onApplyFilters = useCallback(
        values => {
            const { filters } = values;
            const newFilters = getListFiltersFromFormValues(filters);

            setFilters(
                newFilters,
                Object.keys(newFilters).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {})
            );

            if (onFiltersApplied && typeof onFiltersApplied === 'function') {
                onFiltersApplied();
            }
        },
        [onFiltersApplied, setFilters]
    );

    const appliedFilters = {
        filters: getFormValuesFromListFilters(filterValues, config),
    };

    const sourceChoices = Object.keys(config).map(source => ({
        id: source,
        name: source,
        label: config[source].label,
    }));

    return (
        <Root
            className={clsx(StackedFiltersFormClasses.root, className)}
            onSubmit={onApplyFilters}
            defaultValues={appliedFilters}
            sx={sx}
        >
            <ArrayInput label={false} source="filters">
                <SimpleFormIterator
                    inline
                    disableReordering
                    disableClear
                    addButton={
                        <StackedFiltersFormActions
                            onFiltersApplied={onFiltersApplied}
                        />
                    }
                    removeButton={<RemoveItemButton />}
                    sx={{
                        '& .RaSimpleFormIterator-inline': {
                            width: '100%',
                            alignItems: 'center',
                        },
                        '& .RaSimpleFormIterator-action': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .RaSimpleFormIterator-add': {
                            marginTop: 1,
                            width: '100%',
                        },
                    }}
                >
                    <SourceInput
                        className={StackedFiltersFormClasses.sourceInput}
                        source="source"
                        label={translate('ra-form-layout.filters.source', {
                            _: 'Source',
                        })}
                        choices={sourceChoices}
                    />
                    <FormDataConsumer>
                        {({ scopedFormData, getSource }) => {
                            const source = scopedFormData.source;
                            const { operators } = config[source] ?? {
                                operators: [],
                            };

                            return (
                                <OperatorInput
                                    className={
                                        StackedFiltersFormClasses.operatorInput
                                    }
                                    source={getSource('operator')}
                                    operators={operators}
                                    label={translate(
                                        'ra-form-layout.filters.operator',
                                        {
                                            _: 'Operator',
                                        }
                                    )}
                                />
                            );
                        }}
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {({ scopedFormData, getSource }) => {
                            const source = scopedFormData.source;
                            const operator = scopedFormData.operator;

                            const { operators, input } = config[source] ?? {
                                operators: [],
                                // eslint-disable-next-line react/display-name
                                input: ({ source }) => (
                                    <TextInput
                                        className={
                                            StackedFiltersFormClasses.valueInput
                                        }
                                        label={translate(
                                            'ra-form-layout.filters.value',
                                            {
                                                _: 'Value',
                                            }
                                        )}
                                        source={source}
                                        disabled
                                        helperText={false}
                                    />
                                ),
                            };

                            const operatorConfig = operators.find(
                                o => o.value === operator
                            );

                            return operatorConfig && operatorConfig.input
                                ? operatorConfig.input({
                                      className:
                                          StackedFiltersFormClasses.valueInput,
                                      operator,
                                      source: getSource('value'),
                                      label: translate(
                                          'ra-form-layout.filters.value',
                                          {
                                              _: 'Value',
                                          }
                                      ),
                                  })
                                : input({
                                      className:
                                          StackedFiltersFormClasses.valueInput,
                                      operator,
                                      source: getSource('value'),
                                      label: translate(
                                          'ra-form-layout.filters.value',
                                          {
                                              _: 'Value',
                                          }
                                      ),
                                  });
                        }}
                    </FormDataConsumer>
                </SimpleFormIterator>
            </ArrayInput>
        </Root>
    );
};

export interface StackedFiltersFormProps {
    className?: string;
    config: FiltersConfig;
    onFiltersApplied?: () => void;
    sx?: SxProps;
}

const SourceInput = ({ source, choices, ...rest }: AutocompleteInputProps) => {
    const resource = useResourceContext();
    const translateLabel = useTranslateLabel();
    return (
        <AutocompleteInput
            source={source}
            choices={choices}
            optionText={choice =>
                translateLabel({
                    label: choice.label,
                    resource,
                    source: choice.name,
                })
            }
            helperText={false}
            sx={{ flex: 1 }}
            {...rest}
        />
    );
};

const OperatorInput = ({
    className,
    operators,
    source,
    ...rest
}: CommonInputProps & { className?: string; operators: FilterOperator[] }) => {
    const formContext = useFormContext();
    // This effect is necessary because the form default values might have already been set
    // and this input is added dynamically. For some reason, react-hook-form sometimes does not
    // set the default value in this case.
    useEffect(() => {
        if (operators.length === 1) {
            formContext.setValue(source, operators[0].value);
        }
    }, [operators, formContext, source]);

    const handleChange = useCallback(() => {
        formContext.resetField('value');
    }, [formContext]);

    return operators.length === 1 ? (
        <TextInput
            className={className}
            source={source}
            type="hidden"
            defaultValue={operators[0].value}
            sx={{ display: 'none' }}
            helperText={false}
            {...rest}
        />
    ) : (
        <SelectInput
            className={className}
            source={source}
            choices={operators}
            optionValue="value"
            optionText="label"
            sx={{ flex: 1 }}
            onChange={handleChange}
            disabled={operators.length === 0}
            helperText={false}
            defaultValue={operators[0]?.value}
            {...rest}
        />
    );
};

const RemoveItemButton = ({ onClick, ...props }: ButtonProps) => {
    const { add, total } = useSimpleFormIterator();
    const { remove } = useSimpleFormIteratorItem();

    const handleClick = useCallback(() => {
        remove();
        // We don't want the filter list to be empty so we add a new empty filter
        // if that was the last one
        if (total === 1) {
            add();
        }
    }, [add, remove, total]);

    return (
        <IconButtonWithTooltip
            label="ra.action.remove"
            size="small"
            onClick={handleClick}
            color="warning"
            {...props}
        >
            <CloseIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};

const PREFIX = 'RaStackedFiltersForm';

export const StackedFiltersFormClasses = {
    root: `${PREFIX}-root`,
    sourceInput: `${PREFIX}-sourceInput`,
    operatorInput: `${PREFIX}-operatorInput`,
    valueInput: `${PREFIX}-valueInput`,
};

const Root = styled(Form, {
    name: PREFIX,
    overridesResolver: (props: any, styles) => styles.root,
})(() => ({}));
