import React from 'react'
import CIWebModal from '../../../../_components/CIModal'   
import { useCoreServiceContext } from '../../CoreServiceContex'
import EditCoreService from './EditCoreService'

const EditCoreServiceModal = () => {
  const { isCoreServiceModalOpen, setIsCoreServiceModalOpen } =
        useCoreServiceContext();

  return (
    <CIWebModal
      isModalOpen={isCoreServiceModalOpen.open}
      setIsModalOpen={() => setIsCoreServiceModalOpen({ open: false })}
    >
      <EditCoreService />
    </CIWebModal>
  )
}

export default EditCoreServiceModal
