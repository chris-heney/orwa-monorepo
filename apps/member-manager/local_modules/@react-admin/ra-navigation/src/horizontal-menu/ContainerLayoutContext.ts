import { ReactNode, createContext, useContext } from 'react';
import defaults from 'lodash/defaults';

export interface ContainerLayoutContextValue {
    hasDashboard?: boolean;
    menu?: ReactNode;
    title?: string | ReactNode;
    toolbar?: ReactNode;
    userMenu?: ReactNode;
}

export const ContainerLayoutContext =
    createContext<ContainerLayoutContextValue>({});

export const useContainerLayout = (props?: any) => {
    const context = useContext(ContainerLayoutContext);
    return defaults(
        {},
        props != null ? extractContainerLayoutProps(props) : {},
        context
    );
};

const extractContainerLayoutProps = ({
    hasDashboard,
    menu,
    title,
    toolbar,
    userMenu,
}: any): ContainerLayoutContextValue => ({
    hasDashboard,
    menu,
    title,
    toolbar,
    userMenu,
});
