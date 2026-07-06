import * as React from 'react';
import { MouseEventHandler, ReactElement } from 'react';
import { DialogTitleProps } from '@mui/material';
import { RaRecord } from 'react-admin';
export declare const FormDialogTitle: (props: FormDialogTitleProps) => React.JSX.Element;
interface FormDialogTitleProps extends Omit<DialogTitleProps, 'title'> {
    defaultTitle?: string;
    onClose: MouseEventHandler<HTMLButtonElement>;
    record?: Partial<RaRecord>;
    title?: ReactElement | string;
}
export declare const FormDialogTitleClasses: {
    closeButton: string;
};
export {};
//# sourceMappingURL=FormDialogTitle.d.ts.map