import React from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import EventPanelDetailsShow from './EventPanelDetailsShow'
import EventPanelDetailsModify from './EventPanelDetailsModify'
import EventPanelScheduleShow from './EventPanelScheduleShow'
import EventPanelScheduleModify from './EventPanelScheduleModify'
import EventRoster from './EventPanelRoster'
import { useRecordContext } from 'react-admin'


interface EventProps {
  context: 'show' | 'edit' | 'create'
}

const Event = ({ context }: EventProps) => {

  const [selectedTab, setSelectedTab] = React.useState('1')
  const record  = useRecordContext()
  return (
    <>
      
      <TabContext value={selectedTab}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}>
          <TabList onChange={(e: React.SyntheticEvent, v: string) => setSelectedTab(v)} scrollButtons="auto" variant="scrollable">
            <Tab label="Event Information" value="1" />
            {context != 'create' && <Tab label="Event Schedule" value="2" />}
            {record && (record.status === 'RSVP' || record.status === 'LIVE' || record.status === 'CANCELLED' || record.status === 'COMPLETE') && (
              <Tab label="Event Roster" value="3" />
            )}
          </TabList>
        </Box>
        <TabPanel sx={{p: 0}} value="1">
          {context === 'show'
            ? <EventPanelDetailsShow />
            : <EventPanelDetailsModify context={context} />
          }
        </TabPanel>
        <TabPanel value="2">
          {context === 'show'
            ? <EventPanelScheduleShow />
            : <EventPanelScheduleModify />
          }
        </TabPanel>
        <TabPanel value="3">
          <EventRoster />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default Event