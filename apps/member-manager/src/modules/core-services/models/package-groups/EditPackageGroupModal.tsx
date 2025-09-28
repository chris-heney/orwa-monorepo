import React from 'react'
import CIWebModal from '../../../../_components/CIModal'
import { useCoreServiceContext } from '../../CoreServiceContex'
import EditPackageGroup from './EditPackageGroup'

const EditPackageGroupModal = () => {
  const { isPackageGroupModalOpen, setIsPackageGroupModalOpen } =
        useCoreServiceContext();

  return (
        <CIWebModal
            isModalOpen={isPackageGroupModalOpen.open}
            setIsModalOpen={() => setIsPackageGroupModalOpen({ open: false })}
        >
            <EditPackageGroup />
        </CIWebModal>
  )
}

export default EditPackageGroupModal