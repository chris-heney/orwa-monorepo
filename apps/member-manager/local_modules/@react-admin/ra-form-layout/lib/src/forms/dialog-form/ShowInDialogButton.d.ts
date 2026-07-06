import React from 'react';
import { FormDialogButtonProps } from './FormDialogButton';
import { ShowDialogProps } from './ShowDialog';
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
export declare const ShowInDialogButton: (props: ShowInDialogButtonProps) => React.JSX.Element;
export type ShowInDialogButtonProps = Omit<FormDialogButtonProps, 'dialog'> & ShowDialogProps;
//# sourceMappingURL=ShowInDialogButton.d.ts.map