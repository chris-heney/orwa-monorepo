import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import {
    List,
    RaRecord,
    TextField,
    FunctionField,
    DatagridConfigurable,
    ReferenceField,
} from 'react-admin';
import { useEmailManagementContext } from '../EmailManagementContextProvider';
import { customDatagridStyle } from '../../../css';

const EmailLogsList = ({ template }: { template?: number }) => {
    const { emailLogFilters } = useEmailManagementContext();
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    return (
        <Box>
            <List
                sx={{
                    '& .RaList-noActions': {
                        mt: '0',
                    },
                }}
                filter={
                    template
                        ? { template: template }
                        : emailLogFilters
                        ? emailLogFilters
                        : undefined
                }
                actions={false}
                exporter={false}
                disableSyncWithLocation
                title=" "
                resource="email-logs"
            >
                <DatagridConfigurable
                    bulkActionButtons={false}
                    expandSingle={true}
                    isRowExpandable={() => true}
                    isRowSelectable={() => false}
                    rowClick="expand"
                    sx={{ ...customDatagridStyle }}
                    expand={(record: RaRecord) => {
                        return (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: record.record.html || '',
                                }}
                            />
                        );
                    }}
                >
                    <TextField source="to" label="To" />
                    <FunctionField
                        label="Sent At"
                        render={(record: RaRecord) =>
                            record.createdAt
                                ? new Date(record.createdAt).toLocaleString()
                                : 'N/A'
                        }
                    />
                    <TextField source="from" label="From" />
                    <ReferenceField
                        source="template"
                        reference="email-templates"
                        label="Template"
                        link={false}
                    >
                        <TextField source="email_name" />
                    </ReferenceField>
                </DatagridConfigurable>
            </List>

            {/* Modal for Email Preview */}
            <Dialog
                open={!!selectedEmail}
                onClose={() => setSelectedEmail(null)}
            >
                <DialogTitle>Email Content</DialogTitle>
                <DialogContent>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: selectedEmail || '',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default EmailLogsList;
