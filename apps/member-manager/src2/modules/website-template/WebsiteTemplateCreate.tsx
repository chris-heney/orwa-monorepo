import ModalHeader from '../../_components/ModalHeader';
import { Add as AddIcon } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import {
    Create,
    SaveButton,
    SimpleForm,
    Toolbar,
} from 'react-admin';
import { WebsiteTemplateFormFields } from './components';

// Custom toolbar with enhanced save button
const WebsiteTemplateCreateToolbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Toolbar
            sx={{
                justifyContent: 'space-between',
                p: { xs: 1, sm: 2 },
            }}
        >
            <SaveButton
                label={isMobile ? 'Create' : 'Create Template'}
                icon={<AddIcon />}
                variant="contained"
                size={isMobile ? 'small' : 'large'}
                sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: { xs: 2, sm: 3 },
                }}
            />
        </Toolbar>
    );
};

const WebsiteTemplateCreate = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Create
            actions={false}
            sx={{
                width: '100%',
                padding: 0,
            }}
            redirect={"edit"}
        >
            <ModalHeader
                title={isMobile ? 'Create Template' : 'Create New Website Template'}
                redirect={'/website-template'}
                onClose={() => {}}
            />
            <SimpleForm
                toolbar={<WebsiteTemplateCreateToolbar />}
                sx={{
                    p: 0,
                    width: '100%',
                }}
            >
                <WebsiteTemplateFormFields />
            </SimpleForm>
        </Create>
    );
};

export default WebsiteTemplateCreate; 