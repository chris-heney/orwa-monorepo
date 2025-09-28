import ModalHeader from '../../_components/ModalHeader';
import { Add as AddIcon } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import {
    Create,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetIdentity,
} from 'react-admin';
import { DeckFormFields } from './components';

// Custom toolbar with enhanced save button
const DeckCreateToolbar = () => {
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
                label={isMobile ? 'Create' : 'Create Deck'}
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

const DeckCreate = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const identity = useGetIdentity();

    return (
        <Create
            actions={false}
            sx={{
                width: '100%',
                padding: 0,
            }}
            redirect={"edit"}
            transform={data => {
                // Remove onboardingStepId from each deck step since it's only needed for the junction table
                const cleanedDeckSteps = data.deckSteps?.map(deckStep => {
                    const { onboardingStepId, ...cleanDeckStep } = deckStep;
                    // remove onboardDeckId from each deck step since it's only needed for the junction table
                    const { onboardingDeckId, ...cleanDeckStep2 } = cleanDeckStep;
                    return cleanDeckStep2;
                }) || [];

                return {
                    ...data,
                    deckSteps: cleanedDeckSteps,
                    authentikUid: identity.identity?.id,
                };
            }}
        >
            <ModalHeader
                title={isMobile ? 'Create Deck' : 'Create New Deck'}
                redirect={'/onboarding-deck'}
                onClose={() => {}}
            />
            <SimpleForm
                toolbar={<DeckCreateToolbar />}
                sx={{
                    '& .MuiCardContent-root': {
                        p: { xs: 1, sm: 2 },
                    },
                    width: '100%',
                }}
            >
                <DeckFormFields />
            </SimpleForm>
        </Create>
    );
};

export default DeckCreate;
