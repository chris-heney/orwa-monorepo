import * as React from 'react';
import { ElementType } from 'react';
import { HideOnScroll, TitlePortal, LoadingIndicator } from 'react-admin';
import {
    Stack,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    styled,
    Theme,
    Toolbar,
    useMediaQuery,
} from '@mui/material';

import { usePrimarySidebarState } from './usePrimarySidebarState';
import { SolarSidebarToggleButton } from './SolarSidebarToggleButton';

/**
 * An AppBar alternative that is only shown on small devices unless users have scrolled down.
 * Used in the SolarLayout.
 * It only displays the app title if provided and the button allowing to open the sidebar.
 * You can customize it by passing children.
 *
 * @param props {SolarAppBarProps}
 * @param props.alwaysOn {boolean} Optional. This prop is injected by Layout. You should not use it directly unless you are using a custom layout. If you are using the default layout, use `<Layout appBarAlwaysOn>` instead. On small devices, this prop make the AppBar always visible. Disabled by default.
 * @param props.children {ReactNode} Optional. The content to render inside the AppBar. If you passed a title on your <Admin>, it will render it by default.
 * @param props.className {string} Optional. A class name to apply to the AppBar container.
 * @param props.color {string} Optional. The color of the AppBar. Can be primary, secondary, or inherit. Defaults to secondary.
 * @param props.container {ElementType} Optional. The component used for the root node. Defaults to HideOnScroll.
 * @param props.title {string} Optional. The title to render inside the AppBar. If you passed a title on your <Admin>, it will be passed automatically and rendered by default.
 * @param props.toolbar {JSX.Element} Optional. The toolbar to render inside the AppBar. Defaults to null.
 *
 * @example <caption>Custom content</caption>
 * import { Admin, AppBarProps, Resource } from 'react-admin';
 * import { SolarAppBar, SolarLayout, SolarLayoutProps } from '@react-admin/ra-navigation';
 *
 * const CustomAppBar = () => (
 *    <SolarAppBar>
 *       <Typography variant="h6">MyApp</Typography>
 *   </SolarAppBar>
 * );
 *
 * export const CustomLayout = (props: SolarLayoutProps) => (
 *    <SolarLayout {...props} appBar={CustomAppBar} />
 * );
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={CustomLayout}>
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
export const SolarAppBar = ({
    alwaysOn,
    className,
    color = 'secondary',
    container: Container = alwaysOn ? 'div' : HideOnScroll,
    children,
    ...rest
}: SolarAppBarProps) => {
    const [isSidebarOpen] = usePrimarySidebarState();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );

    return (
        <Container className={className}>
            <StyledAppBar
                className={AppBarClasses.appBar}
                color={color}
                isSidebarOpen={isSidebarOpen}
                {...rest}
            >
                <Toolbar
                    disableGutters
                    variant={isXSmall ? 'regular' : 'dense'}
                    className={AppBarClasses.toolbar}
                >
                    <SolarSidebarToggleButton
                        className={AppBarClasses.menuButton}
                    />
                    <TitlePortal />
                    <Stack
                        direction="row"
                        marginLeft="auto"
                        alignItems="center"
                    >
                        {children || <LoadingIndicator />}
                    </Stack>
                </Toolbar>
            </StyledAppBar>
        </Container>
    );
};

/** Only exists to declare the isSidebarOpen prop which is only used in the styled component below */
const AppBar = React.forwardRef<
    HTMLElement,
    MuiAppBarProps & { isSidebarOpen?: boolean }
>(({ isSidebarOpen, ...props }, ref) => {
    return <MuiAppBar ref={ref} {...props} />;
});

AppBar.displayName = 'AppBar';

export interface SolarAppBarProps extends Omit<MuiAppBarProps, 'title'> {
    /**
     * This prop is injected by Layout. You should not use it directly unless
     * you are using a custom layout.
     * If you are using the default layout, use `<Layout appBarAlwaysOn>` instead.
     */
    alwaysOn?: boolean;
    container?: ElementType<any>;
    toolbar?: JSX.Element;
}

const PREFIX = 'RaSolarAppBar';

export const AppBarClasses = {
    appBar: `${PREFIX}-appBar`,
    toolbar: `${PREFIX}-toolbar`,
    rightToolbar: `${PREFIX}-rightToolbar`,
    menuButton: `${PREFIX}-menuButton`,
};

const StyledAppBar = styled(AppBar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
    shouldForwardProp(propName) {
        return propName !== 'isSidebarOpen';
    },
})(({ theme, isSidebarOpen }) => ({
    display: isSidebarOpen ? 'none' : 'block',

    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
    [`& .${AppBarClasses.toolbar}`]: {
        padding: `0 ${theme.spacing(1)}`,
        [theme.breakpoints.down('md')]: {
            minHeight: theme.spacing(6),
        },
    },
    [`& .${AppBarClasses.menuButton}`]: {
        marginRight: '0.2em',
    },
}));
