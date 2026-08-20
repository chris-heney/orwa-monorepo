import React from 'react'
import { SimpleForm, useGetList, useRecordContext, useRedirect } from 'react-admin'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CustomAvatarHeader from '../../../_components/CustomAvatarHeader'
import InstructorFormFields from './InstructorFormFields'
import { contactAvatarSrc } from '../../../../helpers/contactAvatar'

const EditInstructorForm = () => {

  const redirect = useRedirect()
  const record = useRecordContext()
  const { data: contactData } = useGetList('contacts', { filter: { id: record.instructor } }, { keepPreviousData: true })
  const contact = contactData && contactData[0]
  const { data: certificationData } = useGetList('training-instructor-certifications', { filter: { id: record.training_instructor_certification } }, { keepPreviousData: true })
  const certification = certificationData && certificationData[0]
  const { data: staffData } = useGetList('staff', { filter: { contact: record.instructor } }, { keepPreviousData: true })
  const staff = staffData && staffData[0]
  const [selectedTab, setSelectedTab] = React.useState('2')
  return (
    <SimpleForm>
      <Box width={'100%'} textAlign={'center'} >
        <CustomAvatarHeader url={contactAvatarSrc(contact?.avatar)} title={contact ? `${contact.first} ${contact.last}` : ''} />
      </Box>
      <TabContext value={selectedTab}>
        <TabList onChange={(e: React.SyntheticEvent, v: string) => setSelectedTab(v)} scrollButtons="auto" variant="scrollable">
          <Tab label="Contact Information" value="1" onClick={() => redirect(`/contacts/${contact ? contact.id : ''}/edit`)} />
          <Tab label="Instructor Details" value='2' />
          <Tab label="Staff Details" value='3' onClick={() => redirect(`/staff/${staff ? staff.id : ''}/edit`)}/>
        </TabList>
        <TabPanel sx={{ p: 0, width: '100%' }} value="2">        
          <Tab label="Certification" onClick={() => redirect(`/training-instructor-certifications/${certification.id}/edit`)} />
        </TabPanel>
        <TabPanel sx={{ p: 0, width: '100%' }} value="2">
          <InstructorFormFields />
        </TabPanel>
      </TabContext>
    </SimpleForm>
  )
}

export default EditInstructorForm
