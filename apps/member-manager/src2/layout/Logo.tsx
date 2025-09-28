import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import logo from '/logo-horizontal.svg';

export const Logo = () => {
    const theme = useTheme();
    const themeTweaks: Record<string, any> =
        theme.palette.mode === 'dark'
            ? {
                  filter: 'invert(1) hue-rotate(180deg)',
              }
            : {
                  filter: 'none',
              };

    return (
        <img
            src={logo}
            alt="Logo"
            style={{
                width: '280px',
                height: '38px',
                filter: themeTweaks.filter,
            }}
        />
    );
};
