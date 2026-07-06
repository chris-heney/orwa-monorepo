import { defaultTheme } from 'react-admin';
import merge from 'lodash/merge';
export var theme = merge({}, defaultTheme, {
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
