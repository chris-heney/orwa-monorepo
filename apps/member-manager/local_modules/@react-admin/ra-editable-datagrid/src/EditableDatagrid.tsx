import * as React from 'react';
import {
    cloneElement,
    createElement,
    FC,
    forwardRef,
    isValidElement,
    ReactElement,
    useState,
    useMemo,
} from 'react';
import { styled, Table } from '@mui/material';
import {
    Datagrid,
    DatagridProps,
    MutationMode,
    useResourceContext,
    useListContext,
    useRedirect,
    DatagridRoot,
    sanitizeListRestProps,
    injectedProps,
    DatagridHeader,
    ListNoResults,
} from 'react-admin';
import clsx from 'clsx';

import { ActionsColumn } from './ActionsColumn';
import EditableDatagridBody from './EditableDatagridBody';
import { EditableDatagridContextProvider } from './EditableDatagridContext';
import { CreateButton, InlineCreateButton } from './buttons';
import { useMatch } from 'react-router-dom';

/**
 * Component to display and edit tabular data.
 *
 * To be used as child of <List> or <ReferenceManyField>.
 * The <EditableDatagrid> expects the same props as <Datagrid>, plus 5 more props:
 *
 * - editForm: a component to display instead of a row when the user edits a record
 * - createForm: a component to display as the first row when the user creates a record
 * - noDelete: disable the inline Delete button
 * - actions: a component to display instead of the default actions
 * - mutationMode: the mutation mode to use for the inline form (default to undoable)
 *
 * The component renders the editForm and createForm elements in a <table>, so they
 * should render a <tr>. We advise you to use <RowForm> for editForm and createForm.
 *
 * Note: No need to include an <EditButton> as child, the <EditableDatagrid>
 * component adds a column with edit/delete/save/cancel buttons itself.
 *
 * Note: To display a custom create button, pass a custom component as the `empty` prop. It can use the `useEditableDatagridContext` hook to access to `openStandaloneCreateForm` and `closeStandaloneCreateForm` callbacks.
 *
 * Note: To enable the create form in a <List>, you should add the `hasCreate`
 * prop to the <List> component.
 *
 * @example
 *
 *     const ArtistList = () => (
 *         <List hasCreate>
 *             <EditableDatagrid
 *                 createForm={<ArtistForm />}
 *                 editForm={<ArtistForm />}
 *                 empty={<CustomEmptyComponent />}
 *             >
 *                 <TextField source="id" />
 *                 <TextField source="firstname" />
 *                 <TextField source="name" />
 *                 <DateField source="dob" label="born" />
 *                 <SelectField
 *                     source="prof"
 *                     label="Profession"
 *                     choices={professionChoices}
 *                 />
 *             </EditableDatagrid>
 *         </List>
 *     );
 *
 *      const CustomEmptyComponent = () => {
 *          const { openStandaloneCreateForm } = useEditableDatagridContext();
 *
 *          const handleClick = () => {
 *              openStandaloneCreateForm();
 *          };
 *          return (
 *              <>
 *                  <p>Here a custom empty component</p>
 *                  <Button
 *                      size="small"
 *                      color="primary"
 *                      variant="outlined"
 *                      onClick={handleClick}
 *                  >
 *                      Custom Create Button
 *                  </Button>
 *              </>
 *          );
 *      };
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
 * @example // inside a <ReferenceManyField> - remember to set the foreign ket in the createForm using defaultValues
 *
 *     const OrderEdit = () => (
 *         <Edit>
 *             <SimpleForm>
 *                 <ReferenceManyField
 *                     fullWidth
 *                     label="Products"
 *                     reference="products"
 *                     target="order_id"
 *                 >
 *                     <EditableDatagrid
 *                         createForm={<ProductForm />}
 *                         editForm={<ProductForm />}
 *                     >
 *                         <TextField source="id" />
 *                         <TextField source="name" />
 *                         <NumberField source="price" label="Default Price" />
 *                         <DateField source="available_since" />
 *                     </EditableDatagrid>
 *                 </ReferenceManyField>
 *                 <DateInput source="purchase_date" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     const ProductForm = () => {
 *         const orderRecord = useRecordContext();
 *
 *         return (
 *             <RowForm defaultValues={{ order_id: orderRecord.id }}>
 *                 <TextField source="id" disabled />
 *                 <TextInput source="name" validate={required()} />
 *                 <NumberInput
 *                     source="price"
 *                     label="Default Price"
 *                     validate={required()}
 *                 />
 *                 <DateInput source="available_since" validate={required()} />
 *             </RowForm>
 *         );
 *     };
 *
 * @see Datagrid for the other props
 * @see RowForm for the create and edit form
 */
const EditableDatagrid: FC<EditableDatagridProps> = forwardRef(
    (props, ref): JSX.Element => {
        const {
            actions,
            bulkActionButtons,
            className,
            children,
            createForm,
            editForm,
            empty,
            expand,
            header = DatagridHeader,
            mutationMode = 'undoable',
            noDelete,
            size = 'small',
            ...rest
        } = props;

        const resource = useResourceContext(props);
        const redirect = useRedirect();
        const { data, defaultTitle, sort, setSort, selectedIds } =
            useListContext();

        const [isStandaloneCreateFormVisible, setShowStandaloneCreateForm] =
            useState<boolean>(false);

        // If EditableDatagrid is in a List view, the create form is displayed based on the route
        // If not, the create form is displayed based on an internal state (see EditableDatagridBody)
        // In order to detect if we are in a List view, we check the props that are passed
        // We choose 'defaultTitle' since it's very unlikely to have this prop in a Reference field
        // Also, we don't want to have 'defaultTitle' in the Props type, to not confuse users
        const isInListView =
            defaultTitle !== null &&
            defaultTitle !== undefined &&
            defaultTitle !== '';
        const hasStandaloneCreateForm = !isInListView && Boolean(createForm);

        const openStandaloneCreateForm = (): void => {
            if (hasStandaloneCreateForm) {
                setShowStandaloneCreateForm(true);
            } else {
                redirect('create', resource);
            }
            // once the row is replaced by a form, focus the first input
            setTimeout(() => {
                const input = document.querySelectorAll(
                    '#new_record input'
                )[0] as HTMLInputElement | undefined;
                input && input.focus && input.focus();
            }, 100); // FIXME not super robust
        };

        const closeStandaloneCreateForm = (): void => {
            if (hasStandaloneCreateForm) {
                setShowStandaloneCreateForm(false);
            } else {
                redirect('list', resource);
            }
        };

        const contextValue = useMemo(
            () => ({
                openStandaloneCreateForm,
                closeStandaloneCreateForm,
            }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        const datagridBody = (
            <EditableDatagridBody
                className={className}
                createForm={createForm}
                editForm={editForm}
                expand={expand}
                hasBulkActions={!!bulkActionButtons}
                hasStandaloneCreateForm={hasStandaloneCreateForm}
                isStandaloneCreateFormVisible={isStandaloneCreateFormVisible}
                closeStandaloneCreateForm={closeStandaloneCreateForm}
                mutationMode={mutationMode}
                resource={resource}
            />
        );

        const actionsChildren =
            actions === false ? null : (
                <ActionsColumn
                    // Datagrid cells supports the label prop which accept a React element.
                    label={
                        hasStandaloneCreateForm ? (
                            <InlineCreateButton
                                onClick={openStandaloneCreateForm}
                            />
                        ) : (
                            ''
                        )
                    }
                    mutationMode={mutationMode}
                    noDelete={noDelete}
                    redirect={isInListView ? 'list' : false}
                >
                    {actions}
                </ActionsColumn>
            );

        const matchCreate = useMatch(`/${resource}/create/*`);

        const shouldRenderDatagridBodyForCreation =
            isStandaloneCreateFormVisible || matchCreate !== null;

        const shouldRenderCustomEmpty =
            empty &&
            React.isValidElement(empty) &&
            !shouldRenderDatagridBodyForCreation;

        const shouldRenderDefaultEmpty = !shouldRenderDatagridBodyForCreation;

        const shouldRenderCreateButton =
            hasStandaloneCreateForm && !shouldRenderDatagridBodyForCreation;

        return (
            <EditableDatagridContextProvider value={contextValue}>
                <Root
                    body={datagridBody}
                    bulkActionButtons={bulkActionButtons}
                    expand={expand}
                    resource={resource}
                    header={header}
                    size={size}
                    empty={
                        <>
                            {shouldRenderCustomEmpty ? (
                                empty
                            ) : shouldRenderCreateButton ? (
                                <CreateButton
                                    resource={resource}
                                    onClick={openStandaloneCreateForm}
                                />
                            ) : shouldRenderDefaultEmpty ? (
                                <ListNoResults />
                            ) : null}
                            {shouldRenderDatagridBodyForCreation ? (
                                // TODO: The DataGrid wrapper (DatagridRoot + Table + Headers) should be extracted
                                // to a dedicated component in react-admin to avoid duplicating it here
                                <DatagridRoot className={DatagridClasses.root}>
                                    <div
                                        className={DatagridClasses.tableWrapper}
                                    >
                                        <Table
                                            ref={ref}
                                            className={clsx(
                                                DatagridClasses.table,
                                                className
                                            )}
                                            size={size}
                                            {...sanitizeRestProps(rest)}
                                        >
                                            {createOrCloneElement(
                                                header,
                                                {
                                                    children,
                                                    sort,
                                                    data,
                                                    hasExpand: !!expand,
                                                    hasBulkActions: false,
                                                    isRowSelectable:
                                                        rest.isRowSelectable,
                                                    onSelect: rest.onSelect,
                                                    resource,
                                                    selectedIds,
                                                    setSort,
                                                },
                                                children,
                                                actionsChildren
                                            )}
                                            {datagridBody}
                                        </Table>
                                    </div>
                                </DatagridRoot>
                            ) : null}
                        </>
                    }
                    {...rest}
                >
                    {children}
                    {actionsChildren}
                </Root>
            </EditableDatagridContextProvider>
        );
    }
);

EditableDatagrid.displayName = 'EditableDatagrid';

const createOrCloneElement = (element, props, ...children) =>
    isValidElement(element)
        ? cloneElement(element, props, ...children)
        : createElement(element, props, ...children);

const dataGridProps = ['rowClick', 'optimized', 'isRowSelectable'];
const sanitizeRestProps = props =>
    Object.keys(sanitizeListRestProps(props))
        .filter(
            propName =>
                !injectedProps.includes(propName) &&
                !dataGridProps.includes(propName)
        )
        .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

const PREFIX = 'RaEditableDatagrid';

export const DatagridClasses = {
    root: `${PREFIX}-root`,
    table: `${PREFIX}-table`,
    tableWrapper: `${PREFIX}-tableWrapper`,
    thead: `${PREFIX}-thead`,
    tbody: `${PREFIX}-tbody`,
    headerRow: `${PREFIX}-headerRow`,
    headerCell: `${PREFIX}-headerCell`,
    checkbox: `${PREFIX}-checkbox`,
    row: `${PREFIX}-row`,
    clickableRow: `${PREFIX}-clickableRow`,
    rowEven: `${PREFIX}-rowEven`,
    rowOdd: `${PREFIX}-rowOdd`,
    rowCell: `${PREFIX}-rowCell`,
    expandHeader: `${PREFIX}-expandHeader`,
    expandIconCell: `${PREFIX}-expandIconCell`,
    expandIcon: `${PREFIX}-expandIcon`,
    expanded: `${PREFIX}-expanded`,
    expandedPanel: `${PREFIX}-expandedPanel`,
};

const Root = styled(Datagrid, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${DatagridClasses.table}`]: {
        tableLayout: 'auto',
    },
    [`& .${DatagridClasses.tableWrapper}`]: {},
    [`& .${DatagridClasses.thead}`]: {},
    [`& .${DatagridClasses.tbody}`]: {},
    [`& .${DatagridClasses.headerRow}`]: {},
    [`& .${DatagridClasses.headerCell}`]: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: theme.palette.background.paper,
        '&:first-of-type': {
            borderTopLeftRadius: theme.shape.borderRadius,
        },
        '&:last-child': {
            borderTopRightRadius: theme.shape.borderRadius,
        },
    },
    [`& .${DatagridClasses.checkbox}`]: {},
    [`& .${DatagridClasses.row}`]: {},
    [`& .${DatagridClasses.clickableRow}`]: {
        cursor: 'pointer',
    },
    [`& .${DatagridClasses.rowEven}`]: {},
    [`& .${DatagridClasses.rowOdd}`]: {},
    [`& .${DatagridClasses.rowCell}`]: {},
    [`& .${DatagridClasses.expandHeader}`]: {
        padding: 0,
        width: theme.spacing(6),
    },
    [`& .${DatagridClasses.expandIconCell}`]: {
        width: theme.spacing(6),
    },
    [`& .${DatagridClasses.expandIcon}`]: {
        padding: theme.spacing(1),
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    [`& .${DatagridClasses.expandIcon}.${DatagridClasses.expanded}`]: {
        transform: 'rotate(0deg)',
    },
    [`& .${DatagridClasses.expandedPanel}`]: {},
}));

export interface EditableDatagridProps extends DatagridProps {
    actions?: ReactElement | false;
    editForm: ReactElement;
    createForm?: ReactElement;
    mutationMode?: MutationMode;
    noDelete?: boolean;
}

export default EditableDatagrid;
