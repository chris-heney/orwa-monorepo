import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    EmailField,
    FunctionField,
    TopToolbar,
    ExportButton,
    CreateButton,
    BooleanField,
    ChipField,
    ArrayField,
    SingleFieldList
} from 'react-admin';
import { Avatar, Chip, Box } from '@mui/material';
// Using any type for extended user fields

const UserListActions = () => (
    <TopToolbar>
        <ExportButton />
        <CreateButton />
    </TopToolbar>
);

const AvatarField = ({ record }: { record?: any }) => {
    if (!record) return null;
    
    return (
        <Avatar
            src={record.profilePicture?.fileUrl}
            alt={record.displayName || record.username}
            sx={{ width: 40, height: 40 }}
        >
            {(record.displayName || record.username)?.charAt(0)?.toUpperCase()}
        </Avatar>
    );
};

const RolesField = ({ record }: { record?: any }) => {
    if (!record?.role || !Array.isArray(record.role) || record.role.length === 0) return null;
    
    return (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {record.role.map((role: any, index: number) => (
                <Chip
                    key={index}
                    label={role.name}
                    size="small"
                    color={role.name === 'Super Admins' ? 'error' : 'primary'}
                    variant="outlined"
                />
            ))}
        </Box>
    );
};

export const UserList = () => (
    <List 
        actions={<UserListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid rowClick="show" bulkActionButtons={false}>
            <FunctionField
                label="Avatar"
                render={(record: any) => <AvatarField record={record} />}
                sortable={false}
            />
            <TextField source="displayName" label="Display Name" />
            <TextField source="username" label="Username" />
            <ReferenceField 
                source="contactId" 
                reference="contact" 
                label="Email"
                link={false}
            >
                <EmailField source="email" />
            </ReferenceField>
            <FunctionField
                label="Roles"
                render={(record: any) => <RolesField record={record} />}
                sortable={false}
            />
            <TextField source="authProvider" label="Auth Provider" />
            <DateField source="lastLoginAt" label="Last Login" showTime />
            <DateField source="createdAt" label="Created" showTime />
            <FunctionField 
                source="profilePicture" 
                label="Has Avatar" 
                render={(record: any) => record.profilePicture ? 'Yes' : 'No'} 
            />
        </Datagrid>
    </List>
);
