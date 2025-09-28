import ModalHeader from '../../_components/ModalHeader';
import { Save as SaveIcon } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import {
    Edit,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetIdentity,
} from 'react-admin';
import { DeckFormFields } from './components';

// Custom toolbar with enhanced save button
const DeckEditToolbar = () => {
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
                label={isMobile ? 'Save' : 'Save Deck'}
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

const DeckEdit = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const identity = useGetIdentity();

    return (
        <Edit     
            actions={false}
            sx={{
                width: '100%',
                padding: 0,
            }}
            redirect={false}
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
            queryOptions={{
                meta: {
                    populate: ['coreServices, deckSteps.onboardingStep'],
                    raw: true,
                },
            }}
        >
            <ModalHeader
                title={isMobile ? 'Edit Deck' : 'Edit Deck'}
                redirect={'/onboarding-deck'}
                onClose={() => {}}
                showButton
            />
            <SimpleForm
                toolbar={<DeckEditToolbar />}
                sx={{
                    '& .MuiCardContent-root': {
                        p: { xs: 1, sm: 2 },
                    },
                    width: '100%',
                }}
            >
                <DeckFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default DeckEdit;
