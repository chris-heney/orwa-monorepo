import { Box, Button, Fade, Typography } from '@mui/material'
import React from 'react'
import { Identifier, List, RaRecord, ReferenceField, SimpleList,TextField } from 'react-admin'
import CustomHeader from '../../../_components/CustomHeader' 

interface SelectedInfo {
    block?: Identifier | Identifier[];
    session?: Identifier | Identifier[];
  }
interface EventAttendanceProps {
    formatDateTime: (record: RaRecord) => string
    selectedInfo: SelectedInfo
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    modalTitle: string
    record: RaRecord
  }
const ModalEventAttendance = ({ record, openModal, setOpenModal, modalTitle, selectedInfo, formatDateTime}: EventAttendanceProps) => {
  return (
    <Fade in={openModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          boxShadow: 24,
          p: 1,
        }}
      >
        <Button
          sx={{ color: 'common.white', position: 'absolute', top: '10px', right: '10px', border: 'none', cursor: 'pointer', zIndex: 1 }}
          onClick={() => setOpenModal(false)}
        >X</Button>
        <CustomHeader title={modalTitle} sx={{ textAlign: 'center' }} />
        <Typography>
          <Box width={1}>
            <List
              title={' '}
              hasCreate={false}
              filter={(() => {
                const filter: { event?: Identifier, session?: Identifier | Identifier[], block?: Identifier | Identifier[] } = {}
                if (selectedInfo.session && selectedInfo.block) {
                  filter.event = record.id
                 
                }
                else if (selectedInfo.session) {
                  filter.session = selectedInfo.session
                } 
                else if (selectedInfo.block) {
                  filter.block = selectedInfo.block
                }
                return filter
              })()}
              resource='training-event-logs'>
              <SimpleList
                primaryText={() => (
                  <ReferenceField source="contact" label="Name" reference="contacts"
                    link={false}
                  >
                    <TextField source="first" />
                    {' '}
                    <TextField source="last" />
                  </ReferenceField>
                )}
                linkType='show'
                secondaryText={formatDateTime}
                tertiaryText={(record) => record.hours ? `${record.hours} hours` : ''}
              />
            </List>
          </Box>
        </Typography>
      </Box>
    </Fade>
  )
}

export default ModalEventAttendance
