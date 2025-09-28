import DomainFormFields from './components/DomainFormFields';
import { Edit, SimpleForm } from 'react-admin';

const DomainEdit = () => {
    return (
        <Edit
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: 0,
            }}
            component={'div'}
            redirect={false}
        >
            <SimpleForm
                toolbar={false}
                sx={{
                    width: '100%',
                    maxWidth: '100%',
                    p: 0,
                }}
            >
                <DomainFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default DomainEdit;
