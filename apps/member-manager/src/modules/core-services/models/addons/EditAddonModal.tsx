import React from 'react'
import CIWebModal from '../../../../_components/CIModal'
import { useCoreServiceContext } from '../../CoreServiceContex'
import EditAddon from './EditAddon'

const EditAddonModal = () => {
  const { isAddonModalOpen, setIsAddonModalOpen } =
        useCoreServiceContext();

  return (
    <CIWebModal
      isModalOpen={isAddonModalOpen.open}
      setIsModalOpen={() => setIsAddonModalOpen({ open: false })}
    >
      <EditAddon />
    </CIWebModal>
  )
}

export default EditAddonModal
