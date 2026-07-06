import React from 'react';
import ContentCreate from '@mui/icons-material/Create';
import { FormDialogButton, FormDialogButtonProps } from './FormDialogButton';
import { EditDialog, EditDialogProps } from './EditDialog';

/**
 * A component which creates a `<EditDialog>`, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @example
 * const editButton = (
 *  <EditInDialogButton fullWidth maxWidth="md">
 *      <SimpleForm>
 *          <TextInput source="first_name" validate={required()} fullWidth />
 *      </SimpleForm>
 *  </EditInDialogButton>
 * );
 */
export const EditInDialogButton = (props: EditInDialogButtonProps) => {
    const {
        inline,
        icon = defaultIcon,
        label = 'ra.action.edit',
        ButtonProps,
        ...editDialogProps
    } = props;

    const editDialog = <EditDialog {...editDialogProps} />;

    return (
        <FormDialogButton
            icon={icon}
            label={label}
            dialog={editDialog}
            inline={inline}
            ButtonProps={ButtonProps}
        />
    );
};

const defaultIcon = <ContentCreate />;

export type EditInDialogButtonProps = Omit<FormDialogButtonProps, 'dialog'> &
    EditDialogProps;
