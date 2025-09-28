import { Edit } from 'react-admin'
import CoreServiceFormFields from './CoreServiceFormFields'
import { useCoreServiceContext } from '../../CoreServiceContex'
const EditCoreService = () => {
  const { isCoreServiceModalOpen } =
        useCoreServiceContext();

  return (
      <Edit 
        resource="core-service"
        mutationMode="pessimistic"  
        redirect={false}
        id={isCoreServiceModalOpen.record?.id}
        queryOptions={{
          meta: {
            populate: ['packages', 'decks'],
          },
        }}
      >
        <CoreServiceFormFields isEdit />
      </Edit>
  )
}

export default EditCoreService
