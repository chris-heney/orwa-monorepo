import DomainFormFields from './components/DomainFormFields';
import { Create, SimpleForm } from 'react-admin';

const DomainCreate = () => {
    return (
        <Create 
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: 0,
            }}
            component={'div'}
            redirect={"edit"}
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
        </Create>
    );
};

export default DomainCreate;
