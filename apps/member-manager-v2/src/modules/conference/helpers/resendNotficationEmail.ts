import authProvider from '../../../authProvider'
import { Identifier } from 'react-admin'
import { UseNotifyFunction } from '../types/helpers'

export const resendNotificationEmail = async (registrationId: number, conferenceId: Identifier, notify: UseNotifyFunction) => {
  const identity = await authProvider.getIdentity?.()

  try {
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/conference-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${identity?.token}`,
      },
      body: JSON.stringify({
        registrationId: registrationId,
        conferenceId: conferenceId
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()

    if (responseData.result === 'success') {
      notify('Notification Email Sent', { type: 'success' })
    } else {
      notify('Error Sending Email', { type: 'error' })
    }

  } catch (error) {
    notify('Error Sending Email', { type: 'error' })
  }
}
