import React from 'react';
import ContentAdd from '@mui/icons-material/Add';
import { FormDialogButton, FormDialogButtonProps } from './FormDialogButton';
import { CreateDialog, CreateDialogProps } from './CreateDialog';

/**
 * A component which creates a `<CreateDialog>`, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @example
 * const createButton = (
 *  <CreateInDialogButton fullWidth maxWidth="md">
 *      <SimpleForm>
 *          <TextInput source="first_name" validate={required()} fullWidth />
 *      </SimpleForm>
 *  </CreateInDialogButton>
 * );
 */
export const CreateInDialogButton = (props: CreateInDialogButtonProps) => {
    const {
        inline,
        icon = defaultIcon,
        label = 'ra.action.create',
        ButtonProps,
        ...createDialogProps
    } = props;

    const createDialog = <CreateDialog {...createDialogProps} />;

    return (
        <FormDialogButton
            icon={icon}
            label={label}
            dialog={createDialog}
            inline={inline}
            ButtonProps={ButtonProps}
        />
    );
};

const defaultIcon = <ContentAdd />;

export type CreateInDialogButtonProps = Omit<FormDialogButtonProps, 'dialog'> &
    CreateDialogProps;
