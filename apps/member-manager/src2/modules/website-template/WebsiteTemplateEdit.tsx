import ModalHeader from '../../_components/ModalHeader';
import { Save as SaveIcon } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import { Edit, SaveButton, SimpleForm, Toolbar } from 'react-admin';
import { WebsiteTemplateFormFields } from './components';

// Custom toolbar with enhanced save button
const WebsiteTemplateEditToolbar = () => {
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
                label={isMobile ? 'Save' : 'Save Template'}
                icon={<SaveIcon />}
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

const WebsiteTemplateEdit = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Edit
            actions={false}
            sx={{
                width: '100%',
                padding: 0,
            }}
            redirect={false}
        >
            <ModalHeader
                title={isMobile ? 'Edit Template' : 'Edit Website Template'}
                redirect={'/website-template'}
                onClose={() => {}}
                showButton
            />
            <SimpleForm
                toolbar={<WebsiteTemplateEditToolbar />}
                sx={{
                    p: 0,
                    width: '100%',
                }}
            >
                <WebsiteTemplateFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default WebsiteTemplateEdit;
