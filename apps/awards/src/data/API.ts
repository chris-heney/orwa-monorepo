import { useQuery } from '@tanstack/react-query'
import { getAcceptedTerms } from '@orwa/terms-gate'
import { EmailPayload, IAwardNominationPayload } from '../types/types'


interface IStrapiResponse {
  data: IStrapiRecord | IStrapiRecord[]
}

interface IStrapiRecord extends Record<string, unknown> {
  id: string
} 

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
const API_KEY = import.meta.env.VITE_API_KEY

const _get = async (resource: string, query = '', method = 'GET') => {

  const target = query ? `${resource}${query}` : resource

  return fetch(`${API_ENDPOINT}/${target}`, {
    method,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
  }).then(httpResponse => httpResponse.json())
  .then((strapiResponse: IStrapiResponse) => Array.isArray(strapiResponse.data) ? _transform_list(strapiResponse.data) : _transform_single(strapiResponse.data))
}

const _submitApplication = async (resource: string, data: IAwardNominationPayload) => {
  const payload = {
    ...data,
    accepted_terms: (data as IAwardNominationPayload & { accepted_terms?: unknown[] }).accepted_terms?.length
      ? (data as IAwardNominationPayload & { accepted_terms?: unknown[] }).accepted_terms
      : getAcceptedTerms(),
  }

  return fetch(`${API_ENDPOINT}/${resource}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
  }).then(httpResponse => httpResponse.json())
  .then( data => data)
}


const _uploadFile = async ( file: File) => {
  
  const data = new FormData()

  data.append('files', file)

  return fetch(`${API_ENDPOINT}/upload`, {
    method: 'POST',
    body: data,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
  }).then(httpResponse => httpResponse.json())
  .then( data => data)
}

const _sendEmail = async ( data: EmailPayload) => {
  return fetch(`${API_ENDPOINT}/mailer/send-email`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
  }).then(httpResponse => httpResponse.json())
  .then( data => data)
}

const _transform_single = (data: IStrapiRecord) => ({
  ...data,
})

const _transform_list = (data: IStrapiRecord[]) => data.map(_transform_single)

export const useGetWatersystems = () => {
  return useQuery({
    queryKey: ['watersystems'],
    queryFn: async () =>
      _get(
        'watersystems',
        '?pagination[limit]=1000&sort=name:ASC&fields[0]=id&fields[1]=documentId&fields[2]=name&fields[3]=legal_entity_name&fields[4]=county'
      ),
  })
}


export const useGetAwardWinners = () => {
  return useQuery({
    queryKey: ['award-winners'],
    queryFn: async () => {
      const winners = await _get(
        'award-winners',
        '?filters[is_published][$eq]=true&pagination[limit]=500' +
          '&sort[0]=award_year:desc&sort[1]=sort_order:asc' +
          '&populate[photo][fields][0]=url&populate[photo][fields][1]=formats'
      )
      return Array.isArray(winners) ? winners : winners ? [winners] : []
    },
  })
}

export const useGetSubmissions = () => {
  return useQuery({
    queryKey: ['logs', 'award-nomination'],
    queryFn: async () => {
      const submissions = await _get(
        'logs',
        '?filters[resource][$eq]=award-nomination&pagination[limit]=1000&populate=*&sort=createdAt:DESC'
      )
      return Array.isArray(submissions) ? submissions : submissions ? [submissions] : []
    },
  })
}

export const getWatersystems = async () => {
  return _get(
    'watersystems',
    '?pagination[limit]=1000&sort=name:ASC&fields[0]=id&fields[1]=documentId&fields[2]=name&fields[3]=legal_entity_name&fields[4]=county'
  )
}

export const submitAwardNomination = async (data: IAwardNominationPayload) => {
  return _submitApplication('submissions/award-nomination', data)
}

export const uploadFile = async (file: File) => {
  return _uploadFile(file)
}

export const sendEmail = async (data: EmailPayload) => {
  return _sendEmail(data)
}

export const getContactByEmail = async (email: string) => {
  return _get('contacts', `?filters[email][$eq]=${email}`)
}