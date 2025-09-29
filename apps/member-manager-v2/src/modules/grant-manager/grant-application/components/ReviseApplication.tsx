import React from 'react'
import { Create, RaRecord, SimpleForm } from 'react-admin'
import GrantApplicationFormFields from './ApplicationFormFields'
import { Box, Button, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

interface ReviseApplicationProps {
    record: RaRecord
    isRevising: boolean
    setIsRevising: React.Dispatch<React.SetStateAction<boolean>>
}
const ReviseApplication = ({ record, isRevising, setIsRevising}: ReviseApplicationProps) => {
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography ml={2} variant='h6'>Revising {record.record.legal_entity_name}</Typography>
        <Button size='small' onClick={() => isRevising ? setIsRevising(false) : setIsRevising(true)} >Show<VisibilityIcon sx={{ ml: .5 }} fontSize='small' /></Button>
      </Box>
      <Create resource='grant-application-finals' redirect={false} title={' '} record={{
        ...record.record,
        id: undefined,
        status: 11
      }} >

        <SimpleForm>
          <GrantApplicationFormFields />
        </SimpleForm>
      </Create>
    </Box>
  )
}

export default ReviseApplication
