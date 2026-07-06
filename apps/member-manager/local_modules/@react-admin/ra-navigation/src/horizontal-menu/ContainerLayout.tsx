import { Container, ContainerProps } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';
import clsx from 'clsx';
import React, {
    ComponentType,
    ErrorInfo,
    HtmlHTMLAttributes,
    ReactNode,
    useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import {
    CoreLayoutProps,
    Error,
    ErrorProps,
    SkipNavigationButton,
    // FIXME: add this when the react-admin dependency is updated
    //Inspector,
} from 'react-admin';
import { AppLocationContext } from '../app-location';
import { ContainerLayoutContext } from './ContainerLayoutContext';
import { Header } from './Header';

/**
 * Layout component with no sidebar and a horizontal menu.
 *
 * @example
 * import { Admin, Resource } from 'react-admin';
 * import { ContainerLayout } from '@react-admin/ra-navigation';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={ContainerLayout}>
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export const ContainerLayout = (props: LayoutProps) => {
    const {
        appBar = defaultAppBar,
        children,
        className,
        dashboard,
        error: errorComponent,
        menu,
        title,
        toolbar,
        maxWidth,
        fixed,
        userMenu,
        sx,
    } = props;

    const [errorInfo, setErrorInfo] = useState<ErrorInfo>(null);

    const handleError = (error: Error, componentStack: ErrorInfo) => {
        setErrorInfo(componentStack);
    };

    return (
        <AppLocationContext>
            <ContainerLayoutContext.Provider
                value={{
                    hasDashboard: !!dashboard,
                    title,
                    menu,
                    toolbar,
                    userMenu,
                }}
            >
                <StyledLayout
                    className={clsx(
                        'layout',
                        ContainerLayoutClasses.root,
                        className
                    )}
                    sx={sx}
                >
                    <SkipNavigationButton />
                    {appBar}
                    <Container
                        id="main-content"
                        className={ContainerLayoutClasses.content}
                        maxWidth={maxWidth}
                        fixed={fixed}
                    >
                        <ErrorBoundary
                            onError={handleError as any}
                            fallbackRender={({ error, resetErrorBoundary }) => (
                                <Error
                                    error={error}
                                    errorComponent={errorComponent}
                                    errorInfo={errorInfo}
                                    resetErrorBoundary={resetErrorBoundary}
                                    title={title}
                                />
                            )}
                        >
                            {children}
                        </ErrorBoundary>
                    </Container>
                    {/* <Inspector /> */}
                </StyledLayout>
            </ContainerLayoutContext.Provider>
        </AppLocationContext>
    );
};

const defaultAppBar = <Header />;

export interface LayoutProps
    extends Omit<CoreLayoutProps, 'menu'>,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ReactNode;
    className?: string;
    error?: ComponentType<ErrorProps>;
    fixed?: ContainerProps['fixed'];
    maxWidth?: ContainerProps['maxWidth'];
    menu?: ReactNode;
    sidebar?: ComponentType<{ children: ReactNode }>;
    sx?: SxProps;
    toolbar?: ReactNode;
    userMenu?: ReactNode;
}

const PREFIX = 'RaContainerLayout';
export const ContainerLayoutClasses = {
    root: `${PREFIX}-root`,
    content: `${PREFIX}-content`,
};

const StyledLayout = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    minHeight: `100vh`,
}));
