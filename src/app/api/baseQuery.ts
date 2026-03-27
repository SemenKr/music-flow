import { AUTH_KEYS } from '@/common/constants'
import { getApiBaseUrl } from '@/common/utils'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  headers: {
    'API-KEY': import.meta.env.VITE_API_KEY,
  },
  prepareHeaders: headers => {
    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return headers
  },
})
