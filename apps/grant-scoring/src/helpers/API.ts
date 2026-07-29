import { EmailPayload } from '../grant-scoring/types'
import { API_ENDPOINT, API_KEY } from '../config'
import axios from 'axios'

const authHeaders = {
  Authorization: `Bearer ${API_KEY}`,
}

/**
 * Retrieves the status associated with the token.
 *
 * @param public_key Group Access Token
 * @returns null if no token found, otherwise returns the token record
 */
export const Login = async (public_key: string) => {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/grant-scoring-tokens`, {
      params: {
        'pagination[limit]': 1000,
        populate: '*',
        'sort': 'id:ASC',
        filters: { public_key },
      },
      headers: authHeaders,
    })

    if (data.data.length === 0 || !data.data[0]?.application_status?.id) {
      return null
    }

    return data.data[0]
  } catch (error) {
    return null
  }
}

/**
 * Get all status' as steps associated with the grant scoring process
 * @returns Array of steps
 */
export const GetSteps = async () => {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/grant-scoring-tokens`, {
      params: {
        'pagination[limit]': 1000,
        populate: '*',
        'sort': 'order:ASC',
      },
      headers: authHeaders,
    })

    return data.data.length
      ? data.data.map((step: Record<string, any>) => ({
          ...step.application_status,
          id: step.id,
          statusId: step.application_status?.id,
          label: step.name,
        }))
      : []
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

export const useGetApplications = () => async (status: number) => {
  const { data: response } = await axios.get(`${API_ENDPOINT}/grant-application-finals`, {
    params: {
      'pagination[limit]': 1000,
      populate: '*',
      'sort': 'application_date:ASC',
      filters: { status },
    },
    headers: authHeaders,
  })

  if (!response.data || !response.data.length) return []

  return response.data.map((application: any) => ({ ...application }))
}

export const updateApplication = async (
  applicationId: number | string | undefined,
  payload: {}
) => {
  try {
    await axios.put(`${API_ENDPOINT}/grant-application-finals/${applicationId}`, payload, {
      headers: authHeaders,
    })
  } catch (error) {
    console.error('Error updating application status:', error)
  }
}

export const GetScoring = async () => {
  try {
    const { data: fetchedScoring } = await axios.get(
      `${API_ENDPOINT}/grant-application-scorings`,
      {
        params: {
          'pagination[limit]': 1000,
          populate: '*',
          'sort': 'order:ASC',
        },
        headers: authHeaders,
      }
    )
    return fetchedScoring.data.map((scoring: any) => ({ ...scoring }))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useGetScore = () => async (id: number) => {
  const { data: response } = await axios.get(`${API_ENDPOINT}/grant-application-scores`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    params: {
      populate: '*',
      'filters[grant_application]': id,
    },
  })

  if (!response.data || !response.data.length) return []

  return response.data[0].score
}

export const submitScore = async (data: {}) => {
  try {
    await axios.post(`${API_ENDPOINT}/grant-application-scores`, data, {
      headers: authHeaders,
    })
  } catch (error) {
    console.error('Error submitting score:', error)
  }
}

export const updateScoreSheet = async (id: number | string, data: {}) => {
  try {
    await axios.put(`${API_ENDPOINT}/grant-application-scores/${id}`, data, {
      headers: authHeaders,
    })
  } catch (error) {
    console.error('Error submitting score:', error)
  }
}

export const updateApplicationScoring = async (
  id: number | string | undefined,
  data: {}
) => {
  if (id === undefined) return
  try {
    await axios.put(`${API_ENDPOINT}/grant-application-scores/${id}`, data, {
      headers: authHeaders,
    })
  } catch (error) {
    console.error('Error updating application score:', error)
  }
}

export const useGetStatus = () => async (name: string) => {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/grant-statuses`, {
      headers: authHeaders,
      params: {
        populate: '*',
        filters: { name },
      },
    })

    return data.data[0].id
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useGetScoringCriterias = () => async () => {
  const { data: response } = await axios.get(`${API_ENDPOINT}/grant-application-scorings`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    params: {
      populate: '*',
      'pagination[limit]': 1000,
      'sort': 'order:ASC',
    },
  })

  if (!response.data || !response.data.length) return []

  return response.data.map((scoring: any) => ({ ...scoring }))
}

export const useGetDenialReasons = () => async () => {
  const { data: response } = await axios.get(`${API_ENDPOINT}/grant-sub-statuses`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    params: {
      populate: '*',
      'pagination[limit]': 1000,
    },
  })

  if (!response.data || !response.data.length) return []

  return response.data.map((reason: any) => ({ ...reason }))
}

export const _sendEmail = async (data: EmailPayload) => {
  return fetch(`${API_ENDPOINT}/mailer/send-email`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((data) => data)
}
