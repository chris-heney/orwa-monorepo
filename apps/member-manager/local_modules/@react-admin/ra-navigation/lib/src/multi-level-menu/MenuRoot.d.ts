import { ReactElement, ReactNode } from 'react';
import { SxProps } from '@mui/material';
export declare const MenuRoot: (props: MenuRootProps) => ReactElement;
export type MultiLevelMenuVariants = 'categories' | 'default';
export interface MenuRootProps {
    children?: ReactNode;
    initialOpen?: boolean;
    sx?: SxProps;
    variant?: MultiLevelMenuVariants;
    openItemList?: string[];
}
export declare const MultiLevelMenuClasses: {
    nav: string;
    navWithCategories: string;
    list: string;
};
//# sourceMappingURL=MenuRoot.d.ts.map