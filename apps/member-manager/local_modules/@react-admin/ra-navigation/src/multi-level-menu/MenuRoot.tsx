import * as React from 'react';
import {
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { styled, SxProps } from '@mui/material';
import { MultiLevelMenuContext } from './MultiLevelMenuContext';
import { MenuItemList } from './MenuItemList';

export const MenuRoot = (props: MenuRootProps): ReactElement => {
    const {
        children,
        initialOpen = false,
        openItemList = [],
        variant = 'default',
        ...rest
    } = props;

    const openedItems = useRef([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const rootRef = useRef<HTMLDivElement>();
    const openingListeners = useRef([]);

    const onOpen = (callback: (name: string) => void): void => {
        openingListeners.current.push(callback);
    };

    const offOpen = (callback: (name: string) => void): void => {
        openingListeners.current = openingListeners.current.filter(
            l => l !== callback
        );
    };

    const isOpen = useCallback(
        (name: string) => Array.from(openedItems.current).includes(name),
        []
    );

    const close = useCallback((name: string) => {
        openedItems.current = openedItems.current.filter(item => item !== name);
    }, []);

    const open = useCallback((name: string) => {
        const set = new Set(openedItems.current);
        set.add(name);
        openedItems.current = Array.from(set);

        openingListeners.current.forEach(callback => callback(name));
    }, []);

    const setIsOpen = useCallback(
        (name: string, isOpen: boolean) => {
            if (isOpen) {
                return open(name);
            }

            close(name);
        },
        [open, close]
    );

    const toggle = useCallback(
        (name: string) => {
            setIsOpen(name, !isOpen);
        },
        [setIsOpen, isOpen]
    );

    const [hasCategories, setHasCategories] = useState(false);

    const context = {
        close,
        hasCategories,
        initialOpen,
        openItemList,
        isFirstLoad,
        isOpen,
        offOpen,
        onOpen,
        open,
        rootRef,
        setHasCategories,
        setIsOpen,
        toggle,
    };

    useEffect(() => {
        setTimeout(() => setIsFirstLoad(false), 150);
    }, []);

    return (
        <Root ref={rootRef} {...rest}>
            <MultiLevelMenuContext.Provider value={context}>
                <nav
                    className={
                        variant === 'categories'
                            ? MultiLevelMenuClasses.navWithCategories
                            : MultiLevelMenuClasses.nav
                    }
                >
                    <MenuItemList className={MultiLevelMenuClasses.list}>
                        {children}
                    </MenuItemList>
                </nav>
            </MultiLevelMenuContext.Provider>
        </Root>
    );
};

export type MultiLevelMenuVariants = 'categories' | 'default';

export interface MenuRootProps {
    children?: ReactNode;
    initialOpen?: boolean;
    sx?: SxProps;
    variant?: MultiLevelMenuVariants;
    openItemList?: string[];
}
const PREFIX = 'RaMenuRoot';
export const MultiLevelMenuClasses = {
    nav: `${PREFIX}-nav`,
    navWithCategories: `${PREFIX}-navWithCategories`,
    list: `${PREFIX}-list`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    zIndex: theme.zIndex.appBar - 1, // Display the menu under the AppBar
    minHeight: '100%',
    [`& .${MultiLevelMenuClasses.navWithCategories}`]: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        zIndex: theme.zIndex.appBar - 1, // Display the menu categories under the AppBar
    },
    [`& .${MultiLevelMenuClasses.nav}`]: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(1),
    },
    [`& .${MultiLevelMenuClasses.list}`]: {},
}));
