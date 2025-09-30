import { useQuery } from '@tanstack/react-query'
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

  const target = query ? `${resource}/${query}` : resource

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

  return fetch(`${API_ENDPOINT}/${resource}`, {
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

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const oneYearAgoFormatted = formatDate(oneYearAgo);


export const useGetWatersystems = () => {
  return useQuery({ queryKey: ['watersystems'], queryFn: async () => _get('watersystems', `?filters[payment_last_date][$gt]=${oneYearAgoFormatted}&pagination[limit]=1000&populate=*&sort=legal_entity_name:ASC`) })
}


export const useGetSubmissions = () => {
  return useQuery({ queryKey: ['logs'], queryFn: async () => _get('logs', `?filters[resource]=grant-application&pagination[limit]=1000&populate=*`) })
}

export const getWatersystems = async () => {
  return _get('watersystems', `?filters[payment_last_date][$gt]=${oneYearAgoFormatted}&pagination[limit]=1000&populate=*&sort=legal_entity_name:ASC`)
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