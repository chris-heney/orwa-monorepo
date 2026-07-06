import React from 'react'
import { SimpleForm, useGetOne, useRecordContext, useRedirect } from 'react-admin'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CustomAvatarHeader from '../../../_components/CustomAvatarHeader'
import InstructorCertficationFormFields from './InstructorCertficationFormFields'

const EditInstructorCertificationForm = () => {
  const redirect = useRedirect()
  const record = useRecordContext()
  const {data : instructor} = useGetOne('training-instructors', {id :  record.instructor})
  const {data : contact} = useGetOne('contacts', {id : instructor ? instructor.instructor : ''})

  const [selectedTab, setSelectedTab] = React.useState('2')
  const [secondTab, setSecondTab] = React.useState('3')
  return (
    <SimpleForm>
      <Box width={'100%'} textAlign={'center'} >
        <CustomAvatarHeader url={contact ? contact.avatar[0].url : ''} title={contact ? `${contact.first} ${contact.last}` : ''} />
      </Box>
      <TabContext value={selectedTab}>
        <TabList onChange={(e: React.SyntheticEvent, v: string) => setSelectedTab(v)} scrollButtons="auto" variant="scrollable">
          <Tab label="Contact Information" value="1" onClick={() => redirect(`/contacts/${contact ? contact.id : ''}/edit`)} />
          <Tab label="Instructor Details" value='2' onClick={() => redirect(`/training-instructors/${instructor ? instructor.id : ''}/edit`)} />
        </TabList>
        <TabPanel sx={{ p: 0, width: '100%' }} value="2">
          <TabContext value={secondTab}>
            <TabList onChange={(e: React.SyntheticEvent, v: string) => setSecondTab(v)} scrollButtons="auto" variant="scrollable">
              <Tab value="3" label="Certification" />
            </TabList>
            <TabPanel sx={{ p: 0, width: '100%' }} value="3">
              <InstructorCertficationFormFields />
            </TabPanel>
          </TabContext>
        </TabPanel>
      </TabContext>
    </SimpleForm>
  )
}

export default EditInstructorCertificationForm
