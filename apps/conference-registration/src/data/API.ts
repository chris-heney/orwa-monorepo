import { useQuery } from '@tanstack/react-query'
import { SubmitHandler, FieldValues } from 'react-hook-form'
import { getAcceptedTerms } from '@orwa/terms-gate'
import { EmailPayload, Identifier, IRegistrationPayload } from '../types/types'


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

const _postRegistration = async (resource: string, data: IRegistrationPayload) => {
  const payload: IRegistrationPayload = {
    ...data,
    accepted_terms: data.accepted_terms?.length
      ? data.accepted_terms
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
  id: data.id,
  ...data
})

const _transform_list = (data: IStrapiRecord[]) => data.map(_transform_single)


export const useGetConferences = () => {
  return useQuery({ queryKey: ['conferences'], queryFn: async () => _get('conferences', '?populate=*') })
}

export const useGetTickets = (conference_id: string) => {
  return useQuery({ queryKey: ['conference-tickets'], queryFn: async () => _get('conference-tickets', `?filters[conferences]=${conference_id}`) })
}

export const useGetExtras = (conference_id: string) => {
  return useQuery({ queryKey: ['conference-extras'], queryFn: async () => _get('conference-extras', `?filters[conferences]=${conference_id}&populate=*`) })
}

export const useGetSponsorships = (conference_id: string) => {
  return useQuery({ queryKey: ['conference-sponsorships'], queryFn: async () => _get('conference-sponsorships', `?filters[conference]=${conference_id}`) })
}


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
  return useQuery({ queryKey: ['watersystems'], queryFn: async () => _get('watersystems', `?filters[payment_last_date][$gt]=${oneYearAgoFormatted}&pagination[limit]=1000&populate=*&sort=name:ASC`) })
}

// Admin registrant list. `data` is a plain JSON blob in Strapi (not a queryable
// relation/component), so Strapi rejects server-side filters like
// `filters[data][conference]=X` (400 "Invalid key ... at data") — filtering by
// conference has to happen client-side after fetch. Newest-first `sort` is
// required: without it Strapi defaults to ascending id order, and once the
// `logs` table holds more conference-registration rows than the pagination
// limit, the most recent submissions silently fall outside the fetched page
// (this is what made Admin View look "stuck" on an old conference).
export const useGetSubmissions = (conference_id?: string | null) => {
  return useQuery({
    queryKey: ['logs', conference_id],
    queryFn: async () => {
      const submissions = await _get('logs', `?filters[resource]=conference-registration&pagination[limit]=1000&populate=*&sort=createdAt:desc`)
      if (!conference_id) return submissions
      return (submissions as unknown as { data?: { conference?: Identifier } }[]).filter(
        (submission) => String(submission?.data?.conference) === String(conference_id)
      )
    }
  })
}

export const useGetRegistrationAddons = (conference_id: number) => {
  return useQuery({ queryKey: ['registration-addons'], queryFn: async () => _get('registration-addons',  `?filters[conferences]=${conference_id}`) })
}

export const useGetAssociates = () => {
  return useQuery({ queryKey: ['associates'], queryFn: async () => _get('associates', `?filters[payment_last_date][$gt]=${oneYearAgoFormatted}&pagination[limit]=1000&populate=*&sort=name:ASC&fields[0]=id&fields[1]=name`) })
}

export const useGetRegistrations = (conference_id: string, year: number): {
  data: IRegistrationPayload[] | undefined,
  isLoading: boolean
} => {
  return useQuery({ queryKey: ['conference-registrations', conference_id, year], queryFn: async () => _get('conference-registrations', `?filters[conference]=${conference_id}&filters[year]=${year}&pagination[limit]=1000&populate=*&sort=organization:ASC`) })
}

// form submit handler:
export const useSubmitRegistration = () :SubmitHandler<FieldValues> => {

  const onSubmit = (data: FieldValues) => {
    return _postRegistration('conference-webhook', data as IRegistrationPayload)
  }

  return onSubmit
}

export const useSubmitRegistration2 = (payload: IRegistrationPayload) => {
  return _postRegistration('conference-webhook', payload as IRegistrationPayload) 
}

export const useSendEmail = (email: EmailPayload) => {
  _sendEmail(email)
}