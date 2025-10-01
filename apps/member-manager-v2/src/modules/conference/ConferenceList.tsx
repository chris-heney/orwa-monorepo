import React from 'react'
import { List } from 'react-admin'


const ConferenceList = () => {
  return (
    <List
      sx={{
        '& .RaList-noActions': {
          mt: '0',
        },
      }}
    >
      ConferenceList
    </List>
  )
}

export default ConferenceList