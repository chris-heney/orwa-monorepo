import { API_ENDPOINT, API_TOKEN } from '../config'
import axios from 'axios'

/**
 * Retrieves the status associated with the token.
 * 
 * @param public_key Group Access Token
 * @returns null if no token found, otherwise returns the status id (number)
 */

export const FindApplication = async (applicationId: string) => {
  
  try {

    const { data: applications } = await axios.get(`${API_ENDPOINT}/grant-application-finals`, {
      params: {
        'filters[$or][0][application_id][$eq]': applicationId,
        'filters[$or][1][id][$eq]': applicationId,
        'pagination[limit]': 1000,
        'populate': '*',
        'sort': 'id:ASC',
      },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    })


    if (applications.data.length === 0) {
      return null
    }

    return {applications : {
      data: applications.data.map((application: Record<any, any>) => ({
        id: application.id,
        ...application
      }))
    }}

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
        'populate': '*',
        'sort': 'order:ASC'
      },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    })

    return data.data.length ? data.data.map((step: Record<any, any>) => ({
      id: step.id,
      statusId: step.application_status.data.id,
      ...step.application_status.data,
      label: step.name
    })) : []

  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// export const useGetApplications = () => async (status: number) => {

//   const { data: response } = await axios.get(`${API_ENDPOINT}/grant-application-finals`, {
//     params: {
//       'pagination[limit]': 1000,
//       'populate': '*',
//       'sort': 'id:ASC',
//       'filters': { status }
//     },
//     headers: {
//       'Authorization': `Bearer ${API_TOKEN}`,
//     },

//   });

//   if (!response.data || !response.data.length) return []

//   return response.data.map((application: any) => ({
//     id: application.id,
//     ...application
//   }))

// }


// export const updateApplication = async (applicationId: number | undefined, payload: {}) => {
//   try {
//     await axios.put(`${API_ENDPOINT}/grant-application-finals/${applicationId}`, payload, {
//       headers: {
//         'Authorization': `Bearer ${API_TOKEN}`,
//       },
//     })
//   }
//   catch (error) {
//     console.error('Error updating application status:', error)
//   }
// }


export const GetScoring = async () => {
  try {
    const { data: fetchedScoring } = await axios.get(`${API_ENDPOINT}/grant-application-scorings`, {
      params: {
        'pagination[limit]': 1000,
        'populate': '*'
      },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },

    });
    return fetchedScoring.data.map((scoring: any) => ({ ...scoring }))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useGetScore = () => async (id: number) => {

  const {data: response} = await axios.get(`${API_ENDPOINT}/grant-application-scores`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    },
    params: {
      'populate': '*',
      'filters[grant_application]': id
    }
  }) 

  if (!response.data || !response.data.length) return []
  
  return response.data[0]
}

export const submitScore = async (data: any ) => {
  try {
    await axios.post(`${API_ENDPOINT}/grant-application-scores`, data, {
      headers: {
        'Authorization ': `Bearer ${API_TOKEN}`,
      },
    })
  } catch (error) {
    console.error('Error submitting score:', error)
  }
}

export const updateApplicationScoring = async (id: number, data: any) => {
  try {
    await axios.put(`${API_ENDPOINT}/grant-application-scores/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    })
  } catch (error) {
    console.error('Error updating application score:', error)
  }
}

export const getNextStatus = async (name: string) => {
  try {
    const { data } = await axios.get(`${API_ENDPOINT}/grant-statuses`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      params: {
        'populate': '*',
        'filters': { name }
      }
    })

    return data.data[0].next_statuses.data[0].id
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const useGetScoringCriterias = () => async () => {

  const {data: response} = await axios.get(`${API_ENDPOINT}/grant-application-scorings`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    },
    params: {
      'populate': '*',
      'pagination[limit]': 1000,
    }
  }) 

  if (!response.data || !response.data.length) return []

  return response.data.map((scoring: any) => ({ id: scoring.id , ...scoring }))
}







