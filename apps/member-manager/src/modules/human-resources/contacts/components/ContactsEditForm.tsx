import React from 'react'
import {  SimpleForm, useGetList, useRecordContext, useRedirect,  } from 'react-admin'
import { Box, Tab } from '@mui/material'
import ContactValidate from './ContactValidate'
import ContactEditFormFields from '../fields/ContactEditFormFields'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CustomAvatarHeader from '../../../_components/CustomAvatarHeader'
import { contactAvatarSrc } from '../../../../helpers/contactAvatar'


const ContactsEditForm = () => {

  const redirect = useRedirect()
  const record = useRecordContext()
  const {data : instructor} = useGetList('training-instructors', {filter: {instructor: record.id}}, {keepPreviousData: true})
  const instructorId = instructor && instructor[0] && instructor[0].id
  const {data : staff} = useGetList('staff', {filter: {contact: record.id}}, {keepPreviousData: true})
  const staffId = staff && staff[0] && staff[0].id 

  const [selectedTab, setSelectedTab] = React.useState('1')
  return (
    <SimpleForm validate={ContactValidate}>
      <Box width={'100%'} textAlign={'center'} >
        <CustomAvatarHeader url={contactAvatarSrc(record.avatar)} title={record.first ? `${record.first + ' ' + record.last}` : 'Contact Form'}/>      
      </Box>
      <TabContext value={selectedTab}>
        <TabList sx={{width: '100%'}}  onChange={(e: React.SyntheticEvent, v: string) => setSelectedTab(v)} scrollButtons="auto" variant="scrollable">
          <Tab label="Contact Information" value="1" />
          {instructorId && <Tab label="Instructor Details" value='2' onClick={() => redirect(`/training-instructors/${instructorId}/edit`)}/>}
          {staffId && <Tab label="Staff Details" value='2' onClick={() => redirect(`/staff/${staffId}/edit`)}/>}
        </TabList>
        <TabPanel sx={{ p: 0, width: '100%'  }} value="1">
          <ContactEditFormFields/>
        </TabPanel>
        <TabPanel sx={{ p: 0, width: '100%'  }} value="2">
          {/* Redirects to instructor form */}
        </TabPanel>
        <TabPanel sx={{ p: 0 , width: '100%' }} value="3">
          {/* Redirects to instructor form */}
        </TabPanel>
      </TabContext>
    </SimpleForm>
  )
}

export default ContactsEditForm
