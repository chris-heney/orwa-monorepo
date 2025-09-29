import React from 'react'
import ConferenceContextProvider from './ConferenceContext'
import ConferenceDashboard from './ConferenceDashboard'

const Conferences = () => {
  return (
    <ConferenceContextProvider>
      <ConferenceDashboard/>
    </ConferenceContextProvider>
  )
}

export default Conferences
