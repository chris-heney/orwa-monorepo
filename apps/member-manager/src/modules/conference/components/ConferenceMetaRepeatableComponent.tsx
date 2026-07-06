import React, { useEffect, useState } from 'react'
import { Box, FormControlLabel, Checkbox, FormLabel } from '@mui/material'
import { Loading, useGetList, useNotify, useUpdate, useRecordContext } from 'react-admin'
import { IExtra, ISharedMeta } from '../types/IConference'
import { useConferenceContext } from '../ConferenceContext'
import { getPrimaryConferenceId } from '../helpers/mergeConferenceAcrossTabFilters'

interface MetaComponentProps {
  context: string
  ticketType?: string
  resource: string
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>
  /** When set (e.g. attendee’s saved conference), extras are loaded for this conference, not only dashboard filter. */
  conferenceId?: number
}

const MetaComponent = ({
  resource,
  setUpdated,
  context,
  conferenceId: conferenceIdProp,
}: MetaComponentProps) => {

  const { currentFilter } = useConferenceContext()
  const record = useRecordContext()
  const [update] = useUpdate()
  const notify = useNotify()
  const [selectedExtras, setSelectedExtras] = useState<ISharedMeta[]>([])

  const filterConferenceId =
    conferenceIdProp ?? getPrimaryConferenceId(currentFilter as Record<string, unknown>)
  const extrasListEnabled = filterConferenceId != null && filterConferenceId > 0

  const { data: extras, isLoading } = useGetList('conference-extras', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'id', order: 'ASC' },
    meta: {
      raw: true,
    },
    filter: extrasListEnabled
      ? { conferences: [filterConferenceId] }
      : { conferences: [0] },
  }, { enabled: extrasListEnabled })

  useEffect(() => {
    if (record?.items) {
      setSelectedExtras(record.items)
    }
  }, [record])

  const handleCheckboxChange = async (extra: IExtra, checked: boolean) => {
    let updatedSelectedExtras
    if (checked) {
      updatedSelectedExtras = [...selectedExtras, {
        key: extra.name + ' ' + extra.id,
        label: extra.name,
        value: extra.price_online.toString(),
        item: extra.id
      }]
    } else {
      updatedSelectedExtras = selectedExtras.filter((selectedExtra) => selectedExtra.label !== extra.name)
    }
    setSelectedExtras(updatedSelectedExtras as ISharedMeta[])


    await update(`${resource}`, {
      id: record.id, data: {
        items: updatedSelectedExtras
      }, previousData: record
    }).then(() => {
      notify('Extras Updated', { type: 'success' })
    }).catch((error) => {
      console.error('Error updating extras:', error)
      notify('Error updating extras', { type: 'error' })
    })


    setUpdated(true)
  }

  return isLoading ? <Loading /> : (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <FormLabel>Extras</FormLabel>
      {extras?.filter((extra) => {
        return extra.context.toLowerCase() === context.toLowerCase()
      })?.map((extra, index) => (
        <FormControlLabel
          label={extra.name ?? extra.label}
          key={index}
          control={
            <Checkbox
              checked={selectedExtras.some((selectedExtra) => selectedExtra.label === extra.name)}
              onChange={(event) => handleCheckboxChange(extra, event.target.checked)}
            />
          }
        />
      ))}
    </Box>
  )
}

export default MetaComponent
