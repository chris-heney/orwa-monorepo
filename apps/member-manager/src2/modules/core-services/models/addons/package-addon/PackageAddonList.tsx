import React from 'react';
import { Card, CardContent, CardHeader, IconButton } from '@mui/material';
import {
    TextField,
    List,
    ReferenceField,
    useRecordContext,
    TopToolbar,
    SelectColumnsButton,
    FunctionField,
    DeleteButton,
    NumberField,
    Button,
} from 'react-admin';
import {
    EditableDatagridConfigurable,
    EditRowButton,
} from '@react-admin/ra-editable-datagrid';
import { FeatureRecord } from '../types';
import CreateFeaturePackage from './EditAddonPackage';
import EmptyList from '../../../../../_components/EmptyList';
import { customDatagridStyle } from '../../../../../themes/customDatagridStyles';
import SimpleToolbar from '../../../../../_components/SimpleToolbar';
import AddIcon from '@mui/icons-material/Add';

const PackageAddonList = ({
    setIsModalOpen,
}: {
    setIsModalOpen: (isModalOpen: boolean) => void;
}) => {
    const record = useRecordContext<FeatureRecord>();

    return (
        <Card
            sx={{
                p: 0,
                pb: 0,
                border: '1px solid',
                borderColor: 'grey.500',
                borderRadius: 0,
            }}
        >
            <CardHeader title="Associated Packages" />
            <CardContent>
                <List
                    disableSyncWithLocation
                    sort={{ field: 'packageId', order: 'ASC' }}
                    resource="package-addon"
                    filter={{
                        addonId: {
                            $in: record ? [record.id] : [],
                        },
                    }}
                    actions={
                        <SimpleToolbar hasCreateButton={false}>
                            <IconButton
                                color="primary"
                                size="medium"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </SimpleToolbar>
                    }
                    empty={
                        <EmptyList
                            onClick={() => setIsModalOpen(true)}
                            title="No packages found for this feature."
                            buttonText="Add Package"
                        />
                    }
                >
                    <EditableDatagridConfigurable
                        sx={customDatagridStyle}
                        bulkActionButtons={false}
                        rowClick="edit"
                        editForm={<CreateFeaturePackage />}
                        createForm={<CreateFeaturePackage />}
                        actions={false}
                    >
                        <ReferenceField source="packageId" reference="package">
                            <TextField source="name" />
                        </ReferenceField>
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Setup"
                            source="investmentSetup"
                            options={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        />
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Recurring"
                            source="investmentRecurring"
                            options={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        />
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Per Unit"
                            source="investmentEa"
                            options={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        />
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Qty"
                            source="quantity"
                        />
                        <NumberField
                            source="min"
                            label="Min"
                            className="text-right"
                            align="right"
                        />
                        <NumberField
                            source="max"
                            label="Max"
                            className="text-right"
                            align="right"
                        />
                        <TextField source="investmentFrequency" />
                        <FunctionField
                            label="Actions"
                            headerClassName="text-right"
                            render={() => {
                                return (
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: 4,
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <EditRowButton
                                            size="small"
                                            sx={{ p: 0 }}
                                        />
                                        <DeleteButton
                                            sx={{ p: 0 }}
                                            size="small"
                                            label=" "
                                            redirect={false}
                                        />
                                    </div>
                                );
                            }}
                        />
                    </EditableDatagridConfigurable>
                </List>
            </CardContent>
        </Card>
    );
};

export default PackageAddonList;
