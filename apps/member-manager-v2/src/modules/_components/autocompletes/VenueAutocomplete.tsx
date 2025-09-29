import React, { Dispatch, SetStateAction } from 'react'
import { AutocompleteInput, Identifier, RaRecord, useGetList, useRecordContext, } from 'react-admin'
import { Venue } from '../../training/training-events-old/components/TrainingEventFormFields'


interface VenueAutocompleteInputProps {
  setVenue: Dispatch<SetStateAction<RaRecord<Identifier> | Venue | undefined>>
  venue : Venue | RaRecord<Identifier> | undefined
}

export const VenueAutocompleteInput: React.FC<VenueAutocompleteInputProps> = ({ setVenue, venue }) => {
  const record = useRecordContext()
  // const editRecord = useEditContext()
  const { data, isLoading, error } = useGetList('venues', {
    meta: {
      populate: true,
      raw: true
    },
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'venue_name', order: 'ASC' }
  })

  if (isLoading) return <>Loading...</>
  if (error) return <>Error</>
  if (typeof data === 'undefined') return <>No Data</>

  const options = data?.map((v) => ({
    id: v.wp_uid,
    name: v.venue_name,
    street: v.address,
    city: v.city,
    state: v.province,
    zip: v.zip
  }))

  return (
    <AutocompleteInput
      source='venue_id'
      value={venue}
      onChange={(event, venue) => {
        setVenue(venue as Venue)
      }}
      choices={options}
      helperText={false}
      disabled={record === undefined ? false : record?.status !== 'REVIEW' && record?.status !== 'DRAFT'}
    />
  )
}
