import {
    Typography,
    Box,
    alpha,
    Grid2,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import {
    TextField,
    DatagridConfigurable,
    List,
    useRecordContext,
    FunctionField,
    Button,
    useRefresh,
    EmailField,
    useDataProvider,
    useNotify,
} from 'react-admin';
import { SimpleToolbar } from '../../../../_components';
import { useState } from 'react';
import EditContactModal from './EditOrganizationContactModal';
import CreateOrganizationContactModal from './CreateOrganizationContactModal';
import EmptyList from '../../../../_components/EmptyList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { customDatagridStyle } from '../../../../themes/customDatagridStyles';

const OrganizationContactsTab = () => {
    const record = useRecordContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const [isContactModalOpen, setIsContactModalOpen] = useState({
        open: false,
        contactId: null,
    });

    if (!record) {
        return null;
    }

    const handleDelete = (id: string) => {
        dataProvider.delete('organization-contact', { id }).then(() => {
            notify('Contact deleted successfully');
            refresh();
        });
    };

    return (
        <>
            <Grid2 container spacing={3} width="100%">
                <Grid2 size={{ xs: 12 }}>
                    <Box
                        sx={{
                            bgcolor: alpha('#2196f3', 0.08),
                            p: 2,
                            borderRadius: 1,
                            borderLeft: '4px solid #2196f3',
                            mb: 3,
                        }}
                    >
                        <Typography variant="body1">
                            Add contact information for key people in your
                            organization. This helps us know who to reach out to
                            for different matters.
                        </Typography>
                    </Box>

                    <List
                        empty={
                            <EmptyList
                                title="No contacts found for the selected organization."
                                buttonText="Create Contact"
                                onClick={() =>
                                    setIsContactModalOpen({
                                        open: true,
                                        contactId: null,
                                    })
                                }
                            />
                        }
                        actions={
                            <SimpleToolbar
                                selectedIds={[]}
                                setSelectedIds={() => {}}
                                hasCreateButton={false}
                            >
                                <Button
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                        setIsContactModalOpen({
                                            open: true,
                                            contactId: null,
                                        })
                                    }
                                >
                                    Create Contact
                                </Button>
                            </SimpleToolbar>
                        }
                        queryOptions={{
                            meta: {
                                populate: '*',
                                raw: true,
                            },
                        }}
                        filter={{
                            'organizationContacts.organizationId': {
                                $eq: record.id,
                            },
                        }}
                        resource="contact"
                        disableSyncWithLocation
                    >
                        <DatagridConfigurable
                            sx={{ ...customDatagridStyle }}
                            bulkActionButtons={false}
                        >
                            <FunctionField
                                label="Name"
                                render={record => {
                                    return `${record.first} ${record.last}`;
                                }}
                            />
                            <EmailField label="Email" source="email" />
                            <FunctionField
                                label="Phones"
                                render={record => {
                                    if (!record.phones) return null;
                                    const phones = Array.isArray(record.phones)
                                        ? record.phones
                                        : record.phones
                                              .split(',')
                                              .map((p: string) => p.trim());

                                    return (
                                        <Box
                                            display="flex"
                                            gap={1}
                                            flexWrap="wrap"
                                        >
                                            {phones.map(
                                                (
                                                    phone: string,
                                                    index: number
                                                ) => (
                                                    <Chip
                                                        key={index}
                                                        label={phone}
                                                        onClick={() => {
                                                            window.open(
                                                                `tel:${phone}`,
                                                                '_blank'
                                                            );
                                                        }}
                                                        size="small"
                                                        icon={<PhoneIcon />}
                                                    />
                                                )
                                            )}
                                        </Box>
                                    );
                                }}
                            />
                            <TextField label="Address" source="address" />
                            <FunctionField
                                label="Contact Type"
                                render={record => {
                                    const contactType =
                                        record.organizationContacts.find(
                                            (contact: any) =>
                                                contact.contactId === record.id
                                        )?.contactType || '';

                                    // Convert EMPLOYEE to Employee, ADMIN to Admin, etc.
                                    return (
                                        contactType.charAt(0).toUpperCase() +
                                        contactType.slice(1).toLowerCase()
                                    );
                                }}
                            />
                            <FunctionField
                                label="Actions"
                                headerClassName="text-right"
                                render={contact => {
                                    return (
                                        <>
                                            <IconButton
                                                onClick={() =>
                                                    setIsContactModalOpen({
                                                        open: true,
                                                        contactId: contact.id,
                                                    })
                                                }
                                            >
                                                <EditIcon
                                                    sx={{
                                                        color: 'primary.main',
                                                    }}
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                            {/* Delete Button */}
                                            <Tooltip
                                                title={`Remove ${contact.first} ${contact.last} from ${record.name}`}
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        handleDelete(
                                                            record.organizationContacts.find(
                                                                (
                                                                    contact: any
                                                                ) =>
                                                                    contact.contactId ===
                                                                    record.id
                                                            )?.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon
                                                        sx={{
                                                            color: 'error.main',
                                                        }}
                                                        fontSize="small"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    );
                                }}
                            />
                        </DatagridConfigurable>
                    </List>
                </Grid2>
            </Grid2>
            <EditContactModal
                open={isContactModalOpen}
                setOpen={() => {
                    setIsContactModalOpen({
                        open: false,
                        contactId: null,
                    });
                    refresh();
                }}
            />
            <CreateOrganizationContactModal
                open={isContactModalOpen}
                setOpen={() => {
                    setIsContactModalOpen({
                        open: false,
                        contactId: null,
                    });
                }}
            />
        </>
    );
};

export default OrganizationContactsTab;
