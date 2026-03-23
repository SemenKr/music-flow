import { AUTH_KEYS } from '@/common/constants'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const withTrailingSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`)

export const baseQuery = fetchBaseQuery({
  baseUrl: withTrailingSlash(import.meta.env.VITE_BASE_URL),
  prepareHeaders: headers => {
    // VITE_* variables are shipped to the browser bundle, so keep the API key
    // limited to local development unless you proxy requests through your own backend.
    if (import.meta.env.DEV && import.meta.env.VITE_API_KEY) {
      headers.set('API-KEY', import.meta.env.VITE_API_KEY)
    }

    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return headers
  },
})
