import { Language as WebIcon } from '@mui/icons-material';
import { Grid2 } from '@mui/material';
import {
    ArrayInput,
    AutocompleteInput,
    BooleanInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    useDataProvider,
    useRecordContext,
} from 'react-admin';
import { FormSection } from '../../../_components/FormSection';
import { validateModelField } from '../../../_utils/validateModelName';

const WebsiteTemplateFormFields = () => {
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    const styleChoices = [
        { id: 'Modern', name: 'Modern' },
        { id: 'Professional', name: 'Professional' },
        { id: 'Classic', name: 'Classic' },
        { id: 'Creative', name: 'Creative' },
    ];

    return (
        <FormSection title="Website Template Details" icon={<WebIcon />}>
            <Grid2 container spacing={2} sx={{ p: 1, width: '100%' }}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        helperText="Enter a unique slug for the template (used in URLs)"
                        validate={(value: string) =>
                            validateModelField(
                                value,
                                'website-template',
                                'slug',
                                dataProvider,
                                record
                            )
                        }
                        required
                        label="Slug"
                        name="slug"
                        source="slug"
                        fullWidth
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        helperText="Enter the display name of the template"
                        validate={(value: string) =>
                            validateModelField(
                                value,
                                'website-template',
                                'name',
                                dataProvider,
                                record
                            )
                        }
                        required
                        label="Name"
                        name="name"
                        source="name"
                        fullWidth
                    />
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <TextInput
                        helperText="Enter a description of the template"
                        label="Description"
                        name="description"
                        source="description"
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextInput
                        helperText="Enter the website URL for the template"
                        required
                        label="Website URL"
                        name="websiteUrl"
                        source="websiteUrl"
                        fullWidth
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <ReferenceInput
                        source="industryId"
                        reference="industry"
                        label="Industry"
                    >
                        <AutocompleteInput
                            optionText="name"
                            helperText="Select the industry associated with this template"
                            fullWidth
                        />
                    </ReferenceInput>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <SelectInput
                        source="style"
                        choices={styleChoices}
                        helperText="Select the style category for this template"
                        label="Style"
                        required
                        fullWidth
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <NumberInput
                        source="sortOrder"
                        label="Sort Order"
                        helperText="Enter the sort order (lower numbers appear first)"
                        defaultValue={0}
                        fullWidth
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <BooleanInput
                        source="isActive"
                        label="Active"
                        helperText="Whether this template is active and available for selection"
                        defaultValue={true}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <ArrayInput source="features" label="Features">
                        <SimpleFormIterator inline>
                            <TextInput
                                source=""
                                label="Feature"
                                helperText="Enter a feature description"
                                fullWidth
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                </Grid2>
            </Grid2>
        </FormSection>
    );
};

export default WebsiteTemplateFormFields;
