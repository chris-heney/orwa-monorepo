import { defaultTheme, RaThemeOptions } from 'react-admin';
import merge from 'lodash/merge';

export type Overrides = {
    [key: string]: any;
};

export const theme: RaThemeOptions = merge({}, defaultTheme, {
    sidebar: {
        width: 96,
        closedWidth: 48,
    },
    components: {
        // @ts-ignore
        RaSidebar: {
            styleOverrides: {
                fixed: {
                    zIndex: 1200,
                },
            },
        },
    },
});
