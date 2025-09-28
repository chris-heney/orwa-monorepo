import React from 'react';
import { Card, CardContent, CardHeader, IconButton } from '@mui/material';
import {
    TextField,
    List,
    ReferenceField,
    useRecordContext,
    FunctionField,
    DeleteButton,
    NumberField,
} from 'react-admin';
import {
    EditableDatagridConfigurable,
    EditRowButton,
} from '@react-admin/ra-editable-datagrid';
import CreatePackageGroupFeature from './EditPackageGroupAddon';
import { customDatagridStyle } from '../../../../../themes/customDatagridStyles';
import EmptyList from '../../../../../_components/EmptyList';
import AddIcon from '@mui/icons-material/Add';
import SimpleToolbar from '../../../../../_components/SimpleToolbar';

type FeatureRecord = {
    id: number;
    name: string;
    investmentSetup?: number;
    investmentRecurring?: number;
    investmentEa?: number;
    quantity?: number;
    min?: number;
    max?: number;
    investmentFrequency?: string;
};

const PackageGroupFeatureList = ({
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
            <CardHeader title="Associated Package Groups" />
            <CardContent>
                <List
                    disableSyncWithLocation
                    sort={{ field: 'packageGroupId', order: 'ASC' }}
                    resource="package-group-addon"
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
                    filter={{
                        addonId: {
                            $in: record?.id,
                        },
                    }}
                    empty={
                        <EmptyList
                            onClick={() => setIsModalOpen(true)}
                            title="No package group features found for this feature."
                            buttonText="Create Package Feature"
                        />
                    }
                >
                    <EditableDatagridConfigurable
                        bulkActionButtons={false}
                        resource="package-group-addon"
                        sx={customDatagridStyle}
                        rowClick="edit"
                        editForm={<CreatePackageGroupFeature />}
                        createForm={<CreatePackageGroupFeature />}
                        preferenceKey="package-group-addon"
                        actions={false}
                    >
                        <ReferenceField
                            source="packageGroupId"
                            reference="package-group"
                        >
                            <TextField source="name" />
                        </ReferenceField>
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Setup"
                            source="investmentSetup"
                            options={{
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }}
                        />
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Recurring"
                            source="investmentRecurring"
                            options={{
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }}
                        />
                        <NumberField
                            className="text-right"
                            align="right"
                            label="Per Unit"
                            source="investmentEa"
                            options={{
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }}
                        />
                        <NumberField
                            source="quantity"
                            label="Qty"
                            className="text-right"
                            align="right"
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

export default PackageGroupFeatureList;
