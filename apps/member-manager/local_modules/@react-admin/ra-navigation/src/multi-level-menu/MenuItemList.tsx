import * as React from 'react';
import { List, ListProps, styled } from '@mui/material';

export const MenuItemList = (props: ListProps) => (
    <Root disablePadding {...props} />
);

const Root = styled(List, {
    name: 'RaMenu',
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    display: 'flex',
    flexDirection: 'column',
}));
