import React from 'react'
import { Edit, SimpleForm, useListContext } from 'react-admin'
import ConferenceForm from './components/ConferenceForm'
import CustomToolBar from '../_components/CustomToolbar'
import { useConferenceContext } from './ConferenceContext'
import { DEFAULT_CONFERENCE_ID } from './helpers/mergeConferenceAcrossTabFilters'

/**
 * Resolve filter/store conference value (often numeric entityId) to the
 * react-admin record id (documentId after withStableId).
 */
function resolveConferenceEditId(
  filterConference: unknown,
  conferences: Array<{ id?: unknown; entityId?: unknown }> | undefined
): string | number {
  const fallback = filterConference ?? DEFAULT_CONFERENCE_ID
  const match = conferences?.find(
    (c) =>
      c.id === filterConference ||
      c.entityId === filterConference ||
      String(c.entityId) === String(filterConference) ||
      String(c.id) === String(filterConference)
  )
  // Prefer documentId-shaped record.id when we have a list match.
  if (match?.id != null && match.id !== '') {
    return match.id as string | number
  }
  return fallback as string | number
}

const ConferenceEdit = () => {
  const { filterValues } = useListContext()
  const { conferences } = useConferenceContext()
  const editId = resolveConferenceEditId(
    filterValues?.conference,
    conferences
  )

  return (
    <Edit
      title={''}
      resource="conferences"
      id={editId}
      actions={false}
      redirect={false}
    >
      <SimpleForm
        toolbar={<CustomToolBar />}
        warnWhenUnsavedChanges
        sanitizeEmptyValues
        sx={{  m: 0, p: 0 }}    
      >
        <ConferenceForm />
      </SimpleForm>
    </Edit>
  )
}

export default ConferenceEdit
