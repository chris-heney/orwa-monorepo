import React from 'react';
import ImageEye from '@mui/icons-material/RemoveRedEye';
import { FormDialogButton, FormDialogButtonProps } from './FormDialogButton';
import { ShowDialog, ShowDialogProps } from './ShowDialog';

/**
 * A component which creates a `<ShowDialog>`, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @example
 * const showButton = (
 *  <ShowInDialogButton fullWidth maxWidth="md">
 *      <SimpleShowLayout>
 *          <TextField source="first_name" fullWidth />
 *      </SimpleShowLayout>
 *  </ShowInDialogButton>
 * );
 */
export const ShowInDialogButton = (props: ShowInDialogButtonProps) => {
    const {
        inline,
        icon = defaultIcon,
        label = 'ra.action.show',
        ButtonProps,
        ...showDialogProps
    } = props;

    const showDialog = <ShowDialog {...showDialogProps} />;

    return (
        <FormDialogButton
            icon={icon}
            label={label}
            dialog={showDialog}
            inline={inline}
            ButtonProps={ButtonProps}
        />
    );
};

const defaultIcon = <ImageEye />;

export type ShowInDialogButtonProps = Omit<FormDialogButtonProps, 'dialog'> &
    ShowDialogProps;
