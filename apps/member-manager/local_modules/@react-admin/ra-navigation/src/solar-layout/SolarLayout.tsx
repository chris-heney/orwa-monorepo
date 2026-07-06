import React, {
    useState,
    ErrorInfo,
    ComponentType,
    HtmlHTMLAttributes,
    ReactNode,
    Suspense,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import clsx from 'clsx';
import { styled, SxProps } from '@mui/material';
import {
    AppBarProps,
    CoreLayoutProps,
    Error,
    ErrorProps,
    Inspector,
    Loading,
    SkipNavigationButton,
} from 'react-admin';
import { AppLocationContext } from '../app-location';
import { SolarAppBar } from './SolarAppBar';
import { SolarMenu, SolarMenuProps } from './SolarMenu';
import { SolarLogoContext } from './SolarLogoContext';
import { TitleContext } from './TitleContext';

/**
 * Layout component without AppBar, using a narrow a sidebar that can expand to show more content.
 * On mobile, it shows the AppBar to allow opening the navigation menu.
 *
 * @example <caption>Basic usage</caption>
 * import { Admin, Resource, ListGuesser } from 'react-admin';
 * import { SolarLayout } from '@react-admin/ra-navigation';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={SolarLayout}>
 *         <Resource name="songs" list={ListGuesser} />
 *         <Resource name="artists" list={ListGuesser} />
 *     </Admin>
 * );
 */
export const SolarLayout = (props: SolarLayoutProps) => {
    const {
        appBar: AppBar = SolarAppBar,
        children,
        className,
        dashboard,
        error: errorComponent,
        logo,
        menu: Menu = SolarMenu,
        title,
        ...rest
    } = props;

    const [errorInfo, setErrorInfo] = useState<ErrorInfo>(null);

    const handleError = (error: Error, info: ErrorInfo) => {
        setErrorInfo(info);
    };

    return (
        <AppLocationContext hasDashboard={!!dashboard}>
            <SolarLogoContext.Provider value={logo}>
                <TitleContext.Provider value={title}>
                    <StyledLayout
                        className={clsx('layout', className)}
                        {...rest}
                    >
                        <SkipNavigationButton />
                        <div className={LayoutClasses.appFrame}>
                            <AppBar />
                            <main className={LayoutClasses.contentWithSidebar}>
                                <Menu />
                                <div
                                    id="main-content"
                                    className={LayoutClasses.content}
                                >
                                    <ErrorBoundary
                                        // @ts-ignore
                                        onError={handleError}
                                        fallbackRender={({
                                            error,
                                            resetErrorBoundary,
                                        }) => (
                                            <Error
                                                error={error}
                                                errorComponent={errorComponent}
                                                errorInfo={errorInfo}
                                                resetErrorBoundary={
                                                    resetErrorBoundary
                                                }
                                                title={title}
                                            />
                                        )}
                                    >
                                        <Suspense fallback={<Loading />}>
                                            {children}
                                        </Suspense>
                                    </ErrorBoundary>
                                </div>
                            </main>
                            <Inspector />
                        </div>
                    </StyledLayout>
                </TitleContext.Provider>
            </SolarLogoContext.Provider>
        </AppLocationContext>
    );
};

export interface SolarLayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
    appBar?: ComponentType<Omit<AppBarProps, 'title' | 'open'>>;
    className?: string;
    error?: ComponentType<ErrorProps>;
    logo?: ReactNode;
    menu?: ComponentType<SolarMenuProps>;
    sx?: SxProps;
}

const PREFIX = 'RaSolarLayout';
export const LayoutClasses = {
    appFrame: `${PREFIX}-appFrame`,
    contentWithSidebar: `${PREFIX}-contentWithSidebar`,
    content: `${PREFIX}-content`,
};

const StyledLayout = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
    minWidth: 'fit-content',
    width: '100%',
    color: theme.palette.getContrastText(theme.palette.background.default),

    [`& .${LayoutClasses.appFrame}`]: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginTop: 0,
    },
    [`& .${LayoutClasses.contentWithSidebar}`]: {
        display: 'flex',
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    [`& .${LayoutClasses.content}`]: {
        backgroundColor: theme.palette.background.default,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        flexBasis: 0,
        padding: 0,
        marginTop: theme.spacing(8),
        [theme.breakpoints.up('md')]: {
            marginTop: theme.spacing(1),
            marginLeft: 'var(--SolarPrimarySidebarWidth)',
        },
        [theme.breakpoints.up('xs')]: {
            paddingRight: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
    },
}));
