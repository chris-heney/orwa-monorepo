import * as React from 'react';
import {
    isValidElement,
    cloneElement,
    createElement,
    MouseEvent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    DatagridRow,
    DatagridRowProps,
    ExpandRowButton,
    Identifier,
    RaRecord,
    useResourceContext,
    useRecordContext,
    TransformData,
    UpdateParams,
    useDatagridContext,
    useExpanded,
    useCreatePath,
} from 'react-admin';
import clsx from 'clsx';
import { Checkbox, styled, TableRow, TableCell } from '@mui/material';

import { RowContext } from './RowContext';
import { UseMutationOptions } from 'react-query';
import { DatagridClasses } from './EditableDatagrid';
import { useNavigate } from 'react-router-dom';
import { EditableDatagridRowEditBase } from './EditableDatagridRowEditBase';

const EditableRow = (props: EditableRowProps) => {
    const {
        children,
        expand,
        form,
        hasBulkActions,
        id: idOverride,
        mutationMode,
        mutationOptions = {},
        onToggleItem,
        resource: resourceOverride,
        record: recordOverride,
        rowClick,
        selectable,
        selected,
        transform,
        ...rest
    } = props;
    const context = useDatagridContext();
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const id = idOverride ?? record.id;

    const expandable =
        (!context ||
            !context.isRowExpandable ||
            context.isRowExpandable(record)) &&
        expand;
    const [expanded, toggleExpanded] = useExpanded(
        resource,
        id,
        context && context.expandSingle
    );
    const [isEdit, setEdit] = useState(false);

    const openEditMode = useCallback((): void => {
        setEdit(true);
    }, []);
    const closeEditMode = useCallback((): void => {
        setEdit(false);
    }, []);

    const navigate = useNavigate();
    const createPath = useCreatePath();

    const [nbColumns, setNbColumns] = useState(() =>
        computeNbColumns(expandable, children, hasBulkActions)
    );
    useEffect(() => {
        // Fields can be hidden dynamically based on permissions;
        // The expand panel must span over the remaining columns
        // So we must recompute the number of columns to span on
        const newNbColumns = computeNbColumns(
            expandable,
            children,
            hasBulkActions
        );
        if (newNbColumns !== nbColumns) {
            setNbColumns(newNbColumns);
        }
    }, [expandable, nbColumns, children, hasBulkActions]);

    const handleToggleExpand = useCallback(
        event => {
            toggleExpanded();
            event.stopPropagation();
        },
        [toggleExpanded]
    );
    const handleToggleSelection = useCallback(
        event => {
            if (!selectable) return;
            onToggleItem(id, event);
            event.stopPropagation();
        },
        [id, onToggleItem, selectable]
    );

    const handleClick = useCallback(
        async (event: MouseEvent<HTMLElement>) => {
            event.persist();
            const type =
                typeof rowClick === 'function'
                    ? await rowClick(id, resource, record)
                    : rowClick;

            if (type === false || type == null) {
                return;
            }
            if (type === 'show') {
                navigate(createPath({ resource, id, type }));
                return;
            }
            if (type === 'expand') {
                handleToggleExpand(event);
                return;
            }
            if (type === 'toggleSelection') {
                handleToggleSelection(event);
                return;
            }
            if (type === 'edit') {
                const { tbody, row, column } =
                    getTableClickEventPosition(event);
                openEditMode();
                // once the row is replaced by a form, focus the input inside the cell clicked
                setTimeout(() => {
                    // No way to know the markup of the form in advance, as developers
                    // can inject a form element of their own. The only valid assumption
                    // is that the form should have the same number of columns as the row.
                    // So we select the input based on the column it's in.
                    const input = tbody.querySelector(
                        `tr:nth-child(${row}) td:nth-child(${column}) input`
                    ) as HTMLInputElement;
                    input && input.focus && input.focus();
                }, 100); // FIXME not super robust
            }
        },
        [
            createPath,
            openEditMode,
            rowClick,
            handleToggleExpand,
            handleToggleSelection,
            navigate,
            id,
            resource,
            record,
        ]
    );

    const rowContext = useMemo(
        () => ({
            open: openEditMode,
            close: closeEditMode,
        }),
        [openEditMode, closeEditMode]
    );

    return (
        <RowContext.Provider value={rowContext}>
            {isEdit ? (
                <EditableDatagridRowEditBase
                    mutationOptions={mutationOptions}
                    transform={transform}
                    mutationMode={mutationMode}
                >
                    <TableRow key={id}>
                        {expand ? (
                            <TableCell padding="none">
                                {expandable && (
                                    <ExpandRowButton
                                        className={clsx(
                                            DatagridClasses.expandIcon,
                                            {
                                                [DatagridClasses.expanded]:
                                                    expanded,
                                            }
                                        )}
                                        expanded={expanded}
                                        onClick={handleToggleExpand}
                                        expandContentId={`${id}-expand`}
                                    />
                                )}
                            </TableCell>
                        ) : null}
                        {hasBulkActions ? (
                            <TableCell padding="checkbox">
                                {selectable ? (
                                    <Checkbox
                                        color="primary"
                                        checked={selected}
                                        disabled
                                    />
                                ) : null}
                            </TableCell>
                        ) : null}
                        {form}
                    </TableRow>
                    {expandable && expanded && (
                        <TableRow
                            key={`${id}-expand`}
                            id={`${id}-expand`}
                            className={DatagridClasses.expandedPanel}
                        >
                            <TableCell colSpan={nbColumns}>
                                {isValidElement(expand)
                                    ? cloneElement(expand, {
                                          // @ts-ignore
                                          record,
                                          resource,
                                          id: String(id),
                                      })
                                    : typeof expand === 'function'
                                    ? createElement(expand, {
                                          record,
                                          resource,
                                          id: String(id),
                                      })
                                    : null}
                            </TableCell>
                        </TableRow>
                    )}
                </EditableDatagridRowEditBase>
            ) : (
                <StyledDatagridRow
                    id={id}
                    {...rest}
                    expand={expand}
                    hasBulkActions={hasBulkActions}
                    onClick={handleClick}
                    onToggleItem={onToggleItem}
                    selectable={selectable}
                    selected={selected}
                >
                    {children}
                </StyledDatagridRow>
            )}
        </RowContext.Provider>
    );
};

const computeNbColumns = (expand, children, hasBulkActions) =>
    expand
        ? 1 + // show expand button
          (hasBulkActions ? 1 : 0) + // checkbox column
          React.Children.toArray(children).filter(child => !!child).length // non-null children
        : 0; // we don't need to compute columns if there is no expand panel;

/**
 * Based on a MouseEvent triggered by a click on a table row,
 * get the tbody element, the row and column number of the cell clicked.
 *
 * @param {MouseEvent} event
 */
const getTableClickEventPosition = (
    event: MouseEvent<HTMLElement>
): { tbody: HTMLElement; row: number; column: number } => {
    const target = event.target as HTMLElement;
    const td = target.closest('td');
    const tr = td.parentNode;
    const columns = tr.children as HTMLCollection;
    let column: number;
    for (let index = 0; index < columns.length; index++) {
        if (columns.item(index) === td) {
            column = index + 1;
        }
    }
    const tbody = tr.parentNode as HTMLElement;
    const rows = tbody.children as HTMLCollection;
    let row: number;
    for (let index = 0; index < rows.length; index++) {
        if (rows.item(index) === tr) {
            row = index + 1;
        }
    }
    return { tbody, row, column };
};

export interface EditableRowProps<RecordType extends RaRecord = any>
    extends DatagridRowProps {
    form: ReactElement;
    id?: Identifier;
    record?: RaRecord;
    [key: string]: any;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        UpdateParams<RecordType>
    >;
    transform?: TransformData;
}

const PREFIX = 'RaEditableDatagridRow';

export const DatagridRowClasses = {
    td: `${PREFIX}-td`,
};

const StyledDatagridRow = styled(DatagridRow)(() => ({
    '& td:last-of-type > *': {
        visibility: 'hidden',
    },
    '&:hover td:last-of-type > *': {
        visibility: 'visible',
    },
}));

export default EditableRow;
