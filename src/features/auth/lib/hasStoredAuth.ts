import { AUTH_KEYS } from '@/common/constants'

export const hasStoredAuth = () =>
  Boolean(localStorage.getItem(AUTH_KEYS.accessToken) || localStorage.getItem(AUTH_KEYS.refreshToken))
