import React from 'react'
import CIWebModal from '../../../../_components/CIModal'
import { useCoreServiceContext } from '../../CoreServiceContex'
import EditPackage from './EditPackage'

const EditPackageModal = () => {
  const { isPackageModalOpen, setIsPackageModalOpen } =
        useCoreServiceContext();

  return (
    <CIWebModal
      isModalOpen={isPackageModalOpen.open}
      setIsModalOpen={() => setIsPackageModalOpen({ open: false })}
    >
      <EditPackage />
    </CIWebModal>
  )
}

export default EditPackageModal
