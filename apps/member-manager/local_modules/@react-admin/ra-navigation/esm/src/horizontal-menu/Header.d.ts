import React from 'react';
import { AppBarProps } from '@mui/material';
import { TitleComponent } from 'react-admin';
export declare const Header: (props: HeaderProps) => React.JSX.Element;
export declare const HeaderClasses: {
    root: string;
    toolbar: string;
};
export interface HeaderProps extends Omit<AppBarProps, 'title'> {
    menu?: React.ReactNode;
    title?: TitleComponent;
    toolbar?: React.ReactNode;
    userMenu?: React.ReactNode;
}
//# sourceMappingURL=Header.d.ts.map