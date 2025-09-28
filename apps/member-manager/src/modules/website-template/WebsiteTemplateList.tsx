import WebsiteTemplateListContent from './components/WebsiteTemplateListContent';
import { useMediaQuery, useTheme } from '@mui/material';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    FilterLiveSearch,
    List,
    SelectColumnsButton,
    SelectInput,
    TopToolbar,
} from 'react-admin';

// Filters for the list
const WebsiteTemplateFilters = [
    <FilterLiveSearch
        source="name[$contains]"
        placeholder="Search templates..."
        alwaysOn
        sx={{
            '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
            },
        }}
    />,
    <SelectInput
        source="style[$eq]"
        choices={[
            { id: 'Modern', name: 'Modern' },
            { id: 'Professional', name: 'Professional' },
            { id: 'Classic', name: 'Classic' },
            { id: 'Creative', name: 'Creative' },
        ]}
        label="Style"
        emptyText="All Styles"
        sx={{
            minWidth: { xs: '120px', sm: '160px' },
        }}
    />,
    <SelectInput
        source="isActive[$eq]"
        choices={[
            { id: true, name: 'Active' },
            { id: false, name: 'Inactive' },
        ]}
        label="Status"
        emptyText="All Templates"
        sx={{
            minWidth: { xs: '120px', sm: '160px' },
        }}
    />,
];

// List actions toolbar
const WebsiteTemplateListActions = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TopToolbar>
            <SelectColumnsButton size={isMobile ? 'small' : 'medium'} />
            <FilterButton size={isMobile ? 'small' : 'medium'} />
            <CreateButton
                label={isMobile ? 'Add' : 'Add Template'}
                size={isMobile ? 'small' : 'medium'}
            />
            <ExportButton
                size={isMobile ? 'small' : 'medium'}
                sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                }}
            />
        </TopToolbar>
    );
};

const WebsiteTemplateList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <List
            filters={WebsiteTemplateFilters}
            actions={<WebsiteTemplateListActions />}
            perPage={isMobile ? 10 : 25}
            sort={{ field: 'sortOrder', order: 'ASC' }}
            resource="website-template"
            disableSyncWithLocation
            sx={{
                width: '100%',
                '& .RaList-main': {
                    width: '100%',
                },
                '& .RaList-content': {
                    width: '100%',
                },
                p: 0,
            }}
            component="div"
        >
            <WebsiteTemplateListContent />
        </List>
    );
};

export default WebsiteTemplateList;
