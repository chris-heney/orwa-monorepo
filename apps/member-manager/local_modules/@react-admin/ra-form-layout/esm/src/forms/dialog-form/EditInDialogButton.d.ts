import React from 'react';
import { FormDialogButtonProps } from './FormDialogButton';
import { EditDialogProps } from './EditDialog';
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
export declare const EditInDialogButton: (props: EditInDialogButtonProps) => React.JSX.Element;
export type EditInDialogButtonProps = Omit<FormDialogButtonProps, 'dialog'> & EditDialogProps;
//# sourceMappingURL=EditInDialogButton.d.ts.map