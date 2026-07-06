import React from 'react';
import { FormDialogButtonProps } from './FormDialogButton';
import { CreateDialogProps } from './CreateDialog';
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
export declare const CreateInDialogButton: (props: CreateInDialogButtonProps) => React.JSX.Element;
export type CreateInDialogButtonProps = Omit<FormDialogButtonProps, 'dialog'> & CreateDialogProps;
//# sourceMappingURL=CreateInDialogButton.d.ts.map