import { RaRecord } from 'react-admin'
import { FieldValues } from 'react-hook-form'
import { UseNotifyFunction, UseRemove, UseUpdate } from '../conference/types/helpers'

export const updateRecord = (
  data: FieldValues,
  record: RaRecord,
  update: UseUpdate,
  notify: UseNotifyFunction,
  remove: UseRemove,
  resource: string
) => {

  const recordData = {
    ...data,
  }
  // resource = conference-attendees => title = Conference Attendee
  // given the resource create a title for the notification reusable for all resources remove the pluralization
  const title = resource
    .split('-')
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
    .replace(/(?:s)$/, '')

  update(`${resource}`, { id: record.id, data: recordData, previousData: record })
    .then(() => {
      notify(`${title} was Updated`, { type: 'success' })
    })
    .catch((error: Error) => {
      console.error('Error updating conference attendee:', error)
      notify(`Error updating ${title}`, { type: 'error' })
    })
  remove(`${resource}.datagrid.expanded`)
}