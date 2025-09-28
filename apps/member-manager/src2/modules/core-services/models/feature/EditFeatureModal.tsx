import React from 'react'
import EditAddon from './EditFeature'
import { Box } from '@mui/material'
import EditFeature from './EditFeature'
import { useCoreServiceContext } from '../../CoreServiceContex'
import CIWebModal from '../../../../_components/CIModal'

const EditFeatureModal = () => {
  const { isFeatureModalOpen, setIsFeatureModalOpen } =
        useCoreServiceContext();

  return (
    <CIWebModal
      isModalOpen={isFeatureModalOpen.open}
      setIsModalOpen={() => setIsFeatureModalOpen({ open: false })}
    >
      <EditFeature />
      
    </CIWebModal>
  )
}

export default EditFeatureModal
