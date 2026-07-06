import React, { ReactElement } from 'react';
import { ButtonProps } from 'react-admin';
/**
 * Internal component which creates a dialog, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @param props.dialog A React Element containing the dialog
 * @param props.inline Optional - Set to true for an inline button, having only an icon and a tooltip
 * @param props.icon Optional - The icon associated to the button label
 * @param props.label Optional - The button label
 * @param props.ButtonProps Optional - An object containing props to pass to the MUI Button
 */
export declare const FormDialogButton: (props: FormDialogButtonProps) => React.JSX.Element;
export type FormDialogButtonProps = {
    inline?: boolean;
    icon?: ReactElement;
    dialog: ReactElement;
    label?: string;
    ButtonProps?: Omit<ButtonProps, 'onClick'>;
};
//# sourceMappingURL=FormDialogButton.d.ts.map