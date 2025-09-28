import React from 'react'
import CIWebModal from '../../../../_components/CIModal'   
import { useCoreServiceContext } from '../../CoreServiceContex'
import EditAddonGroup from './EditAddonGroup'

const EditAddonGroupModal = () => {

  const { isAddonGroupModalOpen, setIsAddonGroupModalOpen } =
        useCoreServiceContext();

  return (
    <CIWebModal
      isModalOpen={isAddonGroupModalOpen.open}
      setIsModalOpen={() => setIsAddonGroupModalOpen({ open: false })}
    >
      <EditAddonGroup />
    </CIWebModal>
  )
}

export default EditAddonGroupModal
