import React from 'react'
import { Show } from 'react-admin'


const ConferenceShow = () => {
  return (
    <Show>
      <ConferenceDetails />
      <ConferenceAttendeeList />
      <ConferenceBoothList />
      <ConferenceContestantList />
    </Show>
  )
}

export default ConferenceShow