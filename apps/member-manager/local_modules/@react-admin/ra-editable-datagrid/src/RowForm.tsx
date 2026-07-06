import * as React from 'react';
import { Children, isValidElement, ReactNode, useCallback } from 'react';
import {
    RaRecord,
    FormProps,
    UpdateParams,
    CreateParams,
    TransformData,
    useSaveContext,
    useAugmentedForm,
    OptionalRecordContextProvider,
    useRecordContext,
    setSubmissionErrors,
} from 'react-admin';
import { TableCell, styled } from '@mui/material';
import { FormProvider, FieldValues, SubmitHandler } from 'react-hook-form';
import { CancelEditButton, SaveRowButton } from './buttons';
import { UseMutationOptions } from 'react-query';

/**
 * A form to be rendered as a table row in an <EditableDatagrid>.
 *
 * All the props it expects are injected by <EditableDatagrid>. You should only
 * provide children to be rendered in each table cell.
 *
 * The children should be Input components, just like in a <SimpleForm>. You
 * can also pass a <Field> component as child.
 *
 * <RowForm> should have as many children as the <EditableDatagrid> that calls
 * it, or there will be a colSpan issue.
 *
 * @example
 *
 *     const ArtistForm = () => (
 *         <RowForm>
 *             <TextField source="id" />
 *             <TextInput source="firstname" validate={required()} />
 *             <TextInput source="name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput
 *                 source="prof"
 *                 label="Profession"
 *                 choices={professionChoices}
 *             />
 *         </RowForm>
 *     );
 *
 * @see EditableDatagrid
 */
const RowForm = <RecordType extends Omit<RaRecord, 'id'> = RaRecord>(
    props: RowFormProps<RecordType>
) => {
    const {
        children,
        id,
        className,
        expand,
        hasBulkActions,
        defaultValues,
        mutationOptions,
        selectable,
        resource,
        save: saveProp,
        saving,
        selected,
        submitOnEnter = true,
        transform,
        ...rest
    } = props;

    const record = useRecordContext(props);
    const { save } = useSaveContext();

    const { form, formHandleSubmit } = useAugmentedForm({
        defaultValues: { ...defaultValues, ...record },
        record,
        onSubmit: save as SubmitHandler<FieldValues>,
        mode: 'onSubmit',
        ...rest,
    });

    const hasSideEffects =
        (mutationOptions &&
            (mutationOptions?.onSuccess ||
                mutationOptions?.onError ||
                mutationOptions?.meta)) ||
        transform;

    const handleSubmitWithSideEffects = useCallback(
        async values => {
            let errors;
            if (save) {
                errors = await save(values, {
                    ...mutationOptions,
                    transform,
                });
            }
            if (errors != null) {
                setSubmissionErrors(errors, form.setError);
            }
        },
        [form.setError, save, mutationOptions, transform]
    );

    // handle submit by enter
    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' && submitOnEnter) {
                if (hasSideEffects) {
                    event.stopPropagation();
                    await form.handleSubmit(handleSubmitWithSideEffects)(event);
                } else {
                    formHandleSubmit(event);
                }
            }
        },
        [
            submitOnEnter,
            hasSideEffects,
            form,
            handleSubmitWithSideEffects,
            formHandleSubmit,
        ]
    );

    return (
        <OptionalRecordContextProvider value={record}>
            <FormProvider<FieldValues> {...form}>
                {Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <TableCell
                            key={index}
                            className={field.props.cellClassName}
                            align={field.props.textAlign}
                            onKeyDown={handleKeyDown}
                        >
                            {field}
                        </TableCell>
                    ) : null
                )}
                <RowFormActionsTableCell
                    handleSubmit={formHandleSubmit}
                    mutationOptions={mutationOptions}
                    transform={transform}
                />
            </FormProvider>
        </OptionalRecordContextProvider>
    );
};

export interface RowFormProps<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> extends Omit<FormProps, 'render'> {
    children: ReactNode;
    className?: string;
    expand?: boolean;
    hasBulkActions?: boolean;
    id?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        | CreateParams<RecordType>
        | UpdateParams<RecordType & { id: RaRecord['id'] }>
    >;
    record?: RaRecord;
    resource?: string;
    save?: (data: Partial<RaRecord>) => void;
    saving?: boolean;
    selectable?: boolean;
    selected?: boolean;
    submitOnEnter?: boolean;
    transform?: TransformData;
}

const PREFIX = 'RaRowFormActionsTableCell';

const RowFormActionsTableCell = <
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
>({
    handleSubmit,
    mutationOptions,
    transform,
}: RowFormActionsTableCellProps<RecordType>) => (
    <StyledTableCell className="RaRowForm-actionColumn">
        <SaveRowButton
            handleSubmit={handleSubmit}
            mutationOptions={mutationOptions}
            transform={transform}
        />
        <CancelEditButton />
    </StyledTableCell>
);

interface RowFormActionsTableCellProps<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> {
    handleSubmit: (
        event: React.BaseSyntheticEvent<Record<string, unknown>, any, any>
    ) => void;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        | CreateParams<RecordType>
        | UpdateParams<RecordType & { id: RaRecord['id'] }>
    >;
    transform?: TransformData;
}

const StyledTableCell = styled(TableCell, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    whiteSpace: 'nowrap',
    width: '5em',
}));

export default RowForm;
