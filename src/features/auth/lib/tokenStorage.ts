import { AUTH_KEYS } from '@/common/constants'

type Tokens = {
  accessToken: string
  refreshToken: string
}

export const getAccessToken = () => localStorage.getItem(AUTH_KEYS.accessToken)

export const getRefreshToken = () => localStorage.getItem(AUTH_KEYS.refreshToken)

export const setTokens = ({ accessToken, refreshToken }: Tokens) => {
  localStorage.setItem(AUTH_KEYS.accessToken, accessToken)
  localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem(AUTH_KEYS.accessToken)
  localStorage.removeItem(AUTH_KEYS.refreshToken)
}
