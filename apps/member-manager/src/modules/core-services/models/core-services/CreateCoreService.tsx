import { Create } from 'react-admin'
import CoreServiceFormFields from './CoreServiceFormFields'

const CreateCoreService = () => {
    
    return (
        <Create 
            resource="core-service"
            redirect={false}
        >
            <CoreServiceFormFields />
        </Create>
    )
}

export default CreateCoreService
