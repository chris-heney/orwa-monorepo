import { Box, Button, Fade, Typography } from '@mui/material'
import jsonExport from 'jsonexport/dist'
import React from 'react'
import {
  downloadCSV,
  Identifier,
  List,
  RaRecord,
  ReferenceField,
  SimpleList,
  TextField,
  useDataProvider,
} from 'react-admin'
import CustomHeader from '../../../_components/CustomHeader'
import { fetchRelatedRecord } from '../../../../helpers/fetchRelatedRecord'
import { getDisplayEntityId } from '../../../../helpers/strapiIds' 

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
  const dataProvider = useDataProvider()

  /**
   * Export what the list shows (attendee, date, hours) instead of react-admin's
   * default exporter, which dumps every raw field — including the Strapi 5
   * documentId on `id`. The ID column exports the numeric PK.
   */
  const exporter = async (logs: RaRecord[]) => {
    const rows = await Promise.all(
      logs.map(async (log) => {
        const contact = await fetchRelatedRecord(dataProvider, 'contacts', log.contact)
        return {
          ID: getDisplayEntityId(log) ?? '',
          Attendee: `${contact.first ?? ''} ${contact.last ?? ''}`.trim(),
          Date: formatDateTime(log),
          Hours: log.hours ?? '',
        }
      })
    )
    return jsonExport(rows, (err: Error, csv: string) =>
      downloadCSV(csv, `${modalTitle || 'Attendance'}`)
    )
  }

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
              exporter={exporter}
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
