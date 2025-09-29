import * as React from 'react';
import ServerIcon from '@mui/icons-material/Computer';
import { List, Datagrid, TextField } from 'react-admin';
import dataProvider from '../dataProvider';

export const ServerList = (props: any) => (
    <List {...props} dataProvider={dataProvider}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

export default {
    list: ServerList,
    icon: ServerIcon,
};
