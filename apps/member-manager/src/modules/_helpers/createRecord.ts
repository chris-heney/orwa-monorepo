import React from 'react'
import { FieldValues } from 'react-hook-form'
import { UseCreate, UseNotifyFunction } from '../conference/types/helpers'
import { formatTitle } from '../../helpers/formatResourceTitle'

export const createRecord = (
  data: FieldValues, 
  create: UseCreate,
  notify: UseNotifyFunction,
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>,
  resource: string
) => {
  const title = resource
    .split('-')
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
    .replace(/(?:s)$/, '')
  const recordData = {
    ...data,
  }
  try {
    create(`${resource}`, { data: recordData })
    notify(`${formatTitle(resource)} was Created`, { type: 'success' })
    setIsCreating(false)
  } catch (error) {
    console.error('Error creating conference attendee:', error)
    notify(`Error creating ${title}`, { type: 'error' })
  }
}
